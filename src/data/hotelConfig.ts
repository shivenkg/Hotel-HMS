export interface HotelDetails {
  hotelName: string;
  tagline: string;
  logoType: 'icon' | 'url';
  logoIconName: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  supportPhone: string;
  email: string;
  website: string;
  googleMapsUrl: string;
  latitude: string;
  longitude: string;
  
  // GST & Legal Entity
  gstin: string;
  legalEntityName: string;
  stateCode: string;
  panNumber: string;
  defaultCgstRate: number; // 9%
  defaultSgstRate: number; // 9%
  hsnSacAccommodation: string; // '996311'
  hsnSacRestaurant: string; // '996331'

  // WhatsApp Configuration
  whatsapp: {
    enabled: boolean;
    provider: 'Meta Cloud API' | 'Twilio' | 'Interakt' | 'Wati';
    businessNumber: string;
    phoneNumberId: string;
    wabaId: string;
    accessToken: string;
    webhookUrl: string;
    enableAutoWelcome: boolean;
    enableLocationShare: boolean;
    enableInvoiceDispatch: boolean;
  };

  // Email Configuration
  emailConfig: {
    enabled: boolean;
    provider: 'SendGrid' | 'AWS SES' | 'Gmail' | 'Custom SMTP';
    smtpHost: string;
    smtpPort: number;
    secure: boolean;
    fromName: string;
    fromEmail: string;
    replyToEmail: string;
  };
}

export interface LicenseModuleData {
  licenseKey: string;
  edition: string;
  tier: 'Enterprise Cloud' | 'Hospitality Suite Pro' | 'Global Multi-Property';
  issuedTo: string;
  status: 'Active' | 'Expiring Soon' | 'Validated' | 'Suspended';
  activationDate: string;
  expiryDate: string;
  daysRemaining: number;
  
  // Quotas & Entitlements
  roomsQuota: number;
  roomsAllocated: number;
  staffSeatsQuota: number;
  staffSeatsAllocated: number;
  otaConnectors: string[];
  featuresEnabled: string[];
  supportSla: string;
}

export interface AdminFunctionRights {
  canCancelBookings: boolean;
  canIssueRefunds: boolean;
  canModifyPricing: boolean;
  canDeleteInventory: boolean;
  canExportGuestPII: boolean;
  canOverrideRoomStatus: boolean;
  canManageStaffPayroll: boolean;
  canViewAuditLogs: boolean;
  canManageOTASync: boolean;
}

export interface AdminAccessControl {
  allowedModules: string[];
  functionRights: AdminFunctionRights;
}

export const DEFAULT_HOTEL_DETAILS: HotelDetails = {
  hotelName: 'The Grand Azure Resort & Spa',
  tagline: 'Luxury Heritage & Coastal Hospitality',
  logoType: 'icon',
  logoIconName: 'Hotel',
  logoUrl: '',
  address: 'Plot No. 42, Beach Road, Candolim',
  city: 'Candolim, North Goa',
  state: 'Goa',
  pincode: '403515',
  country: 'India',
  phone: '+91 832 249 8800',
  supportPhone: '+91 98230 45678',
  email: 'reservations@grandazurehotel.com',
  website: 'https://www.grandazurehotel.com',
  googleMapsUrl: 'https://maps.google.com/?q=Candolim+Beach+Goa',
  latitude: '15.5168',
  longitude: '73.7634',

  gstin: '30AAACG1234F1Z8',
  legalEntityName: 'Grand Azure Hospitality Private Limited',
  stateCode: '30 (Goa)',
  panNumber: 'AAACG1234F',
  defaultCgstRate: 9,
  defaultSgstRate: 9,
  hsnSacAccommodation: '996311',
  hsnSacRestaurant: '996331',

  whatsapp: {
    enabled: true,
    provider: 'Meta Cloud API',
    businessNumber: '+91 98230 45678',
    phoneNumberId: '109283746501928',
    wabaId: 'waba_az_990142385',
    accessToken: 'EAAG1829471928472910abcdefgh9931',
    webhookUrl: 'https://api.grandazurehotel.com/webhooks/whatsapp',
    enableAutoWelcome: true,
    enableLocationShare: true,
    enableInvoiceDispatch: true
  },

  emailConfig: {
    enabled: true,
    provider: 'SendGrid',
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    secure: true,
    fromName: 'The Grand Azure Concierge',
    fromEmail: 'concierge@grandazurehotel.com',
    replyToEmail: 'reservations@grandazurehotel.com'
  }
};

export const DEFAULT_LICENSE_DATA: LicenseModuleData = {
  licenseKey: 'GA-ENT-2026-CLOUD-99482-X88',
  edition: 'Enterprise Cloud Multi-Property HMS',
  tier: 'Enterprise Cloud',
  issuedTo: 'Grand Azure Hospitality Private Limited',
  status: 'Active',
  activationDate: '2026-01-01',
  expiryDate: '2027-12-31',
  daysRemaining: 468,
  roomsQuota: 50,
  roomsAllocated: 50,
  staffSeatsQuota: 25,
  staffSeatsAllocated: 4,
  otaConnectors: ['Booking.com', 'Airbnb', 'Expedia Partner Central', 'Agoda YCS', 'MakeMyTrip'],
  featuresEnabled: [
    'Tape Chart & Hourly Timeline Calendar',
    'Real-time OTA 2-Way Channel Sync',
    'Dual GST 9% CGST + 9% SGST Invoicing',
    'Kitchen Display System & POS',
    'WhatsApp Business Automated Concierge',
    'RBAC User & Security Administration',
    'Digital KYC & Passport Scanning',
    'Dynamic Surge & Occupancy Pricing'
  ],
  supportSla: '24/7 Dedicated Enterprise Support (Response < 15 Mins)'
};

