import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  GripVertical, 
  Clock, 
  CheckCircle2, 
  LogIn, 
  RotateCcw, 
  FileText, 
  Info, 
  User, 
  BedDouble, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export interface CalendarReservation {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomCategory: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  guestsCount: number;
  status: string;
  source: string;
  grandTotal: number;
  paidAmount: number;
  kycStatus: string;
  documentType?: string;
  documentNumber?: string;
}

interface MonthReservationCalendarProps {
  reservations: CalendarReservation[];
  onRescheduleBooking: (id: string, newCheckInDate: string, newCheckOutDate: string) => void;
  onPerformCheckIn?: (reservation: CalendarReservation) => void;
  onNavigateTab?: (tab: string) => void;
  searchTerm?: string;
  statusFilter?: string;
}

export const MonthReservationCalendar: React.FC<MonthReservationCalendarProps> = ({
  reservations,
  onRescheduleBooking,
  onPerformCheckIn,
  onNavigateTab,
  searchTerm = '',
  statusFilter = 'All'
}) => {
  // Current displayed month (September 2026 by default)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 1)); // Month 8 = September
  const [draggedResId, setDraggedResId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<CalendarReservation | null>(null);
  const [manualNewCheckIn, setManualNewCheckIn] = useState('');
  const [rescheduleToast, setRescheduleToast] = useState<{
    message: string;
    resId: string;
    prevCheckIn: string;
    prevCheckOut: string;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 1));
  };

  // Calendar math
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: Array<{
    dayNumber: number;
    dateStr: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }> = [];

  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const todayStr = '2026-09-18';

  // Fill preceding days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = formatDateStr(prevYear, prevMonthIdx, d);
    calendarDays.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Fill days of current month
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = formatDateStr(year, month, d);
    calendarDays.push({
      dayNumber: d,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Fill trailing days for next month to complete weeks grid (total multiple of 7)
  const remainingCells = 7 - (calendarDays.length % 7);
  if (remainingCells < 7) {
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonthIdx = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = formatDateStr(nextYear, nextMonthIdx, d);
      calendarDays.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr
      });
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, res: CalendarReservation) => {
    e.dataTransfer.setData('text/plain', res.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedResId(res.id);
  };

  const handleDragEnd = () => {
    setDraggedResId(null);
    setDragOverDate(null);
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDate !== dateStr) {
      setDragOverDate(dateStr);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we leave the day container
    const currentTarget = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!currentTarget.contains(relatedTarget)) {
      setDragOverDate(null);
    }
  };

  const calculateStayNights = (inDate: string, outDate: string) => {
    const inD = new Date(inDate);
    const outD = new Date(outDate);
    const diff = Math.round((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const executeReschedule = (resId: string, newCheckInDate: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;

    if (res.checkInDate === newCheckInDate) {
      setDraggedResId(null);
      setDragOverDate(null);
      return;
    }

    const nights = calculateStayNights(res.checkInDate, res.checkOutDate);
    const targetIn = new Date(newCheckInDate);
    const targetOut = new Date(targetIn);
    targetOut.setDate(targetOut.getDate() + nights);

    const newCheckOutStr = formatDateStr(
      targetOut.getFullYear(),
      targetOut.getMonth(),
      targetOut.getDate()
    );

    // Call parent handler
    onRescheduleBooking(res.id, newCheckInDate, newCheckOutStr);

    // Set toast with Undo action
    setRescheduleToast({
      message: `Rescheduled ${res.guestName} (${res.bookingRef}) to ${newCheckInDate} → ${newCheckOutStr} (${nights} night${nights > 1 ? 's' : ''})`,
      resId: res.id,
      prevCheckIn: res.checkInDate,
      prevCheckOut: res.checkOutDate
    });

    setDraggedResId(null);
    setDragOverDate(null);
    if (selectedBooking && selectedBooking.id === res.id) {
      setSelectedBooking(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const resId = e.dataTransfer.getData('text/plain') || draggedResId;
    if (resId) {
      executeReschedule(resId, targetDateStr);
    }
  };

  const handleUndoReschedule = () => {
    if (!rescheduleToast) return;
    onRescheduleBooking(rescheduleToast.resId, rescheduleToast.prevCheckIn, rescheduleToast.prevCheckOut);
    setRescheduleToast(null);
  };

  // Filter reservations based on search and status
  const isMatchingFilter = (res: CalendarReservation) => {
    const matchesSearch = !searchTerm.trim() ||
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.roomNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  };

  // Month stats
  const reservationsInThisMonth = reservations.filter(r => {
    const d = new Date(r.checkInDate);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Calendar Header with Controls & Navigation */}
      <div className="lodgify-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#D4F05B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A'
          }}>
            <CalendarIcon size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main, #0F172A)', margin: 0 }}>
                {monthNames[month]} {year}
              </h3>
              <span style={{
                backgroundColor: 'var(--bg-subtle, #F1F5F9)',
                color: 'var(--text-muted, #64748B)',
                fontSize: '11px',
                fontWeight: '700',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                {reservationsInThisMonth.length} Bookings
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', margin: 0, marginTop: '2px' }}>
              Interactive Front-Desk Calendar • Drag & drop booking cards to reschedule check-in dates.
            </p>
          </div>
        </div>

        {/* Buttons: Prev, Today, Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handlePrevMonth}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--card-border, #E2E8F0)',
              backgroundColor: 'var(--card-bg, #FFFFFF)',
              color: 'var(--text-main, #0F172A)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            <ChevronLeft size={16} /> Prev
          </button>

          <button
            onClick={handleToday}
            style={{
              padding: '7px 14px',
              borderRadius: '8px',
              border: '1px solid #0F172A',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            Today (Sep 18)
          </button>

          <button
            onClick={handleNextMonth}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid var(--card-border, #E2E8F0)',
              backgroundColor: 'var(--card-bg, #FFFFFF)',
              color: 'var(--text-main, #0F172A)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: '700'
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

      </div>

      {/* Drag & Drop Feedback Toast Banner */}
      {rescheduleToast && (
        <div style={{
          padding: '12px 18px',
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.12)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#059669" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#065F46' }}>
              {rescheduleToast.message}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleUndoReschedule}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #059669',
                backgroundColor: '#FFFFFF',
                color: '#065F46',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Undo
            </button>
            <button
              onClick={() => setRescheduleToast(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Drag-and-Drop Hint Bar */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '12px',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: '#D4F05B',
            color: '#0F172A',
            fontWeight: '800',
            fontSize: '11px'
          }}>
            ✋
          </span>
          <span>
            <strong>Drag-and-Drop Rescheduling Active:</strong> Grab any booking card by its handle and drop onto any calendar day cell to instantly reschedule check-in. The reservation stay duration is automatically preserved.
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#D4F05B' }} />
            <span>Checked In</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#38BDF8' }} />
            <span>Confirmed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#94A3B8' }} />
            <span>Checked Out</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
        
        {/* Days of Week Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          backgroundColor: 'var(--bg-subtle, #F8FAFC)',
          borderBottom: '1px solid var(--card-border, #E2E8F0)'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, idx) => (
            <div
              key={dayName}
              style={{
                padding: '12px 10px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: '800',
                color: idx === 0 || idx === 6 ? '#EF4444' : 'var(--text-main, #0F172A)',
                borderRight: idx < 6 ? '1px solid var(--card-border, #E2E8F0)' : 'none'
              }}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Month Days Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          backgroundColor: 'var(--card-border, #E2E8F0)',
          gap: '1px' // Creates clean grid lines
        }}>
          {calendarDays.map((dayItem, idx) => {
            const isHoveredTarget = dragOverDate === dayItem.dateStr;

            // Find reservations starting on this day (Check-in)
            const checkInBookings = reservations.filter(r => r.checkInDate === dayItem.dateStr);

            // Find active stay bookings spanning across this day (not starting today)
            const spanningBookings = reservations.filter(r => 
              r.checkInDate < dayItem.dateStr && r.checkOutDate > dayItem.dateStr
            );

            return (
              <div
                key={dayItem.dateStr}
                onDragOver={(e) => handleDragOver(e, dayItem.dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dayItem.dateStr)}
                style={{
                  minHeight: '130px',
                  padding: '8px',
                  backgroundColor: isHoveredTarget 
                    ? '#ECFDF5' 
                    : dayItem.isToday
                    ? '#F8FAFC'
                    : dayItem.isCurrentMonth 
                    ? 'var(--card-bg, #FFFFFF)' 
                    : '#F9FAFB',
                  opacity: dayItem.isCurrentMonth ? 1 : 0.65,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  outline: isHoveredTarget ? '2px dashed #059669' : 'none',
                  outlineOffset: '-2px',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Day Number and Today Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    fontSize: '13px',
                    fontWeight: dayItem.isToday ? '800' : '700',
                    color: dayItem.isToday 
                      ? '#FFFFFF' 
                      : dayItem.isCurrentMonth 
                      ? 'var(--text-main, #0F172A)' 
                      : '#94A3B8',
                    backgroundColor: dayItem.isToday ? '#0F172A' : 'transparent',
                    width: dayItem.isToday ? '24px' : 'auto',
                    height: dayItem.isToday ? '24px' : 'auto',
                    borderRadius: dayItem.isToday ? '50%' : '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {dayItem.dayNumber}
                  </span>

                  {dayItem.isToday && (
                    <span style={{
                      backgroundColor: '#D4F05B',
                      color: '#0F172A',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      Today
                    </span>
                  )}

                  {isHoveredTarget && (
                    <span style={{
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      fontSize: '9px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      Drop Here
                    </span>
                  )}
                </div>

                {/* Drop Prompt Banner when dragging over this cell */}
                {isHoveredTarget && draggedResId && (
                  <div style={{
                    padding: '6px',
                    borderRadius: '6px',
                    backgroundColor: '#D1FAE5',
                    border: '1px solid #10B981',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#065F46',
                    animation: 'pulse 1.5s infinite'
                  }}>
                    Reschedule check-in to {dayItem.dateStr}
                  </div>
                )}

                {/* Bookings Checking In Today (Primary Draggable Cards) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                  {checkInBookings.map((res) => {
                    const matchesFilter = isMatchingFilter(res);
                    const nights = calculateStayNights(res.checkInDate, res.checkOutDate);
                    const isBeingDragged = draggedResId === res.id;

                    const statusBg = 
                      res.status === 'CheckedIn' ? '#D4F05B' : 
                      res.status === 'Confirmed' ? '#38BDF8' : '#CBD5E1';

                    const borderAccent =
                      res.status === 'CheckedIn' ? '#84CC16' :
                      res.status === 'Confirmed' ? '#0284C7' : '#94A3B8';

                    return (
                      <div
                        key={res.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, res)}
                        onDragEnd={handleDragEnd}
                        onClick={() => setSelectedBooking(res)}
                        title={`Check-in on ${res.checkInDate} for ${nights} night(s). Drag to reschedule.`}
                        style={{
                          padding: '6px 8px',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${borderAccent}`,
                          borderLeft: `4px solid ${borderAccent}`,
                          boxShadow: isBeingDragged 
                            ? '0 8px 16px rgba(0,0,0,0.15)' 
                            : '0 1px 3px rgba(0,0,0,0.06)',
                          cursor: 'grab',
                          opacity: isBeingDragged ? 0.45 : matchesFilter ? 1 : 0.35,
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                            <GripVertical size={12} color="#94A3B8" style={{ flexShrink: 0 }} />
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              color: '#0F172A',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {res.guestName}
                            </span>
                          </div>

                          <span style={{
                            fontSize: '9px',
                            fontWeight: '800',
                            backgroundColor: statusBg,
                            color: '#0F172A',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            flexShrink: 0
                          }}>
                            {res.status === 'CheckedIn' ? 'In' : res.status === 'Confirmed' ? 'Conf' : 'Out'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                          <span style={{ fontWeight: '700' }}>Rm {res.roomNumber}</span>
                          <span>{nights} nt{nights > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Ongoing Stay Pills (Guests staying in-house) */}
                  {spanningBookings.slice(0, 2).map((res) => {
                    const matchesFilter = isMatchingFilter(res);
                    return (
                      <div
                        key={`span-${res.id}`}
                        onClick={() => setSelectedBooking(res)}
                        title={`In-House Stay: ${res.guestName} in Room ${res.roomNumber} (${res.checkInDate} → ${res.checkOutDate})`}
                        style={{
                          padding: '3px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#F1F5F9',
                          border: '1px dashed #CBD5E1',
                          fontSize: '10px',
                          color: '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          opacity: matchesFilter ? 1 : 0.3
                        }}
                      >
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {res.guestName.split(' ')[0]} • Rm {res.roomNumber}
                        </span>
                        <span style={{ fontSize: '9px', color: '#94A3B8' }}>Stay</span>
                      </div>
                    );
                  })}

                  {spanningBookings.length > 2 && (
                    <div style={{ fontSize: '9px', color: '#94A3B8', textAlign: 'center' }}>
                      +{spanningBookings.length - 2} more stays
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Booking Details & Manual Reschedule Modal */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '24px', maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {selectedBooking.bookingRef} • {selectedBooking.source}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0, marginTop: '2px' }}>
                  {selectedBooking.guestName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748B'
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Room Allocation</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                  Room {selectedBooking.roomNumber} ({selectedBooking.roomCategory})
                </span>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Status</span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {/* Stay Dates with Reschedule Prompt */}
            <div style={{
              padding: '14px',
              backgroundColor: '#F0FDF4',
              borderRadius: '10px',
              border: '1px solid #BBF7D0',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>
                  Current Scheduled Stay
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '9999px' }}>
                  {calculateStayNights(selectedBooking.checkInDate, selectedBooking.checkOutDate)} Nights
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                <span>{selectedBooking.checkInDate}</span>
                <ArrowRight size={14} color="#166534" />
                <span>{selectedBooking.checkOutDate}</span>
              </div>

              <div style={{ marginTop: '14px', borderTop: '1px solid #DCFCE7', paddingTop: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '6px' }}>
                  Manual Reschedule Check-In Date (or drag directly on calendar):
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="date"
                    defaultValue={selectedBooking.checkInDate}
                    onChange={(e) => setManualNewCheckIn(e.target.value)}
                    className="input-clean"
                    style={{ flex: 1, borderRadius: '8px', fontSize: '12px' }}
                  />
                  <button
                    onClick={() => {
                      if (manualNewCheckIn && manualNewCheckIn !== selectedBooking.checkInDate) {
                        executeReschedule(selectedBooking.id, manualNewCheckIn);
                      }
                    }}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '12px' }}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Total Folio</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                  ₹{selectedBooking.grandTotal.toLocaleString()}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedBooking.status === 'Confirmed' && onPerformCheckIn && (
                  <button
                    onClick={() => {
                      onPerformCheckIn(selectedBooking);
                      setSelectedBooking(null);
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    <LogIn size={14} /> Check In Guest
                  </button>
                )}

                <button
                  onClick={() => setSelectedBooking(null)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
