import {
  Room,
  Reservation,
  Folio,
  HousekeepingTask,
  InventoryItem,
  PosOrder,
  LaundryBatch,
  StaffMember,
  AttendanceRecord,
  LeaveRequest,
  CustomerFeedback,
  LoyaltyProfile,
  ChannelSyncLog,
  AuditTrail,
  DynamicPricingConfig,
  MaintenanceWorkOrder,
  MenuItem,
  HotelProperty
} from '../types/index.js';

export const initialRooms: Room[] = [
  // 1st Floor - Single & Deluxe Rooms
  { id: 'rm-101', roomNumber: '101', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Occupied', amenities: ['King Bed', 'Balcony', 'Wi-Fi', 'Smart TV', 'Espresso Machine'], currentGuest: 'Daniel Hamilton', currentReservationId: 'res-1001' },
  { id: 'rm-102', roomNumber: '102', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Occupied', amenities: ['King Bed', 'Wi-Fi', 'Smart TV', 'Mini Fridge'], currentGuest: 'Frances Swann', currentReservationId: 'res-1002' },
  { id: 'rm-103', roomNumber: '103', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Dirty', amenities: ['Twin Beds', 'Wi-Fi', 'Work Desk'], currentGuest: 'Dennis Callis' },
  { id: 'rm-104', roomNumber: '104', floor: 1, category: 'Standard', baseRate: 2500, maxGuests: 2, status: 'Available', amenities: ['Queen Bed', 'Wi-Fi', 'Shower'], currentGuest: 'Ricky Smith' },
  { id: 'rm-105', roomNumber: '105', floor: 1, category: 'Standard', baseRate: 2500, maxGuests: 2, status: 'Cleaning', amenities: ['Queen Bed', 'Wi-Fi', 'Work Desk'], currentGuest: 'John Dukes' },
  { id: 'rm-106', roomNumber: '106', floor: 1, category: 'Standard', baseRate: 2500, maxGuests: 2, status: 'Available', amenities: ['Twin Beds', 'Wi-Fi'], currentGuest: 'Alexander Buckmaster' },
  { id: 'rm-107', roomNumber: '107', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Occupied', amenities: ['Queen Bed', 'Wi-Fi', 'City View'], currentGuest: 'Paula Mora' },
  { id: 'rm-108', roomNumber: '108', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Occupied', amenities: ['King Bed', 'Work Desk', 'Wi-Fi'], currentGuest: 'Alex Buckmaster' },
  { id: 'rm-109', roomNumber: '109', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Occupied', amenities: ['King Bed', 'Balcony', 'Smart TV'], currentGuest: 'Rhonda Rhodes' },
  { id: 'rm-110', roomNumber: '110', floor: 1, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Available', amenities: ['Queen Bed', 'Espresso Machine', 'Wi-Fi'], currentGuest: 'David Elson' },

  // 2nd Floor - Executive & Suites
  { id: 'rm-suite1', roomNumber: 'Suite1', floor: 2, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Available', amenities: ['King Bed', 'Lounge Area', 'City View', 'Bathtub', 'High-Speed Wi-Fi'], currentGuest: 'Joshua Jones' },
  { id: 'rm-suite2', roomNumber: 'Suite2', floor: 2, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Dirty', amenities: ['King Bed', 'Lounge Area', 'Balcony', 'Bathtub'], currentGuest: 'Kimberly Mastrangelo' },
  { id: 'rm-suite3', roomNumber: 'Suite3', floor: 2, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Occupied', amenities: ['King Bed', 'Lounge Area', 'Panoramic View'], currentGuest: 'Judith Rodriguez' },
  { id: 'rm-201', roomNumber: '201', floor: 2, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Occupied', amenities: ['King Bed', 'Lounge Area', 'City View', 'Bathtub', 'High-Speed Wi-Fi'], currentGuest: 'David Miller', currentReservationId: 'res-1003' },
  { id: 'rm-202', roomNumber: '202', floor: 2, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Inspected', amenities: ['King Bed', 'Lounge Area', 'Balcony', 'Bathtub'] },
  { id: 'rm-203', roomNumber: '203', floor: 2, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Available', amenities: ['King Bed', 'Lounge Area', 'Panoramic View'] },
  { id: 'rm-204', roomNumber: '204', floor: 2, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Occupied', amenities: ['King Bed', 'Wi-Fi', 'Smart TV'], currentGuest: 'Amina Al-Mansoor', currentReservationId: 'res-1004' },
  { id: 'rm-205', roomNumber: '205', floor: 2, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'OutOfOrder', amenities: ['King Bed', 'Smart TV', 'Balcony'] },
  { id: 'rm-206', roomNumber: '206', floor: 2, category: 'Standard', baseRate: 2500, maxGuests: 2, status: 'Available', amenities: ['Queen Bed', 'Wi-Fi'] },

  // 3rd Floor - Presidential & Suites
  { id: 'rm-301', roomNumber: '301', floor: 3, category: 'Presidential Suite', baseRate: 12500, maxGuests: 4, status: 'Occupied', amenities: ['Master Bedroom', 'Private Jacuzzi', 'Butler Service', 'Dining Area', 'Walk-in Closet'], currentGuest: 'Lord Alistair Sterling', currentReservationId: 'res-1005' },
  { id: 'rm-302', roomNumber: '302', floor: 3, category: 'Executive Suite', baseRate: 6500, maxGuests: 3, status: 'Available', amenities: ['King Bed', 'Terrace', 'Jacuzzi'] },
  { id: 'rm-303', roomNumber: '303', floor: 3, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Available', amenities: ['King Bed', 'Ocean View', 'Wi-Fi'] },
  { id: 'rm-304', roomNumber: '304', floor: 3, category: 'Deluxe', baseRate: 3500, maxGuests: 2, status: 'Inspected', amenities: ['Queen Bed', 'Wi-Fi', 'Espresso Machine'] },
];

export const initialReservations: Reservation[] = [
  {
    id: 'res-1001',
    bookingRef: 'BK-2026-901',
    guestName: 'Sophia Laurent',
    guestEmail: 'sophia.laurent@paris.fr',
    guestPhone: '+33 612 345 678',
    roomId: 'rm-101',
    roomNumber: '101',
    roomCategory: 'Deluxe',
    checkInDate: '2026-09-15',
    checkOutDate: '2026-09-18',
    guestsCount: 2,
    status: 'CheckedIn',
    source: 'Booking.com',
    totalNights: 3,
    roomRatePerNight: 3500,
    totalRoomAmount: 10500,
    taxAmount: 1260, // 12% GST
    grandTotal: 11760,
    paidAmount: 11760,
    paymentStatus: 'Paid',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'FR-8892104B',
    specialRequests: 'High floor, feather pillows',
    createdAt: '2026-09-10'
  },
  {
    id: 'res-1002',
    bookingRef: 'BK-2026-902',
    guestName: 'Marcus Chen',
    guestEmail: 'marcus.chen@techglobal.sg',
    guestPhone: '+65 9123 4567',
    roomId: 'rm-102',
    roomNumber: '102',
    roomCategory: 'Deluxe',
    checkInDate: '2026-09-16',
    checkOutDate: '2026-09-19',
    guestsCount: 1,
    status: 'CheckedIn',
    source: 'Direct',
    totalNights: 3,
    roomRatePerNight: 3850,
    totalRoomAmount: 11550,
    taxAmount: 1386,
    grandTotal: 12936,
    paidAmount: 5000,
    paymentStatus: 'Partial',
    kycStatus: 'Verified',
    documentType: 'NationalID',
    documentNumber: 'SG-S9238411D',
    specialRequests: 'Late check-in requested (21:00)',
    createdAt: '2026-09-12'
  },
  {
    id: 'res-1003',
    bookingRef: 'BK-2026-903',
    guestName: 'David Miller',
    guestEmail: 'dmiller@austin-corp.com',
    guestPhone: '+1 512 889 1234',
    roomId: 'rm-201',
    roomNumber: '201',
    roomCategory: 'Executive Suite',
    checkInDate: '2026-09-14',
    checkOutDate: '2026-09-17',
    guestsCount: 2,
    status: 'CheckedIn',
    source: 'Expedia',
    totalNights: 3,
    roomRatePerNight: 6500,
    totalRoomAmount: 19500,
    taxAmount: 2340,
    grandTotal: 21840,
    paidAmount: 21840,
    paymentStatus: 'Paid',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'USA-55104821',
    createdAt: '2026-09-08'
  },
  {
    id: 'res-1004',
    bookingRef: 'BK-2026-904',
    guestName: 'Amina Al-Mansoor',
    guestEmail: 'amina.mansoor@qatarholding.qa',
    guestPhone: '+974 5512 3456',
    roomId: 'rm-204',
    roomNumber: '204',
    roomCategory: 'Deluxe',
    checkInDate: '2026-09-16',
    checkOutDate: '2026-09-20',
    guestsCount: 2,
    status: 'CheckedIn',
    source: 'Airbnb',
    totalNights: 4,
    roomRatePerNight: 3500,
    totalRoomAmount: 14000,
    taxAmount: 1680,
    grandTotal: 15680,
    paidAmount: 15680,
    paymentStatus: 'Paid',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'QA-71049281',
    createdAt: '2026-09-11'
  },
  {
    id: 'res-1005',
    bookingRef: 'BK-2026-905',
    guestName: 'Lord Alistair Sterling',
    guestEmail: 'sterling.estates@uknet.co.uk',
    guestPhone: '+44 7700 900123',
    roomId: 'rm-301',
    roomNumber: '301',
    roomCategory: 'Presidential Suite',
    checkInDate: '2026-09-15',
    checkOutDate: '2026-09-21',
    guestsCount: 2,
    status: 'CheckedIn',
    source: 'Direct',
    totalNights: 6,
    roomRatePerNight: 12500,
    totalRoomAmount: 75000,
    taxAmount: 13500, // 18% GST for luxury slab
    grandTotal: 88500,
    paidAmount: 88500,
    paymentStatus: 'Paid',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'GB-99014238',
    specialRequests: 'VIP Airport transfer, Champagne on arrival',
    createdAt: '2026-09-01'
  },
  {
    id: 'res-1006',
    bookingRef: 'BK-2026-906',
    guestName: 'Elena Rostova',
    guestEmail: 'elena.rostova@berlinart.de',
    guestPhone: '+49 171 2345678',
    roomId: 'rm-202',
    roomNumber: '202',
    roomCategory: 'Executive Suite',
    checkInDate: '2026-09-17',
    checkOutDate: '2026-09-20',
    guestsCount: 1,
    status: 'Confirmed',
    source: 'Booking.com',
    totalNights: 3,
    roomRatePerNight: 6500,
    totalRoomAmount: 19500,
    taxAmount: 2340,
    grandTotal: 21840,
    paidAmount: 5000,
    paymentStatus: 'Partial',
    kycStatus: 'Pending',
    createdAt: '2026-09-14'
  }
];

export const initialFolios: Folio[] = [
  {
    id: 'fol-1001',
    reservationId: 'res-1001',
    guestName: 'Sophia Laurent',
    roomNumber: '101',
    invoiceNumber: 'INV-2026-0842',
    issuedDate: '2026-09-15',
    items: [
      { id: 'fi-1', date: '2026-09-15', description: 'Room Stay (3 Nights)', category: 'Room', amount: 10500, hsnSacCode: '996311', taxRatePercent: 12 },
      { id: 'fi-2', date: '2026-09-15', description: 'Restaurant - Azure Fine Dining (Dinner)', category: 'Restaurant', amount: 1850, hsnSacCode: '996331', taxRatePercent: 5 },
      { id: 'fi-3', date: '2026-09-16', description: 'Minibar - Perrier & Artisan Chocolate', category: 'Minibar', amount: 450, hsnSacCode: '996331', taxRatePercent: 18 }
    ],
    subtotal: 12800,
    cgst: 716,
    sgst: 716,
    igst: 0,
    totalTax: 1432,
    discount: 500,
    grandTotal: 13732,
    paidAmount: 11760,
    balanceDue: 1972,
    status: 'Open',
    paymentMethod: 'Stripe'
  }
];

export const initialPricingConfig: DynamicPricingConfig = {
  baseOccupancyThreshold: 70,
  surgeMultiplier: 1.25,
  weekendMultiplier: 1.15,
  peakSeasonMultiplier: 1.20,
  isSurgeActive: true
};

export const initialMaintenanceWorkOrders: MaintenanceWorkOrder[] = [
  { id: 'mwo-1', roomNumber: '108', issue: 'Broken bedside reading lamp & flickering switch', category: 'Electrical', priority: 'Medium', reportedBy: 'Priya Sharma (Housekeeper)', assignedTo: 'Vikram Singh (Tech)', status: 'InProgress', remarks: 'Replacement bulb & socket dispatched', createdAt: '2026-09-16 09:30' },
  { id: 'mwo-2', roomNumber: '104', issue: 'Minibar completely empty, requires full restocking', category: 'Furniture', priority: 'Medium', reportedBy: 'Front Desk', assignedTo: 'Ramesh Kumar (F&B Runner)', status: 'Reported', remarks: 'Bar is totally empty', createdAt: '2026-09-16 10:45' },
  { id: 'mwo-3', roomNumber: 'Suite2', issue: 'Guest reported missing items & requested security verification', category: 'Security', priority: 'High', reportedBy: 'Kimberly Mastrangelo', assignedTo: 'Rajesh Menon (GM) & Security', status: 'Reported', remarks: 'Missed things. Need security', createdAt: '2026-09-16 11:20' },
  { id: 'mwo-4', roomNumber: '205', issue: 'Digital AC thermostat sensor error #E-04', category: 'HVAC', priority: 'High', reportedBy: 'System Auto-Alert', assignedTo: 'Vikram Singh (Tech)', status: 'InProgress', remarks: 'Compressor calibration required', createdAt: '2026-09-16 08:15' }
];

export const initialHousekeepingTasks: HousekeepingTask[] = [
  { id: 'hk-101', roomId: 'rm-101', roomNumber: '101', roomType: 'Deluxe', cleanStatus: 'In Process', availability: 'Available', guestName: 'Daniel Hamilton', taskType: 'Routine Cleaning', priority: 'Medium', assignedTo: 'Priya Sharma', status: 'InProgress', dueTime: '14:00', remarks: '...', updatedAt: '2026-09-16 11:00' },
  { id: 'hk-102', roomId: 'rm-102', roomNumber: '102', roomType: 'Deluxe', cleanStatus: 'In Process', availability: 'Cancel', guestName: 'Corina McCoy', taskType: 'Deep Clean', priority: 'Medium', assignedTo: 'Ramesh Kumar', status: 'InProgress', dueTime: '14:30', remarks: '...', updatedAt: '2026-09-16 11:15' },
  { id: 'hk-103', roomId: 'rm-103', roomNumber: '103', roomType: 'Deluxe', cleanStatus: 'Clean', availability: 'Occupied', guestName: 'Dennis Callis', taskType: 'Inspection', priority: 'High', assignedTo: 'Anita Desai (Supervisor)', status: 'Completed', dueTime: '12:00', remarks: '...', updatedAt: '2026-09-16 11:45' },
  { id: 'hk-104', roomId: 'rm-104', roomNumber: '104', roomType: 'Deluxe', cleanStatus: 'In Process', availability: 'Available', guestName: 'Katie Sims', taskType: 'Routine Cleaning', priority: 'Medium', assignedTo: 'Priya Sharma', status: 'InProgress', dueTime: '15:00', remarks: 'Bar is totally empty', updatedAt: '2026-09-16 10:30' },
  { id: 'hk-105', roomId: 'rm-105', roomNumber: '105', roomType: 'Deluxe', cleanStatus: 'In Process', availability: 'Available', guestName: 'Jerry Helfer', taskType: 'Routine Cleaning', priority: 'Low', assignedTo: 'Ramesh Kumar', status: 'InProgress', dueTime: '15:30', remarks: '...', updatedAt: '2026-09-16 10:45' },
  { id: 'hk-106', roomId: 'rm-106', roomNumber: '106', roomType: 'Deluxe', cleanStatus: 'Dirty', availability: 'Cancel', guestName: 'Chris Glasser', taskType: 'Deep Clean', priority: 'High', assignedTo: 'Priya Sharma', status: 'Pending', dueTime: '16:00', remarks: '...', updatedAt: '2026-09-16 09:10' },
  { id: 'hk-107', roomId: 'rm-107', roomNumber: '107', roomType: 'Deluxe', cleanStatus: 'Clean', availability: 'Occupied', guestName: 'Paula Mora', taskType: 'Inspection', priority: 'Medium', assignedTo: 'Anita Desai (Supervisor)', status: 'Completed', dueTime: '13:00', remarks: '...', updatedAt: '2026-09-16 12:00' },
  { id: 'hk-108', roomId: 'rm-108', roomNumber: '108', roomType: 'Deluxe', cleanStatus: 'In Process', availability: 'Available', guestName: 'Alex Buckmaster', taskType: 'Maintenance', priority: 'High', assignedTo: 'Vikram Singh', status: 'InProgress', dueTime: '13:30', remarks: 'Broken lamp', updatedAt: '2026-09-16 09:30' },
  { id: 'hk-109', roomId: 'rm-109', roomNumber: '109', roomType: 'Deluxe', cleanStatus: 'Clean', availability: 'Occupied', guestName: 'Rhonda Rhodes', taskType: 'Inspection', priority: 'Low', assignedTo: 'Anita Desai (Supervisor)', status: 'Completed', dueTime: '13:00', remarks: '...', updatedAt: '2026-09-16 11:30' },
  { id: 'hk-110', roomId: 'rm-110', roomNumber: '110', roomType: 'Deluxe', cleanStatus: 'In Process', availability: 'Available', guestName: 'David Elson', taskType: 'Routine Cleaning', priority: 'Medium', assignedTo: 'Ramesh Kumar', status: 'InProgress', dueTime: '14:45', remarks: '...', updatedAt: '2026-09-16 10:50' },
  { id: 'hk-s1', roomId: 'rm-suite1', roomNumber: 'Suite1', roomType: 'Suite', cleanStatus: 'In Process', availability: 'Available', guestName: 'Joshua Jones', taskType: 'Routine Cleaning', priority: 'High', assignedTo: 'Priya Sharma', status: 'InProgress', dueTime: '15:15', remarks: '...', updatedAt: '2026-09-16 11:20' },
  { id: 'hk-s2', roomId: 'rm-suite2', roomNumber: 'Suite2', roomType: 'Suite', cleanStatus: 'Dirty', availability: 'Cancel', guestName: 'Kimberly Mastrangelo', taskType: 'Maintenance', priority: 'High', assignedTo: 'Vikram Singh', status: 'Pending', dueTime: '14:00', remarks: 'Missed things. Need security', updatedAt: '2026-09-16 11:20' },
  { id: 'hk-s3', roomId: 'rm-suite3', roomNumber: 'Suite3', roomType: 'Suite', cleanStatus: 'Clean', availability: 'Occupied', guestName: 'Judith Rodriguez', taskType: 'Inspection', priority: 'High', assignedTo: 'Anita Desai (Supervisor)', status: 'Completed', dueTime: '12:30', remarks: '...', updatedAt: '2026-09-16 12:15' }
];

export const initialInventoryItems: InventoryItem[] = [
  { id: 'inv-1', name: 'Fresh Farm Eggs (Grade A)', category: 'Kitchen', currentStock: 140, minThreshold: 50, unit: 'pcs', unitCost: 8, supplier: 'GreenValley Agro', lastRestocked: '2026-09-14' },
  { id: 'inv-2', name: 'Artisan Coffee Beans (Arabica)', category: 'Kitchen', currentStock: 18, minThreshold: 10, unit: 'kg', unitCost: 850, supplier: 'BlueTokai Roasters', lastRestocked: '2026-09-10' },
  { id: 'inv-3', name: 'Luxury Herbal Shampoo 50ml', category: 'Amenities', currentStock: 320, minThreshold: 100, unit: 'bottles', unitCost: 35, supplier: 'Forest Botanicals', lastRestocked: '2026-09-05' },
  { id: 'inv-4', name: 'Egyptian Cotton Bath Towels', category: 'Linen', currentStock: 65, minThreshold: 40, unit: 'pcs', unitCost: 450, supplier: 'Textile Luxe Corp', lastRestocked: '2026-08-20' },
  { id: 'inv-5', name: 'Sparkling Water 330ml', category: 'Minibar', currentStock: 12, minThreshold: 24, unit: 'cans', unitCost: 65, supplier: 'AquaPurity Ltd', lastRestocked: '2026-09-02' },
  { id: 'inv-6', name: 'Hospital-Grade Disinfectant 5L', category: 'Housekeeping Supplies', currentStock: 8, minThreshold: 5, unit: 'canisters', unitCost: 1200, supplier: 'CleanMed Solutions', lastRestocked: '2026-09-08' }
];

export const initialPosOrders: PosOrder[] = [
  {
    id: 'pos-201',
    orderNumber: 'POS-2026-041',
    type: 'RoomService',
    roomOrTableNumber: 'Room 101',
    guestName: 'Sophia Laurent',
    items: [
      { id: 'menu-1', name: 'Truffle Mushroom Risotto', quantity: 1, unitPrice: 850, totalPrice: 850, category: 'Main Course' },
      { id: 'menu-2', name: 'San Pellegrino 750ml', quantity: 1, unitPrice: 320, totalPrice: 320, category: 'Beverage' },
      { id: 'menu-3', name: 'Tiramisu Della Nonna', quantity: 1, unitPrice: 420, totalPrice: 420, category: 'Dessert' }
    ],
    subtotal: 1590,
    tax: 79.5, // 5% GST on Restaurant F&B
    total: 1669.5,
    status: 'Delivered',
    billedToRoom: true,
    reservationId: 'res-1001',
    timestamp: '2026-09-16 13:20'
  },
  {
    id: 'pos-202',
    orderNumber: 'POS-2026-042',
    type: 'Restaurant',
    roomOrTableNumber: 'Table 4',
    guestName: 'Walk-in Guest',
    items: [
      { id: 'menu-4', name: 'Wood-fired Margherita Pizza', quantity: 2, unitPrice: 650, totalPrice: 1300, category: 'Main Course' },
      { id: 'menu-5', name: 'Craft Berry Mocktail', quantity: 2, unitPrice: 280, totalPrice: 560, category: 'Beverage' }
    ],
    subtotal: 1860,
    tax: 93,
    total: 1953,
    status: 'Preparing',
    billedToRoom: false,
    timestamp: '2026-09-16 14:05'
  }
];

export const initialLaundryBatches: LaundryBatch[] = [
  { id: 'ld-1', batchNumber: 'LB-2026-081', itemType: 'Bed Sheets', quantity: 45, status: 'Washing', vendor: 'In-House Hydro-Laundry', sentDate: '2026-09-16 09:00', expectedReturnDate: '2026-09-16 17:00' },
  { id: 'ld-2', batchNumber: 'LB-2026-082', itemType: 'Bath Towels', quantity: 60, status: 'Ironing', vendor: 'In-House Hydro-Laundry', sentDate: '2026-09-16 10:00', expectedReturnDate: '2026-09-16 16:30' },
  { id: 'ld-3', batchNumber: 'LB-2026-083', itemType: 'Staff Uniforms', quantity: 22, status: 'Returned', vendor: 'Elite Dry Cleaners Ltd', sentDate: '2026-09-15 08:30', expectedReturnDate: '2026-09-16 12:00' }
];

export const initialStaffMembers: StaffMember[] = [
  { id: 'stf-1', name: 'Rajesh Menon', role: 'General Manager', department: 'Administration', shift: 'Morning (06:00-14:00)', phone: '+91 98450 11223', email: 'rajesh.menon@grandazure.com', status: 'On Duty', punchInTime: '08:45' },
  { id: 'stf-2', name: 'Kavita Nair', role: 'Front Desk Officer', department: 'Front Office', shift: 'Morning (06:00-14:00)', phone: '+91 98450 44556', email: 'kavita.nair@grandazure.com', status: 'On Duty', punchInTime: '06:00' },
  { id: 'stf-3', name: 'Anita Desai', role: 'Housekeeping Lead', department: 'Housekeeping', shift: 'Morning (06:00-14:00)', phone: '+91 98450 77889', email: 'anita.desai@grandazure.com', status: 'On Duty', punchInTime: '06:15' },
  { id: 'stf-4', name: 'Priya Sharma', role: 'Housekeeping Lead', department: 'Housekeeping', shift: 'Morning (06:00-14:00)', phone: '+91 98450 99001', email: 'priya.sharma@grandazure.com', status: 'On Duty', punchInTime: '06:20' },
  { id: 'stf-5', name: 'Chef Antonio Rossi', role: 'Executive Chef', department: 'Food & Beverage', shift: 'Evening (14:00-22:00)', phone: '+91 98450 33445', email: 'antonio.rossi@grandazure.com', status: 'On Duty', punchInTime: '13:50' },
  { id: 'stf-6', name: 'Vikram Singh', role: 'Maintenance Tech', department: 'Engineering', shift: 'Morning (06:00-14:00)', phone: '+91 98450 55667', email: 'vikram.singh@grandazure.com', status: 'On Duty', punchInTime: '07:30' }
];

export const initialAttendanceRecords: AttendanceRecord[] = [
  { id: 'att-1', staffId: 'stf-2', staffName: 'Kavita Nair', date: '2026-09-16', clockIn: '06:00:12', method: 'Biometric Scanner', status: 'Present' },
  { id: 'att-2', staffId: 'stf-3', staffName: 'Anita Desai', date: '2026-09-16', clockIn: '06:15:40', method: 'Biometric Scanner', status: 'Present' },
  { id: 'att-3', staffId: 'stf-4', staffName: 'Priya Sharma', date: '2026-09-16', clockIn: '06:20:05', method: 'Mobile App GPS', status: 'Present' },
  { id: 'att-4', staffId: 'stf-1', staffName: 'Rajesh Menon', date: '2026-09-16', clockIn: '08:45:10', method: 'Mobile App GPS', status: 'Present' }
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: 'lv-1', staffId: 'stf-4', staffName: 'Priya Sharma', leaveType: 'Casual', startDate: '2026-09-22', endDate: '2026-09-24', reason: 'Family wedding event', status: 'Pending' },
  { id: 'lv-2', staffId: 'stf-6', staffName: 'Vikram Singh', leaveType: 'Medical', startDate: '2026-09-10', endDate: '2026-09-12', reason: 'Viral fever recovery', status: 'Approved', approvedBy: 'Rajesh Menon' }
];

export const initialFeedback: CustomerFeedback[] = [
  { id: 'fb-1', reservationId: 'res-998', guestName: 'Charles Montgomery', roomNumber: '201', npsScore: 10, ratingCleanliness: 5, ratingStaff: 5, ratingFood: 4, ratingValue: 5, comments: 'Impeccable concierge service and the suite views are sensational.', sentiment: 'Positive', date: '2026-09-14' },
  { id: 'fb-2', reservationId: 'res-999', guestName: 'Maria Garcia', roomNumber: '104', npsScore: 9, ratingCleanliness: 5, ratingStaff: 4, ratingFood: 5, ratingValue: 4, comments: 'Delicious breakfast spread and rapid check-in process.', sentiment: 'Positive', date: '2026-09-13' },
  { id: 'fb-3', reservationId: 'res-995', guestName: 'Kenji Sato', roomNumber: '106', npsScore: 7, ratingCleanliness: 4, ratingStaff: 4, ratingFood: 3, ratingValue: 3, comments: 'Room was very comfortable, although room service took 35 minutes.', sentiment: 'Neutral', date: '2026-09-11' }
];

export const initialLoyaltyMembers: LoyaltyProfile[] = [
  { id: 'loy-1', guestName: 'Lord Alistair Sterling', email: 'sterling.estates@uknet.co.uk', tier: 'Platinum', pointsBalance: 14500, lifetimeSpend: 245000, totalNights: 22, joinDate: '2025-04-10' },
  { id: 'loy-2', guestName: 'Sophia Laurent', email: 'sophia.laurent@paris.fr', tier: 'Gold', pointsBalance: 4800, lifetimeSpend: 68000, totalNights: 9, joinDate: '2025-11-18' },
  { id: 'loy-3', guestName: 'Marcus Chen', email: 'marcus.chen@techglobal.sg', tier: 'Silver', pointsBalance: 1200, lifetimeSpend: 25000, totalNights: 4, joinDate: '2026-03-02' }
];

export const initialChannelSyncLogs: ChannelSyncLog[] = [
  { id: 'csl-1', channel: 'Booking.com', eventType: 'Rates Push', status: 'Success', details: 'Surge pricing multiplier (1.25x) pushed across 16 available units', timestamp: '2026-09-16 11:30' },
  { id: 'csl-2', channel: 'Expedia', eventType: 'Inventory Update', status: 'Success', details: 'Room 201 marked as Occupied (Blocked across partner network)', timestamp: '2026-09-16 10:15' },
  { id: 'csl-3', channel: 'Airbnb', eventType: 'New Reservation', status: 'Success', details: 'Imported reservation BK-2026-904 for Amina Al-Mansoor', timestamp: '2026-09-16 09:40' }
];

export const initialAuditLogs: AuditTrail[] = [
  { id: 'aud-1', timestamp: '2026-09-16 10:15', actor: 'Kavita Nair', role: 'Front Desk', action: 'GUEST_CHECK_IN', details: 'Checked in Marcus Chen into Room 102. KYC verified with SG National ID.', ipAddress: '192.168.1.104' },
  { id: 'aud-2', timestamp: '2026-09-16 11:30', actor: 'Rajesh Menon', role: 'General Manager', action: 'DYNAMIC_PRICING_UPDATED', details: 'Enabled weekend surge factor (1.15x) due to local festival demand.', ipAddress: '192.168.1.101' },
  { id: 'aud-3', timestamp: '2026-09-16 11:45', actor: 'Anita Desai', role: 'Housekeeping Lead', action: 'ROOM_INSPECTED', details: 'Room 202 inspection approved and marked ready for occupancy.', ipAddress: '192.168.1.115' },
  { id: 'aud-4', timestamp: '2026-09-16 13:20', actor: 'Antonio Rossi', role: 'Executive Chef', action: 'POS_ORDER_BILLED_TO_ROOM', details: 'Order POS-2026-041 amount ₹1,669.50 billed to Room 101 Folio.', ipAddress: '192.168.1.130' }
];

export const initialMenuItems: MenuItem[] = [
  { id: 'm1', name: 'Truffle Mushroom Risotto', category: 'Main Course', price: 850, prepTime: '20 min', available: true, description: 'Arborio rice infused with black truffle paste, parmesan, and wild porcini.' },
  { id: 'm2', name: 'Wood-fired Margherita Pizza', category: 'Main Course', price: 650, prepTime: '15 min', available: true, description: 'San Marzano tomatoes, buffalo mozzarella, fresh basil, and extra virgin olive oil.' },
  { id: 'm3', name: 'Grilled Norwegian Salmon', category: 'Main Course', price: 1200, prepTime: '25 min', available: true, description: 'Pan-seared Atlantic salmon fillet with dill lemon emulsion and asparagus.' },
  { id: 'm4', name: 'Crispy Calamari Fritti', category: 'Appetizer', price: 480, prepTime: '12 min', available: true, description: 'Tender squid rings with garlic herb aioli and lemon wedges.' },
  { id: 'm5', name: 'Burrata Caprese Salad', category: 'Appetizer', price: 520, prepTime: '10 min', available: true, description: 'Creamy burrata, heirloom tomatoes, aged balsamic reduction, basil pesto.' },
  { id: 'm6', name: 'San Pellegrino 750ml', category: 'Beverage', price: 320, prepTime: '3 min', available: true, description: 'Sparkling natural mineral water imported from Italy.' },
  { id: 'm7', name: 'Craft Berry Mocktail', category: 'Beverage', price: 280, prepTime: '5 min', available: true, description: 'Crushed blueberries, mint, lime, pomegranate fizz.' },
  { id: 'm8', name: 'Tiramisu Della Nonna', category: 'Dessert', price: 420, prepTime: '5 min', available: true, description: 'Classic Italian espresso savoiardi with mascarpone and cocoa dusting.' },
  { id: 'm9', name: 'Artisan Gelato Trio', category: 'Dessert', price: 350, prepTime: '5 min', available: true, description: 'Pistachio, Madagascar vanilla bean, and Belgian dark chocolate scoops.' }
];

export const initialHotelProperty: HotelProperty = {
  id: 'b0000000-0000-0000-0000-000000000001',
  tenantId: 'a0000000-0000-0000-0000-000000000001',
  code: 'GA-GOA',
  name: 'The Grand Azure Hotel & Suites',
  currencyCode: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  gstin: '27AAAAA0000A1Z5',
  hsnSacCode: '996311',
  address: 'Grand Azure Boulevard, Candolim Beach Road, North Goa 403515, India',
  contactEmail: 'gm@grandazure.com',
  contactPhone: '+91 832 249 9000',
  logoUrl: ''
};
