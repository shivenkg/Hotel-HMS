import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  LogIn, 
  LogOut, 
  FileText, 
  ShieldAlert 
} from 'lucide-react';

interface ReservationsViewProps {
  onNavigateTab: (tab: any) => void;
}

export const ReservationsView: React.FC<ReservationsViewProps> = ({ onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [checkInModal, setCheckInModal] = useState<any | null>(null);
  const [newBookingModal, setNewBookingModal] = useState(false);
  const [kycDocType, setKycDocType] = useState('Passport');
  const [kycDocNumber, setKycDocNumber] = useState('');

  // Local state initialized with rich realistic reservations
  const [reservations, setReservations] = useState([
    {
      id: 'res-1001',
      bookingRef: 'BK-2026-901',
      guestName: 'Sophia Laurent',
      guestEmail: 'sophia.laurent@paris.fr',
      roomNumber: '101',
      roomCategory: 'Deluxe',
      checkInDate: '2026-09-15',
      checkOutDate: '2026-09-18',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Booking.com',
      grandTotal: 11760,
      paidAmount: 11760,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'FR-8892104B'
    },
    {
      id: 'res-1002',
      bookingRef: 'BK-2026-902',
      guestName: 'Marcus Chen',
      guestEmail: 'marcus.chen@techglobal.sg',
      roomNumber: '102',
      roomCategory: 'Deluxe',
      checkInDate: '2026-09-16',
      checkOutDate: '2026-09-19',
      guestsCount: 1,
      status: 'CheckedIn',
      source: 'Direct',
      grandTotal: 12936,
      paidAmount: 5000,
      kycStatus: 'Verified',
      documentType: 'NationalID',
      documentNumber: 'SG-S9238411D'
    },
    {
      id: 'res-1003',
      bookingRef: 'BK-2026-903',
      guestName: 'David Miller',
      guestEmail: 'dmiller@austin-corp.com',
      roomNumber: '201',
      roomCategory: 'Executive Suite',
      checkInDate: '2026-09-14',
      checkOutDate: '2026-09-17',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Expedia',
      grandTotal: 21840,
      paidAmount: 21840,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'USA-55104821'
    },
    {
      id: 'res-1004',
      bookingRef: 'BK-2026-904',
      guestName: 'Amina Al-Mansoor',
      guestEmail: 'amina.mansoor@qatarholding.qa',
      roomNumber: '204',
      roomCategory: 'Deluxe',
      checkInDate: '2026-09-16',
      checkOutDate: '2026-09-20',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Airbnb',
      grandTotal: 15680,
      paidAmount: 15680,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'QA-71049281'
    },
    {
      id: 'res-1005',
      bookingRef: 'BK-2026-905',
      guestName: 'Lord Alistair Sterling',
      guestEmail: 'sterling.estates@uknet.co.uk',
      roomNumber: '301',
      roomCategory: 'Presidential Suite',
      checkInDate: '2026-09-15',
      checkOutDate: '2026-09-21',
      guestsCount: 2,
      status: 'CheckedIn',
      source: 'Direct',
      grandTotal: 88500,
      paidAmount: 88500,
      kycStatus: 'Verified',
      documentType: 'Passport',
      documentNumber: 'GB-99014238'
    },
    {
      id: 'res-1006',
      bookingRef: 'BK-2026-906',
      guestName: 'Elena Rostova',
      guestEmail: 'elena.rostova@berlinart.de',
      roomNumber: '202',
      roomCategory: 'Executive Suite',
      checkInDate: '2026-09-17',
      checkOutDate: '2026-09-20',
      guestsCount: 1,
      status: 'Confirmed',
      source: 'Booking.com',
      grandTotal: 21840,
      paidAmount: 5000,
      kycStatus: 'Pending',
      documentType: 'Passport',
      documentNumber: ''
    }
  ]);

  // New booking form fields
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    roomNumber: '104',
    roomCategory: 'Standard',
    checkInDate: '2026-09-18',
    checkOutDate: '2026-09-21',
    guestsCount: 1,
    source: 'Direct'
  });

  const handlePerformCheckIn = (resv: any) => {
    setCheckInModal(resv);
    setKycDocType(resv.documentType || 'Passport');
    setKycDocNumber(resv.documentNumber || '');
  };

  const handleSaveCheckIn = () => {
    if (!checkInModal) return;
    setReservations(reservations.map(r => {
      if (r.id === checkInModal.id) {
        return {
          ...r,
          status: 'CheckedIn',
          kycStatus: kycDocNumber.trim() ? 'Verified' : 'Pending',
          documentType: kycDocType,
          documentNumber: kycDocNumber
        };
      }
      return r;
    }));
    setCheckInModal(null);
  };

  const handlePerformCheckOut = (resv: any) => {
    setReservations(reservations.map(r => {
      if (r.id === resv.id) {
        return { ...r, status: 'CheckedOut' };
      }
      return r;
    }));
    alert(`Guest ${resv.guestName} successfully checked out. Room ${resv.roomNumber} is now marked as DIRTY for Housekeeping.`);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newRes = {
      id: `res-${Date.now()}`,
      bookingRef: `BK-2026-${Math.floor(100 + Math.random() * 900)}`,
      guestName: formData.guestName,
      guestEmail: formData.guestEmail,
      roomNumber: formData.roomNumber,
      roomCategory: formData.roomCategory,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      guestsCount: Number(formData.guestsCount),
      status: 'Confirmed',
      source: formData.source,
      grandTotal: 8400,
      paidAmount: 0,
      kycStatus: 'Pending',
      documentType: 'Passport',
      documentNumber: ''
    };
    setReservations([newRes, ...reservations]);
    setNewBookingModal(false);
    setFormData({
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      roomNumber: '104',
      roomCategory: 'Standard',
      checkInDate: '2026-09-18',
      checkOutDate: '2026-09-21',
      guestsCount: 1,
      source: 'Direct'
    });
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = 
      r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top action header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Guest Reservations & Front Desk
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Omnichannel bookings with digital KYC verification, room key issuance, and checkout workflows.
          </p>
        </div>

        <button onClick={() => setNewBookingModal(true)} className="btn-primary">
          <Plus size={16} color="#0F172A" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="lodgify-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '320px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
          <input
            type="text"
            placeholder="Search by guest, ref code, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-clean"
            style={{ width: '100%', paddingLeft: '42px', fontSize: '13px' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Status:</span>
          {['All', 'Confirmed', 'CheckedIn', 'CheckedOut'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === st ? '#D4F05B' : '#F1F5F9',
                color: statusFilter === st ? '#0F172A' : '#64748B',
                transition: 'all 0.15s ease'
              }}
            >
              {st === 'CheckedIn' ? 'Checked In' : st === 'CheckedOut' ? 'Checked Out' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ref & Guest</th>
              <th>Room & Type</th>
              <th>Stay Dates</th>
              <th>Source</th>
              <th>KYC Status</th>
              <th>Folio / Balance</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => {
              const balance = res.grandTotal - res.paidAmount;
              return (
                <tr key={res.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0F172A' }}>{res.guestName}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{res.bookingRef}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0F172A' }}>Room {res.roomNumber}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{res.roomCategory}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#0F172A' }}>
                      {res.checkInDate} → {res.checkOutDate}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>{res.guestsCount} Guest(s)</div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: 
                        res.source === 'Booking.com' ? '#E0F2FE' : 
                        res.source === 'Airbnb' ? '#FEE2E2' : 
                        res.source === 'Expedia' ? '#FEF3C7' : '#D1FAE5',
                      color:
                        res.source === 'Booking.com' ? '#0369A1' : 
                        res.source === 'Airbnb' ? '#991B1B' : 
                        res.source === 'Expedia' ? '#92400E' : '#065F46',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 9px',
                      borderRadius: '9999px'
                    }}>
                      {res.source}
                    </span>
                  </td>
                  <td>
                    {res.kycStatus === 'Verified' ? (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#065F46',
                        backgroundColor: '#D1FAE5',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '9999px'
                      }}>
                        <CheckCircle2 size={12} /> {res.documentType}
                      </span>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#92400E',
                        backgroundColor: '#FEF3C7',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '9999px'
                      }}>
                        <Clock size={12} /> Pending ID
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0F172A' }}>₹{res.grandTotal.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', color: balance > 0 ? '#EF4444' : '#10B981', fontWeight: '600' }}>
                      {balance > 0 ? `Due: ₹${balance.toLocaleString()}` : 'Fully Paid'}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: 
                        res.status === 'CheckedIn' ? '#D4F05B' : 
                        res.status === 'Confirmed' ? '#E2E8F0' : '#F1F5F9',
                      color: '#0F172A',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '9999px'
                    }}>
                      {res.status === 'CheckedIn' ? 'Checked In' : res.status === 'Confirmed' ? 'Confirmed' : 'Checked Out'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {res.status === 'Confirmed' && (
                        <button
                          onClick={() => handlePerformCheckIn(res)}
                          style={{
                            backgroundColor: '#D4F05B',
                            color: '#0F172A',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <LogIn size={13} /> Check In
                        </button>
                      )}

                      {res.status === 'CheckedIn' && (
                        <button
                          onClick={() => handlePerformCheckOut(res)}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '12px',
                            padding: '6px 12px',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <LogOut size={13} /> Check Out
                        </button>
                      )}

                      <button
                        onClick={() => onNavigateTab('financials')}
                        title="View Folio & Billing"
                        style={{
                          backgroundColor: '#F8FAFC',
                          color: '#0F172A',
                          border: '1px solid #E2E8F0',
                          padding: '6px 10px',
                          borderRadius: '9999px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        <FileText size={13} /> Folio
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Digital Check-in & KYC Modal */}
      {checkInModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserCheck size={20} color="#065F46" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  Digital Check-in & KYC Verification
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  {checkInModal.guestName} • Room {checkInModal.roomNumber} ({checkInModal.roomCategory})
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Government ID Document Type
                </label>
                <select
                  value={kycDocType}
                  onChange={(e) => setKycDocType(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                >
                  <option value="Passport">Passport</option>
                  <option value="DrivingLicense">Driving License</option>
                  <option value="NationalID">National ID Card / Aadhaar</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  ID / Document Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. US-9912048X or SG-S9238411D"
                  value={kycDocNumber}
                  onChange={(e) => setKycDocNumber(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </div>

              <div style={{
                padding: '12px 16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <ShieldAlert size={18} color="#10B981" />
                <span style={{ fontSize: '12px', color: '#475569' }}>
                  Digital KYC will encrypt document credentials and mark guest verified for hospitality compliance.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setCheckInModal(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSaveCheckIn} className="btn-primary">
                Complete Check-In & Issue Room Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Reservation Modal */}
      {newBookingModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '580px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginBottom: '18px' }}>
              Create New Reservation
            </h3>

            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Guest Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Olivia Vance"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Guest Email</label>
                  <input
                    type="email"
                    required
                    placeholder="olivia@domain.com"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Room Number & Type</label>
                  <select
                    value={formData.roomNumber}
                    onChange={(e) => {
                      const num = e.target.value;
                      const cat = num.startsWith('1') ? 'Deluxe' : num.startsWith('2') ? 'Executive Suite' : 'Presidential Suite';
                      setFormData({ ...formData, roomNumber: num, roomCategory: cat });
                    }}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="104">Room 104 - Standard (₹2,500/nt)</option>
                    <option value="106">Room 106 - Standard (₹2,500/nt)</option>
                    <option value="203">Room 203 - Executive Suite (₹6,500/nt)</option>
                    <option value="302">Room 302 - Executive Suite (₹6,500/nt)</option>
                    <option value="303">Room 303 - Deluxe (₹3,500/nt)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Booking Channel</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  >
                    <option value="Direct">Direct Front Desk / Web</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Airbnb">Airbnb</option>
                    <option value="Expedia">Expedia</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Check-in Date</label>
                  <input
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Check-out Date</label>
                  <input
                    type="date"
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button type="button" onClick={() => setNewBookingModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Booking & Issue Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
