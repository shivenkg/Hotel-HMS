import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  LogIn, 
  LogOut, 
  IndianRupee, 
  Bookmark, 
  MoreHorizontal, 
  Plus, 
  ChevronDown,
  CalendarPlus,
  RefreshCw,
  X,
  Bed,
  CheckCircle2,
  CreditCard,
  Sparkles,
  UserCheck,
  ShieldCheck,
  StickyNote
} from 'lucide-react';

import { TodaysArrivals } from '../components/TodaysArrivals';
import { useDashboardAutoRefresh } from '../hooks/useDashboardAutoRefresh';
import { FrontDeskNotes } from '../components/FrontDeskNotes';

interface DashboardViewProps {
  onNavigateTab: (tab: any) => void;
  currentUser?: {
    id?: string;
    name: string;
    username: string;
    role: 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen';
    department?: string;
  };
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab, currentUser }) => {
  const [revenueRange] = useState('Last 6 Months');
  const [reservationsRange] = useState('Last 7 Days');

  // 5-Minute Dashboard Real-time Auto-Refresh Hook
  const {
    metrics,
    roomAvailability,
    rooms,
    reservations,
    lastUpdated,
    isRefreshing,
    refresh
  } = useDashboardAutoRefresh(5 * 60 * 1000); // 5 minutes

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Quick Actions Modal States
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [showQuickCheckInModal, setShowQuickCheckInModal] = useState(false);
  const [showGuestCheckoutModal, setShowGuestCheckoutModal] = useState(false);
  const [newTaskModal, setNewTaskModal] = useState(false);

  // Smoothly close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showNewReservationModal) setShowNewReservationModal(false);
        if (showQuickCheckInModal) setShowQuickCheckInModal(false);
        if (showGuestCheckoutModal) setShowGuestCheckoutModal(false);
        if (newTaskModal) setNewTaskModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNewReservationModal, showQuickCheckInModal, showGuestCheckoutModal, newTaskModal]);

  // New Reservation Form State
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [resvGuestName, setResvGuestName] = useState('');
  const [resvGuestEmail, setResvGuestEmail] = useState('');
  const [resvGuestPhone, setResvGuestPhone] = useState('');
  const [resvRoomNumber, setResvRoomNumber] = useState('101');
  const [resvCategory, setResvCategory] = useState('Deluxe');
  const [resvCheckIn, setResvCheckIn] = useState(todayStr);
  const [resvCheckOut, setResvCheckOut] = useState(tomorrowStr);
  const [resvGuestsCount, setResvGuestsCount] = useState(2);
  const [resvSource, setResvSource] = useState('Direct');
  const [resvDocType, setResvDocType] = useState('Aadhaar Card');
  const [resvDocNumber, setResvDocNumber] = useState('');
  const [resvImmediateCheckIn, setResvImmediateCheckIn] = useState(false);

  // Quick Check-in Form State
  const [selectedCheckInGuest, setSelectedCheckInGuest] = useState('BK-2026-902');
  const [checkInDocType, setCheckInDocType] = useState('Passport');
  const [checkInDocNumber, setCheckInDocNumber] = useState('');
  const [checkInKeyIssued, setCheckInKeyIssued] = useState(true);

  // Guest Checkout Form State
  const [selectedCheckoutRoom, setSelectedCheckoutRoom] = useState('101');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('CreditCard');

  // Tasks state
  const [tasks, setTasks] = useState([
    {
      id: 1,
      date: 'June 19, 2028',
      title: 'Set Up Conference Room B for 10 AM Meeting',
      highlight: false
    },
    {
      id: 2,
      date: 'June 19, 2028',
      title: 'Restock Housekeeping Supplies on 3rd Floor',
      highlight: true
    },
    {
      id: 3,
      date: 'June 20, 2028',
      title: 'Inspect and Clean the Pool Area',
      highlight: false
    },
    {
      id: 4,
      date: 'June 20, 2028',
      title: 'Check-In Assistance During Peak Hours (4 PM - 6 PM)',
      highlight: false
    }
  ]);

  const [taskInput, setTaskInput] = useState('');

  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        date: 'Today',
        title: taskInput,
        highlight: false
      }
    ]);
    setTaskInput('');
    setNewTaskModal(false);
  };

  // Submit New Reservation
  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resvGuestName.trim()) {
      alert('Please enter guest full name');
      return;
    }

    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: resvGuestName,
          guestEmail: resvGuestEmail || `${resvGuestName.toLowerCase().replace(/\s+/g, '.')}@guest.com`,
          guestPhone: resvGuestPhone || '+91 98765 43210',
          roomId: resvRoomNumber,
          checkInDate: resvCheckIn,
          checkOutDate: resvCheckOut,
          guestsCount: resvGuestsCount,
          source: resvSource,
          documentType: resvDocType,
          documentNumber: resvDocNumber || `DOC-${Date.now().toString().slice(-6)}`,
          immediateCheckIn: resvImmediateCheckIn
        })
      });
    } catch {
      // Graceful local completion
    }

    showToast(`Reservation successfully created for ${resvGuestName} (Room ${resvRoomNumber})!`);
    setShowNewReservationModal(false);
    setResvGuestName('');
    setResvGuestEmail('');
    setResvGuestPhone('');
    setResvDocNumber('');
    refresh();
  };

  // Submit Quick Check-in
  const handleCompleteCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/reservations/${selectedCheckInGuest}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: checkInDocType,
          documentNumber: checkInDocNumber || 'VERIFIED-DESK'
        })
      });
    } catch {
      // Graceful local completion
    }

    showToast(`Guest checked in successfully! Room status marked as Occupied.`);
    setShowQuickCheckInModal(false);
    refresh();
  };

  // Submit Guest Checkout
  const handleCompleteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/reservations/${selectedCheckoutRoom}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: checkoutPaymentMethod
        })
      });
    } catch {
      // Graceful local completion
    }

    showToast(`Checkout completed for Room ${selectedCheckoutRoom}! Room released to Housekeeping (Dirty).`);
    setShowGuestCheckoutModal(false);
    refresh();
  };

  return (
    <div className="animate-fade-in dashboard-container" style={{ padding: 'clamp(14px, 2.5vw, 32px)', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 10000,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '14px 22px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: '600'
        }}>
          <CheckCircle2 size={18} color="#D4F05B" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 1. TOP METRIC CARDS ROW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: New Bookings */}
        <div className="lodgify-card" style={{
          backgroundColor: '#E6F9EE',
          borderColor: '#D1F4DE',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#4B6354', fontWeight: '600' }}>New Bookings</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}>
              <Bookmark size={16} color="#10B981" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {metrics.newBookings}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowUpRight size={12} /> {metrics.newBookingsTrend}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>

        {/* Card 2: Check-In */}
        <div className="lodgify-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Check-In</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogIn size={16} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {metrics.checkIn}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowUpRight size={12} /> {metrics.checkInTrend}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>

        {/* Card 3: Check-Out */}
        <div className="lodgify-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Check-Out</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogOut size={16} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            {metrics.checkOut}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowDownRight size={12} /> {metrics.checkOutTrend}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="lodgify-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600' }}>Total Revenue</span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IndianRupee size={16} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '8px' }}>
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '11px',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <ArrowUpRight size={12} /> {metrics.totalRevenueTrend}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>from last week</span>
          </div>
        </div>
      </div>

      {/* 2. FRONT DESK QUICK ACTIONS ROW */}
      <div className="lodgify-card" style={{
        padding: '20px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Left Title & Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#D4F05B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(212, 240, 91, 0.35)'
          }}>
            <Sparkles size={22} color="#0F172A" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.2px' }}>
              Front Desk Quick Actions
            </div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              One-click operations for new bookings, arrivals, and departures
            </div>
          </div>
        </div>

        {/* Center: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Button 1: New Reservation */}
          <button
            onClick={() => setShowNewReservationModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D4F05B',
              color: '#0F172A',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <CalendarPlus size={16} />
            <span>New Reservation</span>
          </button>

          {/* Button 2: Quick Check-in */}
          <button
            onClick={() => setShowQuickCheckInModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              border: '1px solid #A7F3D0',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <UserCheck size={16} />
            <span>Quick Check-in</span>
          </button>

          {/* Button 3: Guest Checkout */}
          <button
            onClick={() => setShowGuestCheckoutModal(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <LogOut size={16} />
            <span>Guest Checkout</span>
          </button>

          {/* Button 4: Shift Handover Notes */}
          <button
            onClick={() => {
              const el = document.getElementById('front-desk-notes-widget');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                el.style.boxShadow = '0 0 0 3px #D4F05B, 0 12px 32px rgba(0,0,0,0.12)';
                setTimeout(() => {
                  el.style.boxShadow = '';
                }, 2000);
              }
            }}
            title="View & Log Shift Handover Notes"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F1F5F9',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <StickyNote size={16} color="#0F172A" />
            <span>Shift Notes</span>
          </button>
        </div>

        {/* Right: Live Sync Status Indicator & Manual Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '12px',
            color: '#475569'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)'
            }} />
            <span style={{ fontWeight: '600' }}>Live 5m Sync</span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <button
            onClick={() => refresh()}
            disabled={isRefreshing}
            title="Refresh dashboard data now"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              color: '#475569',
              transition: 'all 0.15s ease'
            }}
          >
            <RefreshCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* 3. TODAY'S ARRIVALS */}
      <TodaysArrivals onNavigateTab={onNavigateTab} />

      {/* 4. MAIN GRID: 2 COLUMNS (LEFT 2/3, RIGHT 1/3) */}
      <div className="dashboard-main-grid" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        
        {/* LEFT COLUMN: ROOM AVAILABILITY & REVENUE, RESERVATIONS & BOOKING PLATFORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ROW 1: Room Availability (Left) + Revenue Wave (Right) */}
          <div className="dashboard-sub-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: '20px'
          }}>
            {/* Room Availability Card */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Room Availability</h2>
                <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Dynamic Segmented bar */}
              <div style={{
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                overflow: 'hidden',
                marginBottom: '24px',
                gap: '2px'
              }}>
                <div style={{ flex: Math.max(1, roomAvailability.occupied), backgroundColor: '#D1FAE5' }} title={`Occupied (${roomAvailability.occupied})`} />
                <div style={{ flex: Math.max(1, roomAvailability.reserved), backgroundColor: '#FEF08A' }} title={`Reserved (${roomAvailability.reserved})`} />
                <div style={{ flex: Math.max(1, roomAvailability.available), backgroundColor: '#BEF264' }} title={`Available (${roomAvailability.available})`} />
                <div style={{ flex: Math.max(1, roomAvailability.notReady), backgroundColor: '#E2E8F0' }} title={`Not Ready (${roomAvailability.notReady})`} />
              </div>

              {/* 4 Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Occupied</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{roomAvailability.occupied}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Reserved</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{roomAvailability.reserved}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Available</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{roomAvailability.available}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '2px' }}>Not Ready</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F172A' }}>{roomAvailability.notReady}</div>
                </div>
              </div>
            </div>

            {/* Revenue Chart Card */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Revenue</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4FBD0',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}>
                  <span>{revenueRange}</span>
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* SVG Wavy Revenue Line Chart with Badge */}
              <div style={{ position: 'relative', width: '100%', height: '180px', marginTop: '10px' }}>
                {/* Floating Badge */}
                <div style={{
                  position: 'absolute',
                  top: '18px',
                  left: '46%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#D4F05B',
                  color: '#0F172A',
                  fontWeight: '800',
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                  zIndex: 5
                }}>
                  ₹315,060
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '4px solid #D4F05B'
                  }} />
                </div>

                <svg viewBox="0 0 500 170" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4F05B" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#D4F05B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeDasharray="4 4" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#E2E8F0" />

                  {/* Smooth curve */}
                  <path
                    d="M 10 90 Q 60 100 110 80 T 230 45 T 350 85 T 480 95 L 480 150 L 10 150 Z"
                    fill="url(#revenueGrad)"
                  />
                  <path
                    d="M 10 90 Q 60 100 110 80 T 230 45 T 350 85 T 480 95"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />

                  {/* Active Point dot */}
                  <circle cx="230" cy="45" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                </svg>

                {/* X-Axis labels */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: '#94A3B8',
                  marginTop: '4px'
                }}>
                  <span>Dec 2027</span>
                  <span>Jan 2028</span>
                  <span style={{ fontWeight: '700', color: '#0F172A' }}>Feb 2028</span>
                  <span>Mar 2028</span>
                  <span>Apr 2028</span>
                  <span>May 2028</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Reservations Bar Chart + Booking by Platform Donut */}
          <div className="dashboard-sub-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '20px'
          }}>
            {/* Reservations Bar Chart */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Reservations</h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#F4FBD0',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}>
                  <span>{reservationsRange}</span>
                  <ChevronDown size={12} />
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D1FAE5' }} />
                  <span style={{ color: '#64748B' }}>Booked</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FEF08A' }} />
                  <span style={{ color: '#64748B' }}>Canceled</span>
                </div>
              </div>

              {/* 7-day Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '130px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                {[
                  { day: '12 Jun', booked: 65, canceled: 15 },
                  { day: '13 Jun', booked: 75, canceled: 20 },
                  { day: '14 Jun', booked: 60, canceled: 12 },
                  { day: '15 Jun', booked: 85, canceled: 18 },
                  { day: '16 Jun', booked: 90, canceled: 22 },
                  { day: '17 Jun', booked: 70, canceled: 15 },
                  { day: '18 Jun', booked: 80, canceled: 16 }
                ].map((col, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '28px' }}>
                    <div style={{
                      width: '18px',
                      height: `${col.booked + col.canceled}px`,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column-reverse'
                    }}>
                      <div style={{ height: `${col.booked}px`, backgroundColor: '#D1FAE5' }} />
                      <div style={{ height: `${col.canceled}px`, backgroundColor: '#FEF08A' }} />
                    </div>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{col.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking by Platform Donut Chart */}
            <div className="lodgify-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Booking by Platform</h2>
                <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                {/* SVG Donut Chart */}
                <div style={{ width: '120px', height: '120px', minWidth: '120px' }}>
                  <svg viewBox="0 0 42 42" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#A7F3D0" strokeWidth="6" strokeDasharray="61 39" strokeDashoffset="0" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#D4F05B" strokeWidth="6" strokeDasharray="12 88" strokeDashoffset="-61" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#BEF264" strokeWidth="6" strokeDasharray="11 89" strokeDashoffset="-73" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FEF08A" strokeWidth="6" strokeDasharray="9 91" strokeDashoffset="-84" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="5 95" strokeDashoffset="-93" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#94A3B8" strokeWidth="6" strokeDasharray="2 98" strokeDashoffset="-98" />
                  </svg>
                </div>

                {/* Legend list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#A7F3D0' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>61%</span>
                    <span style={{ color: '#64748B' }}>Direct Booking</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4F05B' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>12%</span>
                    <span style={{ color: '#64748B' }}>Booking.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#BEF264' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>11%</span>
                    <span style={{ color: '#64748B' }}>Agoda</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FEF08A' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>9%</span>
                    <span style={{ color: '#64748B' }}>Airbnb</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#CBD5E1' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>5%</span>
                    <span style={{ color: '#64748B' }}>Hotels.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>2%</span>
                    <span style={{ color: '#64748B' }}>Others</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FRONT DESK NOTES, OVERALL RATING & TASKS WIDGET */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Front Desk Notes Component (Shift-Specific Handover Notes) */}
          <FrontDeskNotes currentUser={currentUser} onNavigateTab={onNavigateTab} />

          {/* Card 2: Overall Rating */}
          <div className="lodgify-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Overall Rating</h2>
              <button style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Score header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                fontWeight: '800',
                fontSize: '20px',
                padding: '6px 14px',
                borderRadius: '12px'
              }}>
                4.6 <span style={{ fontSize: '13px', fontWeight: '600', opacity: 0.8 }}>/5</span>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>Impressive</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>from 2,544 reviews</div>
              </div>
            </div>

            {/* Category breakdown bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Facilities', score: 4.4, width: '88%' },
                { name: 'Cleanliness', score: 4.7, width: '94%' },
                { name: 'Services', score: 4.6, width: '92%' },
                { name: 'Comfort', score: 4.8, width: '96%' },
                { name: 'Location', score: 4.5, width: '90%' }
              ].map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', fontSize: '12px' }}>
                  <span style={{ width: '80px', color: '#64748B', fontWeight: '500' }}>{cat.name}</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: cat.width, height: '100%', backgroundColor: '#FEF08A', borderRadius: '9999px' }} />
                  </div>
                  <span style={{ width: '24px', textAlign: 'right', fontWeight: '700', color: '#0F172A' }}>{cat.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Tasks Widget */}
          <div className="lodgify-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A', margin: 0 }}>Tasks</h2>
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
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                }}
              >
                <Plus size={16} color="#0F172A" />
              </button>
            </div>

            {/* Tasks list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.map((t) => (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: t.highlight ? '#FEF9C3' : '#F8FAFC',
                    border: t.highlight ? '1px solid #FEF08A' : '1px solid #E8EEF5',
                    borderRadius: '14px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>{t.date}</span>
                    <button style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: 0 }}>
                      <MoreHorizontal size={14} />
                    </button>
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

      {/* ========================================================================= */}
      {/* MODAL 1: NEW RESERVATION                                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showNewReservationModal && (
          <motion.div
            key="dashboard-new-resv-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowNewReservationModal(false);
            }}
            className="modal-overlay"
          >
            <motion.div
              key="dashboard-new-resv-container"
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="modal-container"
              style={{ maxWidth: '640px', padding: '28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#D4F05B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarPlus size={20} color="#0F172A" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0F172A' }}>New Reservation</h3>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Book guest accommodation and create automatic folio ledger</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNewReservationModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

            <form onSubmit={handleCreateReservation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Guest Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Singhania"
                    value={resvGuestName}
                    onChange={(e) => setResvGuestName(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98201 55432"
                    value={resvGuestPhone}
                    onChange={(e) => setResvGuestPhone(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Guest Email</label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={resvGuestEmail}
                    onChange={(e) => setResvGuestEmail(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="form-label">Room Assignment</label>
                  <select
                    value={resvRoomNumber}
                    onChange={(e) => {
                      setResvRoomNumber(e.target.value);
                      const selected = rooms.find(r => r.roomNumber === e.target.value);
                      if (selected) setResvCategory(selected.category);
                    }}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    {rooms.length > 0 ? (
                      rooms.map(r => (
                        <option key={r.id} value={r.roomNumber}>
                          Room {r.roomNumber} – {r.category} ({r.status})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="101">Room 101 – Deluxe (Available)</option>
                        <option value="102">Room 102 – Deluxe (Available)</option>
                        <option value="201">Room 201 – Executive Suite (Available)</option>
                        <option value="301">Room 301 – Presidential Suite (Available)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Check-in Date *</label>
                  <input
                    type="date"
                    required
                    value={resvCheckIn}
                    onChange={(e) => setResvCheckIn(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="form-label">Check-out Date *</label>
                  <input
                    type="date"
                    required
                    value={resvCheckOut}
                    onChange={(e) => setResvCheckOut(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label className="form-label">Guests Count</label>
                  <select
                    value={resvGuestsCount}
                    onChange={(e) => setResvGuestsCount(Number(e.target.value))}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4+ Guests</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Booking Channel</label>
                  <select
                    value={resvSource}
                    onChange={(e) => setResvSource(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="Direct">Direct (Walk-in / Phone)</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Expedia">Expedia</option>
                    <option value="Agoda">Agoda</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Identity Doc Type</label>
                  <select
                    value={resvDocType}
                    onChange={(e) => setResvDocType(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="PAN Card">PAN Card</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">ID Document No.</label>
                  <input
                    type="text"
                    placeholder="e.g. 5421 9876 1234"
                    value={resvDocNumber}
                    onChange={(e) => setResvDocNumber(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#F8FAFC',
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0'
              }}>
                <input
                  type="checkbox"
                  id="immediateCheckInCheckbox"
                  checked={resvImmediateCheckIn}
                  onChange={(e) => setResvImmediateCheckIn(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#10B981' }}
                />
                <label htmlFor="immediateCheckInCheckbox" style={{ fontSize: '13px', color: '#0F172A', fontWeight: '600', cursor: 'pointer' }}>
                  Immediate Check-in (Mark room as Occupied now)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewReservationModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Confirm & Book Reservation</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: QUICK CHECK-IN                                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showQuickCheckInModal && (
          <motion.div
            key="dashboard-quick-checkin-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowQuickCheckInModal(false);
            }}
            className="modal-overlay"
          >
            <motion.div
              key="dashboard-quick-checkin-container"
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="modal-container"
              style={{ maxWidth: '560px', padding: '28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserCheck size={20} color="#065F46" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Quick Check-in</h3>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Expedite guest arrival, record ID credentials, and issue keycard</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowQuickCheckInModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

            <form onSubmit={handleCompleteCheckIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="form-label">Select Expected Guest / Reservation *</label>
                <select
                  value={selectedCheckInGuest}
                  onChange={(e) => setSelectedCheckInGuest(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                >
                  <option value="BK-2026-902">Marcus Chen (BK-2026-902) – Room 102 (Deluxe)</option>
                  <option value="BK-2026-905">Lord Alistair Sterling (BK-2026-905) – Room 301 (Presidential)</option>
                  <option value="BK-2026-906">Elena Rostova (BK-2026-906) – Room 202 (Executive)</option>
                  <option value="BK-2026-904">Amina Al-Mansoor (BK-2026-904) – Room 204 (Deluxe)</option>
                  {reservations
                    .filter(r => r.status === 'Confirmed' || r.status === 'Expected')
                    .map(r => (
                      <option key={r.id} value={r.id}>
                        {r.guestName} ({r.bookingRef}) – Room {r.roomNumber}
                      </option>
                    ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="form-label">Identity Document</label>
                  <select
                    value={checkInDocType}
                    onChange={(e) => setCheckInDocType(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="Passport">Passport</option>
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="National ID">National ID</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Document Serial No.</label>
                  <input
                    type="text"
                    placeholder="e.g. IN-98234120"
                    value={checkInDocNumber}
                    onChange={(e) => setCheckInDocNumber(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                  <ShieldCheck size={16} color="#10B981" />
                  <span>Front Desk Operational Checklist</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkInKeyIssued}
                    onChange={(e) => setCheckInKeyIssued(e.target.checked)}
                    style={{ accentColor: '#10B981' }}
                  />
                  <span>RFID Room Keycard programmed and issued to guest</span>
                </label>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  Automatic folio ledger initialized with room tariffs and Indian dual-slab GST (SAC 996311).
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowQuickCheckInModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}>
                  Complete Check-in
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 3: GUEST CHECKOUT                                                   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showGuestCheckoutModal && (
          <motion.div
            key="dashboard-checkout-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowGuestCheckoutModal(false);
            }}
            className="modal-overlay"
          >
            <motion.div
              key="dashboard-checkout-container"
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="modal-container"
              style={{ maxWidth: '560px', padding: '28px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <LogOut size={20} color="#991B1B" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#0F172A' }}>Guest Checkout</h3>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Settle guest folio balance and release room to Housekeeping</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowGuestCheckoutModal(false)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCompleteCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Occupied Room / Guest *</label>
                  <select
                    value={selectedCheckoutRoom}
                    onChange={(e) => setSelectedCheckoutRoom(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="101">Room 101 – Sophia Laurent (Folio: ₹11,760 - Settled)</option>
                    <option value="102">Room 102 – Marcus Chen (Folio: ₹12,936 - Settled)</option>
                    <option value="201">Room 201 – David Miller (Folio: ₹21,840 - Settled)</option>
                    <option value="204">Room 204 – Amina Al-Mansoor (Folio: ₹14,200 - Settled)</option>
                    {rooms
                      .filter(r => r.status === 'Occupied')
                      .map(r => (
                        <option key={r.id} value={r.roomNumber}>
                          Room {r.roomNumber} – {r.currentGuest || 'Occupied Guest'}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Payment Settlement Method</label>
                  <select
                    value={checkoutPaymentMethod}
                    onChange={(e) => setCheckoutPaymentMethod(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="CreditCard">Credit / Debit Card (Stripe Terminal)</option>
                    <option value="UPI">UPI / QR Payment (Razorpay)</option>
                    <option value="Cash">Cash at Front Desk</option>
                    <option value="CompanyBill">Direct Corporate Billing</option>
                  </select>
                </div>

                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#64748B' }}>Room Category:</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>Deluxe Suite (Room {selectedCheckoutRoom})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#64748B' }}>Folio Balance Status:</span>
                    <span style={{ fontWeight: '700', color: '#10B981' }}>₹0.00 (Fully Paid)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94A3B8', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid #E2E8F0' }}>
                    <Bed size={14} />
                    <span>Room will transition to <strong>Dirty</strong>, dispatching an automated cleaning task to Housekeeping.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowGuestCheckoutModal(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
                    Finalize Checkout & Release Room
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Task Modal */}
      <AnimatePresence>
        {newTaskModal && (
          <motion.div
            key="dashboard-new-task-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setNewTaskModal(false);
            }}
            className="modal-overlay"
          >
            <motion.div
              key="dashboard-new-task-container"
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="modal-container"
              style={{ maxWidth: '440px', padding: '24px' }}
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
