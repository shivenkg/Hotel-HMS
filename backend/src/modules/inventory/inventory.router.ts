/**
 * ============================================================================
 * INVENTORY & LAUNDRY DOMAIN MODULE
 * Handles Stock Ledgers, Balances Projection, Depletion Alerts, and Linen Turnover
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { LaundryBatch, InventoryItem } from '../../types/index.js';
import { outbox } from '../../events/outboxProcessor.js';

export const inventoryRouter = Router();

inventoryRouter.get('/inventory', (req: Request, res: Response) => {
  res.json(store.inventoryItems);
});

inventoryRouter.patch('/inventory/:id/stock', (req: Request, res: Response) => {
  const item = store.inventoryItems.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const oldStock = item.currentStock;
  item.currentStock = Number(req.body.currentStock);
  item.lastRestocked = new Date().toISOString().slice(0, 10);

  outbox.recordEvent('stock.adjusted', 'InventoryItem', item.id, {
    name: item.name,
    oldStock,
    newStock: item.currentStock,
    minThreshold: item.minThreshold
  });

  res.json(item);
});

// Master Data: Create Inventory Item
inventoryRouter.post('/inventory', (req: Request, res: Response) => {
  const { name, category, currentStock, minThreshold, unit, unitCost, supplier } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Item name is required' });
  }

  const newItem: InventoryItem = {
    id: `inv-${Date.now()}`,
    name: String(name),
    category: category || 'Housekeeping Supplies',
    currentStock: Number(currentStock) || 0,
    minThreshold: Number(minThreshold) || 10,
    unit: unit || 'pcs',
    unitCost: Number(unitCost) || 0,
    supplier: supplier || 'General Vendor',
    lastRestocked: new Date().toISOString().slice(0, 10)
  };

  store.inventoryItems.push(newItem);
  store.logAudit('Admin', 'Operations', 'INVENTORY_ITEM_CREATED', `Added new inventory SKU: ${newItem.name} (Unit cost: ₹${newItem.unitCost})`);
  res.status(201).json(newItem);
});

// Master Data: Update Inventory Item
inventoryRouter.put('/inventory/:id', (req: Request, res: Response) => {
  const itemIndex = store.inventoryItems.findIndex(i => i.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  const current = store.inventoryItems[itemIndex];
  const { name, category, currentStock, minThreshold, unit, unitCost, supplier } = req.body;

  store.inventoryItems[itemIndex] = {
    ...current,
    name: name !== undefined ? String(name) : current.name,
    category: category || current.category,
    currentStock: currentStock !== undefined ? Number(currentStock) : current.currentStock,
    minThreshold: minThreshold !== undefined ? Number(minThreshold) : current.minThreshold,
    unit: unit !== undefined ? String(unit) : current.unit,
    unitCost: unitCost !== undefined ? Number(unitCost) : current.unitCost,
    supplier: supplier !== undefined ? String(supplier) : current.supplier
  };

  store.logAudit('Admin', 'Operations', 'INVENTORY_ITEM_UPDATED', `Updated inventory SKU: ${store.inventoryItems[itemIndex].name}`);
  res.json(store.inventoryItems[itemIndex]);
});

// Master Data: Delete Inventory Item
inventoryRouter.delete('/inventory/:id', (req: Request, res: Response) => {
  const itemIndex = store.inventoryItems.findIndex(i => i.id === req.params.id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Inventory item not found' });
  }

  const deleted = store.inventoryItems.splice(itemIndex, 1)[0];
  store.logAudit('Admin', 'Operations', 'INVENTORY_ITEM_DELETED', `Deleted inventory SKU: ${deleted.name}`);
  res.json({ message: `Inventory item ${deleted.name} deleted successfully`, item: deleted });
});

inventoryRouter.get('/laundry', (req: Request, res: Response) => {
  res.json(store.laundryBatches);
});

inventoryRouter.post('/laundry', (req: Request, res: Response) => {
  const { itemType, quantity, vendor } = req.body;
  const newBatch: LaundryBatch = {
    id: `ld-${Date.now()}`,
    batchNumber: `LB-2026-${Math.floor(100 + Math.random() * 900)}`,
    itemType,
    quantity: Number(quantity),
    status: 'Washing',
    vendor: vendor || 'In-House Hydro-Laundry',
    sentDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    expectedReturnDate: 'Same Day 18:00'
  };
  store.laundryBatches.unshift(newBatch);
  res.status(201).json(newBatch);
});

inventoryRouter.patch('/laundry/:id/status', (req: Request, res: Response) => {
  const batch = store.laundryBatches.find(b => b.id === req.params.id);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  batch.status = req.body.status;
  res.json(batch);
});