export const DEFAULT_ADMIN_ACCESS: AdminAccessControl = {
  allowedModules: [
    'dashboard', 
    'reservation', 
    'rooms', 
    'messages', 
    'housekeeping', 
    'inventory', 
    'calendar', 
    'financials', 
    'reviews', 
    'concierge', 
    'staff', 
    'users', 
    'audit'
  ],
  functionRights: {
    canCancelBookings: true,
    canIssueRefunds: true,
    canModifyPricing: true,
    canDeleteInventory: false,
    canExportGuestPII: true,
    canOverrideRoomStatus: true,
    canManageStaffPayroll: true,
    canViewAuditLogs: true,
    canManageOTASync: true
  }
};

// Storage Keys
const HOTEL_STORAGE_KEY = 'hms_hotel_details_config';
const LICENSE_STORAGE_KEY = 'hms_license_module_config';
const ADMIN_ACCESS_STORAGE_KEY = 'hms_admin_access_control';

export function loadHotelDetails(): HotelDetails {
  try {
    const saved = localStorage.getItem(HOTEL_STORAGE_KEY);
    if (saved) return { ...DEFAULT_HOTEL_DETAILS, ...JSON.parse(saved) };
  } catch (err) {
    console.error('Failed to load hotel details from localStorage', err);
  }
  return DEFAULT_HOTEL_DETAILS;
}

export function saveHotelDetails(details: HotelDetails): void {
  try {
    localStorage.setItem(HOTEL_STORAGE_KEY, JSON.stringify(details));
    window.dispatchEvent(new CustomEvent('hotel-details-updated', { detail: details }));
  } catch (err) {
    console.error('Failed to save hotel details', err);
  }
}

export function loadLicenseData(): LicenseModuleData {
  try {
    const saved = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (saved) return { ...DEFAULT_LICENSE_DATA, ...JSON.parse(saved) };
  } catch (err) {
    console.error('Failed to load license data', err);
  }
  return DEFAULT_LICENSE_DATA;
}

export function saveLicenseData(data: LicenseModuleData): void {
  try {
    localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save license data', err);
  }
}

export function loadAdminAccess(): AdminAccessControl {
  try {
    const saved = localStorage.getItem(ADMIN_ACCESS_STORAGE_KEY);
    if (saved) return { ...DEFAULT_ADMIN_ACCESS, ...JSON.parse(saved) };
  } catch (err) {
    console.error('Failed to load admin access control', err);
  }
  return DEFAULT_ADMIN_ACCESS;
}

export function saveAdminAccess(access: AdminAccessControl): void {
  try {
    localStorage.setItem(ADMIN_ACCESS_STORAGE_KEY, JSON.stringify(access));
    window.dispatchEvent(new CustomEvent('admin-access-updated', { detail: access }));
  } catch (err) {
    console.error('Failed to save admin access control', err);
  }
}

// Generate rich WhatsApp Location message
export function generateLocationShareText(hotel: HotelDetails, guestName?: string): string {
  const greeting = guestName ? `Dear ${guestName}` : `Valued Guest`;
  return `🌴 *${hotel.hotelName}* 🌴
${hotel.tagline}

${greeting}, we look forward to welcoming you! Here are our exact arrival directions & coordinates:

📍 *Property Address:*
${hotel.address}, ${hotel.city}, ${hotel.state} - ${hotel.pincode}

🗺️ *Google Maps Live Navigation:*
${hotel.googleMapsUrl}

📞 *Front Desk / Concierge Assistance:*
${hotel.phone} (or WhatsApp ${hotel.whatsapp.businessNumber})

🅿️ *Valet Parking & Luggage Assistance:*
Available 24/7 at the main lobby portico.

Safe travels, and see you soon!`;
}

// Generate rich Email Location sharing body
export function generateLocationEmailContent(hotel: HotelDetails, guestName?: string): { subject: string; body: string } {
  const greeting = guestName ? `Dear ${guestName}` : `Valued Guest`;
  const subject = `Arrival Directions & Location Guide - ${hotel.hotelName}`;
  const body = `${greeting},

Thank you for choosing ${hotel.hotelName}!

To ensure a seamless arrival, please find our exact property location and navigation details below:

HOTEL ADDRESS:
${hotel.address}
${hotel.city}, ${hotel.state} - ${hotel.pincode}, ${hotel.country}

DIRECT GOOGLE MAPS LINK:
${hotel.googleMapsUrl}

CONTACT NUMBERS:
Front Desk: ${hotel.phone}
WhatsApp Concierge: ${hotel.whatsapp.businessNumber}
Email: ${hotel.email}

GSTIN: ${hotel.gstin} (${hotel.legalEntityName})

We look forward to hosting you. Please feel free to reach out if you require airport pick-up or special assistance.

Warm regards,
The Concierge Team
${hotel.hotelName}`;

  return { subject, body };
}
