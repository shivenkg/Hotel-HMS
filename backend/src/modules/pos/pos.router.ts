/**
 * ============================================================================
 * POS & KITCHEN DISPLAY DOMAIN MODULE
 * Handles Restaurant & Room Service POS, KDS Stages, and Folio Charge Routing
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { PosOrder, MenuItem } from '../../types/index.js';
import { GstTaxCalculator } from '../../services/gstCalculator.js';
import { outbox } from '../../events/outboxProcessor.js';

export const posRouter = Router();

posRouter.get('/pos/orders', (req: Request, res: Response) => {
  res.json(store.posOrders);
});

posRouter.post('/pos/orders', (req: Request, res: Response) => {
  const { type, roomOrTableNumber, guestName, items, billedToRoom } = req.body;
  const subtotal = items.reduce((sum: number, it: any) => sum + it.unitPrice * it.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% F&B GST
  const total = subtotal + tax;

  const newOrder: PosOrder = {
    id: `pos-${Date.now()}`,
    orderNumber: `POS-2026-${Math.floor(100 + Math.random() * 900)}`,
    type: type || 'Restaurant',
    roomOrTableNumber,
    guestName: guestName || 'Walk-in Guest',
    items,
    subtotal,
    tax,
    total,
    status: 'Received',
    billedToRoom: Boolean(billedToRoom),
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  store.posOrders.unshift(newOrder);

  // If billed to room, append automatically to active guest folio
  if (billedToRoom) {
    const activeRes = store.reservations.find(r => 
      r.status === 'CheckedIn' && 
      (roomOrTableNumber.includes(r.roomNumber) || r.roomNumber === roomOrTableNumber)
    );
    if (activeRes) {
      newOrder.reservationId = activeRes.id;
      const folio = store.folios.find(f => f.reservationId === activeRes.id);
      if (folio) {
        folio.items.push({
          id: `fi-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          description: `F&B Order ${newOrder.orderNumber} (${newOrder.type})`,
          category: 'Restaurant',
          amount: subtotal,
          hsnSacCode: '996331',
          taxRatePercent: 5
        });
        const taxBreakdown = GstTaxCalculator.computeFolioTaxes(folio.items, folio.discount);
        folio.subtotal = taxBreakdown.subtotal;
        folio.cgst = taxBreakdown.cgst;
        folio.sgst = taxBreakdown.sgst;
        folio.totalTax = taxBreakdown.totalTax;
        folio.grandTotal = taxBreakdown.grandTotal;
        folio.balanceDue = Math.max(0, folio.grandTotal - folio.paidAmount);
      }
    }
  }

  outbox.recordEvent('pos.order_created', 'PosOrder', newOrder.id, {
    orderNumber: newOrder.orderNumber,
    roomOrTableNumber,
    total,
    billedToRoom: newOrder.billedToRoom
  });

  store.logAudit('F&B POS', 'Waiter/Cashier', 'POS_ORDER_CREATED', `Order ${newOrder.orderNumber} for ${roomOrTableNumber} created (₹${total})`);
  res.status(201).json(newOrder);
});

posRouter.patch('/pos/orders/:id/status', (req: Request, res: Response) => {
  const order = store.posOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;

  if (order.status === 'Ready') {
    outbox.recordEvent('kitchen.order_ready', 'PosOrder', order.id, { orderNumber: order.orderNumber });
  } else if (order.status === 'Delivered') {
    outbox.recordEvent('room_service.delivered', 'PosOrder', order.id, { orderNumber: order.orderNumber });
  }

  res.json(order);
});

// Master Data: F&B Menu Catalog
posRouter.get('/pos/menu', (req: Request, res: Response) => {
  res.json(store.menuItems);
});

posRouter.post('/pos/menu', (req: Request, res: Response) => {
  const { name, category, price, prepTime, available, description } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price are required for menu item' });
  }

  const newItem: MenuItem = {
    id: `m-${Date.now()}`,
    name: String(name),
    category: category || 'Main Course',
    price: Number(price),
    prepTime: prepTime || '15 min',
    available: available !== undefined ? Boolean(available) : true,
    description: description || ''
  };

  store.menuItems.push(newItem);
  store.logAudit('Admin', 'Executive Chef', 'MENU_ITEM_CREATED', `Added menu dish: ${newItem.name} (₹${newItem.price})`);
  res.status(201).json(newItem);
});

posRouter.put('/pos/menu/:id', (req: Request, res: Response) => {
  const itemIndex = store.menuItems.findIndex(m => m.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  const current = store.menuItems[itemIndex];
  const { name, category, price, prepTime, available, description } = req.body;

  store.menuItems[itemIndex] = {
    ...current,
    name: name !== undefined ? String(name) : current.name,
    category: category || current.category,
    price: price !== undefined ? Number(price) : current.price,
    prepTime: prepTime !== undefined ? String(prepTime) : current.prepTime,
    available: available !== undefined ? Boolean(available) : current.available,
    description: description !== undefined ? String(description) : current.description
  };

  store.logAudit('Admin', 'Executive Chef', 'MENU_ITEM_UPDATED', `Updated menu dish: ${store.menuItems[itemIndex].name} (₹${store.menuItems[itemIndex].price})`);
  res.json(store.menuItems[itemIndex]);
});

posRouter.delete('/pos/menu/:id', (req: Request, res: Response) => {
  const itemIndex = store.menuItems.findIndex(m => m.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  const deleted = store.menuItems.splice(itemIndex, 1)[0];
  store.logAudit('Admin', 'Executive Chef', 'MENU_ITEM_DELETED', `Deleted menu dish: ${deleted.name}`);
  res.json({ message: `Menu item ${deleted.name} deleted successfully`, item: deleted });
});
