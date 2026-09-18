/**
 * ============================================================================
 * HOTEL & ROOM DOMAIN MODULE
 * Handles Room Catalog, Room State Machine, and Lodgify Dashboard Metrics
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { Room, RoomStatus, RoomCategory, HotelProperty } from '../../types/index.js';
import { outbox } from '../../events/outboxProcessor.js';

export const hotelRouter = Router();

hotelRouter.get('/rooms', (req: Request, res: Response) => {
  res.json(store.rooms);
});

hotelRouter.get('/rooms/:id', (req: Request, res: Response) => {
  const room = store.rooms.find(r => r.id === req.params.id || r.roomNumber === req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room);
});

hotelRouter.patch('/rooms/:id/status', (req: Request, res: Response) => {
  const { status } = req.body as { status: RoomStatus | string };
  const roomIndex = store.rooms.findIndex(r => r.id === req.params.id || r.roomNumber === req.params.id);

  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const oldStatus = store.rooms[roomIndex].status;
  let newStatus: RoomStatus = 'Available';

  if (status === 'Clean') {
    newStatus = store.rooms[roomIndex].currentGuest ? 'Occupied' : 'Available';
  } else if (status === 'Dirty') {
    newStatus = 'Dirty';
  } else if (status === 'Under Maintenance' || status === 'OutOfOrder' || status === 'Repair') {
    newStatus = 'OutOfOrder';
  } else if (status === 'Available') {
    newStatus = 'Available';
  } else if (status === 'Occupied' || status === 'Cleaning' || status === 'Inspected') {
    newStatus = status as RoomStatus;
  } else {
    newStatus = (status as RoomStatus) || 'Available';
  }

  store.rooms[roomIndex].status = newStatus;

  if (newStatus === 'Available') {
    store.rooms[roomIndex].currentGuest = undefined;
    store.rooms[roomIndex].currentReservationId = undefined;
  }

  // Synchronize with housekeeping task
  const roomNum = store.rooms[roomIndex].roomNumber;
  let task = store.housekeepingTasks.find(t => t.roomId === store.rooms[roomIndex].id || t.roomNumber === roomNum);
  if (task) {
    if (newStatus === 'Available' || newStatus === 'Inspected') {
      task.cleanStatus = 'Clean';
      task.status = 'Completed';
    } else if (newStatus === 'Dirty') {
      task.cleanStatus = 'Dirty';
      task.status = 'Pending';
    } else if (newStatus === 'OutOfOrder') {
      task.cleanStatus = 'Under Maintenance';
      task.status = 'Pending';
    } else if (newStatus === 'Cleaning') {
      task.cleanStatus = 'In Process';
      task.status = 'InProgress';
    }
    task.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
  }

  outbox.recordEvent('room.status_changed', 'Room', store.rooms[roomIndex].id, {
    roomNumber: store.rooms[roomIndex].roomNumber,
    oldStatus,
    newStatus
  });

  store.logAudit('Staff', 'Operations', 'ROOM_STATUS_CHANGED', `Room ${store.rooms[roomIndex].roomNumber} transitioned from ${oldStatus} to ${newStatus}`);

  res.json(store.rooms[roomIndex]);
});

// Master Data: Create Room
hotelRouter.post('/rooms', (req: Request, res: Response) => {
  const { roomNumber, floor, category, baseRate, maxGuests, amenities, status } = req.body;
  
  if (!roomNumber) {
    return res.status(400).json({ error: 'Room number is required' });
  }

  const existing = store.rooms.find(r => r.roomNumber.toLowerCase() === String(roomNumber).toLowerCase());
  if (existing) {
    return res.status(409).json({ error: `Room number ${roomNumber} already exists` });
  }

  const newRoom: Room = {
    id: `rm-${roomNumber.toString().toLowerCase().replace(/\s+/g, '-')}`,
    roomNumber: String(roomNumber),
    floor: Number(floor) || 1,
    category: (category as RoomCategory) || 'Standard',
    baseRate: Number(baseRate) || 2500,
    maxGuests: Number(maxGuests) || 2,
    status: (status as RoomStatus) || 'Available',
    amenities: Array.isArray(amenities) ? amenities : ['Wi-Fi', 'Smart TV']
  };

  store.rooms.push(newRoom);
  store.logAudit('Admin', 'Administrator', 'ROOM_CREATED', `Created new room ${newRoom.roomNumber} (${newRoom.category}) at ₹${newRoom.baseRate}/nt`);
  res.status(201).json(newRoom);
});

// Master Data: Update Room
hotelRouter.put('/rooms/:id', (req: Request, res: Response) => {
  const roomIndex = store.rooms.findIndex(r => r.id === req.params.id || r.roomNumber === req.params.id);
  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const current = store.rooms[roomIndex];
  const { roomNumber, floor, category, baseRate, maxGuests, amenities, status } = req.body;

  if (roomNumber && roomNumber !== current.roomNumber) {
    const conflict = store.rooms.find(r => r.id !== current.id && r.roomNumber.toLowerCase() === String(roomNumber).toLowerCase());
    if (conflict) {
      return res.status(409).json({ error: `Room number ${roomNumber} already taken` });
    }
  }

  store.rooms[roomIndex] = {
    ...current,
    roomNumber: roomNumber ? String(roomNumber) : current.roomNumber,
    floor: floor !== undefined ? Number(floor) : current.floor,
    category: category || current.category,
    baseRate: baseRate !== undefined ? Number(baseRate) : current.baseRate,
    maxGuests: maxGuests !== undefined ? Number(maxGuests) : current.maxGuests,
    amenities: Array.isArray(amenities) ? amenities : current.amenities,
    status: status || current.status
  };

  store.logAudit('Admin', 'Administrator', 'ROOM_UPDATED', `Updated room ${store.rooms[roomIndex].roomNumber} configuration`);
  res.json(store.rooms[roomIndex]);
});

// Master Data: Delete Room
hotelRouter.delete('/rooms/:id', (req: Request, res: Response) => {
  const roomIndex = store.rooms.findIndex(r => r.id === req.params.id || r.roomNumber === req.params.id);
  if (roomIndex === -1) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const deleted = store.rooms.splice(roomIndex, 1)[0];
  store.logAudit('Admin', 'Administrator', 'ROOM_DELETED', `Deleted room ${deleted.roomNumber} from catalog`);
  res.json({ message: `Room ${deleted.roomNumber} deleted successfully`, room: deleted });
});

// Hotel Property Master Settings
hotelRouter.get('/hotel/properties', (req: Request, res: Response) => {
  res.json(store.hotelProperty);
});

hotelRouter.put('/hotel/properties', (req: Request, res: Response) => {
  store.hotelProperty = {
    ...store.hotelProperty,
    ...req.body
  };
  store.logAudit('Admin', 'Administrator', 'PROPERTY_SETTINGS_UPDATED', `Updated master property settings for ${store.hotelProperty.name}`);
  res.json(store.hotelProperty);
});

// Dynamic Field Validation Rules Endpoints
hotelRouter.get('/hotel/field-validations', (req: Request, res: Response) => {
  res.json(store.fieldValidations || {});
});

hotelRouter.put('/hotel/field-validations', (req: Request, res: Response) => {
  store.fieldValidations = req.body;
  store.logAudit('Admin', 'Administrator', 'VALIDATION_RULES_UPDATED', 'Admin modified field validation rules configuration');
  res.json({ message: 'Validation rules updated successfully', rules: store.fieldValidations });
});

hotelRouter.get('/dashboard', (req: Request, res: Response) => {
  const total = store.rooms.length;
  const occupied = store.rooms.filter(r => r.status === 'Occupied').length;
  const reserved = store.rooms.filter(r => r.status === 'Dirty' || r.status === 'Cleaning').length;
  const available = store.rooms.filter(r => r.status === 'Available' || r.status === 'Inspected').length;
  const notReady = store.rooms.filter(r => r.status === 'OutOfOrder').length;

  const directBookings = store.reservations.filter(r => r.source === 'Direct').length;
  const bookingCom = store.reservations.filter(r => r.source === 'Booking.com').length;
  const airbnb = store.reservations.filter(r => r.source === 'Airbnb').length;
  const expedia = store.reservations.filter(r => r.source === 'Expedia').length;

  const totalRev = store.folios.reduce((sum, f) => sum + f.grandTotal, 0);

  res.json({
    metrics: {
      newBookings: 840,
      newBookingsTrend: '+8.70%',
      checkIn: 231,
      checkInTrend: '+3.56%',
      checkOut: 124,
      checkOutTrend: '-1.06%',
      totalRevenue: totalRev || 123980,
      totalRevenueTrend: '+5.70%'
    },
    roomAvailability: {
      total,
      occupied,
      reserved,
      available,
      notReady
    },
    ratings: {
      score: 4.6,
      status: 'Impressive',
      categories: [
        { name: 'Facilities', score: 4.4 },
        { name: 'Cleanliness', score: 4.7 },
        { name: 'Services', score: 4.6 },
        { name: 'Comfort', score: 4.8 },
        { name: 'Location', score: 4.5 }
      ]
    },
    bookingByPlatform: [
      { name: 'Direct Booking', percentage: 61, count: directBookings || 48 },
      { name: 'Booking.com', percentage: 12, count: bookingCom || 12 },
      { name: 'Agoda', percentage: 11, count: 8 },
      { name: 'Airbnb', percentage: 9, count: airbnb || 6 },
      { name: 'Hotels.com', percentage: 5, count: expedia || 3 },
      { name: 'Others', percentage: 2, count: 2 }
    ]
  });
});
