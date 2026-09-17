import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  initialRooms,
  initialReservations,
  initialFolios,
  initialPricingConfig,
  initialHousekeepingTasks,
  initialInventoryItems,
  initialPosOrders,
  initialLaundryBatches,
  initialStaffMembers,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialFeedback,
  initialLoyaltyMembers,
  initialChannelSyncLogs,
  initialAuditLogs,
  initialMaintenanceWorkOrders
} from './data/mockData.js';
import { DynamicPricingEngine } from './services/pricingEngine.js';
import { GstTaxCalculator } from './services/gstCalculator.js';
import { OtaChannelSyncService } from './services/otaChannelSync.js';
import { Reservation, Room, HousekeepingTask, PosOrder, FolioItem, LaundryBatch, CustomerFeedback, MaintenanceWorkOrder } from './types/index.js';
import path from 'path';
import fs from 'fs';

// In-Memory Database State
let rooms = [...initialRooms];
let reservations = [...initialReservations];
let folios = [...initialFolios];
let housekeepingTasks = [...initialHousekeepingTasks];
let inventoryItems = [...initialInventoryItems];
let posOrders = [...initialPosOrders];
let laundryBatches = [...initialLaundryBatches];
let staffMembers = [...initialStaffMembers];
let attendanceRecords = [...initialAttendanceRecords];
let leaveRequests = [...initialLeaveRequests];
let feedbackList = [...initialFeedback];
let loyaltyMembers = [...initialLoyaltyMembers];
let auditLogs = [...initialAuditLogs];
let maintenanceWorkOrders = [...initialMaintenanceWorkOrders];

const pricingEngine = new DynamicPricingEngine(initialPricingConfig);
const channelSyncService = new OtaChannelSyncService(initialChannelSyncLogs);

// Helper for audit logging
function logAudit(actor: string, role: string, action: string, details: string) {
  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    actor,
    role,
    action,
    details,
    ipAddress: '127.0.0.1'
  });
}

export type SystemRole = 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen';

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  role: SystemRole;
  department: string;
  allowedTabs: string[];
  landingTab: string;
  createdAt: string;
}

function getRolePermissions(role: SystemRole): { allowedTabs: string[]; landingTab: string; department: string } {
  switch (role) {
    case 'Reception':
      return {
        allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'],
        landingTab: 'reservation',
        department: 'Front Office'
      };
    case 'Housekeeping':
      return {
        allowedTabs: ['housekeeping'],
        landingTab: 'housekeeping',
        department: 'Housekeeping'
      };
    case 'Kitchen':
      return {
        allowedTabs: ['concierge', 'inventory'],
        landingTab: 'concierge',
        department: 'Food & Beverage'
      };
    case 'Admin':
    default:
      return {
        allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'audit'],
        landingTab: 'dashboard',
        department: 'Administration'
      };
  }
}

let systemUsers: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'Jaylon Dorwart',
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    department: 'Administration',
    allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'audit'],
    landingTab: 'dashboard',
    createdAt: '2026-09-01'
  },
  {
    id: 'usr-2',
    name: 'Kavita Nair',
    username: 'reception',
    password: 'rec123',
    role: 'Reception',
    department: 'Front Office',
    allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'],
    landingTab: 'reservation',
    createdAt: '2026-09-05'
  },
  {
    id: 'usr-3',
    name: 'Priya Sharma',
    username: 'cleaner',
    password: 'clean123',
    role: 'Housekeeping',
    department: 'Housekeeping',
    allowedTabs: ['housekeeping'],
    landingTab: 'housekeeping',
    createdAt: '2026-09-08'
  },
  {
    id: 'usr-4',
    name: 'Antonio Rossi',
    username: 'chef',
    password: 'chef123',
    role: 'Kitchen',
    department: 'Food & Beverage',
    allowedTabs: ['concierge', 'inventory'],
    landingTab: 'concierge',
    createdAt: '2026-09-10'
  }
];

