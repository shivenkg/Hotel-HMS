export interface GuestStayRecord {
  id: string;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomNumber: string;
  roomCategory: string;
  totalAmount: number; // in INR
  paidAmount: number; // in INR
  status: 'CheckedIn' | 'Completed' | 'Upcoming' | 'Cancelled';
  source: 'Direct' | 'Booking.com' | 'Expedia' | 'Airbnb' | 'VIP Concierge';
  specialRequests?: string;
  rating?: number;
}

export interface GuestPreferenceItem {
  category: 'Room' | 'Dining' | 'Service' | 'Wellness';
  preference: string;
  priority: 'High' | 'Standard';
}

export interface GuestProfile {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;
  email: string;
  phone: string;
  whatsapp: string;
  nationality: string;
  address: string;
  city: string;
  country: string;
  vipTier: 'Diamond VIP' | 'Platinum' | 'Gold VIP' | 'Silver Member';
  vipTierColor: { bg: string; text: string; border: string };
  currentRoom?: string;
  currentBookingRef?: string;
  kycStatus: 'Verified' | 'Pending' | 'Exempt';
  documentType: string;
  documentNumber: string;
  
  // Lifetime Value & Stay Metrics
  lifetimeValue: number; // Total spend in INR
  totalVisits: number;
  totalNights: number;
  avgDailyRate: number; // in INR
  loyaltyPoints: number;
  firstVisitDate: string;
  lastVisitDate: string;

  // Preferences
  preferences: {
    room: string[];
    dietary: string[];
    housekeeping: string[];
    temperament: string;
  };

  // Stay History List
  stayHistory: GuestStayRecord[];

  // Staff Internal Notes
  internalNotes: Array<{
    id: string;
    author: string;
    date: string;
    note: string;
  }>;
}

