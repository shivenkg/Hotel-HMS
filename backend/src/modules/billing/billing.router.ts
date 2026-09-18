/**
 * ============================================================================
 * BILLING & FOLIO DOMAIN MODULE
 * Handles Itemized Guest Folios, Dual-Slab GST (SAC 996311/996331), Payment Settlements
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { FolioItem } from '../../types/index.js';
import { GstTaxCalculator } from '../../services/gstCalculator.js';
import { outbox } from '../../events/outboxProcessor.js';

export const billingRouter = Router();

billingRouter.get('/folios', (req: Request, res: Response) => {
  res.json(store.folios);
});

billingRouter.get('/folios/:id', (req: Request, res: Response) => {
  const folio = store.folios.find(f => f.id === req.params.id || f.reservationId === req.params.id);
  if (!folio) return res.status(404).json({ error: 'Folio not found' });
  res.json(folio);
});

// Add Item to Folio (Room Service, Minibar, Laundry)
billingRouter.post('/folios/:id/items', (req: Request, res: Response) => {
  const folio = store.folios.find(f => f.id === req.params.id || f.reservationId === req.params.id);
  if (!folio) return res.status(404).json({ error: 'Folio not found' });

  const { description, category, amount, hsnSacCode, taxRatePercent } = req.body;
  const newItem: FolioItem = {
    id: `fi-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    description,
    category,
    amount: Number(amount),
    hsnSacCode: hsnSacCode || '996331',
    taxRatePercent: Number(taxRatePercent) || 5
  };

  folio.items.push(newItem);
  const taxBreakdown = GstTaxCalculator.computeFolioTaxes(folio.items, folio.discount);
  folio.subtotal = taxBreakdown.subtotal;
  folio.cgst = taxBreakdown.cgst;
  folio.sgst = taxBreakdown.sgst;
  folio.igst = taxBreakdown.igst;
  folio.totalTax = taxBreakdown.totalTax;
  folio.grandTotal = taxBreakdown.grandTotal;
  folio.balanceDue = Math.max(0, folio.grandTotal - folio.paidAmount);

  outbox.recordEvent('folio.charge_posted', 'Folio', folio.id, {
    invoiceNumber: folio.invoiceNumber,
    description,
    amount,
    category
  });

  store.logAudit('Billing', 'Cashier', 'FOLIO_ITEM_ADDED', `Added ${description} (₹${amount}) to Folio ${folio.invoiceNumber}`);
  res.json(folio);
});

// Settle Folio / Process Payment
billingRouter.post('/folios/:id/pay', (req: Request, res: Response) => {
  const folio = store.folios.find(f => f.id === req.params.id || f.reservationId === req.params.id);
  if (!folio) return res.status(404).json({ error: 'Folio not found' });

  const { amount, paymentMethod } = req.body;
  const payAmt = Number(amount) || folio.balanceDue;

  folio.paidAmount += payAmt;
  folio.balanceDue = Math.max(0, folio.grandTotal - folio.paidAmount);
  folio.paymentMethod = paymentMethod || 'Stripe';

  if (folio.balanceDue <= 0) {
    folio.status = 'Settled';
  }

  // Update reservation payment status
  const resv = store.reservations.find(r => r.id === folio.reservationId);
  if (resv) {
    resv.paidAmount = folio.paidAmount;
    resv.paymentStatus = folio.status === 'Settled' ? 'Paid' : 'Partial';
  }

  outbox.recordEvent('folio.payment_received', 'Folio', folio.id, {
    invoiceNumber: folio.invoiceNumber,
    paidAmount: payAmt,
    paymentMethod: folio.paymentMethod,
    balanceDue: folio.balanceDue
  });

  store.logAudit('Payment Gateway', 'Stripe/Razorpay', 'PAYMENT_RECEIVED', `Payment of ₹${payAmt} settled for Folio ${folio.invoiceNumber} via ${paymentMethod}`);
  res.json(folio);
});
