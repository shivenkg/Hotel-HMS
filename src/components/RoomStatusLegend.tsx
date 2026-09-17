import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Ban, 
  BedDouble, 
  UserCheck, 
  Filter, 
  Info, 
  RotateCcw,
  Check,
  ChevronDown
} from 'lucide-react';

export type RoomHousekeepingStatus = 'Clean' | 'Dirty' | 'Maintenance' | 'OutOfOrder';

export interface RoomStatusConfigItem {
  id: RoomHousekeepingStatus;
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  icon: React.ComponentType<{ size: number; color?: string; className?: string; style?: React.CSSProperties }>;
}

export const ROOM_STATUS_MAP: Record<RoomHousekeepingStatus, RoomStatusConfigItem> = {
  Clean: {
    id: 'Clean',
    label: 'Clean',
    dotColor: '#10B981',
    bgColor: '#DCFCE7',
    textColor: '#15803D',
    borderColor: '#86EFAC',
    description: 'Sanitized, inspected & ready for immediate guest check-in',
    icon: CheckCircle2
  },
  Dirty: {
    id: 'Dirty',
    label: 'Dirty',
    dotColor: '#EF4444',
    bgColor: '#FEE2E2',
    textColor: '#B91C1C',
    borderColor: '#FCA5A5',
    description: 'Turnover required — linens, bathroom sanitization pending',
    icon: AlertCircle
  },
  Maintenance: {
    id: 'Maintenance',
    label: 'Maintenance',
    dotColor: '#F59E0B',
    bgColor: '#FEF3C7',
    textColor: '#B45309',
    borderColor: '#FCD34D',
    description: 'Engineering work order — plumbing, electrical or HVAC repair',
    icon: Wrench
  },
  OutOfOrder: {
    id: 'OutOfOrder',
    label: 'Out-of-Order',
    dotColor: '#64748B',
    bgColor: '#F1F5F9',
    textColor: '#334155',
    borderColor: '#CBD5E1',
    description: 'Out of service — structural repair, painting or deep overhaul',
    icon: Ban
  }
};

interface RoomStatusLegendProps {
  statusCounts: {
    clean: number;
    dirty: number;
    maintenance: number;
    outOfOrder: number;
    occupied: number;
    vacant: number;
    total: number;
  };
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
  showDescriptions?: boolean;
}