export function registerApiRoutes(app: express.Express) {
  // API Directory Overview
  app.get('/api', (req: Request, res: Response) => {
    res.json({
      name: 'The Grand Azure Hotel Management System API',
      version: '1.0.0',
      status: 'operational',
      endpoints: {
        health: '/api/health',
        rooms: '/api/rooms',
        reservations: '/api/reservations',
        folios: '/api/folios',
        housekeeping: '/api/housekeeping/tasks',
        maintenance: '/api/maintenance',
        inventory: '/api/inventory',
        posOrders: '/api/pos/orders',
        financials: '/api/financials/overview',
        pricing: '/api/pricing/calculate',
        users: '/api/users',
        auth: '/api/auth/login'
      }
    });
  });

  // ----------------------------------------------------
  // 0. AUTHENTICATION & USER MANAGEMENT (RBAC)
  // ----------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = systemUsers.find(u => 
    (u.username.toLowerCase() === String(username).toLowerCase() || (u.username === 'admin' && username === 'admin@grandazure.com')) &&
    u.password === password
  );

  if (user) {
    logAudit(user.name, user.role, 'USER_LOGIN', `User ${user.username} (${user.role}) logged in successfully.`);
    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        department: user.department,
        allowedTabs: user.allowedTabs,
        landingTab: user.landingTab,
        token: `jwt-simulated-${Date.now()}`
      }
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid User ID or Password' });
});

app.get('/api/users', (req: Request, res: Response) => {
  const sanitized = systemUsers.map(({ password: _p, ...rest }) => rest);
  res.json(sanitized);
});

app.post('/api/users', (req: Request, res: Response) => {
  const { name, username, password, role } = req.body;
  if (!name || !username || !password || !role) {
    return res.status(400).json({ error: 'Name, username, password, and role are required' });
  }

  const existing = systemUsers.find(u => u.username.toLowerCase() === String(username).toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'A user with this username already exists' });
  }

  const permissions = getRolePermissions(role as SystemRole);
  const userAllowedTabs = Array.isArray(req.body.allowedTabs) && req.body.allowedTabs.length > 0 
    ? req.body.allowedTabs 
    : permissions.allowedTabs;
  const userLandingTab = req.body.landingTab || permissions.landingTab;
  const userDepartment = req.body.department || permissions.department;

  const newUser: SystemUser = {
    id: `usr-${Date.now()}`,
    name,
    username: String(username).toLowerCase().trim(),
    password,
    role: role as SystemRole,
    department: userDepartment,
    allowedTabs: userAllowedTabs,
    landingTab: userLandingTab,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  systemUsers.unshift(newUser);
  logAudit('Jaylon Dorwart', 'Administrator', 'USER_CREATED', `Created new system user: ${newUser.username} with role [${newUser.role}] and modules [${userAllowedTabs.join(', ')}]`);

  const { password: _p, ...userProfile } = newUser;
  res.status(201).json(userProfile);
});

app.patch('/api/users/:id', (req: Request, res: Response) => {
  const user = systemUsers.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, role, department, allowedTabs, landingTab, password } = req.body;
  if (name) user.name = name;
  if (role) user.role = role as SystemRole;
  if (department) user.department = department;
  if (allowedTabs && Array.isArray(allowedTabs)) user.allowedTabs = allowedTabs;
  if (landingTab) user.landingTab = landingTab;
  if (password) user.password = password;

  logAudit('Jaylon Dorwart', 'Administrator', 'USER_PERMISSIONS_UPDATED', `Updated permissions/role for user ${user.username} (modules: ${user.allowedTabs.join(', ')})`);
  const { password: _p, ...userProfile } = user;
  res.json(userProfile);
});

app.delete('/api/users/:id', (req: Request, res: Response) => {
  const index = systemUsers.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  if (systemUsers[index].username === 'admin') {
    return res.status(403).json({ error: 'Cannot delete primary Administrator account' });
  }
  const deleted = systemUsers.splice(index, 1)[0];
  logAudit('Jaylon Dorwart', 'Administrator', 'USER_DELETED', `Deleted user ${deleted.username}`);
  res.json({ success: true, message: `User ${deleted.username} deleted` });
});

