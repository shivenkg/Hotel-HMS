import React, { useState } from 'react';
import { 
  LogIn, 
  Clock, 
  CheckCircle2, 
  Search, 
  UserCheck, 
  ArrowRight
} from 'lucide-react';

export interface TodayArrivalGuest {
  id: string;
  bookingRef: string;
  guestName: string;
  roomNumber: string;
  roomCategory: string;
  arrivalTime: string;
  status: 'Expected' | 'CheckedIn' | 'Delayed';
  source: string;
  guestsCount: number;
  phone?: string;
}

interface TodaysArrivalsProps {
  onNavigateTab?: (tab: any) => void;
}

export const TodaysArrivals: React.FC<TodaysArrivalsProps> = ({ onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Expected' | 'CheckedIn'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Realistic sample arrivals for today
  const [arrivals, setArrivals] = useState<TodayArrivalGuest[]>([
    {
      id: 'arr-1',
      bookingRef: 'BK-2026-902',
      guestName: 'Marcus Chen',
      roomNumber: '102',
      roomCategory: 'Deluxe',
      arrivalTime: '01:15 PM',
      status: 'Expected',
      source: 'Direct',
      guestsCount: 1,
      phone: '+91 98201 44512'
    },
    {
      id: 'arr-2',
      bookingRef: 'BK-2026-905',
      guestName: 'Lord Alistair Sterling',
      roomNumber: '301',
      roomCategory: 'Presidential Suite',
      arrivalTime: '02:45 PM',
      status: 'Expected',
      source: 'Direct',
      guestsCount: 2,
      phone: '+44 7911 123456'
    },
    {
      id: 'arr-3',
      bookingRef: 'BK-2026-901',
      guestName: 'Sophia Laurent',
      roomNumber: '101',
      roomCategory: 'Deluxe',
      arrivalTime: '11:30 AM',
      status: 'CheckedIn',
      source: 'Booking.com',
      guestsCount: 2,
      phone: '+33 612 345678'
    },
    {
      id: 'arr-4',
      bookingRef: 'BK-2026-906',
      guestName: 'Elena Rostova',
      roomNumber: '202',
      roomCategory: 'Executive Suite',
      arrivalTime: '04:30 PM',
      status: 'Expected',
      source: 'Booking.com',
      guestsCount: 1,
      phone: '+49 151 2345678'
    },
    {
      id: 'arr-5',
      bookingRef: 'BK-2026-904',
      guestName: 'Amina Al-Mansoor',
      roomNumber: '204',
      roomCategory: 'Deluxe',
      arrivalTime: '06:00 PM',
      status: 'Expected',
      source: 'Airbnb',
      guestsCount: 2,
      phone: '+974 5512 3456'
    }
  ]);

  const handleCheckIn = (guest: TodayArrivalGuest) => {
    setArrivals(prev => prev.map(g => {
      if (g.id === guest.id) {
        return { ...g, status: 'CheckedIn' };
      }
      return g;
    }));

    setToastMessage(`Guest "${guest.guestName}" successfully checked in to Room ${guest.roomNumber}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredArrivals = arrivals.filter(guest => {
    const matchesSearch = 
      guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.roomNumber.includes(searchTerm) ||
      guest.bookingRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const checkedInCount = arrivals.filter(g => g.status === 'CheckedIn').length;
  const expectedCount = arrivals.filter(g => g.status === 'Expected').length;

  return (
    <div className="lodgify-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Today's Arrivals
              </h2>
              <span style={{
                backgroundColor: '#D4F05B',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '9999px'
              }}>
                {arrivals.length} Scheduled Today
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {checkedInCount} checked-in • {expectedCount} expected arrivals remaining
            </p>
          </div>
        </div>

        {/* View full reservations link */}
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('reservations')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              color: '#0E94A8',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '8px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(14, 148, 168, 0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span>View All in Front Desk</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search arrival by name, room, or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-clean"
            style={{ width: '100%', paddingLeft: '38px', fontSize: '12px' }}
          />
        </div>

        {/* Status filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['All', 'Expected', 'CheckedIn'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '11px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === st ? 'var(--text-main)' : 'var(--bg-subtle)',
                color: statusFilter === st ? 'var(--bg-card)' : 'var(--text-muted)',
                transition: 'all 0.15s ease'
              }}
            >
              {st === 'All' ? `All (${arrivals.length})` : st === 'Expected' ? `Expected (${expectedCount})` : `Checked In (${checkedInCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Arrivals Table */}
      <div className="responsive-table-wrapper" style={{ margin: 0, padding: 0 }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Guest & Ref</th>
              <th>Assigned Room</th>
              <th>Arrival Time</th>
              <th>Channel</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredArrivals.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                  No arrivals found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredArrivals.map(guest => {
                const isCheckedIn = guest.status === 'CheckedIn';
                return (
                  <tr key={guest.id}>
                    {/* Guest Name & Avatar */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: isCheckedIn ? '#D1FAE5' : '#E0F2FE',
                          color: isCheckedIn ? '#065F46' : '#0369A1',
                          fontWeight: '800',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {guest.guestName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                            {guest.guestName}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                            {guest.bookingRef} • {guest.guestsCount} Guest(s)
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Assigned Room */}
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        Room {guest.roomNumber}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {guest.roomCategory}
                      </div>
                    </td>

                    {/* Arrival Time */}
                    <td>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'var(--text-main)'
                      }}>
                        <Clock size={13} color="#0E94A8" />
                        <span>{guest.arrivalTime}</span>
                      </div>
                    </td>

                    {/* Booking Channel */}
                    <td>
                      <span style={{
                        backgroundColor: 
                          guest.source === 'Booking.com' ? '#E0F2FE' : 
                          guest.source === 'Airbnb' ? '#FEE2E2' : '#D1FAE5',
                        color: 
                          guest.source === 'Booking.com' ? '#0369A1' : 
                          guest.source === 'Airbnb' ? '#991B1B' : '#065F46',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '9999px'
                      }}>
                        {guest.source}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td>
                      {isCheckedIn ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#D1FAE5',
                          color: '#065F46',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '9999px'
                        }}>
                          <CheckCircle2 size={12} /> Checked In
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          backgroundColor: '#E0F2FE',
                          color: '#0369A1',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '9999px'
                        }}>
                          <Clock size={12} /> Expected
                        </span>
                      )}
                    </td>

                    {/* Action Button */}
                    <td style={{ textAlign: 'right' }}>
                      {isCheckedIn ? (
                        <span style={{
                          fontSize: '11px',
                          color: '#10B981',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={13} /> In Room
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(guest)}
                          style={{
                            backgroundColor: '#D4F05B',
                            color: '#0F172A',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '12px',
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#C5E545';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#D4F05B';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <LogIn size={13} /> Check-in
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Check-in Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: '600',
          border: '1px solid #334155'
        }}>
          <CheckCircle2 size={18} color="#D4F05B" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