export const RoomStatusLegend: React.FC<RoomStatusLegendProps> = ({
  statusCounts,
  activeFilter,
  onSelectFilter,
  showDescriptions = false
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const legendItems: Array<{
    id: string;
    label: string;
    count: number;
    dotColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    desc: string;
  }> = [
    {
      id: 'All',
      label: 'All Rooms',
      count: statusCounts.total,
      dotColor: '#0F172A',
      bgColor: '#F8FAFC',
      textColor: '#0F172A',
      borderColor: '#E2E8F0',
      desc: 'View all inventory rooms'
    },
    {
      id: 'Clean',
      label: 'Clean',
      count: statusCounts.clean,
      dotColor: '#10B981',
      bgColor: '#DCFCE7',
      textColor: '#15803D',
      borderColor: '#86EFAC',
      desc: 'Guest-ready & sanitized'
    },
    {
      id: 'Dirty',
      label: 'Dirty',
      count: statusCounts.dirty,
      dotColor: '#EF4444',
      bgColor: '#FEE2E2',
      textColor: '#B91C1C',
      borderColor: '#FCA5A5',
      desc: 'Housekeeping turnover needed'
    },
    {
      id: 'Maintenance',
      label: 'Maintenance',
      count: statusCounts.maintenance,
      dotColor: '#F59E0B',
      bgColor: '#FEF3C7',
      textColor: '#B45309',
      borderColor: '#FCD34D',
      desc: 'Active maintenance work order'
    },
    {
      id: 'OutOfOrder',
      label: 'Out-of-Order',
      count: statusCounts.outOfOrder,
      dotColor: '#64748B',
      bgColor: '#F1F5F9',
      textColor: '#334155',
      borderColor: '#CBD5E1',
      desc: 'Out of inventory / renovation'
    },
    {
      id: 'Occupied',
      label: 'Occupied',
      count: statusCounts.occupied,
      dotColor: '#0E94A8',
      bgColor: '#E0F2FE',
      textColor: '#0369A1',
      borderColor: '#BAE6FD',
      desc: 'In-house guest staying'
    },
    {
      id: 'Vacant',
      label: 'Vacant',
      count: statusCounts.vacant,
      dotColor: '#3B82F6',
      bgColor: '#EBF3FB',
      textColor: '#1E40AF',
      borderColor: '#BFDBFE',
      desc: 'Ready for new arrivals'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1px solid #E2E8F0',
      padding: '12px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* Top Header: Title + Toggle Description + Active Filter reset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Filter size={12} color="#64748B" />
            Room Status Legend & Quick Filter
          </span>
          {activeFilter !== 'All' && (
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              padding: '1px 8px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Filtered by: {activeFilter}
              <button 
                onClick={() => onSelectFilter('All')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#92400E' }}
                title="Clear filter"
              >
                ×
              </button>
            </span>
          )}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#0E94A8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 6px'
          }}
        >
          <Info size={13} />
          <span>{showDetails ? 'Hide Status Details' : 'Status Guide & Meanings'}</span>
        </button>
      </div>

      {/* Interactive Color-Coded Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        {legendItems.map((item) => {
          const isSelected = activeFilter === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectFilter(isSelected && item.id !== 'All' ? 'All' : item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '5px 11px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: isSelected ? '800' : '600',
                border: isSelected ? `1.5px solid ${item.dotColor}` : `1px solid ${item.borderColor}`,
                backgroundColor: isSelected ? item.bgColor : '#FFFFFF',
                color: item.textColor,
                cursor: 'pointer',
                boxShadow: isSelected ? `0 2px 6px ${item.dotColor}25` : '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
              title={`Filter by ${item.label} (${item.desc})`}
            >
              {/* Color Dot Indicator */}
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: item.dotColor,
                  display: 'inline-block',
                  flexShrink: 0
                }}
              />
              <span>{item.label}</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  backgroundColor: isSelected ? '#FFFFFF' : item.bgColor,
                  color: item.textColor,
                  border: `1px solid ${item.borderColor}`
                }}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded Status Meanings Drawer / Guide */}
      {showDetails && (
        <div style={{
          marginTop: '4px',
          paddingTop: '10px',
          borderTop: '1px solid #F1F5F9',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '8px'
        }}>
          {Object.values(ROOM_STATUS_MAP).map(status => (
            <div 
              key={status.id}
              style={{
                backgroundColor: status.bgColor,
                border: `1px solid ${status.borderColor}`,
                borderRadius: '8px',
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              <status.icon size={16} color={status.dotColor} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: status.textColor }}>
                  {status.label}
                </div>
                <div style={{ fontSize: '10px', color: status.textColor, opacity: 0.9, marginTop: '2px', lineHeight: 1.3 }}>
                  {status.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Quick Status Badge Component with interactive dropdown to switch status inline
interface RoomStatusBadgeProps {
  roomNumber: string;
  status: RoomHousekeepingStatus;
  onUpdateStatus: (roomNumber: string, newStatus: RoomHousekeepingStatus) => void;
}

export const RoomStatusBadge: React.FC<RoomStatusBadgeProps> = ({
  roomNumber,
  status,
  onUpdateStatus
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = ROOM_STATUS_MAP[status] || ROOM_STATUS_MAP.Clean;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 7px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '700',
          backgroundColor: currentConfig.bgColor,
          color: currentConfig.textColor,
          border: `1px solid ${currentConfig.borderColor}`,
          cursor: 'pointer',
          transition: 'transform 0.1s ease',
          lineHeight: 1.2
        }}
        title={`Click to update room status (Currently: ${currentConfig.label})`}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: currentConfig.dotColor
          }}
        />
        <span>{currentConfig.label}</span>
        <ChevronDown size={11} />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
          />
          <div style={{
            position: 'absolute',
            top: '24px',
            left: 0,
            zIndex: 999,
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            padding: '4px',
            minWidth: '160px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: '800',
              color: '#64748B',
              padding: '4px 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              borderBottom: '1px solid #F1F5F9'
            }}>
              Room {roomNumber} Status
            </div>

            {(['Clean', 'Dirty', 'Maintenance', 'OutOfOrder'] as RoomHousekeepingStatus[]).map((st) => {
              const opt = ROOM_STATUS_MAP[st];
              const isCurrent = status === st;
              return (
                <button
                  key={st}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(roomNumber, st);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isCurrent ? opt.bgColor : 'transparent',
                    color: opt.textColor,
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '700',
                    textAlign: 'left',
                    transition: 'background 0.1s ease'
                  }}
                  className="hover:bg-slate-50"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: opt.dotColor
                      }}
                    />
                    <span>{opt.label}</span>
                  </div>
                  {isCurrent && <Check size={12} color={opt.textColor} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