// ----------------------------------------------------
// 0b. GUEST NOTES & OPERATIONAL ALERTS
// ----------------------------------------------------
const guestNotes: Array<{
  id: string;
  roomNumber: string;
  guestName: string;
  category: 'VIP Preference' | 'Dietary' | 'Room Request' | 'Late Check-out' | 'Maintenance';
  note: string;
  createdBy: string;
  createdAt: string;
}> = [
  {
    id: 'note-1',
    roomNumber: '101',
    guestName: 'Sophia Laurent',
    category: 'VIP Preference',
    note: 'VIP Guest: Prefers feather-free synthetic pillows and sparkling water replenished daily.',
    createdBy: 'Front Desk (Kavita)',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  },
  {
    id: 'note-2',
    roomNumber: '104',
    guestName: 'Jonathan Vance',
    category: 'Late Check-out',
    note: 'Requested 14:00 PM complimentary late checkout due to evening flight departure.',
    createdBy: 'Front Desk (Kavita)',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  }
];

app.get('/api/guest-notes', (req: Request, res: Response) => {
  res.json(guestNotes);
});

app.post('/api/guest-notes', (req: Request, res: Response) => {
  const { roomNumber, guestName, category, note, createdBy } = req.body;
  if (!roomNumber || !note) {
    return res.status(400).json({ error: 'Room number and note text are required' });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    roomNumber,
    guestName: guestName || `Guest in Room ${roomNumber}`,
    category: category || 'Room Request',
    note,
    createdBy: createdBy || 'Staff Member',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  guestNotes.unshift(newNote);
  logAudit(createdBy || 'Staff Member', 'Front Desk', 'GUEST_NOTE_ADDED', `Note added for Room ${roomNumber}: ${category}`);
  res.status(201).json(newNote);
});

// ----------------------------------------------------
// 1. DASHBOARD METRICS (Lodgify UI Match)
// ----------------------------------------------------
app.get('/api/dashboard', (req: Request, res: Response) => {
  const totalRooms = rooms.length;
  const occupiedCount = rooms.filter(r => r.status === 'Occupied').length;
  const reservedCount = reservations.filter(r => r.status === 'Confirmed').length;
  const availableCount = rooms.filter(r => r.status === 'Available' || r.status === 'Inspected').length;
  const notReadyCount = rooms.filter(r => r.status === 'Dirty' || r.status === 'Cleaning' || r.status === 'OutOfOrder').length;
  const occupancyRate = (occupiedCount / totalRooms) * 100;

  // Lodgify stats
  const totalRevenue = folios.reduce((acc, f) => acc + f.grandTotal, 0);
  const totalPaid = folios.reduce((acc, f) => acc + f.paidAmount, 0);

  // Platform distribution
  const platformCounts: Record<string, number> = {};
  reservations.forEach(r => {
    platformCounts[r.source] = (platformCounts[r.source] || 0) + 1;
  });

  const bookingByPlatform = [
    { platform: 'Direct Booking', percent: 61, color: '#A7F3D0' },
    { platform: 'Booking.com', percent: 18, color: '#D4F05B' },
    { platform: 'Airbnb', percent: 11, color: '#BEF264' },
    { platform: 'Expedia', percent: 7, color: '#FEF08A' },
    { platform: 'Others', percent: 3, color: '#E2E8F0' }
  ];

  // Ratings calculation
  const overallRating = 4.6;
  const ratingBreakdown = {
    facilities: 4.4,
    cleanliness: 4.8,
    services: 4.7,
    comfort: 4.8,
    location: 4.5
  };

  res.json({
    metrics: {
      newBookings: 840,
      newBookingsGrowth: '+8.70% from last week',
      checkInsToday: 6,
      checkInsGrowth: '+3.56% from last week',
      checkOutsToday: 4,
      checkOutsGrowth: '-1.06% from last week',
      totalRevenue: totalRevenue || 123980,
      revenueGrowth: '+5.70% from last week'
    },
    roomAvailability: {
      total: totalRooms,
      occupied: occupiedCount,
      reserved: reservedCount,
      available: availableCount,
      notReady: notReadyCount,
      occupancyRate: Math.round(occupancyRate)
    },
    revenueChart: [
      { month: 'Dec 2027', revenue: 240000 },
      { month: 'Jan 2028', revenue: 210000 },
      { month: 'Feb 2028', revenue: 315060 },
      { month: 'Mar 2028', revenue: 280000 },
      { month: 'Apr 2028', revenue: 340000 },
      { month: 'May 2028', revenue: 295000 }
    ],
    bookingByPlatform,
    ratings: {
      score: overallRating,
      label: 'Impressive',
      totalReviews: 2544,
      breakdown: ratingBreakdown
    },
    tasks: housekeepingTasks.slice(0, 4)
  });
});

// ----------------------------------------------------
// 2. ROOMS & RESERVATION CALENDAR
// ----------------------------------------------------
app.get('/api/rooms', (req: Request, res: Response) => {
  res.json(rooms);
});

app.patch('/api/rooms/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const room = rooms.find(r => r.id === id || r.roomNumber === id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const oldStatus = room.status;
  room.status = status;
  channelSyncService.broadcastRoomAvailability(room);
  logAudit('Staff User', 'Front Office', 'ROOM_STATUS_CHANGE', `Room ${room.roomNumber} changed from ${oldStatus} to ${status}`);
  res.json(room);
});

