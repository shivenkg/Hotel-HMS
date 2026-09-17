import React, { useState } from 'react';
import { 
  X, 
  User, 
  Crown, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Award, 
  Sparkles, 
  Heart, 
  Coffee, 
  BedDouble, 
  ShieldCheck, 
  Share2, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { GuestProfile } from '../data/topGuestsData';
import { loadHotelDetails, generateLocationShareText, generateLocationEmailContent } from '../data/hotelConfig';

interface GuestProfileModalProps {
  guest: GuestProfile | null;
  onClose: () => void;
  onSelectBooking?: (bookingRef: string) => void;
}

export const GuestProfileModal: React.FC<GuestProfileModalProps> = ({ 
  guest, 
  onClose,
  onSelectBooking 
}) => {
  if (!guest) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'stays' | 'preferences' | 'notes'>('overview');
  const [expandedStayId, setExpandedStayId] = useState<string | null>(guest.stayHistory[0]?.id || null);
  const [newNote, setNewNote] = useState('');
  const [internalNotes, setInternalNotes] = useState(guest.internalNotes);
  const [shareSuccessMsg, setShareSuccessMsg] = useState<string | null>(null);

  const hotel = loadHotelDetails();

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const noteObj = {
      id: `n-${Date.now()}`,
      author: 'Front Desk Lead',
      date: new Date().toISOString().split('T')[0],
      note: newNote.trim()
    };
    setInternalNotes([noteObj, ...internalNotes]);
    setNewNote('');
  };

  const handleShareWhatsAppLocation = () => {
    const text = generateLocationShareText(hotel, guest.name);
    const cleanPhone = (guest.whatsapp || guest.phone).replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setShareSuccessMsg(`Location message dispatched to ${guest.name}'s WhatsApp!`);
    setTimeout(() => setShareSuccessMsg(null), 3500);
  };

  const handleShareEmailLocation = () => {
    const { subject, body } = generateLocationEmailContent(hotel, guest.name);
    const mailto = `mailto:${guest.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
    setShareSuccessMsg(`Email draft prepared for ${guest.email}!`);
    setTimeout(() => setShareSuccessMsg(null), 3500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      backdropFilter: 'blur(5px)',
      padding: '20px'
    }}>
      <div 
        className="lodgify-card animate-fade-in"
        style={{
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF',
              transition: 'all 0.2s ease'
            }}
            className="hover:bg-white/20"
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: guest.avatarColor,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: '800',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              flexShrink: 0
            }}>
              {guest.avatarInitials}
            </div>

            {/* Guest Summary Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, letterSpacing: '-0.3px' }}>
                  {guest.name}
                </h2>
                
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: guest.vipTierColor.bg,
                  color: guest.vipTierColor.text,
                  border: `1px solid ${guest.vipTierColor.border}`,
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '9999px'
                }}>
                  <Crown size={12} /> {guest.vipTier}
                </span>

                {guest.currentRoom && (
                  <span style={{
                    backgroundColor: '#D4F05B',
                    color: '#0F172A',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 9px',
                    borderRadius: '9999px'
                  }}>
                    In-House • Room {guest.currentRoom}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#94A3B8', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={13} color="#CBD5E1" /> {guest.city}, {guest.country} ({guest.nationality})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={13} color="#CBD5E1" /> {guest.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Mail size={13} color="#CBD5E1" /> {guest.email}
                </span>
              </div>
            </div>

            {/* Action Bar: WhatsApp & Email Location */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleShareWhatsAppLocation}
                title="Send Hotel Location via WhatsApp"
                style={{
                  backgroundColor: '#22C55E',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={13} /> Share Location
              </button>
              <button
                onClick={handleShareEmailLocation}
                title="Email Hotel Directions Guide"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={13} /> Email Guide
              </button>
            </div>
          </div>

          {/* Success toast notification */}
          {shareSuccessMsg && (
            <div style={{
              marginTop: '12px',
              backgroundColor: '#065F46',
              color: '#D1FAE5',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={14} /> {shareSuccessMsg}
            </div>
          )}
        </div>

        {/* METRICS STRIP: LIFETIME VALUE, STAYS, NIGHTS, ADR, POINTS */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Lifetime Value
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
              ₹{guest.lifetimeValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>
              High Spender
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Visits
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
              {guest.totalVisits} Stays
            </div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>
              First: {guest.firstVisitDate}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Room Nights
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
              {guest.totalNights} Nights
            </div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>
              Last: {guest.lastVisitDate}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Avg Daily Rate
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
              ₹{guest.avgDailyRate.toLocaleString()}
            </div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>
              Per Room / Night
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Loyalty Points
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#7C3AED', marginTop: '2px' }}>
              {guest.loyaltyPoints.toLocaleString()} pts
            </div>
            <div style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>
              {guest.vipTier} Tier
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div style={{
          display: 'flex',
          gap: '24px',
          padding: '0 28px',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF'
        }}>
          {[
            { id: 'overview', label: 'Guest Overview', icon: User },
            { id: 'stays', label: `Stay History (${guest.stayHistory.length})`, icon: Calendar },
            { id: 'preferences', label: 'Preferences & Routine', icon: Heart },
            { id: 'notes', label: `Internal Notes (${internalNotes.length})`, icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 0',
                border: 'none',
                background: 'none',
                fontSize: '13px',
                fontWeight: '700',
                color: activeTab === tab.id ? '#0F172A' : '#64748B',
                borderBottom: activeTab === tab.id ? '2px solid #0F172A' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB BODY (SCROLLABLE) */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, backgroundColor: '#FFFFFF' }}>
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Profile & Identification Details */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#059669" /> Identity & Verification
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B' }}>KYC Verification Status</span>
                    <span style={{ fontWeight: '700', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={13} /> {guest.kycStatus}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B' }}>Document Type</span>
                    <span style={{ fontWeight: '700', color: '#0F172A' }}>{guest.documentType}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B' }}>Document Number</span>
                    <span style={{ fontWeight: '700', color: '#0F172A', fontFamily: 'monospace' }}>{guest.documentNumber}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B' }}>Permanent Address</span>
                    <span style={{ fontWeight: '600', color: '#0F172A', textAlign: 'right', maxWidth: '220px' }}>
                      {guest.address}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Active Booking Ref</span>
                    <span style={{ fontWeight: '800', color: '#0E94A8', fontFamily: 'monospace' }}>
                      {guest.currentBookingRef || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* VIP Concierge Summary */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', backgroundColor: '#F8FAFC' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#D97706" /> Staff Temperament & Service Guideline
                </h3>

                <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.6', margin: '0 0 16px 0', fontStyle: 'italic' }}>
                  "{guest.preferences.temperament}"
                </p>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Key Highlights
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', color: '#0F172A' }}>
                      🛎️ Express Check-in
                    </span>
                    <span style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', color: '#0F172A' }}>
                      🍾 Welcome Amenity
                    </span>
                    <span style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '4px 8px', fontSize: '11px', fontWeight: '600', color: '#0F172A' }}>
                      🧾 WhatsApp Digital Folio
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STAY HISTORY TAB */}
          {activeTab === 'stays' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748B' }}>
                  Complete Record of Past & Active Reservations
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669' }}>
                  Total Lifetime Revenue: ₹{guest.lifetimeValue.toLocaleString()}
                </span>
              </div>

              {guest.stayHistory.map((stay) => {
                const isExpanded = expandedStayId === stay.id;
                return (
                  <div 
                    key={stay.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      transition: 'border 0.2s ease'
                    }}
                  >
                    {/* Collapsible Row Header */}
                    <div 
                      onClick={() => setExpandedStayId(isExpanded ? null : stay.id)}
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        backgroundColor: isExpanded ? '#F8FAFC' : '#FFFFFF'
                      }}
                      className="hover:bg-slate-50"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          backgroundColor: stay.status === 'CheckedIn' ? '#D4F05B' : '#E2E8F0',
                          color: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: '13px'
                        }}>
                          {stay.roomNumber}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                              {stay.bookingRef}
                            </span>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '800',
                              backgroundColor: stay.status === 'CheckedIn' ? '#D1FAE5' : '#F1F5F9',
                              color: stay.status === 'CheckedIn' ? '#065F46' : '#475569',
                              padding: '2px 8px',
                              borderRadius: '9999px'
                            }}>
                              {stay.status === 'CheckedIn' ? 'In-House' : stay.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            {stay.roomCategory} • {stay.checkIn} to {stay.checkOut} ({stay.nights} Nights) • via {stay.source}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                            ₹{stay.totalAmount.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                            Paid in Full
                          </div>
                        </div>

                        {isExpanded ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
                      </div>
                    </div>

                    {/* Expanded Drawer Details */}
                    {isExpanded && (
                      <div style={{
                        padding: '16px 18px',
                        borderTop: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        fontSize: '12px'
                      }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '12px' }}>
                          <div>
                            <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Check-in & Check-out:</span>
                            <span style={{ fontWeight: '700', color: '#0F172A' }}>{stay.checkIn} → {stay.checkOut}</span>
                          </div>
                          <div>
                            <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Room & Rate Category:</span>
                            <span style={{ fontWeight: '700', color: '#0F172A' }}>{stay.roomCategory} (Room {stay.roomNumber})</span>
                          </div>
                          <div>
                            <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Guest Satisfaction Rating:</span>
                            <span style={{ fontWeight: '700', color: '#D97706' }}>
                              {'⭐'.repeat(stay.rating || 5)} ({stay.rating || 5}/5.0)
                            </span>
                          </div>
                        </div>

                        {stay.specialRequests && (
                          <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                            <span style={{ fontWeight: '700', color: '#0F172A' }}>Special Requests & Notes: </span>
                            <span style={{ color: '#475569' }}>{stay.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Room Preferences */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BedDouble size={16} color="#0284C7" /> Suite & Room Preferences
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {guest.preferences.room.map((pref, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{pref}</li>
                  ))}
                </ul>
              </div>

              {/* Dining Preferences */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Coffee size={16} color="#D97706" /> Dining & Beverage Preferences
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {guest.preferences.dietary.map((pref, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{pref}</li>
                  ))}
                </ul>
              </div>

              {/* Housekeeping Routine */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#7C3AED" /> Housekeeping & Turndown
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {guest.preferences.housekeeping.map((pref, idx) => (
                    <li key={idx} style={{ lineHeight: '1.4' }}>{pref}</li>
                  ))}
                </ul>
              </div>

              {/* Location & Directions Dispatch */}
              <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '18px', backgroundColor: '#F0FDF4' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#166534', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={16} color="#16A34A" /> WhatsApp Arrival Concierge
                </h4>
                <p style={{ fontSize: '12px', color: '#14532D', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                  Send hotel coordinates, live Google Maps link, and valet instructions directly to {guest.name}'s phone number.
                </p>
                <button
                  onClick={handleShareWhatsAppLocation}
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Share2 size={13} /> Send Location via WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* 4. INTERNAL NOTES TAB */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Note input form */}
              <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder={`Add a private staff note about ${guest.name}...`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="input-clean"
                  style={{ flex: 1, borderRadius: '10px' }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={14} /> Add Note
                </button>
              </form>

              {/* Notes list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {internalNotes.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      backgroundColor: '#F8FAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px' }}>
                      <span style={{ fontWeight: '700', color: '#0F172A' }}>{item.author}</span>
                      <span style={{ color: '#94A3B8' }}>{item.date}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <div>
            Hotel Property: <strong>{hotel.hotelName}</strong> • GST: <strong>{hotel.gstin}</strong>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#E2E8F0',
              color: '#0F172A',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
