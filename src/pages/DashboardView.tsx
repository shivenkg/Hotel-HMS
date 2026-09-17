import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  LogIn, 
  LogOut, 
  DollarSign, 
  Bookmark, 
  MoreHorizontal, 
  Plus, 
  ChevronDown,
  CalendarPlus,
  StickyNote,
  Printer,
  Sparkles,
  UtensilsCrossed,
  BedDouble,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  X,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: any) => void;
  currentUser?: {
    id: string;
    name: string;
    username: string;
    role: 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen';
    department?: string;
    allowedTabs?: string[];
    landingTab?: string;
  } | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, currentUser }) => {
  // Role switcher for Admin or default to logged-in user's role
  const userRole = currentUser?.role || 'Admin';
  const [activePerspective, setActivePerspective] = useState<'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen'>(
    userRole as any
  );

  useEffect(() => {
    if (currentUser?.role) {
      setActivePerspective(currentUser.role);
    }
  }, [currentUser?.role]);

  // Modal states for Quick Actions
  const [newBookingModal, setNewBookingModal] = useState(false);
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [printArrivalsModal, setPrintArrivalsModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Drill-down Modal states
  const [drilldownType, setDrilldownType] = useState<
    'kitchen-orders' | 'housekeeping-rooms' | 'reception-arrivals' | 'maintenance-orders' | null
  >(null);

  // Quick Action Forms State
  const [bookingForm, setBookingForm] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomCategory: 'Deluxe',
    roomNumber: '104',
    checkInDate: new Date().toISOString().slice(0, 10),
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    guestsCount: 2,
    advancePaid: 3500,
    source: 'Direct'
  });

  const [noteForm, setNoteForm] = useState({
    roomNumber: '101',
    guestName: 'Sophia Laurent',
    category: 'VIP Preference' as 'VIP Preference' | 'Dietary' | 'Room Request' | 'Late Check-out' | 'Maintenance',
    note: ''
  });

  // Dynamic Data States
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: 'pos-201',
      orderNumber: 'POS-2026-041',
      roomOrTable: 'Room 101',
      guestName: 'Sophia Laurent',
      type: 'Room Service',
      timeAgo: '12 mins ago',
      status: 'Ready',
      billedToRoom: true,
      items: [
        { name: 'Truffle Mushroom Risotto', qty: 1, price: 850, special: 'Extra parmesan on side' },
        { name: 'San Pellegrino 750ml', qty: 1, price: 320, special: 'Chilled with lemon slice' },
        { name: 'Tiramisu Della Nonna', qty: 1, price: 420, special: 'Standard serving' }
      ]
    },
    {
      id: 'pos-202',
      orderNumber: 'POS-2026-042',
      roomOrTable: 'Room 104',
      guestName: 'Jonathan Vance',
      type: 'Room Service',
      timeAgo: '6 mins ago',
      status: 'Preparing',
      billedToRoom: true,
      items: [
        { name: 'Wood-fired Margherita Pizza', qty: 2, price: 1300, special: 'Well-done crust' },
        { name: 'Craft Berry Mocktail', qty: 2, price: 560, special: 'Less ice' }
      ]
    },
    {
      id: 'pos-203',
      orderNumber: 'POS-2026-043',
      roomOrTable: 'Room 106',
      guestName: 'Lord Alistair Sterling',
      type: 'Room Service',
      timeAgo: '18 mins ago',
      status: 'Preparing',
      billedToRoom: true,
      items: [
        { name: 'Grilled Norwegian Salmon', qty: 1, price: 1200, special: 'Medium rare with asparagus' },
        { name: 'Burrata Caprese Salad', qty: 1, price: 520, special: 'Balsamic reduction' }
      ]
    },
    {
      id: 'pos-204',
      orderNumber: 'POS-2026-044',
      roomOrTable: 'Table 4 (Restaurant)',
      guestName: 'Walk-in Guest',
      type: 'Restaurant',
      timeAgo: '4 mins ago',
      status: 'Received',
      billedToRoom: false,
      items: [
        { name: 'Crispy Calamari Fritti', qty: 1, price: 480, special: 'Tartar dip' },
        { name: 'San Pellegrino 750ml', qty: 2, price: 640, special: 'Room temp' }
      ]
    }
  ]);

  const [housekeepingRooms, setHousekeepingRooms] = useState([
    {
      roomNumber: '102',
      floor: 1,
      category: 'Deluxe',
      cleanStatus: 'Dirty',
      priority: 'High',
      assignedTo: 'Priya Sharma',
      taskType: 'Turnover Cleaning',
      departureTime: '11:00 AM',
      nextArrival: 'Today 14:00 PM',
      remarks: 'Guest checked out. Strip bedding and full disinfection.'
    },
    {
      roomNumber: '105',
      floor: 1,
      category: 'Standard',
      cleanStatus: 'In Process',
      priority: 'High',
      assignedTo: 'Priya Sharma',
      taskType: 'Deep Cleaning',
      departureTime: '10:30 AM',
      nextArrival: 'Today 15:00 PM',
      remarks: 'Currently vacuuming and replacing luxury bath towels.'
    },
    {
      roomNumber: '201',
      floor: 2,
      category: 'Executive Suite',
      cleanStatus: 'Dirty',
      priority: 'Medium',
      assignedTo: 'Amit Kumar',
      taskType: 'Turnover Cleaning',
      departureTime: '11:30 AM',
      nextArrival: 'Tomorrow 13:00 PM',
      remarks: 'Restock espresso pods and wine glasses.'
    },
    {
      roomNumber: '204',
      floor: 2,
      category: 'Presidential Suite',
      cleanStatus: 'In Process',
      priority: 'High',
      assignedTo: 'Lead Attendant (Priya)',
      taskType: 'VIP Sanitization',
      departureTime: '09:00 AM',
      nextArrival: 'Today 16:30 PM (VIP)',
      remarks: 'VIP Lady Eleanor Vance arrival. High floral arrangement setup.'
    },
    {
      roomNumber: '108',
      floor: 1,
      category: 'Standard',
      cleanStatus: 'Dirty',
      priority: 'Low',
      assignedTo: 'Amit Kumar',
      taskType: 'Routine Cleaning',
      departureTime: 'Occupied Stayover',
      nextArrival: 'Stayover',
      remarks: 'Daily towel replacement requested by guest.'
    }
  ]);

  const [expectedArrivals, setExpectedArrivals] = useState([
    {
      id: 'res-arr-1',
      guestName: 'Jonathan Vance',
      roomNumber: '104',
      roomCategory: 'Deluxe',
      checkInDate: 'Today (Sept 17)',
      nights: 3,
      guestsCount: 2,
      kycStatus: 'Verified (Passport)',
      advancePaid: '₹8,400',
      balanceDue: '₹0',
      source: 'Direct Web',
      checkedIn: false
    },
    {
      id: 'res-arr-2',
      guestName: 'Maya Lin',
      roomNumber: '107',
      roomCategory: 'Standard',
      checkInDate: 'Today (Sept 17)',
      nights: 2,
      guestsCount: 1,
      kycStatus: 'Pending Verification',
      advancePaid: '₹3,500',
      balanceDue: '₹1,200',
      source: 'Booking.com',
      checkedIn: false
    },
    {
      id: 'res-arr-3',
      guestName: 'Dr. Robert Chen',
      roomNumber: '202',
      roomCategory: 'Executive Suite',
      checkInDate: 'Today (Sept 17)',
      nights: 4,
      guestsCount: 2,
      kycStatus: 'Verified (DL)',
      advancePaid: '₹12,000',
      balanceDue: '₹0',
      source: 'Corporate Travel',
      checkedIn: false
    },
    {
      id: 'res-arr-4',
      guestName: 'Lady Eleanor Vance',
      roomNumber: '204',
      roomCategory: 'Presidential Suite',
      checkInDate: 'Today (Sept 17)',
      nights: 5,
      guestsCount: 3,
      kycStatus: 'Verified (Passport)',
      advancePaid: '₹25,000',
      balanceDue: '₹0',
      source: 'VIP Concierge',
      checkedIn: false
    },
    {
      id: 'res-arr-5',
      guestName: 'Carlos Gomez',
      roomNumber: '103',
      roomCategory: 'Standard',
      checkInDate: 'Today (Sept 17)',
      nights: 1,
      guestsCount: 1,
      kycStatus: 'Pending Verification',
      advancePaid: '₹2,500',
      balanceDue: '₹0',
      source: 'Expedia',
      checkedIn: false
    }
  ]);

  const [guestNotesList, setGuestNotesList] = useState<any[]>([]);

  // Tasks Widget State
  const [tasks, setTasks] = useState([
    { id: 1, date: 'June 19, 2028', title: 'Set Up Conference Room B for 10 AM Meeting', highlight: false },
    { id: 2, date: 'June 19, 2028', title: 'Restock Housekeeping Supplies on 3rd Floor', highlight: true },
    { id: 3, date: 'June 20, 2028', title: 'Inspect and Clean the Pool Area', highlight: false },
    { id: 4, date: 'June 20, 2028', title: 'Check-In Assistance During Peak Hours (4 PM - 6 PM)', highlight: false }
  ]);
  const [newTaskModal, setNewTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  // Fetch real pos orders & guest notes on mount
  useEffect(() => {
    fetch('/api/pos/orders')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Sync with local state format if desired
        }
      })
      .catch(() => {});

    fetch('/api/guest-notes')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data)) setGuestNotesList(data);
      })
      .catch(() => {});
  }, []);

  // Quick Action Handlers
  const handleQuickNewBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: bookingForm.guestName,
          guestEmail: bookingForm.guestEmail || `${bookingForm.guestName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          guestPhone: bookingForm.guestPhone || '+1 555 234 5678',
          roomId: bookingForm.roomNumber,
          checkInDate: bookingForm.checkInDate,
          checkOutDate: bookingForm.checkOutDate,
          guestsCount: Number(bookingForm.guestsCount),
          advancePaid: Number(bookingForm.advancePaid),
          source: bookingForm.source,
          documentType: 'Passport',
          documentNumber: 'USA-PASSPORT',
          documentUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
          nationality: 'United States',
          paymentMethod: 'CreditCard'
        })
      });

      if (res.ok) {
        setActionSuccessMsg(`Booking created successfully for ${bookingForm.guestName} in Room ${bookingForm.roomNumber}!`);
        setNewBookingModal(false);
        setBookingForm({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          roomCategory: 'Deluxe',
          roomNumber: '104',
          checkInDate: new Date().toISOString().slice(0, 10),
          checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
          guestsCount: 2,
          advancePaid: 3500,
          source: 'Direct'
        });
      }
    } catch {
      setActionSuccessMsg(`Booking registered locally for ${bookingForm.guestName}!`);
      setNewBookingModal(false);
    }
  };

  const handleQuickAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.note.trim()) return;

    try {
      const res = await fetch('/api/guest-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: noteForm.roomNumber,
          guestName: noteForm.guestName,
          category: noteForm.category,
          note: noteForm.note,
          createdBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Staff Member'
        })
      });

      if (res.ok) {
        const saved = await res.json();
        setGuestNotesList([saved, ...guestNotesList]);
        setActionSuccessMsg(`Guest note saved for Room ${noteForm.roomNumber}!`);
      }
    } catch {
      setActionSuccessMsg(`Guest note saved locally for Room ${noteForm.roomNumber}!`);
    }

    setAddNoteModal(false);
    setNoteForm({
      roomNumber: '101',
      guestName: 'Sophia Laurent',
      category: 'VIP Preference',
      note: ''
    });
  };

  const handlePrintArrivals = () => {
    window.print();
  };

  const handleOneClickCheckIn = (arrivalId: string) => {
    setExpectedArrivals(expectedArrivals.map(arr => 
      arr.id === arrivalId ? { ...arr, checkedIn: true } : arr
    ));
    const target = expectedArrivals.find(a => a.id === arrivalId);
    setActionSuccessMsg(`Guest ${target?.guestName} successfully checked into Room ${target?.roomNumber}! Folio activated.`);
  };

  const handleKitchenStatusCycle = (orderId: string) => {
    setKitchenOrders(kitchenOrders.map(o => {
      if (o.id === orderId) {
        const next = o.status === 'Received' ? 'Preparing' : o.status === 'Preparing' ? 'Ready' : 'Delivered';
        return { ...o, status: next };
      }
      return o;
    }));
  };

  const handleHousekeepingStatusCycle = (roomNumber: string) => {
    setHousekeepingRooms(housekeepingRooms.map(r => {
      if (r.roomNumber === roomNumber) {
        const next = r.cleanStatus === 'Dirty' ? 'In Process' : r.cleanStatus === 'In Process' ? 'Clean' : 'Inspected';
        return { ...r, cleanStatus: next };
      }
      return r;
    }));
  };

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), date: 'Today', title: taskInput, highlight: false }
    ]);
    setTaskInput('');
    setNewTaskModal(false);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* PERSPECTIVE SWITCHER FOR ADMIN / DEPARTMENT SELECTION */}
      {userRole === 'Admin' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
              Dashboard Perspective:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'Admin', label: '👑 General Manager Overview', color: '#854D0E', bg: '#FEF9C3' },
                { id: 'Kitchen', label: '🍳 Kitchen Executive (KDS)', color: '#991B1B', bg: '#FEE2E2' },
                { id: 'Housekeeping', label: '🧹 Housekeeping Operations', color: '#065F46', bg: '#D1FAE5' },
                { id: 'Reception', label: '🏨 Front Desk / Reception', color: '#0369A1', bg: '#E0F2FE' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePerspective(p.id as any)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: activePerspective === p.id ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
                    backgroundColor: activePerspective === p.id ? '#0F172A' : '#FFFFFF',
                    color: activePerspective === p.id ? '#FFFFFF' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
            Click any functional KPI card below to drill down into detailed room-wise item orders.
          </span>
        </div>
      )}

      {/* SUCCESS NOTIFICATION BANNER */}
      {actionSuccessMsg && (
        <div style={{
          backgroundColor: '#D1FAE5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          borderRadius: '12px',
          padding: '12px 18px',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>{actionSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMsg('')} 
            style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer', fontWeight: '800' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* QUICK ACTIONS SECTION (Single-click common tasks) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #E8EEF5',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.2px' }}>
              ⚡ Quick Actions & Front Desk Utilities
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Perform high-frequency hospitality tasks instantly with a single click.
            </p>
          </div>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            One-Click Shortcuts
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {/* Action 1: New Booking */}
          <button
            onClick={() => setNewBookingModal(true)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1.5px solid #D4F05B',
              backgroundColor: '#F7FDE6',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            className="hover:shadow-md"
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#D4F05B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CalendarPlus size={20} color="#0F172A" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                New Booking
              </div>
              <div style={{ fontSize: '11px', color: '#4B6354', marginTop: '2px' }}>
                Create guest reservation & assign room
              </div>
            </div>
          </button>

          {/* Action 2: Add Guest Note */}
          <button
            onClick={() => setAddNoteModal(true)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            className="hover:shadow-md"
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#E0F2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <StickyNote size={20} color="#0369A1" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                Add Guest Note
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Log VIP requests & operational alerts
              </div>
            </div>
          </button>

          {/* Action 3: Print Today's Arrival List */}
          <button
            onClick={() => setPrintArrivalsModal(true)}
            style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            className="hover:shadow-md"
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Printer size={20} color="#92400E" />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                Print Today's Arrival List
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Single-click daily expected guest manifest
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* FUNCTIONAL KEY KPI DASHBOARD BASED ON USER ROLE       */}
      {/* ---------------------------------------------------- */}

      {/* A. KITCHEN EXECUTIVE PERSPECTIVE */}
      {activePerspective === 'Kitchen' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                🍳 Kitchen Executive & F&B Operations KPI Dashboard
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Live dining & room service orders, kitchen display queue, and pantry threshold monitoring.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#991B1B', backgroundColor: '#FEE2E2', padding: '4px 10px', borderRadius: '9999px' }}>
              Live KDS Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Card 1: Open Orders (Click to drill down) */}
            <div 
              onClick={() => setDrilldownType('kitchen-orders')}
              className="lodgify-card hover:shadow-lg" 
              style={{
                cursor: 'pointer',
                border: '2px solid #FECDD3',
                backgroundColor: '#FFF1F2',
                padding: '20px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: '700', textTransform: 'uppercase' }}>
                  Open Orders
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: '9999px'
                }}>
                  Live
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                {kitchenOrders.filter(o => o.status !== 'Delivered').length} Orders
              </div>
              <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>👉 Click for room-wise item drill-down</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 2: Items in Preparation */}
            <div className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Items Cooking</span>
                <UtensilsCrossed size={16} color="#0F172A" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                9 Items
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Grill: 3 | Pizza: 2 | Cold/Salad: 4
              </div>
            </div>

            {/* Card 3: Avg Delivery Time */}
            <div className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Avg Delivery Time</span>
                <Clock size={16} color="#059669" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                14.2 min
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                Within 20 min SLA target
              </div>
            </div>

            {/* Card 4: Low Stock Pantry Items */}
            <div 
              onClick={() => onNavigateTab('inventory')}
              className="lodgify-card hover:shadow-md" 
              style={{ padding: '20px', cursor: 'pointer', backgroundColor: '#FEF9C3', borderColor: '#FEF08A' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#854D0E', fontWeight: '700' }}>Low Stock Pantry</span>
                <AlertTriangle size={16} color="#B45309" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                3 Items
              </div>
              <div style={{ fontSize: '11px', color: '#854D0E', fontWeight: '700' }}>
                Truffle Oil, Salmon, Burrata
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. HOUSEKEEPING OPERATIONS PERSPECTIVE */}
      {activePerspective === 'Housekeeping' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                🧹 Housekeeping Operations & Turnover KPI Dashboard
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Room turnover schedules, cleaning stage progressions, and maintenance resolution work orders.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#065F46', backgroundColor: '#D1FAE5', padding: '4px 10px', borderRadius: '9999px' }}>
              Turnover Queue Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Card 1: Dirty / Turnover Needed (Click to drill down) */}
            <div 
              onClick={() => setDrilldownType('housekeeping-rooms')}
              className="lodgify-card hover:shadow-lg" 
              style={{
                cursor: 'pointer',
                border: '2px solid #A7F3D0',
                backgroundColor: '#ECFDF5',
                padding: '20px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#065F46', fontWeight: '700', textTransform: 'uppercase' }}>
                  Dirty / Turnover Needed
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: '9999px'
                }}>
                  Urgent
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                {housekeepingRooms.filter(r => r.cleanStatus !== 'Clean' && r.cleanStatus !== 'Inspected').length} Rooms
              </div>
              <div style={{ fontSize: '11px', color: '#065F46', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>👉 Click for room-wise cleaning drill-down</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 2: Inspected & Ready Rooms */}
            <div className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Ready for Check-In</span>
                <Sparkles size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                14 Rooms
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                Passed supervisor inspection
              </div>
            </div>

            {/* Card 3: Active Maintenance Work Orders */}
            <div 
              onClick={() => onNavigateTab('housekeeping')}
              className="lodgify-card hover:shadow-md" 
              style={{ padding: '20px', cursor: 'pointer', backgroundColor: '#FEF2F2', borderColor: '#FECDD3' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: '700' }}>Maintenance Work Orders</span>
                <AlertTriangle size={16} color="#DC2626" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                4 Orders
              </div>
              <div style={{ fontSize: '11px', color: '#991B1B', fontWeight: '700' }}>
                Room 106 Plumbing, 203 HVAC
              </div>
            </div>

            {/* Card 4: Linen Batches in Laundry */}
            <div className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Linen Batches in Wash</span>
                <BedDouble size={16} color="#0F172A" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                2 Batches
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Estimated completion: 15:30 PM
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. RECEPTION / FRONT DESK PERSPECTIVE */}
      {activePerspective === 'Reception' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                🏨 Front Desk & Reception KPI Dashboard
              </h2>
              <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                Today's expected check-ins, KYC document verification status, and folio balance settlement.
              </p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '4px 10px', borderRadius: '9999px' }}>
              Front Office Live
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Card 1: Today's Expected Arrivals (Click to drill down) */}
            <div 
              onClick={() => setDrilldownType('reception-arrivals')}
              className="lodgify-card hover:shadow-lg" 
              style={{
                cursor: 'pointer',
                border: '2px solid #BAE6FD',
                backgroundColor: '#F0F9FF',
                padding: '20px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#0369A1', fontWeight: '700', textTransform: 'uppercase' }}>
                  Today's Arrivals
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  backgroundColor: '#0284C7',
                  color: '#FFFFFF',
                  padding: '2px 7px',
                  borderRadius: '9999px'
                }}>
                  Arrival Queue
                </span>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                {expectedArrivals.filter(a => !a.checkedIn).length} Pending
              </div>
              <div style={{ fontSize: '11px', color: '#0369A1', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>👉 Click for guest check-in drill-down</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Card 2: Today's Departures */}
            <div className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Departures Due</span>
                <LogOut size={16} color="#0F172A" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                3 Guests
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                2 Checked out, 1 Late departure
              </div>
            </div>

            {/* Card 3: In-House Occupancy */}
            <div className="lodgify-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>In-House Occupancy</span>
                <Bookmark size={16} color="#10B981" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                78.2%
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                18 of 23 Rooms Occupied
              </div>
            </div>

            {/* Card 4: Outstanding Folio Balance */}
            <div 
              onClick={() => onNavigateTab('financials')}
              className="lodgify-card hover:shadow-md" 
              style={{ padding: '20px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '700' }}>Unsettled Folios</span>
                <DollarSign size={16} color="#0F172A" />
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
                ₹3,420
              </div>
              <div style={{ fontSize: '11px', color: '#D97706', fontWeight: '600' }}>
                Pending checkout payment
              </div>
            </div>
          </div>
        </div>
      )}

      {/* D. ADMIN MASTER HOTEL OVERVIEW */}
      {activePerspective === 'Admin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Executive Department Drilldown Shortcut Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Kitchen Drilldown Shortcut */}
            <div 
              onClick={() => setDrilldownType('kitchen-orders')}
              style={{
                backgroundColor: '#FFF1F2',
                border: '1.5px solid #FECDD3',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              className="hover:shadow-md"
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#991B1B', textTransform: 'uppercase' }}>
                  Kitchen Executive Drill-Down
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  {kitchenOrders.filter(o => o.status !== 'Delivered').length} Live Open Orders
                </div>
                <div style={{ fontSize: '11px', color: '#991B1B', marginTop: '2px' }}>
                  Click to inspect Room 101, 104, 106 ordered items
                </div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UtensilsCrossed size={18} color="#991B1B" />
              </div>
            </div>

            {/* Housekeeping Drilldown Shortcut */}
            <div 
              onClick={() => setDrilldownType('housekeeping-rooms')}
              style={{
                backgroundColor: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              className="hover:shadow-md"
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#065F46', textTransform: 'uppercase' }}>
                  Housekeeping Turnover Drill-Down
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  {housekeepingRooms.filter(r => r.cleanStatus !== 'Clean' && r.cleanStatus !== 'Inspected').length} Rooms Need Cleaning
                </div>
                <div style={{ fontSize: '11px', color: '#065F46', marginTop: '2px' }}>
                  Click to view Room 102, 105, 201 turnover status
                </div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} color="#065F46" />
              </div>
            </div>

            {/* Reception Drilldown Shortcut */}
            <div 
              onClick={() => setDrilldownType('reception-arrivals')}
              style={{
                backgroundColor: '#F0F9FF',
                border: '1.5px solid #BAE6FD',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              className="hover:shadow-md"
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#0369A1', textTransform: 'uppercase' }}>
                  Reception Arrival Drill-Down
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
                  {expectedArrivals.filter(a => !a.checkedIn).length} Expected Check-Ins
                </div>
                <div style={{ fontSize: '11px', color: '#0369A1', marginTop: '2px' }}>
                  Click to view guest documents & 1-click check-in
                </div>
              </div>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LogIn size={18} color="#0369A1" />
              </div>
            </div>
          </div>

          {/* Master 4 Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {/* Card 1: New Bookings */}
            <div className="lodgify-card" style={{ backgroundColor: '#E6F9EE', borderColor: '#D1F4DE', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#4B6354', fontWeight: '600' }}>New Bookings</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                  <Bookmark size={16} color="#10B981" />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                840
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={12} /> 8.70%
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
              </div>
            </div>

            {/* Card 2: Check-In */}
            <div className="lodgify-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Check-In</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogIn size={16} color="#0F172A" />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                231
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={12} /> 3.56%
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
              </div>
            </div>

            {/* Card 3: Check-Out */}
            <div className="lodgify-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Check-Out</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogOut size={16} color="#0F172A" />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                124
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowDownRight size={12} /> 1.06%
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
              </div>
            </div>

            {/* Card 4: Total Revenue */}
            <div className="lodgify-card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Total Revenue</span>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={16} color="#0F172A" />
                </div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                ₹123,980
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                  <ArrowUpRight size={12} /> 5.70%
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* LOWER SECTION: CHARTS, REVIEWS & TASKS WIDGETS       */}
      {/* ---------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Room Availability + Revenue Wave */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>
            {/* Room Availability Card */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Room Availability</h2>
                <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Circular Gauge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px 0 24px 0' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                  <svg width="150" height="150" viewBox="0 0 150 150">
                    <circle cx="75" cy="75" r="60" fill="none" stroke="#E2E8F0" strokeWidth="16" />
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="16"
                      strokeDasharray="377"
                      strokeDashoffset="80"
                      strokeLinecap="round"
                      transform="rotate(-90 75 75)"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                      231
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
                      Rooms
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric Breakdown Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Available Room', count: 48, color: '#D4F05B' },
                  { label: 'Sold Out', count: 124, color: '#0F172A' },
                  { label: 'Booked', count: 59, color: '#94A3B8' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                      <span style={{ color: '#64748B', fontWeight: '500' }}>{item.label}</span>
                    </div>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Analytics Wave */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Revenue Analytics</h2>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Last 6 Months</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
                  ₹123,980
                </span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#065F46', backgroundColor: '#D1FAE5', padding: '2px 6px', borderRadius: '6px' }}>
                  +5.7% RevPAR
                </span>
              </div>

              <svg width="100%" height="160" viewBox="0 0 360 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revenueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#D4F05B" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#D4F05B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 140 Q 60 70, 120 90 T 240 40 T 360 20 L 360 160 L 0 160 Z" fill="url(#revenueGrad)" />
                <path d="M 0 140 Q 60 70, 120 90 T 240 40 T 360 20" fill="none" stroke="#0F172A" strokeWidth="2.5" />
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '12px' }}>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>

          {/* Operational Notes Feed (From Quick Action) */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <StickyNote size={18} color="#0F172A" />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Active Guest Operational Notes & Requests
                </h3>
              </div>
              <button 
                onClick={() => setAddNoteModal(true)} 
                style={{ fontSize: '11px', fontWeight: '700', color: '#0369A1', backgroundColor: '#E0F2FE', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer' }}
              >
                + Add Note
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {guestNotesList.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '12px', color: '#64748B', textAlign: 'center' }}>
                  No special guest requests currently logged. Use "Add Guest Note" to record preferences.
                </div>
              ) : (
                guestNotesList.slice(0, 4).map((n) => (
                  <div key={n.id} style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '12px', color: '#0F172A' }}>
                          Room {n.roomNumber} ({n.guestName})
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: '700', backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px' }}>
                          {n.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                        {n.note}
                      </p>
                    </div>
                    <span style={{ fontSize: '10px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {n.createdAt?.slice(11, 16) || 'Today'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Reviews + Tasks Widget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Guest Reviews summary */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Guest Experience</h2>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#10B981', backgroundColor: '#D1FAE5', padding: '2px 6px', borderRadius: '4px' }}>
                4.9 / 5.0
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Facilities', score: 4.8, width: '96%' },
                { name: 'Cleanliness', score: 4.9, width: '98%' },
                { name: 'F&B Quality', score: 4.7, width: '94%' },
                { name: 'Front Desk', score: 4.9, width: '98%' }
              ].map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '12px' }}>
                  <span style={{ width: '85px', color: '#64748B', fontWeight: '500' }}>{cat.name}</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: cat.width, height: '100%', backgroundColor: '#D4F05B', borderRadius: '9999px' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: '700', color: '#0F172A' }}>{cat.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Tasks Widget */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Management Tasks</h2>
              <button
                onClick={() => setNewTaskModal(true)}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#D4F05B',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Plus size={16} color="#0F172A" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: t.highlight ? '#FEF9C3' : '#F8FAFC',
                    border: t.highlight ? '1px solid #FEF08A' : '1px solid #E8EEF5',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{t.date}</span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', lineHeight: 1.4 }}>
                    {t.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. DRILL-DOWN MODAL: KITCHEN ROOM-WISE ITEM ORDERS    */}
      {/* ---------------------------------------------------- */}
      {drilldownType === 'kitchen-orders' && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '780px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UtensilsCrossed size={20} color="#991B1B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    🍳 Kitchen Display: Room Number-Wise Item Orders
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Detailed breakdown of ordered dishes, room delivery destinations, timers, and prep stages.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDrilldownType(null)} 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {kitchenOrders.map((order) => (
                <div 
                  key={order.id} 
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  {/* Order Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                        🏨 {order.roomOrTable}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>
                        Guest: <strong>{order.guestName}</strong>
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: '#E2E8F0', padding: '2px 8px', borderRadius: '4px' }}>
                        {order.orderNumber}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {order.timeAgo}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: order.status === 'Ready' ? '#D1FAE5' : order.status === 'Preparing' ? '#FEF3C7' : '#E0F2FE',
                        color: order.status === 'Ready' ? '#065F46' : order.status === 'Preparing' ? '#92400E' : '#0369A1'
                      }}>
                        ● {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Item List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {order.items.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E8EEF5' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                            {it.qty}x {it.name}
                          </div>
                          {it.special && (
                            <div style={{ fontSize: '11px', color: '#D97706', fontStyle: 'italic', marginTop: '2px' }}>
                              Note: {it.special}
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                          ₹{it.price}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
                      {order.billedToRoom ? '✓ Automatically Charged to Room Folio' : 'Payment on Delivery'}
                    </span>
                    <button
                      onClick={() => handleKitchenStatusCycle(order.id)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: order.status === 'Ready' ? '#059669' : '#0F172A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {order.status === 'Received' ? 'Start Preparing 🍳' : order.status === 'Preparing' ? 'Mark Ready for Delivery 🛎️' : 'Mark Delivered & Complete ✓'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. DRILL-DOWN MODAL: HOUSEKEEPING ROOM TURNOVERS      */}
      {/* ---------------------------------------------------- */}
      {drilldownType === 'housekeeping-rooms' && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '820px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="#065F46" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    🧹 Housekeeping: Room Number-Wise Cleaning & Turnover
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Detailed cleaning status, priority level, housekeeper assignment, and turnover timeline.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDrilldownType(null)} 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Room No & Category</th>
                  <th>Priority</th>
                  <th>Assigned Attendant</th>
                  <th>Clean Stage</th>
                  <th>Turnover Schedule</th>
                  <th style={{ textAlign: 'right' }}>Update Clean Status</th>
                </tr>
              </thead>
              <tbody>
                {housekeepingRooms.map((room) => (
                  <tr key={room.roomNumber}>
                    <td>
                      <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '14px' }}>
                        Room {room.roomNumber}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        {room.category} (Floor {room.floor})
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: room.priority === 'High' ? '#FEE2E2' : '#FEF3C7',
                        color: room.priority === 'High' ? '#991B1B' : '#92400E'
                      }}>
                        {room.priority}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>
                        {room.assignedTo}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        backgroundColor: room.cleanStatus === 'Clean' || room.cleanStatus === 'Inspected' ? '#D1FAE5' : room.cleanStatus === 'In Process' ? '#FEF3C7' : '#FEE2E2',
                        color: room.cleanStatus === 'Clean' || room.cleanStatus === 'Inspected' ? '#065F46' : room.cleanStatus === 'In Process' ? '#92400E' : '#991B1B'
                      }}>
                        ● {room.cleanStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '11px', color: '#475569' }}>
                        <strong>Arr:</strong> {room.nextArrival}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                        {room.remarks}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleHousekeepingStatusCycle(room.roomNumber)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: room.cleanStatus === 'Clean' ? '#D1FAE5' : '#0F172A',
                          color: room.cleanStatus === 'Clean' ? '#065F46' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {room.cleanStatus === 'Dirty' ? 'Start Cleaning 🧹' : room.cleanStatus === 'In Process' ? 'Mark Clean ✨' : 'Inspect Room ✓'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. DRILL-DOWN MODAL: RECEPTION ARRIVALS & CHECK-IN    */}
      {/* ---------------------------------------------------- */}
      {drilldownType === 'reception-arrivals' && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '840px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogIn size={20} color="#0369A1" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    🏨 Front Desk: Expected Guest Arrival Manifest
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Room assignments, digital KYC verification status, prepaid deposit, and express check-in.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDrilldownType(null)} 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Guest Full Name</th>
                  <th>Assigned Room</th>
                  <th>Duration</th>
                  <th>Digital KYC Verification</th>
                  <th>Advance Deposit</th>
                  <th style={{ textAlign: 'right' }}>Front Desk Action</th>
                </tr>
              </thead>
              <tbody>
                {expectedArrivals.map((arr) => (
                  <tr key={arr.id}>
                    <td>
                      <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '13px' }}>
                        {arr.guestName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>
                        Source: {arr.source}
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontWeight: '800',
                        fontSize: '13px',
                        backgroundColor: '#F1F5F9',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#0F172A'
                      }}>
                        Room {arr.roomNumber}
                      </span>
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                        {arr.roomCategory}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: '600' }}>
                        {arr.nights} Nights
                      </div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>
                        {arr.guestsCount} Guests
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: arr.kycStatus.includes('Verified') ? '#D1FAE5' : '#FEF3C7',
                        color: arr.kycStatus.includes('Verified') ? '#065F46' : '#92400E',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {arr.kycStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                        {arr.advancePaid}
                      </div>
                      <div style={{ fontSize: '10px', color: arr.balanceDue === '₹0' ? '#10B981' : '#EF4444' }}>
                        Due: {arr.balanceDue}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {arr.checkedIn ? (
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={14} /> Checked In
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOneClickCheckIn(arr.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#D4F05B',
                            color: '#0F172A',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Express Check-In
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. QUICK ACTION MODAL: NEW BOOKING                   */}
      {/* ---------------------------------------------------- */}
      {newBookingModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '540px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#D4F05B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarPlus size={20} color="#0F172A" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Quick New Reservation
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Instantly book a room and register guest details.
                  </p>
                </div>
              </div>
              <button onClick={() => setNewBookingModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuickNewBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Guest Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={bookingForm.guestName}
                  onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="d.miller@gmail.com"
                    value={bookingForm.guestEmail}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestEmail: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 415 998 2211"
                    value={bookingForm.guestPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, guestPhone: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Select Room Number *
                  </label>
                  <select
                    value={bookingForm.roomNumber}
                    onChange={(e) => setBookingForm({ ...bookingForm, roomNumber: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="103">Room 103 (Standard - ₹2,500/nt)</option>
                    <option value="104">Room 104 (Deluxe - ₹3,500/nt)</option>
                    <option value="107">Room 107 (Standard - ₹2,500/nt)</option>
                    <option value="201">Room 201 (Suite - ₹5,500/nt)</option>
                    <option value="203">Room 203 (Executive - ₹6,000/nt)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Booking Source
                  </label>
                  <select
                    value={bookingForm.source}
                    onChange={(e) => setBookingForm({ ...bookingForm, source: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="Direct">Direct / Walk-in</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Expedia">Expedia</option>
                    <option value="Airbnb">Airbnb</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkInDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkInDate: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.checkOutDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setNewBookingModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm & Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. QUICK ACTION MODAL: ADD GUEST NOTE                */}
      {/* ---------------------------------------------------- */}
      {addNoteModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '480px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StickyNote size={20} color="#0369A1" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Add Guest Note & Alert
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Record special guest preferences or department alerts.
                  </p>
                </div>
              </div>
              <button onClick={() => setAddNoteModal(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleQuickAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Room Number *
                  </label>
                  <select
                    value={noteForm.roomNumber}
                    onChange={(e) => setNoteForm({ ...noteForm, roomNumber: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="101">Room 101 (Sophia Laurent)</option>
                    <option value="102">Room 102 (Daniel Hamilton)</option>
                    <option value="104">Room 104 (Jonathan Vance)</option>
                    <option value="106">Room 106 (Lord Sterling)</option>
                    <option value="201">Room 201 (Executive Suite)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Note Category
                  </label>
                  <select
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value as any })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="VIP Preference">VIP Preference</option>
                    <option value="Dietary">Dietary / Food Allergy</option>
                    <option value="Room Request">Room / Bed Request</option>
                    <option value="Late Check-out">Late Check-out Alert</option>
                    <option value="Maintenance">Maintenance Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Note Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Guest requested extra feather pillows and gluten-free bread for breakfast."
                  value={noteForm.note}
                  onChange={(e) => setNoteForm({ ...noteForm, note: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setAddNoteModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. QUICK ACTION MODAL: PRINT TODAY'S ARRIVAL LIST     */}
      {/* ---------------------------------------------------- */}
      {printArrivalsModal && (
        <div className="modal-overlay">
          <div className="modal-container printable-arrival-sheet" style={{ maxWidth: '840px', padding: '32px' }}>
            
            {/* Header with Print Buttons */}
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Today's Guest Arrival Manifest (Print Preview)
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Ready to print or export as official front desk shift handover sheet.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handlePrintArrivals} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Printer size={15} />
                  <span>Print Sheet (Ctrl+P)</span>
                </button>
                <button 
                  onClick={() => setPrintArrivalsModal(false)} 
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Print Document Content */}
            <div style={{ borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
                  THE GRAND AZURE HOTEL & RESORT
                </h2>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginTop: '4px' }}>
                  Daily Front Desk Arrival List & KYC Compliance Register
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748B' }}>
                <div><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div><strong>Shift:</strong> Morning / Evening Front Desk Roster</div>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '10px' }}>#</th>
                  <th style={{ padding: '10px' }}>Guest Name</th>
                  <th style={{ padding: '10px' }}>Room</th>
                  <th style={{ padding: '10px' }}>Category</th>
                  <th style={{ padding: '10px' }}>Nights</th>
                  <th style={{ padding: '10px' }}>KYC Status</th>
                  <th style={{ padding: '10px' }}>Advance Paid</th>
                  <th style={{ padding: '10px' }}>Balance Due</th>
                  <th style={{ padding: '10px' }}>Signature</th>
                </tr>
              </thead>
              <tbody>
                {expectedArrivals.map((arr, idx) => (
                  <tr key={arr.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px', color: '#64748B' }}>{idx + 1}</td>
                    <td style={{ padding: '10px', fontWeight: '700', color: '#0F172A' }}>{arr.guestName}</td>
                    <td style={{ padding: '10px', fontWeight: '800' }}>Room {arr.roomNumber}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{arr.roomCategory}</td>
                    <td style={{ padding: '10px' }}>{arr.nights} nts</td>
                    <td style={{ padding: '10px', fontWeight: '600' }}>{arr.kycStatus}</td>
                    <td style={{ padding: '10px' }}>{arr.advancePaid}</td>
                    <td style={{ padding: '10px', fontWeight: '700' }}>{arr.balanceDue}</td>
                    <td style={{ padding: '10px', borderBottom: '1px dotted #CBD5E1', width: '120px' }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
              <div>Printed By: {currentUser?.name || 'Administrator'}</div>
              <div>Duty Manager Signature: _______________________</div>
            </div>

          </div>
        </div>
      )}

      {/* New Task Modal */}
      {newTaskModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '440px', padding: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '14px', color: '#0F172A' }}>
              Add Management Task
            </h3>
            <input
              type="text"
              placeholder="e.g. VIP guest welcome gift in Room 301"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="input-clean"
              style={{ width: '100%', marginBottom: '18px', borderRadius: '12px' }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setNewTaskModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleAddTask} className="btn-primary">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