export const TOP_GUESTS: GuestProfile[] = [
  {
    id: 'g-101',
    name: 'Lord Alistair Sterling',
    avatarInitials: 'AS',
    avatarColor: '#7C3AED',
    email: 'sterling.estates@uknet.co.uk',
    phone: '+44 20 7946 0912',
    whatsapp: '+442079460912',
    nationality: 'British',
    address: 'Sterling Manor, Belgravia',
    city: 'London',
    country: 'United Kingdom',
    vipTier: 'Diamond VIP',
    vipTierColor: { bg: '#F3E8FF', text: '#6B21A8', border: '#D8B4FE' },
    currentRoom: '301',
    currentBookingRef: 'BK-2026-905',
    kycStatus: 'Verified',
    documentType: 'Diplomatic Passport',
    documentNumber: 'GB-99014238',
    lifetimeValue: 345000,
    totalVisits: 6,
    totalNights: 28,
    avgDailyRate: 12320,
    loyaltyPoints: 34500,
    firstVisitDate: '2024-11-12',
    lastVisitDate: '2026-09-15',
    preferences: {
      room: ['Presidential Suite only', 'High floor', 'Ocean facing', 'Extra firm duck-down pillows', 'Temperature preset at 21°C'],
      dietary: ['English breakfast at 08:00', 'Earl Grey tea with oat milk', 'Sparkling San Pellegrino in suite daily', 'No shellfish'],
      housekeeping: ['Twice-daily turndown at 18:00', 'Fresh white lilies upon arrival', 'Evening linen change'],
      temperament: 'High-profile dignitary. Values discreet, silent service and private suite elevator routing.'
    },
    stayHistory: [
      {
        id: 'sh-1',
        bookingRef: 'BK-2026-905',
        checkIn: '2026-09-15',
        checkOut: '2026-09-21',
        nights: 6,
        roomNumber: '301',
        roomCategory: 'Presidential Suite',
        totalAmount: 88500,
        paidAmount: 88500,
        status: 'CheckedIn',
        source: 'Direct',
        specialRequests: 'Limousine escort from airport, private Butler on call',
        rating: 5
      },
      {
        id: 'sh-2',
        bookingRef: 'BK-2026-104',
        checkIn: '2026-04-10',
        checkOut: '2026-04-16',
        nights: 6,
        roomNumber: '301',
        roomCategory: 'Presidential Suite',
        totalAmount: 84000,
        paidAmount: 84000,
        status: 'Completed',
        source: 'VIP Concierge',
        specialRequests: 'Chilled Krug champagne & fruit basket',
        rating: 5
      },
      {
        id: 'sh-3',
        bookingRef: 'BK-2025-882',
        checkIn: '2025-12-22',
        checkOut: '2025-12-29',
        nights: 7,
        roomNumber: '301',
        roomCategory: 'Presidential Suite',
        totalAmount: 98000,
        paidAmount: 98000,
        status: 'Completed',
        source: 'Direct',
        specialRequests: 'Christmas Eve private dining on terrace',
        rating: 5
      },
      {
        id: 'sh-4',
        bookingRef: 'BK-2025-312',
        checkIn: '2025-08-01',
        checkOut: '2025-08-05',
        nights: 4,
        roomNumber: '301',
        roomCategory: 'Presidential Suite',
        totalAmount: 56000,
        paidAmount: 56000,
        status: 'Completed',
        source: 'Direct',
        specialRequests: 'Extra security briefing for suite floor',
        rating: 5
      }
    ],
    internalNotes: [
      { id: 'n-1', author: 'General Manager', date: '2026-09-15', note: 'Greet personally in lobby. Suite pre-stocked with vintage single malt.' },
      { id: 'n-2', author: 'Executive Chef', date: '2026-04-12', note: 'Loves fresh sea bass grilled with lemon herb glaze.' }
    ]
  },
  {
    id: 'g-102',
    name: 'Sophia Laurent',
    avatarInitials: 'SL',
    avatarColor: '#E11D48',
    email: 'sophia.laurent@paris.fr',
    phone: '+33 6 40 12 89 54',
    whatsapp: '+33640128954',
    nationality: 'French',
    address: '14 Rue Saint-Honoré',
    city: 'Paris',
    country: 'France',
    vipTier: 'Platinum',
    vipTierColor: { bg: '#E0F2FE', text: '#0369A1', border: '#7DD3FC' },
    currentRoom: '101',
    currentBookingRef: 'BK-2026-901',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'FR-8892104B',
    lifetimeValue: 148500,
    totalVisits: 5,
    totalNights: 17,
    avgDailyRate: 8735,
    loyaltyPoints: 14850,
    firstVisitDate: '2025-01-18',
    lastVisitDate: '2026-09-15',
    preferences: {
      room: ['Deluxe King room with balcony', 'Extra feather pillows', 'Late turndown at 20:30', 'Aromatherapy lavender spray'],
      dietary: ['Gluten-free pastries', 'Fresh organic orange juice every morning', 'Espresso at 07:45'],
      housekeeping: ['Daily laundry valet', 'Hypoallergenic bed linen', 'Additional velvet hangers'],
      temperament: 'Luxury fashion buyer. Polite, observant of aesthetic cleanliness and punctual room service.'
    },
    stayHistory: [
      {
        id: 'sh-5',
        bookingRef: 'BK-2026-901',
        checkIn: '2026-09-15',
        checkOut: '2026-09-18',
        nights: 3,
        roomNumber: '101',
        roomCategory: 'Deluxe',
        totalAmount: 11760,
        paidAmount: 11760,
        status: 'CheckedIn',
        source: 'Booking.com',
        specialRequests: 'Balcony garden view, feather pillows',
        rating: 5
      },
      {
        id: 'sh-6',
        bookingRef: 'BK-2026-441',
        checkIn: '2026-06-02',
        checkOut: '2026-06-06',
        nights: 4,
        roomNumber: '201',
        roomCategory: 'Executive Suite',
        totalAmount: 38400,
        paidAmount: 38400,
        status: 'Completed',
        source: 'Direct',
        specialRequests: 'Late check-out granted until 14:00',
        rating: 5
      },
      {
        id: 'sh-7',
        bookingRef: 'BK-2025-779',
        checkIn: '2025-11-10',
        checkOut: '2025-11-15',
        nights: 5,
        roomNumber: '101',
        roomCategory: 'Deluxe',
        totalAmount: 42000,
        paidAmount: 42000,
        status: 'Completed',
        source: 'Direct',
        specialRequests: 'Spa treatment package booked in advance',
        rating: 4
      }
    ],
    internalNotes: [
      { id: 'n-3', author: 'Front Desk Lead', date: '2026-09-15', note: 'Frequent guest. Prefers express digital folio sent to email.' }
    ]
  },
  {
    id: 'g-103',
    name: 'David Miller',
    avatarInitials: 'DM',
    avatarColor: '#059669',
    email: 'dmiller@austin-corp.com',
    phone: '+1 (512) 489-0211',
    whatsapp: '+15124890211',
    nationality: 'American',
    address: '802 Congress Avenue',
    city: 'Austin, TX',
    country: 'United States',
    vipTier: 'Gold VIP',
    vipTierColor: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
    currentRoom: '201',
    currentBookingRef: 'BK-2026-903',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'USA-55104821',
    lifetimeValue: 98000,
    totalVisits: 4,
    totalNights: 14,
    avgDailyRate: 7000,
    loyaltyPoints: 9800,
    firstVisitDate: '2025-05-14',
    lastVisitDate: '2026-09-14',
    preferences: {
      room: ['Executive Suite', 'Ergonomic work desk & chair', 'High-speed LAN cable requested', 'Quiet courtyard view'],
      dietary: ['Black Americano coffee', 'Keto dinner options', 'Fresh fruit platter'],
      housekeeping: ['Turndown between 19:00 - 20:00', 'Extra towels in bathroom'],
      temperament: 'Senior technology executive. Needs fast Wi-Fi and quiet atmosphere for conference calls.'
    },
    stayHistory: [
      {
        id: 'sh-8',
        bookingRef: 'BK-2026-903',
        checkIn: '2026-09-14',
        checkOut: '2026-09-17',
        nights: 3,
        roomNumber: '201',
        roomCategory: 'Executive Suite',
        totalAmount: 21840,
        paidAmount: 21840,
        status: 'CheckedIn',
        source: 'Expedia',
        specialRequests: 'Early check-in at 11:00 AM',
        rating: 5
      },
      {
        id: 'sh-9',
        bookingRef: 'BK-2026-218',
        checkIn: '2026-02-18',
        checkOut: '2026-02-22',
        nights: 4,
        roomNumber: '201',
        roomCategory: 'Executive Suite',
        totalAmount: 28000,
        paidAmount: 28000,
        status: 'Completed',
        source: 'Direct',
        specialRequests: 'Conference room rental for 4 hours',
        rating: 5
      }
    ],
    internalNotes: [
      { id: 'n-4', author: 'IT Manager', date: '2026-09-14', note: 'Assigned dedicated 200Mbps VIP Wi-Fi profile.' }
    ]
  },
  {
    id: 'g-104',
    name: 'Amina Al-Mansoor',
    avatarInitials: 'AM',
    avatarColor: '#D97706',
    email: 'amina.mansoor@qatarholding.qa',
    phone: '+974 4421 8900',
    whatsapp: '+97444218900',
    nationality: 'Qatari',
    address: 'West Bay Lagoon',
    city: 'Doha',
    country: 'Qatar',
    vipTier: 'Platinum',
    vipTierColor: { bg: '#E0F2FE', text: '#0369A1', border: '#7DD3FC' },
    currentRoom: '204',
    currentBookingRef: 'BK-2026-904',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'QA-71049281',
    lifetimeValue: 112000,
    totalVisits: 3,
    totalNights: 12,
    avgDailyRate: 9333,
    loyaltyPoints: 11200,
    firstVisitDate: '2025-08-20',
    lastVisitDate: '2026-09-16',
    preferences: {
      room: ['Deluxe with private sit-out', 'Qibla directional marker', 'Prayer mat in wardrobe', 'Non-alcoholic minibar'],
      dietary: ['Halal certified menu', 'Arabic mezze & dates upon arrival', 'Warm mint tea in evening'],
      housekeeping: ['Female housekeeping staff preferred', 'Daily fresh orchids'],
      temperament: 'Very gracious and cultured family guest. Appreciates privacy and family-friendly dining.'
    },
    stayHistory: [
      {
        id: 'sh-10',
        bookingRef: 'BK-2026-904',
        checkIn: '2026-09-16',
        checkOut: '2026-09-20',
        nights: 4,
        roomNumber: '204',
        roomCategory: 'Deluxe',
        totalAmount: 15680,
        paidAmount: 15680,
        status: 'CheckedIn',
        source: 'Airbnb',
        specialRequests: 'Halal breakfast hamper, Qibla compass',
        rating: 5
      }
    ],
    internalNotes: [
      { id: 'n-5', author: 'Concierge Lead', date: '2026-09-16', note: 'Arranged private heritage monument guided tour for Sept 18.' }
    ]
  },
  {
    id: 'g-105',
    name: 'Marcus Chen',
    avatarInitials: 'MC',
    avatarColor: '#2563EB',
    email: 'marcus.chen@techglobal.sg',
    phone: '+65 9123 4567',
    whatsapp: '+6591234567',
    nationality: 'Singaporean',
    address: '10 Marina Boulevard',
    city: 'Singapore',
    country: 'Singapore',
    vipTier: 'Silver Member',
    vipTierColor: { bg: '#F1F5F9', text: '#334155', border: '#CBD5E1' },
    currentRoom: '102',
    currentBookingRef: 'BK-2026-902',
    kycStatus: 'Verified',
    documentType: 'NationalID',
    documentNumber: 'SG-S9238411D',
    lifetimeValue: 54000,
    totalVisits: 2,
    totalNights: 7,
    avgDailyRate: 7714,
    loyaltyPoints: 5400,
    firstVisitDate: '2026-03-12',
    lastVisitDate: '2026-09-16',
    preferences: {
      room: ['Deluxe King room', 'Corner room away from elevators', 'Hardwood floor'],
      dietary: ['Asian breakfast options (congee/dim sum)', 'Green tea'],
      housekeeping: ['Standard morning service', 'Extra laundry bags'],
      temperament: 'Venture capital partner. Values fast checkout and electronic receipts.'
    },
    stayHistory: [
      {
        id: 'sh-11',
        bookingRef: 'BK-2026-902',
        checkIn: '2026-09-16',
        checkOut: '2026-09-19',
        nights: 3,
        roomNumber: '102',
        roomCategory: 'Deluxe',
        totalAmount: 12936,
        paidAmount: 5000,
        status: 'CheckedIn',
        source: 'Direct',
        specialRequests: 'Arrived at 21:00 via digital check-in',
        rating: 5
      }
    ],
    internalNotes: [
      { id: 'n-6', author: 'Front Desk', date: '2026-09-16', note: 'Requested corporate invoice with GSTIN on checkout.' }
    ]
  },
  {
    id: 'g-106',
    name: 'Elena Rostova',
    avatarInitials: 'ER',
    avatarColor: '#BE185D',
    email: 'elena.rostova@berlinart.de',
    phone: '+49 30 5566 7788',
    whatsapp: '+493055667788',
    nationality: 'German',
    address: 'Museumsinsel 5',
    city: 'Berlin',
    country: 'Germany',
    vipTier: 'Gold VIP',
    vipTierColor: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
    currentRoom: '202',
    currentBookingRef: 'BK-2026-906',
    kycStatus: 'Pending',
    documentType: 'Passport',
    documentNumber: 'DE-C1928374',
    lifetimeValue: 78500,
    totalVisits: 3,
    totalNights: 10,
    avgDailyRate: 7850,
    loyaltyPoints: 7850,
    firstVisitDate: '2025-07-10',
    lastVisitDate: '2026-09-17',
    preferences: {
      room: ['Executive Suite', 'High natural daylight for sketching', 'Balcony seating'],
      dietary: ['Vegetarian & plant-based meals', 'Almond milk cappuccino'],
      housekeeping: ['Turndown between 19:30 and 20:30'],
      temperament: 'Art gallery curator. Appreciates peaceful environment and local artisan crafts.'
    },
    stayHistory: [
      {
        id: 'sh-12',
        bookingRef: 'BK-2026-906',
        checkIn: '2026-09-17',
        checkOut: '2026-09-20',
        nights: 3,
        roomNumber: '202',
        roomCategory: 'Executive Suite',
        totalAmount: 21840,
        paidAmount: 5000,
        status: 'CheckedIn',
        source: 'Booking.com',
        specialRequests: 'Early morning coffee on balcony',
        rating: 5
      }
    ],
    internalNotes: [
      { id: 'n-7', author: 'Reception', date: '2026-09-17', note: 'Passport pending scan at front desk upon evening return.' }
    ]
  },
  {
    id: 'g-107',
    name: 'Edgar Irving',
    avatarInitials: 'EI',
    avatarColor: '#0284C7',
    email: 'e.irving@irvingholdings.co.za',
    phone: '+27 11 987 6543',
    whatsapp: '+27119876543',
    nationality: 'South African',
    address: '44 Sandton Drive',
    city: 'Johannesburg',
    country: 'South Africa',
    vipTier: 'Gold VIP',
    vipTierColor: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D' },
    currentRoom: '303',
    currentBookingRef: 'LG-B00110',
    kycStatus: 'Verified',
    documentType: 'Passport',
    documentNumber: 'ZA-P8829104',
    lifetimeValue: 86500,
    totalVisits: 3,
    totalNights: 11,
    avgDailyRate: 7863,
    loyaltyPoints: 8650,
    firstVisitDate: '2025-03-22',
    lastVisitDate: '2026-09-17',
    preferences: {
      room: ['Suite with panoramic view', 'Non-smoking floor', 'Extra coat hangers'],
      dietary: ['Steak medium rare', 'South African Rooibos tea', 'Still mineral water'],
      housekeeping: ['Late housekeeping service around 14:00'],
      temperament: 'Corporate investor. Prefers direct WhatsApp billing folios and quick key pickup.'
    },
    stayHistory: [
      {
        id: 'sh-13',
        bookingRef: 'LG-B00110',
        checkIn: '2026-09-17',
        checkOut: '2026-09-22',
        nights: 5,
        roomNumber: '303',
        roomCategory: 'Suite',
        totalAmount: 42500,
        paidAmount: 42500,
        status: 'CheckedIn',
        source: 'Direct',
        specialRequests: 'Airport pickup by hotel sedan',
        rating: 5
      }
    ],
    internalNotes: [
      { id: 'n-8', author: 'Concierge', date: '2026-09-17', note: 'Requested golf course tee time for tomorrow 07:30.' }
    ]
  }
];

export function getGuestByNameOrRef(query: string): GuestProfile | undefined {
  const q = query.toLowerCase().trim();
  return TOP_GUESTS.find(g => 
    g.name.toLowerCase().includes(q) ||
    g.currentRoom?.toLowerCase() === q ||
    g.currentBookingRef?.toLowerCase().includes(q) ||
    g.stayHistory.some(s => s.bookingRef.toLowerCase().includes(q))
  );
}
