import React, { useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  BedDouble, 
  Check, 
  X, 
  Upload, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck,
  CreditCard,
  Clock,
  Layers,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { 
  RoomStatusLegend, 
  RoomStatusBadge, 
  RoomHousekeepingStatus, 
  ROOM_STATUS_MAP 
} from '../components/RoomStatusLegend';
import { HourlyTimelineView } from '../components/HourlyTimelineView';
import { NewBookingDrawer } from '../components/NewBookingDrawer';

interface BookingEntry {
  id: string;
  guest: string;
  fromDay: number;
  toDay: number;
  statusColor?: string;
  source?: string;
  isConfirmed?: boolean;
}

interface RoomItem {
  number: string;
  category: 'Single' | 'Double' | 'Suite' | 'Deluxe';
  status: 'Vacant' | 'Occupied' | 'Reserved' | 'OutOfOrder';
  housekeepingStatus: RoomHousekeepingStatus;
  rate: number;
  bookings: BookingEntry[];
}

export const CalendarView: React.FC = () => {
  const [singleRoomsOpen, setSingleRoomsOpen] = useState(true);
  const [doubleRoomsOpen, setDoubleRoomsOpen] = useState(true);
  const [selectedDay, setSelectedDay] = useState(5); // Fri 5 highlighted as in screenshot

  // Calendar Days matching user screenshot: Tue 2 to Mon 15 Dec 2025
  const days = [
    { day: 2, name: 'Tue' },
    { day: 3, name: 'Wed' },
    { day: 4, name: 'Thu' },
    { day: 5, name: 'Fri' }, // Active column with cyan vertical line
    { day: 6, name: 'Sat' },
    { day: 7, name: 'Sun' },
    { day: 8, name: 'Mon' },
    { day: 9, name: 'Tue' },
    { day: 10, name: 'Wed' },
    { day: 11, name: 'Thu' },
    { day: 12, name: 'Fri' },
    { day: 13, name: 'Sat' },
    { day: 14, name: 'Sun' },
    { day: 15, name: 'Mon' }
  ];

  // Single rooms availability summary badges (as seen in image)
  const singleAvailability = [
    { day: 2, count: 2, available: true },
    { day: 3, count: 2, available: true },
    { day: 4, count: 0, available: false },
    { day: 5, count: 1, available: true },
    { day: 6, count: 0, available: false },
    { day: 7, count: 0, available: false },
    { day: 8, count: 0, available: false },
    { day: 9, count: 1, available: true },
    { day: 10, count: 1, available: true },
    { day: 11, count: 1, available: true },
    { day: 12, count: 2, available: true },
    { day: 13, count: 2, available: true },
    { day: 14, count: 2, available: true },
    { day: 15, count: 2, available: true },
  ];

  // Room rows matching Image 1: 101 to 109 with exact guest names and housekeeping statuses
  const [singleRooms, setSingleRooms] = useState<RoomItem[]>([
    {
      number: '101',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 2500,
      bookings: [
        { id: 'b-101a', guest: 'Chris Glasser', fromDay: 11, toDay: 14, statusColor: '#E6F9E6', source: 'Direct' }
      ]
    },
    {
      number: '102',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Dirty',
      rate: 2500,
      bookings: [
        { id: 'b-102', guest: 'Frances Swann', fromDay: 9, toDay: 11, statusColor: '#E6F9E6', source: 'Booking.com' }
      ]
    },
    {
      number: '103',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 2500,
      bookings: [
        { id: 'b-103', guest: 'James Hall', fromDay: 5, toDay: 6, statusColor: '#E0F2FE', source: 'Expedia' }
      ]
    },
    {
      number: '104',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Dirty',
      rate: 2500,
      bookings: [
        { id: 'b-104', guest: 'Ricky Smith', fromDay: 9, toDay: 11, statusColor: '#E0F2FE', source: 'Airbnb' }
      ]
    },
    {
      number: '105',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 2500,
      bookings: [
        { id: 'b-105a', guest: 'John Dukes', fromDay: 2, toDay: 3, statusColor: '#E6F9E6', source: 'Direct' },
        { id: 'b-105b', guest: 'Iva Ryan', fromDay: 10, toDay: 11, statusColor: '#E0F2FE', source: 'Direct' }
      ]
    },
    {
      number: '106',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Maintenance',
      rate: 2500,
      bookings: [
        { id: 'b-106a', guest: 'Alexander Buckmaster', fromDay: 5, toDay: 10, statusColor: '#E6F9E6', source: 'Corporate' },
        { id: 'b-106b', guest: 'John Smith', fromDay: 12, toDay: 13, statusColor: '#E0F2FE', source: 'Direct' }
      ]
    },
    {
      number: '107',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 2500,
      bookings: [
        { id: 'b-107a', guest: 'Kenneth Allen', fromDay: 9, toDay: 10, statusColor: '#E0F2FE', source: 'Direct' },
        { id: 'b-107b', guest: 'Patricia Sanders', fromDay: 11, toDay: 13, statusColor: '#E0F2FE', source: 'Expedia' }
      ]
    },
    {
      number: '108',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'OutOfOrder',
      rate: 2500,
      bookings: [
        { id: 'b-108', guest: 'Corina McCoy', fromDay: 2, toDay: 3, statusColor: '#E0F2FE', source: 'Direct' }
      ]
    },
    {
      number: '109',
      category: 'Single',
      status: 'Occupied',
      housekeepingStatus: 'Maintenance',
      rate: 2500,
      bookings: [
        { id: 'b-109', guest: 'Paula Mora', fromDay: 12, toDay: 15, statusColor: '#E6F9E6', source: 'Direct' }
      ]
    }
  ]);

  const [doubleRooms, setDoubleRooms] = useState<RoomItem[]>([
    {
      number: 'Suite1',
      category: 'Suite',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 6500,
      bookings: [
        { id: 'b-s1', guest: 'Joshua Jones', fromDay: 4, toDay: 8, statusColor: '#E6F9E6', source: 'Direct' }
      ]
    },
    {
      number: 'Suite2',
      category: 'Suite',
      status: 'Vacant',
      housekeepingStatus: 'Clean',
      rate: 6500,
      bookings: [
        { id: 'b-s2', guest: 'Kimberly Mastrangelo', fromDay: 9, toDay: 13, statusColor: '#E0F2FE', source: 'Booking.com' }
      ]
    },
    {
      number: 'Suite3',
      category: 'Suite',
      status: 'Occupied',
      housekeepingStatus: 'Dirty',
      rate: 6500,
      bookings: [
        { id: 'b-s3', guest: 'Judith Rodriguez', fromDay: 3, toDay: 7, statusColor: '#E6F9E6', source: 'Direct' }
      ]
    },
    {
      number: '201',
      category: 'Double',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 4500,
      bookings: [
        { id: 'b-201', guest: 'David Miller', fromDay: 6, toDay: 10, statusColor: '#E0F2FE', source: 'Expedia' }
      ]
    },
    {
      number: '202',
      category: 'Double',
      status: 'Occupied',
      housekeepingStatus: 'Dirty',
      rate: 4500,
      bookings: [
        { id: 'b-202', guest: 'Elena Rostova', fromDay: 8, toDay: 12, statusColor: '#E6F9E6', source: 'Direct' }
      ]
    },
    {
      number: '301',
      category: 'Suite',
      status: 'Occupied',
      housekeepingStatus: 'Clean',
      rate: 12500,
      bookings: [
        { id: 'b-301', guest: 'Lord Alistair Sterling', fromDay: 4, toDay: 11, statusColor: '#E6F9E6', source: 'VIP Direct' }
      ]
    }
  ]);

  // Operational Room Status & Filter State
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'matrix' | 'hourly'>('matrix');
  const [isDrawerBookingOpen, setIsDrawerBookingOpen] = useState(false);

  // Compute status counts dynamically
  const allRoomsList = [...singleRooms, ...doubleRooms];
  const statusCounts = {
    total: allRoomsList.length,
    clean: allRoomsList.filter(r => r.housekeepingStatus === 'Clean').length,
    dirty: allRoomsList.filter(r => r.housekeepingStatus === 'Dirty').length,
    maintenance: allRoomsList.filter(r => r.housekeepingStatus === 'Maintenance').length,
    outOfOrder: allRoomsList.filter(r => r.housekeepingStatus === 'OutOfOrder').length,
    occupied: allRoomsList.filter(r => r.status === 'Occupied').length,
    vacant: allRoomsList.filter(r => r.status === 'Vacant').length
  };

  const handleUpdateRoomStatus = (roomNumber: string, newStatus: RoomHousekeepingStatus) => {
    setSingleRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, housekeepingStatus: newStatus } : r));
    setDoubleRooms(prev => prev.map(r => r.number === roomNumber ? { ...r, housekeepingStatus: newStatus } : r));
  };

  const handleSaveFromDrawer = (drawerBooking: any) => {
    const roomNum = drawerBooking.roomNumber.replace('Room ', '').trim();
    const day = new Date(drawerBooking.date).getDate() || 5;
    const newBooking: BookingEntry = {
      id: `b-${Date.now()}`,
      guest: drawerBooking.guestName,
      fromDay: day,
      toDay: Math.min(15, day + 2),
      statusColor: '#DCFCE7',
      source: 'Quick Booking',
      isConfirmed: drawerBooking.status === 'Confirmed'
    };

    setSingleRooms(prev => prev.map(r => r.number === roomNum ? { ...r, bookings: [...r.bookings, newBooking], status: 'Occupied' } : r));
    setDoubleRooms(prev => prev.map(r => r.number === roomNum ? { ...r, bookings: [...r.bookings, newBooking], status: 'Occupied' } : r));
  };

  // Filter rooms when status filter is applied
  const filteredSingleRooms = singleRooms.filter(r => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Occupied') return r.status === 'Occupied';
    if (statusFilter === 'Vacant') return r.status === 'Vacant';
    return r.housekeepingStatus === statusFilter;
  });

  const filteredDoubleRooms = doubleRooms.filter(r => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Occupied') return r.status === 'Occupied';
    if (statusFilter === 'Vacant') return r.status === 'Vacant';
    return r.housekeepingStatus === statusFilter;
  });

  // Modal State for Front Desk Booking Engine
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'Room' | 'Deal'>('Room');
  
  // Booking Form State
  const [formData, setFormData] = useState({
    roomNumber: '103',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    nationality: 'American',
    purposeOfVisit: 'Leisure',
    guestAddress: '124 Market Street, San Francisco, CA',
    checkInDate: '2025-12-05',
    checkOutDate: '2025-12-08',
    guestsCount: 1,
    documentType: 'Passport' as 'Passport' | 'NationalID' | 'DrivingLicense' | 'VoterID',
    documentNumber: '',
    scannedDocImage: null as string | null,
    immediateCheckIn: true,
    advancePaid: 0,
    paymentMethod: 'CreditCard'
  });

  const [isUploading, setIsUploading] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Calculate nights and taxes
  const calculateNights = () => {
    const inD = new Date(formData.checkInDate);
    const outD = new Date(formData.checkOutDate);
    const diff = Math.max(1, Math.ceil((outD.getTime() - inD.getTime()) / (1000 * 3600 * 24)));
    return diff;
  };

  const getSelectedRoomRate = () => {
    const all = [...singleRooms, ...doubleRooms];
    const rm = all.find(r => r.number === formData.roomNumber);
    return rm ? rm.rate : 2500;
  };

  const nights = calculateNights();
  const baseRate = getSelectedRoomRate();
  const roomRentTotal = baseRate * nights;
  const gstRate = baseRate > 7500 ? 18 : 12; // Dual-Slab GST
  const gstAmount = Math.round(roomRentTotal * (gstRate / 100));
  const grandTotal = roomRentTotal + gstAmount;

  // Open modal with pre-selected room/day if clicked from grid
  const handleCellClick = (roomNumber: string, day: number) => {
    const nextDay = Math.min(15, day + 2);
    setFormData(prev => ({
      ...prev,
      roomNumber,
      checkInDate: `2025-12-${String(day).padStart(2, '0')}`,
      checkOutDate: `2025-12-${String(nextDay).padStart(2, '0')}`
    }));
    setIsBookingModalOpen(true);
  };

  // Sample Scanned Document Presets
  const handlePresetPassport = () => {
    setIsUploading(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documentType: 'Passport',
        documentNumber: 'USA-99482103P',
        nationality: 'United States',
        scannedDocImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      }));
      setIsUploading(false);
    }, 400);
  };

  const handlePresetNationalId = () => {
    setIsUploading(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        documentType: 'NationalID',
        documentNumber: 'SG-S9841249A',
        nationality: 'Singaporean',
        scannedDocImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      }));
      setIsUploading(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          scannedDocImage: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Create Booking
  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName) {
      alert('Please enter guest name');
      return;
    }

    const checkInDay = parseInt(formData.checkInDate.split('-')[2], 10) || 5;
    const checkOutDay = parseInt(formData.checkOutDate.split('-')[2], 10) || 7;

    const newBooking: BookingEntry = {
      id: `b-${Date.now()}`,
      guest: formData.guestName,
      fromDay: checkInDay,
      toDay: checkOutDay,
      statusColor: '#E6F9E6',
      source: 'Front Desk',
      isConfirmed: true
    };

    // Update frontend state
    const updateRoomsList = (list: RoomItem[]) => {
      return list.map(rm => {
        if (rm.number === formData.roomNumber) {
          return {
            ...rm,
            status: 'Occupied' as const,
            bookings: [...rm.bookings, newBooking]
          };
        }
        return rm;
      });
    };

    setSingleRooms(prev => updateRoomsList(prev));
    setDoubleRooms(prev => updateRoomsList(prev));

    // Try posting to backend
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          guestPhone: formData.guestPhone,
          roomId: formData.roomNumber,
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
          guestsCount: formData.guestsCount,
          source: 'Direct',
          documentType: formData.documentType,
          documentNumber: formData.documentNumber || `DOC-${Date.now().toString().slice(-6)}`,
          documentUrl: formData.scannedDocImage,
          nationality: formData.nationality,
          guestAddress: formData.guestAddress,
          purposeOfVisit: formData.purposeOfVisit,
          immediateCheckIn: formData.immediateCheckIn,
          advancePaid: formData.advancePaid || grandTotal,
          paymentMethod: formData.paymentMethod
        })
      });
    } catch {
      // Offline fallback
    }

    setBookingSuccessMsg(`Reservation BK-2026-${Math.floor(100 + Math.random() * 900)} for ${formData.guestName} in Room ${formData.roomNumber} confirmed!`);
    setTimeout(() => {
      setBookingSuccessMsg('');
      setIsBookingModalOpen(false);
      // Reset
      setFormData(prev => ({
        ...prev,
        guestName: '',
        documentNumber: '',
        scannedDocImage: null
      }));
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER - FRONT DESK TITLE & BUTTONS */}
      {/* ---------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.3px',
            margin: 0
          }}>
            Front desk
          </h1>
        </div>

        {/* Right Top Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* View Mode Toggle: Tape Chart vs Daily Hourly Timeline */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            padding: '3px',
            borderRadius: '9px',
            border: '1px solid #E2E8F0'
          }}>
            <button
              onClick={() => setViewMode('matrix')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: viewMode === 'matrix' ? '800' : '600',
                backgroundColor: viewMode === 'matrix' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'matrix' ? '#0F172A' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                boxShadow: viewMode === 'matrix' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <CalendarIcon size={14} />
              <span>14-Day Tape Chart</span>
            </button>
            <button
              onClick={() => setViewMode('hourly')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: viewMode === 'hourly' ? '800' : '600',
                backgroundColor: viewMode === 'hourly' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'hourly' ? '#0F172A' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                boxShadow: viewMode === 'hourly' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <Clock size={14} />
              <span>Hourly Timeline</span>
            </button>
          </div>

          {/* Quick Booking Drawer Trigger (Inspired by Image 1) */}
          <button
            onClick={() => setIsDrawerBookingOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0F172A',
              border: 'none',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={15} />
            <span>+ Quick Booking</span>
          </button>

          {/* Add Deal Booking button */}
          <button
            onClick={() => { setBookingType('Deal'); setIsBookingModalOpen(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0E94A8',
              color: '#0E94A8',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            <span>Deal Booking</span>
          </button>

          {/* Add Room Booking button */}
          <button
            onClick={() => { setBookingType('Room'); setIsBookingModalOpen(true); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#0E94A8',
              border: '1.5px solid #0E94A8',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(14, 148, 168, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Plus size={16} />
            <span>Room Booking</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. STATS & DATE RANGE ROW */}
      {/* ---------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* 4 Stat Cards */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* VACANT */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'Vacant' ? 'All' : 'Vacant')}
            style={{
              backgroundColor: '#EBF3FB',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: statusFilter === 'Vacant' ? '2px solid #3B82F6' : '1px solid #D6E8F9',
              cursor: 'pointer'
            }}
            title="Filter by Vacant"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#4B7FB5', letterSpacing: '0.5px' }}>
              VACANT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <BedDouble size={18} color="#3B82F6" />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E40AF' }}>{statusCounts.vacant}</span>
            </div>
          </div>

          {/* OCCUPIED */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'Occupied' ? 'All' : 'Occupied')}
            style={{
              backgroundColor: '#E6F7F9',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: statusFilter === 'Occupied' ? '2px solid #0E94A8' : '1px solid #C4EEF3',
              cursor: 'pointer'
            }}
            title="Filter by Occupied"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0E94A8', letterSpacing: '0.5px' }}>
              OCCUPIED
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <BedDouble size={18} color="#0891B2" />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#0E7490' }}>{statusCounts.occupied}</span>
            </div>
          </div>

          {/* CLEAN */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'Clean' ? 'All' : 'Clean')}
            style={{
              backgroundColor: '#EDFAF1',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: statusFilter === 'Clean' ? '2px solid #16A34A' : '1px solid #C9F2D5',
              cursor: 'pointer'
            }}
            title="Filter by Clean"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#15803D', letterSpacing: '0.5px' }}>
              CLEAN (READY)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <Check size={18} color="#16A34A" strokeWidth={3} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#166534' }}>{statusCounts.clean}</span>
            </div>
          </div>

          {/* OUT OF ORDER */}
          <div 
            onClick={() => setStatusFilter(statusFilter === 'OutOfOrder' ? 'All' : 'OutOfOrder')}
            style={{
              backgroundColor: '#FDF0F0',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: statusFilter === 'OutOfOrder' ? '2px solid #DC2626' : '1px solid #FCD4D4',
              cursor: 'pointer'
            }}
            title="Filter by Out of Order"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#B91C1C', letterSpacing: '0.5px' }}>
              OUT OF ORDER
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <X size={18} color="#DC2626" strokeWidth={3} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#991B1B' }}>{statusCounts.outOfOrder}</span>
            </div>
          </div>
        </div>

        {/* Date Selector Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Dates</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #CBD5E1',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#0F172A'
          }}>
            <CalendarIcon size={16} color="#64748B" />
            <span>2-12-2025 – 15-12-2025</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2.5 COLOR-CODED ROOM STATUS LEGEND & FILTER BAR */}
      {/* ---------------------------------------------------- */}
      <RoomStatusLegend
        statusCounts={statusCounts}
        activeFilter={statusFilter}
        onSelectFilter={(f) => setStatusFilter(f)}
      />

      {/* ---------------------------------------------------- */}
      {/* 3. CALENDAR MATRIX GRID (MATCHING IMAGE 1) OR HOURLY TIMELINE (MATCHING IMAGE 2) */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'hourly' ? (
        <HourlyTimelineView 
          onOpenNewBooking={() => setIsDrawerBookingOpen(true)} 
        />
      ) : (
        <div className="lodgify-card" style={{ padding: 0, overflowX: 'auto', borderRadius: '14px', border: '1px solid #E2E8F0', position: 'relative' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {/* Rooms Column Header */}
                <th style={{
                  width: '210px',
                  padding: '14px 16px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#0F172A',
                  borderRight: '1px solid #E2E8F0'
                }}>
                  Rooms & Status
                </th>

              {/* 14 Day Columns */}
              {days.map(d => {
                const isSelected = d.day === selectedDay;
                return (
                  <th
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    style={{
                      padding: '10px 4px',
                      textAlign: 'center',
                      fontSize: '12px',
                      cursor: 'pointer',
                      borderRight: '1px solid #F1F5F9',
                      backgroundColor: isSelected ? '#0E94A8' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      width: '64px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: '600', opacity: isSelected ? 0.9 : 0.7 }}>
                      {d.name}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '800' }}>
                      {d.day}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {/* ---------------------------------------------------- */}
            {/* SINGLE ROOMS CATEGORY ROW */}
            {/* ---------------------------------------------------- */}
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <td
                onClick={() => setSingleRoomsOpen(!singleRoomsOpen)}
                style={{
                  padding: '10px 16px',
                  fontWeight: '800',
                  fontSize: '13px',
                  color: '#0F172A',
                  cursor: 'pointer',
                  borderRight: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Single rooms</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>({filteredSingleRooms.length})</span>
                </div>
                {singleRoomsOpen ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </td>

              {/* Availability Badges per day */}
              {singleAvailability.map(sa => (
                <td
                  key={sa.day}
                  style={{
                    textAlign: 'center',
                    padding: '6px 2px',
                    borderRight: '1px solid #F1F5F9',
                    backgroundColor: sa.day === selectedDay ? '#F0FDFA' : 'transparent'
                  }}
                >
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    backgroundColor: sa.available && sa.count > 0 ? '#16A34A' : '#EF4444'
                  }}>
                    {sa.count}
                  </span>
                </td>
              ))}
            </tr>

            {/* Single Rooms Rows */}
            {singleRoomsOpen && filteredSingleRooms.map(rm => (
              <tr key={rm.number} style={{ borderBottom: '1px solid #F1F5F9', height: '48px' }}>
                {/* Room Number with RoomStatusBadge */}
                <td style={{
                  padding: '8px 16px',
                  borderRight: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        backgroundColor: ROOM_STATUS_MAP[rm.housekeepingStatus]?.dotColor || '#0E94A8'
                      }} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>
                        {rm.number}
                      </span>
                    </div>
                    <RoomStatusBadge
                      roomNumber={rm.number}
                      status={rm.housekeepingStatus}
                      onUpdateStatus={handleUpdateRoomStatus}
                    />
                  </div>
                </td>

                {/* 14 Day Grid Cells */}
                {days.map(d => {
                  const booking = rm.bookings.find(b => d.day >= b.fromDay && d.day <= b.toDay);
                  const isStart = booking && d.day === booking.fromDay;
                  const isTodaySelected = d.day === selectedDay;

                  return (
                    <td
                      key={d.day}
                      onClick={() => !booking && handleCellClick(rm.number, d.day)}
                      style={{
                        padding: '3px 1px',
                        borderRight: isTodaySelected ? '2px solid #0E94A8' : '1px solid #F1F5F9',
                        backgroundColor: isTodaySelected ? '#F0FDFA' : '#FFFFFF',
                        position: 'relative',
                        cursor: booking ? 'default' : 'pointer'
                      }}
                    >
                      {booking ? (
                        <div
                          title={`${booking.guest} (${booking.source})`}
                          style={{
                            height: '34px',
                            backgroundColor: booking.statusColor || '#E6F9E6',
                            borderRadius: isStart ? '6px 0 0 6px' : d.day === booking.toDay ? '0 6px 6px 0' : '0',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: isStart ? '8px' : '2px',
                            overflow: 'hidden',
                            boxShadow: isStart ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                            borderLeft: isStart ? '3px solid #16A34A' : 'none'
                          }}
                        >
                          {isStart && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: booking.statusColor === '#E0F2FE' ? '#0369A1' : '#15803D',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden'
                            }}>
                              {booking.guest}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* ---------------------------------------------------- */}
            {/* DOUBLE ROOMS CATEGORY ROW */}
            {/* ---------------------------------------------------- */}
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderTop: '2px solid #E2E8F0' }}>
              <td
                onClick={() => setDoubleRoomsOpen(!doubleRoomsOpen)}
                style={{
                  padding: '10px 16px',
                  fontWeight: '800',
                  fontSize: '13px',
                  color: '#0F172A',
                  cursor: 'pointer',
                  borderRight: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Double room & Suites</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B' }}>({filteredDoubleRooms.length})</span>
                </div>
                {doubleRoomsOpen ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
              </td>

              {/* Day headers pill representation for double room */}
              {days.map(d => (
                <td key={d.day} style={{ textAlign: 'center', padding: '6px 2px', borderRight: '1px solid #F1F5F9' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    backgroundColor: d.day === 4 || d.day === 6 ? '#EF4444' : '#16A34A'
                  }}>
                    {d.day === 4 || d.day === 6 ? 0 : 2}
                  </span>
                </td>
              ))}
            </tr>

            {/* Double Rooms & Suites Rows */}
            {doubleRoomsOpen && filteredDoubleRooms.map(rm => (
              <tr key={rm.number} style={{ borderBottom: '1px solid #F1F5F9', height: '48px' }}>
                <td style={{
                  padding: '8px 16px',
                  borderRight: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '2px',
                        backgroundColor: ROOM_STATUS_MAP[rm.housekeepingStatus]?.dotColor || '#0E94A8'
                      }} />
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>
                        {rm.number}
                      </span>
                    </div>
                    <RoomStatusBadge
                      roomNumber={rm.number}
                      status={rm.housekeepingStatus}
                      onUpdateStatus={handleUpdateRoomStatus}
                    />
                  </div>
                </td>

                {days.map(d => {
                  const booking = rm.bookings.find(b => d.day >= b.fromDay && d.day <= b.toDay);
                  const isStart = booking && d.day === booking.fromDay;
                  const isTodaySelected = d.day === selectedDay;

                  return (
                    <td
                      key={d.day}
                      onClick={() => !booking && handleCellClick(rm.number, d.day)}
                      style={{
                        padding: '3px 1px',
                        borderRight: isTodaySelected ? '2px solid #0E94A8' : '1px solid #F1F5F9',
                        backgroundColor: isTodaySelected ? '#F0FDFA' : '#FFFFFF',
                        position: 'relative',
                        cursor: booking ? 'default' : 'pointer'
                      }}
                    >
                      {booking && (
                        <div
                          title={`${booking.guest} (${booking.source})`}
                          style={{
                            height: '34px',
                            backgroundColor: booking.statusColor || '#E6F9E6',
                            borderRadius: isStart ? '6px 0 0 6px' : d.day === booking.toDay ? '0 6px 6px 0' : '0',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: isStart ? '8px' : '2px',
                            overflow: 'hidden',
                            borderLeft: isStart ? '3px solid #0E94A8' : 'none'
                          }}
                        >
                          {isStart && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: '#0369A1',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden'
                            }}>
                              {booking.guest}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Zero rooms matching filter fallback */}
            {filteredSingleRooms.length === 0 && filteredDoubleRooms.length === 0 && (
              <tr>
                <td colSpan={15} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                    No rooms currently match status filter: "{statusFilter}"
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                    Click on "All Rooms" on the status legend to display all rooms.
                  </p>
                  <button
                    onClick={() => setStatusFilter('All')}
                    style={{
                      marginTop: '10px',
                      padding: '6px 14px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Filter
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. FRONT DESK ONLINE BOOKING & SCANNED ID KYC MODAL */}
      {/* ---------------------------------------------------- */}
      {isBookingModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="lodgify-card animate-scale-up" style={{
            width: '100%',
            maxWidth: '780px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            borderRadius: '24px',
            backgroundColor: '#FFFFFF',
            position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {bookingType === 'Deal' ? 'Front Desk Package Booking' : 'New Front Desk Reservation & Digital Check-In'}
                  </h2>
                  <span style={{
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}>
                    PMS Engine
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                  Book room stay, attach valid scanned government KYC documents, and issue smart keycard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Success Alert */}
            {bookingSuccessMsg && (
              <div style={{
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <Check size={18} />
                <span>{bookingSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Section 1: Room & Stay Dates */}
              <div style={{
                backgroundColor: '#F8FAFC',
                padding: '18px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  1. Stay Dates & Room Selection
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Room Assignment
                    </label>
                    <select
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    >
                      <optgroup label="Single Rooms (Standard)">
                        {singleRooms.map(r => (
                          <option key={r.number} value={r.number}>Room {r.number} - Single (₹{r.rate}/night)</option>
                        ))}
                      </optgroup>
                      <optgroup label="Double Rooms & Suites">
                        {doubleRooms.map(r => (
                          <option key={r.number} value={r.number}>Room {r.number} - {r.category} (₹{r.rate}/night)</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      value={formData.checkInDate}
                      onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      value={formData.checkOutDate}
                      onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#0E94A8', fontWeight: '700' }}>
                  Total Duration: {nights} {nights === 1 ? 'Night' : 'Nights'} • Base Rate: ₹{baseRate.toLocaleString()}/night
                </div>
              </div>

              {/* Section 2: Guest Details */}
              <div style={{
                backgroundColor: '#F8FAFC',
                padding: '18px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  2. Guest Information
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jonathan Vance"
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. j.vance@company.com"
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Phone / Mobile Number
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 019-2834"
                      value={formData.guestPhone}
                      onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Residential / Permanent Address
                    </label>
                    <input
                      type="text"
                      value={formData.guestAddress}
                      onChange={(e) => setFormData({ ...formData, guestAddress: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Digital KYC & Scanned Image Upload */}
              <div style={{
                backgroundColor: '#F0FDF4',
                padding: '18px',
                borderRadius: '16px',
                border: '1px solid #BBF7D0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} color="#16A34A" />
                    <span>3. Digital KYC & Scanned Document Upload</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#15803D', fontWeight: '700' }}>
                    Government Regulatory Compliant
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Document Type
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    >
                      <option value="Passport">Passport (International)</option>
                      <option value="NationalID">National ID / Aadhaar / SSN</option>
                      <option value="DrivingLicense">Driver's License</option>
                      <option value="VoterID">Government Voter Card</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Document Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. P19284719B"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      className="input-clean"
                      style={{ width: '100%', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Scanned Document Uploader & Presets */}
                <div style={{
                  border: '2px dashed #86EFAC',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  {formData.scannedDocImage ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                        <ShieldCheck size={18} color="#16A34A" />
                        <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>
                          Scanned Document Attached & Verified
                        </span>
                      </div>
                      <img
                        src={formData.scannedDocImage}
                        alt="Scanned KYC Document"
                        style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid #CBD5E1', objectFit: 'cover' }}
                      />
                      <div style={{ marginTop: '8px' }}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, scannedDocImage: null })}
                          style={{
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Remove Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={28} color="#16A34A" style={{ margin: '0 auto 8px auto' }} />
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                        Upload Scanned Identity Document / Image
                      </div>
                      <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0 12px 0' }}>
                        PNG, JPEG, WebP or PDF scanned document (Max 15MB)
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <label style={{
                          backgroundColor: '#0E94A8',
                          color: '#FFFFFF',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <FileText size={14} />
                          <span>Browse Local File</span>
                          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>

                        <button
                          type="button"
                          onClick={handlePresetPassport}
                          disabled={isUploading}
                          style={{
                            backgroundColor: '#E0F2FE',
                            color: '#0369A1',
                            border: '1px solid #BAE6FD',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {isUploading ? 'Attaching...' : 'Attach Sample Passport Scan'}
                        </button>

                        <button
                          type="button"
                          onClick={handlePresetNationalId}
                          disabled={isUploading}
                          style={{
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            border: '1px solid #FDE68A',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          Attach Sample National ID
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Billing & Immediate Check-in */}
              <div style={{
                backgroundColor: '#F8FAFC',
                padding: '18px',
                borderRadius: '16px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  4. Invoicing, GST & Check-In Action
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '14px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Room Rent ({nights} Nights × ₹{baseRate})</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>₹{roomRentTotal.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>GST Slab ({gstRate}%)</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>₹{gstAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Grand Total (Inc. Taxes)</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0E94A8' }}>₹{grandTotal.toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                    <input
                      type="checkbox"
                      checked={formData.immediateCheckIn}
                      onChange={(e) => setFormData({ ...formData, immediateCheckIn: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#0E94A8' }}
                    />
                    <span>Check In Immediately & Issue Keycard (Room Marked Occupied)</span>
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={16} color="#64748B" />
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      style={{ fontSize: '12px', fontWeight: '700', padding: '6px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                    >
                      <option value="CreditCard">Credit Card (Stripe)</option>
                      <option value="Cash">Cash at Counter</option>
                      <option value="UPI">UPI / QR Payment</option>
                      <option value="Corporate">Corporate Direct Bill</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '10px 20px',
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
                    backgroundColor: '#0E94A8',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '10px 24px',
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(14, 148, 168, 0.3)'
                  }}
                >
                  <UserCheck size={16} />
                  <span>{formData.immediateCheckIn ? 'Confirm & Check In Now' : 'Save Confirmed Booking'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. QUICK BOOKING DRAWER (IMAGE 1 & 2 INSPIRATION) */}
      {/* ---------------------------------------------------- */}
      <NewBookingDrawer
        isOpen={isDrawerBookingOpen}
        onClose={() => setIsDrawerBookingOpen(false)}
        onSaveBooking={handleSaveFromDrawer}
      />

    </div>
  );
};

export default CalendarView;
