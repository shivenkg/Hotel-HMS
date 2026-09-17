import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  BedDouble, 
  CheckCircle2,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface NewBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBooking: (newBooking: {
    guestName: string;
    date: string;
    roomNumber: string;
    timeSlot: string;
    startTime: string;
    endTime: string;
    phone: string;
    status: 'Confirmed' | 'Pending' | 'Checked-in';
  }) => void;
}

export const NewBookingDrawer: React.FC<NewBookingDrawerProps> = ({
  isOpen,
  onClose,
  onSaveBooking
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('2025-12-05');
  const [room, setRoom] = useState('Room 101');
  const [timeSlot, setTimeSlot] = useState('Morning Slot (08:00 - 13:00)');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('13:00');
  const [phone, setPhone] = useState('0812 3290 0992');
  const [status, setStatus] = useState<'Confirmed' | 'Pending' | 'Checked-in'>('Confirmed');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveBooking({
      guestName: name,
      date,
      roomNumber: room,
      timeSlot,
      startTime,
      endTime,
      phone,
      status
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 900);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'flex-end',
      backdropFilter: 'blur(2px)'
    }}>
      {/* Backdrop click to close */}
      <div 
        onClick={onClose} 
        style={{ flex: 1, cursor: 'pointer' }} 
      />

      {/* Slide-out Drawer matching Image 1 */}
      <div 
        className="animate-slide-in-right"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          boxShadow: '-8px 0 32px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '800',
              color: '#0F172A',
              margin: 0,
              letterSpacing: '-0.2px'
            }}>
              New Booking
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#64748B',
              margin: '4px 0 0 0'
            }}>
              Fill out the form to create a new room booking.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success Alert */}
        {showSuccessToast && (
          <div style={{
            margin: '16px 28px 0 28px',
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            color: '#15803D',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>Booking confirmed & added to room timeline!</span>
          </div>
        )}

        {/* Drawer Body - Form matching Image 1 fields */}
        <form onSubmit={handleSubmit} style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          
          {/* Name Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="input-clean"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5E1'
              }}
            />
          </div>

          {/* Date Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
              Date
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-clean"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1'
                }}
              />
            </div>
          </div>

          {/* Room Selection Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
              Room
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="Room 101">Room 101 (Single Deluxe)</option>
              <option value="Room 102">Room 102 (Single Deluxe)</option>
              <option value="Room 103">Room 103 (Single Standard)</option>
              <option value="Room 104">Room 104 (Single Standard)</option>
              <option value="Room 105">Room 105 (Single Executive)</option>
              <option value="Suite 1">Suite 1 (Presidential Suite)</option>
              <option value="Suite 2">Suite 2 (Executive Suite)</option>
              <option value="Room 201">Room 201 (Double Premium)</option>
            </select>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
              Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: '600',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              <option value="Morning Slot (08:00 - 13:00)">Morning Slot (08:00 - 13:00)</option>
              <option value="Afternoon Slot (13:00 - 18:00)">Afternoon Slot (13:00 - 18:00)</option>
              <option value="Full Day Stay (08:00 - 20:00)">Full Day Stay (08:00 - 20:00)</option>
              <option value="Overnight Stay (24 Hours)">Overnight Stay (24 Hours)</option>
            </select>
          </div>

          {/* Start Time & End Time side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <option value="07:00">07:00 AM</option>
                <option value="08:00">08:00 AM</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: '13px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <option value="12:00">12:00 PM</option>
                <option value="13:00">01:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
                <option value="18:00">06:00 PM</option>
              </select>
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812 3290 0992"
              className="input-clean"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5E1'
              }}
            />
          </div>

          {/* Status Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: '700',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                color: status === 'Confirmed' ? '#15803D' : status === 'Checked-in' ? '#0369A1' : '#B45309',
                cursor: 'pointer'
              }}
            >
              <option value="Confirmed">Confirmed</option>
              <option value="Checked-in">Checked-in</option>
              <option value="Pending">Pending Confirmation</option>
            </select>
          </div>

          {/* Drawer Footer Actions matching Image 1: Cancel & Save */}
          <div style={{
            marginTop: 'auto',
            paddingTop: '20px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 24px',
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
