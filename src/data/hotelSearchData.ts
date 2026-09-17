export interface SearchResultItem {
  id: string;
  type: 'guest' | 'booking' | 'room';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: { bg: string; text: string; border?: string };
  targetTab: string;
  details: {
    roomNumber?: string;
    bookingId?: string;
    guestName?: string;
    dates?: string;
    status?: string;
    phone?: string;
    amount?: string;
    category?: string;
    cleanliness?: 'Clean' | 'Dirty' | 'Maintenance' | 'Out-of-Order';
  };
}

export const HOTEL_SEARCH_DATABASE: SearchResultItem[] = [
  // GUESTS
  {
    id: 'g-1',
    type: 'guest',
    title: 'Sophia Laurent',
    subtitle: 'Room 101 • Checked In • VIP Guest',
    badge: 'Guest In-House',
    badgeColor: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'rooms',
    details: {
      roomNumber: '101',
      bookingId: 'LG-B00108',
      guestName: 'Sophia Laurent',
      dates: 'Dec 02 - Dec 06, 2025',
      status: 'In-House',
      phone: '+1 (415) 890-2134',
      category: 'Deluxe King',
      amount: '₹1,250'
    }
  },
  {
    id: 'g-2',
    type: 'guest',
    title: 'Angus Copper',
    subtitle: 'Room 101 • Deluxe • 3 nights',
    badge: 'Confirmed Booking',
    badgeColor: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    targetTab: 'dashboard',
    details: {
      roomNumber: '101',
      bookingId: 'LG-B00108',
      guestName: 'Angus Copper',
      dates: 'June 19 - June 22, 2028',
      status: 'Confirmed',
      phone: '+1 (555) 234-8901',
      category: 'Deluxe',
      amount: '₹750'
    }
  },
  {
    id: 'g-3',
    type: 'guest',
    title: 'Catherine Lopp',
    subtitle: 'Room 202 • Standard • 2 nights',
    badge: 'Confirmed Booking',
    badgeColor: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    targetTab: 'dashboard',
    details: {
      roomNumber: '202',
      bookingId: 'LG-B00109',
      guestName: 'Catherine Lopp',
      dates: 'June 19 - June 21, 2028',
      status: 'Confirmed',
      phone: '+1 (555) 345-9012',
      category: 'Standard',
      amount: '₹420'
    }
  },
  {
    id: 'g-4',
    type: 'guest',
    title: 'Edgar Irving',
    subtitle: 'Room 303 • Suite • 5 nights',
    badge: 'VIP Suite',
    badgeColor: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
    targetTab: 'dashboard',
    details: {
      roomNumber: '303',
      bookingId: 'LG-B00110',
      guestName: 'Edgar Irving',
      dates: 'June 19 - June 24, 2028',
      status: 'Confirmed',
      phone: '+1 (555) 456-0123',
      category: 'Suite',
      amount: '₹1,450'
    }
  },
  {
    id: 'g-5',
    type: 'guest',
    title: 'Chris Glasser',
    subtitle: 'Room 102 • Single Cozy • Due Dec 03',
    badge: 'Expected Arrival',
    badgeColor: { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
    targetTab: 'calendar',
    details: {
      roomNumber: '102',
      bookingId: 'BK-2026-002',
      guestName: 'Chris Glasser',
      dates: 'Dec 03 - Dec 05, 2025',
      status: 'Confirmed',
      phone: '+1 (415) 321-7789',
      category: 'Single',
      amount: '₹500'
    }
  },
  {
    id: 'g-6',
    type: 'guest',
    title: 'Lord Alistair Sterling',
    subtitle: 'Room 301 • Presidential Suite • VIP Direct',
    badge: 'VIP Direct',
    badgeColor: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' },
    targetTab: 'rooms',
    details: {
      roomNumber: '301',
      bookingId: 'BK-2026-VIP1',
      guestName: 'Lord Alistair Sterling',
      dates: 'Dec 04 - Dec 11, 2025',
      status: 'In-House',
      phone: '+44 20 7946 0912',
      category: 'Suite',
      amount: '₹12,500'
    }
  },
  {
    id: 'g-7',
    type: 'guest',
    title: 'Joshua Jones',
    subtitle: 'Suite 1 • Deluxe Suite • Checked In',
    badge: 'In-House',
    badgeColor: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'calendar',
    details: {
      roomNumber: 'Suite 1',
      bookingId: 'b-s1',
      guestName: 'Joshua Jones',
      dates: 'Dec 04 - Dec 08, 2025',
      status: 'In-House',
      phone: '+1 (415) 888-2940',
      category: 'Suite',
      amount: '₹6,500'
    }
  },
  {
    id: 'g-8',
    type: 'guest',
    title: 'Mary Johnson',
    subtitle: 'Room 401 • Suite • 7 nights',
    badge: 'Confirmed',
    badgeColor: { bg: '#E0F2FE', text: '#0369A1', border: '#BAE6FD' },
    targetTab: 'dashboard',
    details: {
      roomNumber: '401',
      bookingId: 'LG-B00113',
      guestName: 'Mary Johnson',
      dates: 'June 21 - June 28, 2028',
      status: 'Confirmed',
      phone: '+1 (555) 789-0123',
      category: 'Suite',
      amount: '₹2,800'
    }
  },
  {
    id: 'g-9',
    type: 'guest',
    title: 'Wade Warren',
    subtitle: 'Room 2747 • Active Guest • Request: Towels',
    badge: 'Recent Activity',
    badgeColor: { bg: '#F1F5F9', text: '#334155' },
    targetTab: 'dashboard',
    details: {
      roomNumber: '2747',
      guestName: 'Wade Warren',
      status: 'In-House',
      dates: 'Current Stay',
      phone: '+1 (555) 902-1144'
    }
  },

  // BOOKINGS
  {
    id: 'b-1',
    type: 'booking',
    title: 'LG-B00108',
    subtitle: 'Angus Copper • Room 101 • Deluxe • ₹750',
    badge: 'Active Reservation',
    badgeColor: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'dashboard',
    details: {
      bookingId: 'LG-B00108',
      guestName: 'Angus Copper',
      roomNumber: '101',
      category: 'Deluxe',
      dates: 'June 19 - June 22, 2028',
      amount: '₹750.00',
      status: 'Confirmed'
    }
  },
  {
    id: 'b-2',
    type: 'booking',
    title: 'LG-B00109',
    subtitle: 'Catherine Lopp • Room 202 • Standard • ₹420',
    badge: 'Active Reservation',
    badgeColor: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'dashboard',
    details: {
      bookingId: 'LG-B00109',
      guestName: 'Catherine Lopp',
      roomNumber: '202',
      category: 'Standard',
      dates: 'June 19 - June 21, 2028',
      amount: '₹420.00',
      status: 'Confirmed'
    }
  },
  {
    id: 'b-3',
    type: 'booking',
    title: 'LG-B00110',
    subtitle: 'Edgar Irving • Room 303 • Suite • ₹1,450',
    badge: 'Active Reservation',
    badgeColor: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'dashboard',
    details: {
      bookingId: 'LG-B00110',
      guestName: 'Edgar Irving',
      roomNumber: '303',
      category: 'Suite',
      dates: 'June 19 - June 24, 2028',
      amount: '₹1,450.00',
      status: 'Confirmed'
    }
  },
  {
    id: 'b-4',
    type: 'booking',
    title: 'LG-B00111',
    subtitle: 'Ice B. Holland • Room 105 • Standard • ₹680',
    badge: 'Active Reservation',
    badgeColor: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'dashboard',
    details: {
      bookingId: 'LG-B00111',
      guestName: 'Ice B. Holland',
      roomNumber: '105',
      category: 'Standard',
      dates: 'June 19 - June 23, 2028',
      amount: '₹680.00',
      status: 'Confirmed'
    }
  },
  {
    id: 'b-5',
    type: 'booking',
    title: 'LG-B00112',
    subtitle: 'John Smith • Room 201 • Deluxe • ₹520',
    badge: 'Active Reservation',
    badgeColor: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'dashboard',
    details: {
      bookingId: 'LG-B00112',
      guestName: 'John Smith',
      roomNumber: '201',
      category: 'Deluxe',
      dates: 'June 20 - June 22, 2028',
      amount: '₹520.00',
      status: 'Confirmed'
    }
  },
  {
    id: 'b-6',
    type: 'booking',
    title: 'LG-B00113',
    subtitle: 'Mary Johnson • Room 401 • Suite • ₹2,800',
    badge: 'Active Reservation',
    badgeColor: { bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
    targetTab: 'dashboard',
    details: {
      bookingId: 'LG-B00113',
      guestName: 'Mary Johnson',
      roomNumber: '401',
      category: 'Suite',
      dates: 'June 21 - June 28, 2028',
      amount: '₹2,800.00',
      status: 'Confirmed'
    }
  },
  {
    id: 'b-7',
    type: 'booking',
    title: 'POS-2026-041',
    subtitle: 'Dining Order • Room 101 (Sophia Laurent) • Ready',
    badge: 'KDS Order',
    badgeColor: { bg: '#FEE2E2', text: '#991B1B', border: '#FECDD3' },
    targetTab: 'concierge',
    details: {
      bookingId: 'POS-2026-041',
      roomNumber: '101',
      guestName: 'Sophia Laurent',
      status: 'Ready',
      amount: '₹850.00'
    }
  },

  // ROOM NUMBERS
  {
    id: 'r-101',
    type: 'room',
    title: 'Room 101',
    subtitle: 'Single Deluxe • Clean • Occupied (Sophia Laurent)',
    badge: 'Clean / Occupied',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: '101',
      category: 'Single',
      cleanliness: 'Clean',
      status: 'Occupied',
      guestName: 'Sophia Laurent',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-102',
    type: 'room',
    title: 'Room 102',
    subtitle: 'Single • Dirty (Housekeeping Pending) • Vacant',
    badge: 'Dirty / Needs Clean',
    badgeColor: { bg: '#FEE2E2', text: '#991B1B' },
    targetTab: 'housekeeping',
    details: {
      roomNumber: '102',
      category: 'Single',
      cleanliness: 'Dirty',
      status: 'Vacant',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-103',
    type: 'room',
    title: 'Room 103',
    subtitle: 'Single • Clean • Vacant (Ready for Check-In)',
    badge: 'Clean / Available',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: '103',
      category: 'Single',
      cleanliness: 'Clean',
      status: 'Vacant',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-104',
    type: 'room',
    title: 'Room 104',
    subtitle: 'Single • Dirty • Occupied (James Hall)',
    badge: 'Dirty / Turnover',
    badgeColor: { bg: '#FEE2E2', text: '#991B1B' },
    targetTab: 'calendar',
    details: {
      roomNumber: '104',
      category: 'Single',
      cleanliness: 'Dirty',
      status: 'Occupied',
      guestName: 'James Hall',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-105',
    type: 'room',
    title: 'Room 105',
    subtitle: 'Single • Clean • Occupied (Ricky Smith)',
    badge: 'Clean / Occupied',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: '105',
      category: 'Single',
      cleanliness: 'Clean',
      status: 'Occupied',
      guestName: 'Ricky Smith',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-106',
    type: 'room',
    title: 'Room 106',
    subtitle: 'Single • Maintenance (Plumbing Check) • Out of Service',
    badge: 'Maintenance',
    badgeColor: { bg: '#FEF3C7', text: '#92400E' },
    targetTab: 'calendar',
    details: {
      roomNumber: '106',
      category: 'Single',
      cleanliness: 'Maintenance',
      status: 'OutOfOrder',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-108',
    type: 'room',
    title: 'Room 108',
    subtitle: 'Single • Out-of-Order (Deep AC Overhaul)',
    badge: 'Out-of-Order',
    badgeColor: { bg: '#F1F5F9', text: '#334155' },
    targetTab: 'calendar',
    details: {
      roomNumber: '108',
      category: 'Single',
      cleanliness: 'Out-of-Order',
      status: 'OutOfOrder',
      amount: '₹2,500/night'
    }
  },
  {
    id: 'r-201',
    type: 'room',
    title: 'Room 201',
    subtitle: 'Double • Clean • Occupied (David Miller)',
    badge: 'Clean / Occupied',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: '201',
      category: 'Double',
      cleanliness: 'Clean',
      status: 'Occupied',
      guestName: 'David Miller',
      amount: '₹4,500/night'
    }
  },
  {
    id: 'r-202',
    type: 'room',
    title: 'Room 202',
    subtitle: 'Double • Dirty • Occupied (Elena Rostova)',
    badge: 'Dirty',
    badgeColor: { bg: '#FEE2E2', text: '#991B1B' },
    targetTab: 'calendar',
    details: {
      roomNumber: '202',
      category: 'Double',
      cleanliness: 'Dirty',
      status: 'Occupied',
      guestName: 'Elena Rostova',
      amount: '₹4,500/night'
    }
  },
  {
    id: 'r-203',
    type: 'room',
    title: 'Room 203',
    subtitle: 'Double • Maintenance (HVAC Work Order)',
    badge: 'Maintenance',
    badgeColor: { bg: '#FEF3C7', text: '#92400E' },
    targetTab: 'calendar',
    details: {
      roomNumber: '203',
      category: 'Double',
      cleanliness: 'Maintenance',
      status: 'OutOfOrder',
      amount: '₹4,500/night'
    }
  },
  {
    id: 'r-301',
    type: 'room',
    title: 'Room 301',
    subtitle: 'Suite • Clean • VIP Occupied (Lord Alistair Sterling)',
    badge: 'Clean / VIP',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: '301',
      category: 'Suite',
      cleanliness: 'Clean',
      status: 'Occupied',
      guestName: 'Lord Alistair Sterling',
      amount: '₹12,500/night'
    }
  },
  {
    id: 'r-303',
    type: 'room',
    title: 'Room 303',
    subtitle: 'Suite • Clean • Assigned (Edgar Irving)',
    badge: 'Clean / Reserved',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: '303',
      category: 'Suite',
      cleanliness: 'Clean',
      status: 'Occupied',
      guestName: 'Edgar Irving',
      amount: '₹8,500/night'
    }
  },
  {
    id: 'r-s1',
    type: 'room',
    title: 'Suite 1',
    subtitle: 'Luxury Suite • Clean • Occupied (Joshua Jones)',
    badge: 'Clean / Occupied',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: 'Suite 1',
      category: 'Suite',
      cleanliness: 'Clean',
      status: 'Occupied',
      guestName: 'Joshua Jones',
      amount: '₹6,500/night'
    }
  },
  {
    id: 'r-s2',
    type: 'room',
    title: 'Suite 2',
    subtitle: 'Luxury Suite • Clean • Vacant (Available)',
    badge: 'Clean / Available',
    badgeColor: { bg: '#D1FAE5', text: '#065F46' },
    targetTab: 'calendar',
    details: {
      roomNumber: 'Suite 2',
      category: 'Suite',
      cleanliness: 'Clean',
      status: 'Vacant',
      amount: '₹6,500/night'
    }
  }
];
