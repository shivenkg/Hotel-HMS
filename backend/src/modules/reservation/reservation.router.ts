/**
 * ============================================================================
 * RESERVATION & PRICING DOMAIN MODULE
 * Handles Multi-Night Booking Engine, KYC Ingestion, Surge Pricing, Check-in/out
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { Reservation, HousekeepingTask } from '../../types/index.js';
import { DynamicPricingEngine } from '../../services/pricingEngine.js';
import { GstTaxCalculator } from '../../services/gstCalculator.js';
import { OtaChannelSyncService } from '../../services/otaChannelSync.js';
import { outbox } from '../../events/outboxProcessor.js';

export const reservationRouter = Router();
const pricingEngine = new DynamicPricingEngine(store.pricingConfig);
const channelSyncService = new OtaChannelSyncService(store.channelSyncLogs);

reservationRouter.get('/reservations', (req: Request, res: Response) => {
  res.json(store.reservations);
});

reservationRouter.get('/reservations/:id', (req: Request, res: Response) => {
  const resv = store.reservations.find(r => r.id === req.params.id || r.bookingRef === req.params.id);
  if (!resv) return res.status(404).json({ error: 'Reservation not found' });
  res.json(resv);
});

reservationRouter.post('/reservations', (req: Request, res: Response) => {
  const { 
    guestName, 
    guestEmail, 
    guestPhone, 
    roomId, 
    checkInDate, 
    checkOutDate, 
    guestsCount, 
    source, 
    documentType, 
    documentNumber,
    documentUrl,
    nationality,
    guestAddress,
    purposeOfVisit,
    immediateCheckIn,
    advancePaid,
    paymentMethod
  } = req.body;

  const targetRoom = store.rooms.find(r => r.id === roomId || r.roomNumber === roomId);
  if (!targetRoom) return res.status(400).json({ error: 'Selected room not found' });

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalOccupancy = (store.rooms.filter(r => r.status === 'Occupied').length / store.rooms.length) * 100;
  const pricing = pricingEngine.calculateRate(targetRoom.baseRate, totalOccupancy, checkIn);
  const totalRoomAmount = pricing.finalRate * totalNights;
  const taxRate = GstTaxCalculator.getRoomGstRate(pricing.finalRate);
  const taxAmount = Math.round(totalRoomAmount * (taxRate / 100));
  const grandTotal = totalRoomAmount + taxAmount;
  const paidAmt = Number(advancePaid) || 0;

  const isCheckedIn = Boolean(immediateCheckIn);

  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    bookingRef: `BK-2026-${Math.floor(100 + Math.random() * 900)}`,
    guestName,
    guestEmail: guestEmail || `${guestName.toLowerCase().replace(/\s+/g, '.')}@guest-azure.com`,
    guestPhone: guestPhone || '+1 555-0199',
    roomId: targetRoom.id,
    roomNumber: targetRoom.roomNumber,
    roomCategory: targetRoom.category,
    checkInDate,
    checkOutDate,
    guestsCount: Number(guestsCount) || 1,
    status: isCheckedIn ? 'CheckedIn' : 'Confirmed',
    source: source || 'Direct',
    totalNights,
    roomRatePerNight: pricing.finalRate,
    totalRoomAmount,
    taxAmount,
    grandTotal,
    paidAmount: paidAmt,
    paymentStatus: paidAmt >= grandTotal ? 'Paid' : paidAmt > 0 ? 'Partial' : 'Unpaid',
    kycStatus: (documentNumber || documentUrl) ? 'Verified' : 'Pending',
    documentType: documentType || 'Passport',
    documentNumber: documentNumber || `DOC-${Date.now().toString().slice(-6)}`,
    documentUrl: documentUrl || undefined,
    nationality: nationality || 'International',
    guestAddress: guestAddress || 'Verified Digital Address',
    purposeOfVisit: purposeOfVisit || 'Leisure',
    createdAt: new Date().toISOString().slice(0, 10)
  };

  store.reservations.unshift(newReservation);
  targetRoom.status = isCheckedIn ? 'Occupied' : 'Occupied';
  targetRoom.currentGuest = guestName;
  targetRoom.currentReservationId = newReservation.id;

  // Create associated Folio
  const newFolio = {
    id: `fol-${Date.now()}`,
    reservationId: newReservation.id,
    guestName,
    roomNumber: targetRoom.roomNumber,
    invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    issuedDate: new Date().toISOString().slice(0, 10),
    items: [
      {
        id: `fi-${Date.now()}`,
        date: checkInDate,
        description: `Room Accommodation (${totalNights} Nights) - ${targetRoom.category}`,
        category: 'Room' as const,
        amount: totalRoomAmount,
        hsnSacCode: '996311',
        taxRatePercent: taxRate
      }
    ],
    subtotal: totalRoomAmount,
    cgst: Math.round(taxAmount / 2),
    sgst: Math.round(taxAmount / 2),
    igst: 0,
    totalTax: taxAmount,
    discount: 0,
    grandTotal,
    paidAmount: paidAmt,
    balanceDue: Math.max(0, grandTotal - paidAmt),
    status: (paidAmt >= grandTotal ? 'Settled' : 'Open') as 'Open' | 'Settled',
    paymentMethod: paymentMethod || (paidAmt > 0 ? 'CreditCard' : undefined)
  };
  store.folios.unshift(newFolio);

  channelSyncService.broadcastRoomAvailability(targetRoom);
  
  outbox.recordEvent('reservation.created', 'Reservation', newReservation.id, {
    bookingRef: newReservation.bookingRef,
    roomNumber: targetRoom.roomNumber,
    guestName,
    grandTotal
  });

  store.logAudit(
    'Front Desk', 
    'Receptionist', 
    isCheckedIn ? 'GUEST_CHECK_IN' : 'RESERVATION_CREATED', 
    `${isCheckedIn ? 'Checked in' : 'Booked'} ${newReservation.bookingRef} for ${guestName} (Room ${targetRoom.roomNumber}) with verified ${newReservation.documentType} KYC.`
  );

  res.status(201).json({ reservation: newReservation, folio: newFolio });
});

// Check-in
reservationRouter.post('/reservations/:id/checkin', (req: Request, res: Response) => {
  const { id } = req.params;
  const { documentType, documentNumber } = req.body;
  const resv = store.reservations.find(r => r.id === id || r.bookingRef === id);
  if (!resv) return res.status(404).json({ error: 'Reservation not found' });

  resv.status = 'CheckedIn';
  if (documentNumber) {
    resv.kycStatus = 'Verified';
    resv.documentType = documentType || resv.documentType;
    resv.documentNumber = documentNumber;
  }

  const room = store.rooms.find(r => r.id === resv.roomId || r.roomNumber === resv.roomNumber);
  if (room) {
    room.status = 'Occupied';
    room.currentGuest = resv.guestName;
    room.currentReservationId = resv.id;
  }

  outbox.recordEvent('guest.checked_in', 'Reservation', resv.id, {
    bookingRef: resv.bookingRef,
    roomNumber: resv.roomNumber,
    guestName: resv.guestName
  });

  store.logAudit('Front Desk', 'Receptionist', 'CHECK_IN', `Guest ${resv.guestName} checked in to Room ${resv.roomNumber}`);
  res.json({ message: 'Checked in successfully', reservation: resv });
});

// Check-out
reservationRouter.post('/reservations/:id/checkout', (req: Request, res: Response) => {
  const { id } = req.params;
  const resv = store.reservations.find(r => r.id === id || r.bookingRef === id);
  if (!resv) return res.status(404).json({ error: 'Reservation not found' });

  resv.status = 'CheckedOut';
  const room = store.rooms.find(r => r.id === resv.roomId || r.roomNumber === resv.roomNumber);
  if (room) {
    room.status = 'Dirty';
    room.currentGuest = undefined;
    room.currentReservationId = undefined;

    // Trigger housekeeping cleaning task
    store.housekeepingTasks.unshift({
      id: `hk-${Date.now()}`,
      roomId: room.id,
      roomNumber: room.roomNumber,
      taskType: 'Routine Cleaning',
      priority: 'High',
      assignedTo: 'Housekeeping Team',
      status: 'Pending',
      dueTime: 'Within 2 Hours',
      notes: `Checkout completed for ${resv.guestName}. Sanitize and replace linens.`,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    });

    channelSyncService.broadcastRoomAvailability(room);
  }

  outbox.recordEvent('guest.checked_out', 'Reservation', resv.id, {
    bookingRef: resv.bookingRef,
    roomNumber: resv.roomNumber,
    guestName: resv.guestName
  });

  store.logAudit('Front Desk', 'Receptionist', 'CHECK_OUT', `Guest ${resv.guestName} checked out of Room ${resv.roomNumber}`);
  res.json({ message: 'Checked out successfully', reservation: resv });
});

// Dynamic Pricing Config
reservationRouter.get('/pricing/config', (req: Request, res: Response) => {
  res.json(pricingEngine.getConfig());
});

reservationRouter.put('/pricing/config', (req: Request, res: Response) => {
  const updated = pricingEngine.updateConfig(req.body);
  store.pricingConfig = updated;
  store.logAudit('Manager', 'General Manager', 'PRICING_RULE_UPDATED', `Dynamic surge rules updated. Surge active: ${updated.isSurgeActive}`);
  res.json(updated);
});
