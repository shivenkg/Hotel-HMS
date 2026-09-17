import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  User, 
  Clock, 
  BedDouble,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { RoomHousekeepingStatus, ROOM_STATUS_MAP } from './RoomStatusLegend';

interface HourlyBookingItem {
  id: string;
  guestName: string;
  roomNumber: string;
  startHour: number; // e.g. 8 for 8:00 AM
  endHour: number;   // e.g. 13 for 1:00 PM
  status: 'Confirmed' | 'Checked-in' | 'Pending';
  color: string;
  textColor: string;
  tags?: string[];
  pax?: number;
}

interface HourlyTimelineViewProps {
  onOpenNewBooking: () => void;
  onSelectBooking?: (booking: HourlyBookingItem) => void;
}

export const HourlyTimelineView: React.FC<HourlyTimelineViewProps> = ({
  onOpenNewBooking,
  onSelectBooking
}) => {
  const [selectedDateText, setSelectedDateText] = useState('Fri, Sep 18');
  
  // Hours from 07:00 AM to 18:00 PM as shown in Image 2
  const hours = [
    { hour: 7, label: '07:00 AM' },
    { hour: 8, label: '08:00 AM' },
    { hour: 9, label: '09:00 AM' },
    { hour: 10, label: '10:00 AM' },
    { hour: 11, label: '11:00 AM' },
    { hour: 12, label: '12:00 PM' },
    { hour: 13, label: '13:00 PM' },
    { hour: 14, label: '14:00 PM' },
    { hour: 15, label: '15:00 PM' },
    { hour: 16, label: '16:00 PM' },
    { hour: 17, label: '17:00 PM' },
    { hour: 18, label: '18:00 PM' }
  ];

  // Room Columns matching user mockup
  const rooms = [
    { number: '101', name: 'Room 1', category: 'Single', status: 'Clean' as RoomHousekeepingStatus },
    { number: '102', name: 'Room 2', category: 'Single', status: 'Dirty' as RoomHousekeepingStatus },
    { number: '103', name: 'Room 3', category: 'Single', status: 'Clean' as RoomHousekeepingStatus },
    { number: '104', name: 'Room 4', category: 'Single', status: 'Dirty' as RoomHousekeepingStatus },
    { number: '105', name: 'Room 5', category: 'Single', status: 'Clean' as RoomHousekeepingStatus },
    { number: '106', name: 'Room 6', category: 'Single', status: 'Maintenance' as RoomHousekeepingStatus },
    { number: '107', name: 'Room 7', category: 'Single', status: 'Clean' as RoomHousekeepingStatus },
    { number: '108', name: 'Room 8', category: 'Single', status: 'OutOfOrder' as RoomHousekeepingStatus }
  ];

  // Hourly Bookings inspired by Image 2 cards
  const hourlyBookings: HourlyBookingItem[] = [
    {
      id: 'hb-1',
      guestName: 'Eleanor Pena',
      roomNumber: '101',
      startHour: 8,
      endHour: 11,
      status: 'Confirmed',
      color: '#E0F2FE',
      textColor: '#0369A1',
      tags: ['Corporate', 'VIP'],
      pax: 2
    },
    {
      id: 'hb-2',
      guestName: 'Arlene McCoy',
      roomNumber: '101',
      startHour: 13,
      endHour: 16,
      status: 'Checked-in',
      color: '#DCFCE7',
      textColor: '#15803D',
      tags: ['Direct'],
      pax: 1
    },
    {
      id: 'hb-3',
      guestName: 'Bessie Cooper',
      roomNumber: '102',
      startHour: 9,
      endHour: 14,
      status: 'Confirmed',
      color: '#FEF3C7',
      textColor: '#92400E',
      tags: ['Expedia'],
      pax: 2
    },
    {
      id: 'hb-4',
      guestName: 'Guy Hawkins',
      roomNumber: '103',
      startHour: 10,
      endHour: 17,
      status: 'Checked-in',
      color: '#DCFCE7',
      textColor: '#15803D',
      tags: ['Booking.com'],
      pax: 1
    },
    {
      id: 'hb-5',
      guestName: 'Devon Lane',
      roomNumber: '104',
      startHour: 8,
      endHour: 12,
      status: 'Confirmed',
      color: '#E0F2FE',
      textColor: '#0369A1',
      tags: ['Airbnb'],
      pax: 3
    },
    {
      id: 'hb-6',
      guestName: 'Courtney Henry',
      roomNumber: '105',
      startHour: 11,
      endHour: 15,
      status: 'Checked-in',
      color: '#FEE2E2',
      textColor: '#991B1B',
      tags: ['Walk-in'],
      pax: 1
    },
    {
      id: 'hb-7',
      guestName: 'Kathryn Murphy',
      roomNumber: '107',
      startHour: 12,
      endHour: 18,
      status: 'Confirmed',
      color: '#EDE9FE',
      textColor: '#6D28D9',
      tags: ['Direct Bill'],
      pax: 2
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header Bar matching Image 2 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '12px 20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Hourly Bookings Schedule
          </h2>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            backgroundColor: '#F1F5F9',
            color: '#475569',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            Daily Timeline View
          </span>
        </div>

        {/* Date Navigator: < Fri, Sep 18 > */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#F8FAFC',
          padding: '4px 10px',
          borderRadius: '10px',
          border: '1px solid #E2E8F0'
        }}>
          <button
            onClick={() => setSelectedDateText('Thu, Sep 17')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#0F172A',
            padding: '2px 6px'
          }}>
            <CalendarIcon size={14} color="#0E94A8" />
            <span>{selectedDateText}</span>
          </div>

          <button
            onClick={() => setSelectedDateText('Sat, Sep 19')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Action Button matching Image 2 "+ Booking Room" */}
        <button
          onClick={onOpenNewBooking}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '700',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={15} />
          <span>+ Booking Room</span>
        </button>
      </div>

      {/* Hourly Matrix Table matching Image 2 layout */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        overflowX: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '980px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {/* Room Column Header */}
              <th style={{
                width: '150px',
                padding: '12px 16px',
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: '800',
                color: '#0F172A',
                borderRight: '1px solid #E2E8F0',
                position: 'sticky',
                left: 0,
                backgroundColor: '#F8FAFC',
                zIndex: 10
              }}>
                Room
              </th>

              {/* Time Slot Columns */}
              {hours.map(h => (
                <th
                  key={h.hour}
                  style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#64748B',
                    borderRight: '1px solid #F1F5F9',
                    minWidth: '90px'
                  }}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rooms.map(rm => {
              const statusCfg = ROOM_STATUS_MAP[rm.status];
              const roomBookings = hourlyBookings.filter(b => b.roomNumber === rm.number);

              return (
                <tr key={rm.number} style={{ borderBottom: '1px solid #F1F5F9', height: '62px' }}>
                  
                  {/* Room Label & Status Pill */}
                  <td style={{
                    padding: '10px 16px',
                    borderRight: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    position: 'sticky',
                    left: 0,
                    zIndex: 9
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                        {rm.name}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        backgroundColor: statusCfg.bgColor,
                        color: statusCfg.textColor,
                        border: `1px solid ${statusCfg.borderColor}`,
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                      {rm.category} • #{rm.number}
                    </div>
                  </td>

                  {/* Hourly Grid Cells with Dynamic Booking Block Spans */}
                  {hours.map(h => {
                    // Check if this hour is covered by a booking starting here
                    const startingBooking = roomBookings.find(b => b.startHour === h.hour);
                    const isOccupiedHour = roomBookings.some(b => h.hour >= b.startHour && h.hour < b.endHour);

                    return (
                      <td
                        key={h.hour}
                        style={{
                          padding: '3px 2px',
                          borderRight: '1px solid #F1F5F9',
                          backgroundColor: '#FFFFFF',
                          position: 'relative',
                          verticalAlign: 'middle'
                        }}
                      >
                        {startingBooking ? (
                          <div
                            onClick={() => onSelectBooking && onSelectBooking(startingBooking)}
                            style={{
                              backgroundColor: startingBooking.color,
                              color: startingBooking.textColor,
                              borderRadius: '8px',
                              padding: '6px 8px',
                              borderLeft: `3px solid ${startingBooking.textColor}`,
                              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                              cursor: 'pointer',
                              position: 'relative',
                              zIndex: 2,
                              transition: 'transform 0.1s ease',
                              margin: '0 2px'
                            }}
                            title={`${startingBooking.guestName} (${startingBooking.startHour}:00 - ${startingBooking.endHour}:00)`}
                          >
                            <div style={{ fontSize: '11px', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {startingBooking.guestName}
                            </div>
                            <div style={{ fontSize: '10px', opacity: 0.85, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <Clock size={10} />
                              <span>{startingBooking.startHour}:00 - {startingBooking.endHour}:00</span>
                            </div>
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