app.get('/api/reservations', (req: Request, res: Response) => {
  res.json(reservations);
});

app.post('/api/reservations', (req: Request, res: Response) => {
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

  const targetRoom = rooms.find(r => r.id === roomId || r.roomNumber === roomId);
  if (!targetRoom) return res.status(400).json({ error: 'Selected room not found' });

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const totalOccupancy = (rooms.filter(r => r.status === 'Occupied').length / rooms.length) * 100;
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

  reservations.unshift(newReservation);
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
  folios.unshift(newFolio);

  channelSyncService.broadcastRoomAvailability(targetRoom);
  logAudit(
    'Front Desk', 
    'Receptionist', 
    isCheckedIn ? 'GUEST_CHECK_IN' : 'RESERVATION_CREATED', 
    `${isCheckedIn ? 'Checked in' : 'Booked'} ${newReservation.bookingRef} for ${guestName} (Room ${targetRoom.roomNumber}) with verified ${newReservation.documentType} KYC.`
  );

  res.status(201).json({ reservation: newReservation, folio: newFolio });
});

// Check-in
app.post('/api/reservations/:id/checkin', (req: Request, res: Response) => {
  const { id } = req.params;
  const { documentType, documentNumber } = req.body;
  const resv = reservations.find(r => r.id === id || r.bookingRef === id);
  if (!resv) return res.status(404).json({ error: 'Reservation not found' });

  resv.status = 'CheckedIn';
  if (documentNumber) {
    resv.kycStatus = 'Verified';
    resv.documentType = documentType || resv.documentType;
    resv.documentNumber = documentNumber;
  }

  const room = rooms.find(r => r.id === resv.roomId || r.roomNumber === resv.roomNumber);
  if (room) {
    room.status = 'Occupied';
    room.currentGuest = resv.guestName;
    room.currentReservationId = resv.id;
  }

  logAudit('Front Desk', 'Receptionist', 'CHECK_IN', `Guest ${resv.guestName} checked in to Room ${resv.roomNumber}`);
  res.json({ message: 'Checked in successfully', reservation: resv });
});

