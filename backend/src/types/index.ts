export type RoomCategory = 'Standard' | 'Deluxe' | 'Executive Suite' | 'Presidential Suite';

export type RoomStatus = 
  | 'Available' 
  | 'Occupied' 
  | 'Dirty' 
  | 'Cleaning' 
  | 'Inspected' 
  | 'OutOfOrder';

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  category: RoomCategory;
  baseRate: number;
  maxGuests: number;
  status: RoomStatus;
  amenities: string[];
  currentGuest?: string;
  currentReservationId?: string;
}

export type ReservationStatus = 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'NoShow';
export type BookingSource = 'Direct' | 'Booking.com' | 'Expedia' | 'Airbnb' | 'WalkIn';
export type KycStatus = 'Verified' | 'Pending' | 'Rejected';

export interface Reservation {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  roomNumber: string;
  roomCategory: RoomCategory;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  status: ReservationStatus;
  source: BookingSource;
  totalNights: number;
  roomRatePerNight: number;
  totalRoomAmount: number;
  taxAmount: number;
  grandTotal: number;
  paidAmount: number;
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid';
  kycStatus: KycStatus;
  documentType?: 'Passport' | 'DrivingLicense' | 'NationalID' | 'VoterID';
  documentNumber?: string;
  documentUrl?: string;
  nationality?: string;
  guestAddress?: string;
  purposeOfVisit?: string;
  specialRequests?: string;
  createdAt: string;
}

export interface FolioItem {
  id: string;
  date: string;
  description: string;
  category: 'Room' | 'Restaurant' | 'Minibar' | 'Laundry' | 'Spa' | 'Tax' | 'Discount';
  amount: number;
  hsnSacCode: string;
  taxRatePercent: number;
}

export interface Folio {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  invoiceNumber: string;
  issuedDate: string;
  items: FolioItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  status: 'Open' | 'Settled' | 'Refunded';
  paymentMethod?: 'Stripe' | 'Razorpay' | 'PayPal' | 'CreditCard' | 'Cash';
}

export interface DynamicPricingConfig {
  baseOccupancyThreshold: number; // e.g. 75%
  surgeMultiplier: number; // e.g. 1.25
  weekendMultiplier: number; // e.g. 1.15
  peakSeasonMultiplier: number; // e.g. 1.30
  isSurgeActive: boolean;
}

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  roomType?: string;
  taskType: 'Routine Cleaning' | 'Deep Clean' | 'Inspection' | 'Linen Change' | 'Maintenance' | 'Turndown';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  status: 'Pending' | 'InProgress' | 'Completed';
  cleanStatus?: 'Clean' | 'In Process' | 'Dirty' | 'Repair' | 'Under Maintenance';
  availability?: 'Available' | 'Occupied' | 'Cancel' | 'Out of Order';
  guestName?: string;
  remarks?: string;
  notes?: string;
  dueTime: string;
  updatedAt: string;
}

export interface MaintenanceWorkOrder {
  id: string;
  roomNumber: string;
  issue: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Furniture' | 'Keycard' | 'Security';
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  reportedBy: string;
  assignedTo: string;
  status: 'Reported' | 'Assigned' | 'InProgress' | 'Resolved';
  remarks?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Kitchen' | 'Amenities' | 'Minibar' | 'Linen' | 'Housekeeping Supplies';
  currentStock: number;
  minThreshold: number;
  unit: string;
  unitCost: number;
  supplier: string;
  lastRestocked: string;
}

export interface PosOrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: 'Appetizer' | 'Main Course' | 'Beverage' | 'Dessert' | 'Alcohol';
}

export interface PosOrder {
  id: string;
  orderNumber: string;
  type: 'Restaurant' | 'RoomService' | 'Bar';
  roomOrTableNumber: string;
  guestName?: string;
  items: PosOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Received' | 'Preparing' | 'Ready' | 'Delivered' | 'Paid';
  billedToRoom: boolean;
  reservationId?: string;
  timestamp: string;
}

export interface LaundryBatch {
  id: string;
  batchNumber: string;
  itemType: 'Bed Sheets' | 'Pillow Covers' | 'Bath Towels' | 'Duvet Covers' | 'Staff Uniforms';
  quantity: number;
  status: 'Dispatched' | 'Washing' | 'Ironing' | 'Returned';
  vendor: string;
  sentDate: string;
  expectedReturnDate: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: 'Front Desk Officer' | 'Housekeeping Lead' | 'F&B Manager' | 'Executive Chef' | 'General Manager' | 'Maintenance Tech';
  department: 'Front Office' | 'Housekeeping' | 'Food & Beverage' | 'Administration' | 'Engineering';
  shift: 'Morning (06:00-14:00)' | 'Evening (14:00-22:00)' | 'Night (22:00-06:00)';
  phone: string;
  email: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  punchInTime?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  method: 'Biometric Scanner' | 'Mobile App GPS';
  status: 'Present' | 'Late' | 'Half Day';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: 'Casual' | 'Medical' | 'Earned';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export interface CustomerFeedback {
  id: string;
  reservationId: string;
  guestName: string;
  roomNumber: string;
  npsScore: number; // 0-10
  ratingCleanliness: number; // 1-5
  ratingStaff: number; // 1-5
  ratingFood: number; // 1-5
  ratingValue: number; // 1-5
  comments: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  date: string;
}

export interface LoyaltyProfile {
  id: string;
  guestName: string;
  email: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  pointsBalance: number;
  lifetimeSpend: number;
  totalNights: number;
  joinDate: string;
}

export interface ChannelSyncLog {
  id: string;
  channel: 'Booking.com' | 'Expedia' | 'Airbnb';
  eventType: 'Rates Push' | 'Inventory Update' | 'New Reservation' | 'Cancellation';
  status: 'Success' | 'Syncing' | 'Failed';
  details: string;
  timestamp: string;
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  details: string;
  ipAddress: string;
}

export type LoyaltyMember = LoyaltyProfile;
export type AuditLog = AuditTrail;

export interface MenuItem {
  id: string;
  name: string;
  category: 'Appetizer' | 'Main Course' | 'Beverage' | 'Dessert' | 'Alcohol';
  price: number;
  prepTime: string;
  available: boolean;
  description?: string;
  taxRatePercent?: number;
}

export interface HotelProperty {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  timezone: string;
  gstin: string;
  hsnSacCode: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
}