// Check-out
app.post('/api/reservations/:id/checkout', (req: Request, res: Response) => {
  const { id } = req.params;
  const resv = reservations.find(r => r.id === id || r.bookingRef === id);
  if (!resv) return res.status(404).json({ error: 'Reservation not found' });

  resv.status = 'CheckedOut';
  const room = rooms.find(r => r.id === resv.roomId || r.roomNumber === resv.roomNumber);
  if (room) {
    room.status = 'Dirty';
    room.currentGuest = undefined;
    room.currentReservationId = undefined;

    // Trigger housekeeping cleaning task
    housekeepingTasks.unshift({
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

  logAudit('Front Desk', 'Receptionist', 'CHECK_OUT', `Guest ${resv.guestName} checked out of Room ${resv.roomNumber}`);
  res.json({ message: 'Checked out successfully', reservation: resv });
});

// ----------------------------------------------------
// 3. BILLING, GST, FOLIOS & PAYMENTS
// ----------------------------------------------------
app.get('/api/folios', (req: Request, res: Response) => {
  res.json(folios);
});

app.get('/api/folios/:id', (req: Request, res: Response) => {
  const folio = folios.find(f => f.id === req.params.id || f.reservationId === req.params.id);
  if (!folio) return res.status(404).json({ error: 'Folio not found' });
  res.json(folio);
});

// Add Item to Folio (Room Service, Minibar, Laundry)
app.post('/api/folios/:id/items', (req: Request, res: Response) => {
  const folio = folios.find(f => f.id === req.params.id || f.reservationId === req.params.id);
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

  logAudit('Billing', 'Cashier', 'FOLIO_ITEM_ADDED', `Added ${description} (₹${amount}) to Folio ${folio.invoiceNumber}`);
  res.json(folio);
});

// Settle Folio / Process Payment
app.post('/api/folios/:id/pay', (req: Request, res: Response) => {
  const folio = folios.find(f => f.id === req.params.id || f.reservationId === req.params.id);
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
  const resv = reservations.find(r => r.id === folio.reservationId);
  if (resv) {
    resv.paidAmount = folio.paidAmount;
    resv.paymentStatus = folio.status === 'Settled' ? 'Paid' : 'Partial';
  }

  logAudit('Payment Gateway', 'Stripe/Razorpay', 'PAYMENT_RECEIVED', `Payment of ₹${payAmt} settled for Folio ${folio.invoiceNumber} via ${paymentMethod}`);
  res.json(folio);
});

// Dynamic Pricing Config
app.get('/api/pricing/config', (req: Request, res: Response) => {
  res.json(pricingEngine.getConfig());
});

app.put('/api/pricing/config', (req: Request, res: Response) => {
  const updated = pricingEngine.updateConfig(req.body);
  logAudit('Manager', 'General Manager', 'PRICING_RULE_UPDATED', `Dynamic surge rules updated. Surge active: ${updated.isSurgeActive}`);
  res.json(updated);
});

// ----------------------------------------------------
// 4. HOUSEKEEPING & ROOM SERVICE
// ----------------------------------------------------
app.get('/api/housekeeping/tasks', (req: Request, res: Response) => {
  res.json(housekeepingTasks);
});

app.post('/api/housekeeping/tasks', (req: Request, res: Response) => {
  const { roomId, roomNumber, taskType, priority, assignedTo, notes, dueTime } = req.body;
  const task: HousekeepingTask = {
    id: `hk-${Date.now()}`,
    roomId,
    roomNumber,
    taskType,
    priority: priority || 'Medium',
    assignedTo: assignedTo || 'Unassigned',
    status: 'Pending',
    notes,
    dueTime: dueTime || '15:00',
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  housekeepingTasks.unshift(task);
  res.status(201).json(task);
});

app.patch('/api/housekeeping/tasks/:id', (req: Request, res: Response) => {
  const task = housekeepingTasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { status, assignedTo, notes } = req.body;
  if (status) task.status = status;
  if (assignedTo) task.assignedTo = assignedTo;
  if (notes) task.notes = notes;
  task.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  // If completed inspection or cleaning, update room status
  if (task.status === 'Completed') {
    const room = rooms.find(r => r.id === task.roomId || r.roomNumber === task.roomNumber);
    if (room && room.status !== 'Occupied') {
      room.status = task.taskType === 'Inspection' ? 'Inspected' : 'Available';
      channelSyncService.broadcastRoomAvailability(room);
    }
  }

  res.json(task);
});

app.patch('/api/housekeeping/tasks/:id/clean-status', (req: Request, res: Response) => {
  const task = housekeepingTasks.find(t => t.id === req.params.id || t.roomNumber === req.params.id);
  if (!task) return res.status(404).json({ error: 'Housekeeping task not found' });

  const { cleanStatus, availability, remarks } = req.body;
  if (cleanStatus) task.cleanStatus = cleanStatus;
  if (availability) task.availability = availability;
  if (remarks !== undefined) task.remarks = remarks;
  task.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  // Sync with Room status
  const room = rooms.find(r => r.id === task.roomId || r.roomNumber === task.roomNumber);
  if (room) {
    if (cleanStatus === 'Clean') {
      room.status = availability === 'Occupied' ? 'Occupied' : 'Inspected';
    } else if (cleanStatus === 'Dirty') {
      room.status = 'Dirty';
    } else if (cleanStatus === 'In Process') {
      room.status = 'Cleaning';
    } else if (cleanStatus === 'Repair') {
      room.status = 'OutOfOrder';
    }
  }

  logAudit('Housekeeping Staff', 'Attendant', 'HOUSEKEEPING_STATUS_UPDATE', `Room ${task.roomNumber} updated to ${cleanStatus} (${availability})`);
  res.json(task);
});

// ----------------------------------------------------
// 4b. MAINTENANCE WORK ORDERS
// ----------------------------------------------------
app.get('/api/maintenance', (req: Request, res: Response) => {
  res.json(maintenanceWorkOrders);
});

app.post('/api/maintenance', (req: Request, res: Response) => {
  const { roomNumber, issue, category, priority, reportedBy, remarks } = req.body;
  if (!roomNumber || !issue) {
    return res.status(400).json({ error: 'Room number and issue description are required' });
  }

  const newOrder: MaintenanceWorkOrder = {
    id: `mwo-${Date.now()}`,
    roomNumber,
    issue,
    category: category || 'Electrical',
    priority: priority || 'Medium',
    reportedBy: reportedBy || 'Housekeeping Staff',
    assignedTo: 'Vikram Singh (Tech)',
    status: 'Reported',
    remarks: remarks || '',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  maintenanceWorkOrders.unshift(newOrder);
  logAudit(reportedBy || 'Staff', 'Maintenance', 'MAINTENANCE_ORDER_CREATED', `Work order logged for Room ${roomNumber}: ${issue}`);
  res.status(201).json(newOrder);
});

app.patch('/api/maintenance/:id', (req: Request, res: Response) => {
  const order = maintenanceWorkOrders.find(m => m.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Maintenance order not found' });

  const { status, remarks, assignedTo } = req.body;
  if (status) {
    order.status = status;
    if (status === 'Resolved') {
      order.resolvedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
    }
  }
  if (remarks !== undefined) order.remarks = remarks;
  if (assignedTo) order.assignedTo = assignedTo;

  logAudit('Maintenance Tech', 'Engineering', 'MAINTENANCE_ORDER_UPDATED', `Work order ${order.id} for Room ${order.roomNumber} updated to ${order.status}`);
  res.json(order);
});

// ----------------------------------------------------
// 5. RESTAURANT POS & KITCHEN DISPLAY
// ----------------------------------------------------
app.get('/api/pos/orders', (req: Request, res: Response) => {
  res.json(posOrders);
});

app.post('/api/pos/orders', (req: Request, res: Response) => {
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

  posOrders.unshift(newOrder);

  // If billed to room, append automatically to active guest folio
  if (billedToRoom) {
    const activeRes = reservations.find(r => 
      r.status === 'CheckedIn' && 
      (roomOrTableNumber.includes(r.roomNumber) || r.roomNumber === roomOrTableNumber)
    );
    if (activeRes) {
      newOrder.reservationId = activeRes.id;
      const folio = folios.find(f => f.reservationId === activeRes.id);
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

  logAudit('F&B POS', 'Waiter/Cashier', 'POS_ORDER_CREATED', `Order ${newOrder.orderNumber} for ${roomOrTableNumber} created (₹${total})`);
  res.status(201).json(newOrder);
});

app.patch('/api/pos/orders/:id/status', (req: Request, res: Response) => {
  const order = posOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status;
  res.json(order);
});

// ----------------------------------------------------
// 6. INVENTORY & LAUNDRY OPERATIONS
// ----------------------------------------------------
app.get('/api/inventory', (req: Request, res: Response) => {
  res.json(inventoryItems);
});

app.patch('/api/inventory/:id/stock', (req: Request, res: Response) => {
  const item = inventoryItems.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.currentStock = Number(req.body.currentStock);
  item.lastRestocked = new Date().toISOString().slice(0, 10);
  res.json(item);
});

app.get('/api/laundry', (req: Request, res: Response) => {
  res.json(laundryBatches);
});

app.post('/api/laundry', (req: Request, res: Response) => {
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
  laundryBatches.unshift(newBatch);
  res.status(201).json(newBatch);
});

app.patch('/api/laundry/:id/status', (req: Request, res: Response) => {
  const batch = laundryBatches.find(b => b.id === req.params.id);
  if (!batch) return res.status(404).json({ error: 'Batch not found' });
  batch.status = req.body.status;
  res.json(batch);
});

// ----------------------------------------------------
// 7. STAFF MANAGEMENT & ATTENDANCE
// ----------------------------------------------------
app.get('/api/staff', (req: Request, res: Response) => {
  res.json(staffMembers);
});

app.get('/api/staff/attendance', (req: Request, res: Response) => {
  res.json(attendanceRecords);
});

app.post('/api/staff/attendance/punch', (req: Request, res: Response) => {
  const { staffId, method } = req.body;
  const staff = staffMembers.find(s => s.id === staffId);
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });

  const now = new Date();
  const timeString = now.toTimeString().slice(0, 8);
  const dateString = now.toISOString().slice(0, 10);

  const existingPunch = attendanceRecords.find(a => a.staffId === staffId && a.date === dateString);
  if (existingPunch && !existingPunch.clockOut) {
    existingPunch.clockOut = timeString;
    staff.status = 'Off Duty';
    logAudit(staff.name, staff.role, 'STAFF_CLOCK_OUT', `Clocked out at ${timeString}`);
    return res.json({ message: 'Clocked out successfully', record: existingPunch });
  }

  const newRecord = {
    id: `att-${Date.now()}`,
    staffId: staff.id,
    staffName: staff.name,
    date: dateString,
    clockIn: timeString,
    method: method || 'Mobile App GPS',
    status: 'Present' as const
  };

  attendanceRecords.unshift(newRecord);
  staff.status = 'On Duty';
  staff.punchInTime = timeString;
  logAudit(staff.name, staff.role, 'STAFF_CLOCK_IN', `Clocked in at ${timeString} via ${method}`);
  res.json({ message: 'Clocked in successfully', record: newRecord });
});

app.get('/api/staff/leave', (req: Request, res: Response) => {
  res.json(leaveRequests);
});

// ----------------------------------------------------
// 8. CUSTOMER EXPERIENCE & LOYALTY
// ----------------------------------------------------
app.get('/api/guest-exp/feedback', (req: Request, res: Response) => {
  res.json(feedbackList);
});

app.post('/api/guest-exp/feedback', (req: Request, res: Response) => {
  const { guestName, roomNumber, npsScore, ratingCleanliness, ratingStaff, ratingFood, ratingValue, comments } = req.body;
  const score = Number(npsScore);
  const sentiment = score >= 8 ? 'Positive' : score >= 6 ? 'Neutral' : 'Negative';

  const fb = {
    id: `fb-${Date.now()}`,
    reservationId: `res-${Math.floor(1000 + Math.random() * 9000)}`,
    guestName,
    roomNumber,
    npsScore: score,
    ratingCleanliness: Number(ratingCleanliness) || 5,
    ratingStaff: Number(ratingStaff) || 5,
    ratingFood: Number(ratingFood) || 5,
    ratingValue: Number(ratingValue) || 5,
    comments,
    sentiment: sentiment as 'Positive' | 'Neutral' | 'Negative',
    date: new Date().toISOString().slice(0, 10)
  };

  feedbackList.unshift(fb);
  logAudit(guestName, 'Guest', 'FEEDBACK_SUBMITTED', `NPS Score: ${score}/10 - "${comments.slice(0, 30)}..."`);
  res.status(201).json(fb);
});

app.get('/api/guest-exp/loyalty', (req: Request, res: Response) => {
  res.json(loyaltyMembers);
});

// ----------------------------------------------------
// 9. OTA CHANNELS & AUDIT TRAIL
// ----------------------------------------------------
app.get('/api/ota/logs', (req: Request, res: Response) => {
  res.json(channelSyncService.getLogs());
});

app.post('/api/ota/sync-all', (req: Request, res: Response) => {
  const results: any[] = [];
  rooms.forEach(r => {
    results.push(...channelSyncService.broadcastRoomAvailability(r));
  });
  logAudit('System Cron', 'Channel Manager', 'FULL_OTA_SYNC', `Synced all ${rooms.length} room inventories across Booking.com, Expedia, Airbnb.`);
  res.json({ message: 'Synchronized with all OTA channels', logs: results });
});

app.get('/api/audit', (req: Request, res: Response) => {
  res.json(auditLogs);
});

// ----------------------------------------------------
// 10. UAT DATA SEED & RESET ENGINE
// ----------------------------------------------------
app.post('/api/seed', (req: Request, res: Response) => {
  rooms = [...initialRooms];
  reservations = [...initialReservations];
  folios = [...initialFolios];
  housekeepingTasks = [...initialHousekeepingTasks];
  inventoryItems = [...initialInventoryItems];
  posOrders = [...initialPosOrders];
  laundryBatches = [...initialLaundryBatches];
  staffMembers = [...initialStaffMembers];
  attendanceRecords = [...initialAttendanceRecords];
  leaveRequests = [...initialLeaveRequests];
  feedbackList = [...initialFeedback];
  loyaltyMembers = [...initialLoyaltyMembers];
  auditLogs = [...initialAuditLogs];
  maintenanceWorkOrders = [...initialMaintenanceWorkOrders];

  logAudit('System Administrator', 'Admin', 'DATABASE_RESEEDED', 'Sample data successfully reseeded for UAT enterprise validation.');

  res.json({
    success: true,
    message: 'Sample data seeded successfully for UAT testing & hospitality scenarios',
    summary: {
      roomsCount: rooms.length,
      reservationsCount: reservations.length,
      foliosCount: folios.length,
      housekeepingTasksCount: housekeepingTasks.length,
      maintenanceOrdersCount: maintenanceWorkOrders.length,
      inventoryItemsCount: inventoryItems.length,
      posOrdersCount: posOrders.length,
      staffCount: staffMembers.length,
      systemUsersCount: systemUsers.length
    }
  });
});

app.get('/api/seed/status', (req: Request, res: Response) => {
  res.json({
    seeded: true,
    counts: {
      rooms: rooms.length,
      reservations: reservations.length,
      folios: folios.length,
      housekeepingTasks: housekeepingTasks.length,
      maintenanceOrders: maintenanceWorkOrders.length,
      inventory: inventoryItems.length,
      users: systemUsers.length
    }
  });
});

// Health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      rooms: rooms.length,
      reservations: reservations.length,
      folios: folios.length,
      housekeeping: housekeepingTasks.length,
      maintenance: maintenanceWorkOrders.length,
      inventory: inventoryItems.length,
      users: systemUsers.length
    }
  });
});

  // Fallback for unmatched API routes
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'API endpoint not found',
      method: req.method,
      path: req.originalUrl,
      health: '/api/health'
    });
  });
}
