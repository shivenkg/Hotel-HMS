import React, { useState, useEffect, useCallback } from 'react';
import { 
  BedDouble, 
  Check, 
  X, 
  Key, 
  Wrench, 
  Plus, 
  Smartphone, 
  ClipboardList, 
  CheckCircle2,
  RefreshCw,
  ArrowLeftRight,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export interface HousekeepingRow {
  id: string;
  room: string;
  roomType: 'Deluxe' | 'Suite' | 'Standard';
  status: 'Clean' | 'Dirty' | 'Inspected' | 'Under Maintenance' | 'In Process' | 'Repair';
  availability: 'Available' | 'Cancel' | 'Occupied' | 'Out of Order';
  name: string;
  remarks: string;
}

interface MaintenanceOrder {
  id: string;
  roomNumber: string;
  issue: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Furniture' | 'Keycard' | 'Security';
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  reportedBy: string;
  assignedTo: string;
  status: 'Reported' | 'InProgress' | 'Resolved';
  remarks?: string;
  createdAt: string;
}

export const HousekeepingView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'table' | 'maintenance' | 'mobile'>('table');
  const [viewFilter, setViewFilter] = useState<'All rooms' | 'Dirty' | 'Clean' | 'Inspected' | 'In Process' | 'Under Maintenance' | 'Repair'>('All rooms');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [statusUpdatingRoom, setStatusUpdatingRoom] = useState<string | null>(null);

  // Initial Rooms state matching image & backend
  const [rows, setRows] = useState<HousekeepingRow[]>([
    { id: 'hk-1', room: '101', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Daniel Hamilton', remarks: '...' },
    { id: 'hk-2', room: '102', roomType: 'Deluxe', status: 'In Process', availability: 'Cancel', name: 'Corina McCoy', remarks: '...' },
    { id: 'hk-3', room: '103', roomType: 'Deluxe', status: 'Clean', availability: 'Occupied', name: 'Dennis Callis', remarks: '...' },
    { id: 'hk-4', room: '104', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Katie Sims', remarks: 'Bar is totally empty' },
    { id: 'hk-5', room: '105', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Jerry Helfer', remarks: '...' },
    { id: 'hk-6', room: '106', roomType: 'Deluxe', status: 'Dirty', availability: 'Cancel', name: 'Chris Glasser', remarks: '...' },
    { id: 'hk-7', room: '107', roomType: 'Deluxe', status: 'Inspected', availability: 'Occupied', name: 'Paula Mora', remarks: 'Supervisor inspected & approved' },
    { id: 'hk-8', room: '108', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Alex Buckmaster', remarks: 'Broken lamp' },
    { id: 'hk-9', room: '109', roomType: 'Deluxe', status: 'Clean', availability: 'Occupied', name: 'Rhonda Rhodes', remarks: '...' },
    { id: 'hk-10', room: '110', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'David Elson', remarks: '...' },
    { id: 'hk-11', room: 'Suite1', roomType: 'Suite', status: 'In Process', availability: 'Available', name: 'Joshua Jones', remarks: '...' },
    { id: 'hk-12', room: 'Suite2', roomType: 'Suite', status: 'Dirty', availability: 'Cancel', name: 'Kimberly Mastrangelo', remarks: 'Missed things. Need security' },
    { id: 'hk-13', room: 'Suite3', roomType: 'Suite', status: 'Inspected', availability: 'Occupied', name: 'Judith Rodriguez', remarks: 'VIP inspected & fruit basket placed' }
  ]);

  // Maintenance Work Orders state
  const [maintenanceOrders, setMaintenanceOrders] = useState<MaintenanceOrder[]>([
    { id: 'mwo-1', roomNumber: '108', issue: 'Broken bedside reading lamp & switch', category: 'Electrical', priority: 'Medium', reportedBy: 'Priya Sharma (Housekeeper)', assignedTo: 'Vikram Singh (Tech)', status: 'InProgress', remarks: 'Replacement bulb & socket dispatched', createdAt: '2026-09-16 09:30' },
    { id: 'mwo-2', roomNumber: '104', issue: 'Minibar completely empty, requires restocking', category: 'Furniture', priority: 'Medium', reportedBy: 'Front Desk', assignedTo: 'Ramesh Kumar (F&B Runner)', status: 'Reported', remarks: 'Bar is totally empty', createdAt: '2026-09-16 10:45' },
    { id: 'mwo-3', roomNumber: 'Suite2', issue: 'Guest reported missing items & requested security verification', category: 'Security', priority: 'High', reportedBy: 'Kimberly Mastrangelo', assignedTo: 'Rajesh Menon (GM) & Security', status: 'Reported', remarks: 'Missed things. Need security', createdAt: '2026-09-16 11:20' },
    { id: 'mwo-4', roomNumber: '205', issue: 'Digital AC thermostat sensor error #E-04', category: 'HVAC', priority: 'High', reportedBy: 'System Auto-Alert', assignedTo: 'Vikram Singh (Tech)', status: 'InProgress', remarks: 'Compressor calibration required', createdAt: '2026-09-16 08:15' }
  ]);

  // Modal State for New Maintenance Ticket
  const [isNewOrderModal, setIsNewOrderModal] = useState(false);
  const [newOrderForm, setNewOrderForm] = useState({
    roomNumber: '108',
    issue: '',
    category: 'Electrical' as MaintenanceOrder['category'],
    priority: 'Medium' as MaintenanceOrder['priority'],
    reportedBy: 'Housekeeper Mobile App',
    remarks: ''
  });

  // --------------------------------------------------------------------------
  // Instant Auto-Refresh & Global Data Synchronization Engine
  // --------------------------------------------------------------------------
  const fetchHousekeepingData = useCallback(async () => {
    try {
      setIsLiveSyncing(true);
      const [roomsRes, tasksRes] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/housekeeping/tasks')
      ]);

      if (roomsRes.ok && tasksRes.ok) {
        const roomsData = await roomsRes.json();
        const tasksData = await tasksRes.json();

        if (Array.isArray(roomsData) && roomsData.length > 0) {
          setRows(prevRows => {
            return roomsData.map((rm: any) => {
              const existingRow = prevRows.find(pr => pr.room === rm.roomNumber);
              const matchingTask = Array.isArray(tasksData) 
                ? tasksData.find((t: any) => t.roomNumber === rm.roomNumber || t.roomId === rm.id)
                : null;

              // Determine status from room and task
              let status: HousekeepingRow['status'] = 'Clean';
              if (rm.status === 'OutOfOrder') {
                status = 'Under Maintenance';
              } else if (rm.status === 'Dirty') {
                status = 'Dirty';
              } else if (rm.status === 'Cleaning') {
                status = 'In Process';
              } else if (matchingTask?.cleanStatus) {
                if (matchingTask.cleanStatus === 'Repair' || matchingTask.cleanStatus === 'Under Maintenance') {
                  status = 'Under Maintenance';
                } else {
                  status = matchingTask.cleanStatus;
                }
              } else if (rm.status === 'Inspected') {
                status = 'Inspected';
              } else if (rm.status === 'Available') {
                status = 'Clean';
              } else if (rm.status === 'Occupied') {
                status = existingRow?.status || 'Clean';
              }

              let availability: HousekeepingRow['availability'] = 'Available';
              if (status === 'Under Maintenance' || rm.status === 'OutOfOrder') {
                availability = 'Out of Order';
              } else if (rm.status === 'Occupied' || (rm.currentGuest && rm.currentGuest.trim() !== '')) {
                availability = 'Occupied';
              } else if (existingRow?.availability === 'Cancel') {
                availability = 'Cancel';
              }

              return {
                id: existingRow?.id || matchingTask?.id || `hk-${rm.roomNumber}`,
                room: rm.roomNumber,
                roomType: (rm.category === 'Deluxe' ? 'Deluxe' : (rm.category || '').includes('Suite') ? 'Suite' : 'Standard') as any,
                status,
                availability,
                name: rm.currentGuest || matchingTask?.guestName || existingRow?.name || 'Vacant',
                remarks: matchingTask?.remarks || existingRow?.remarks || '...'
              };
            });
          });
          setLastSyncTime(new Date());
        }
      }
    } catch (err) {
      console.warn('Live housekeeping auto-refresh notice', err);
    } finally {
      setIsLiveSyncing(false);
    }
  }, []);

  // Periodic polling & event-driven auto-refresh
  useEffect(() => {
    // Initial fetch on mount
    void fetchHousekeepingData();

    // High-frequency live polling (every 3.5 seconds) for instant background updates
    const autoRefreshTimer = setInterval(() => {
      void fetchHousekeepingData();
    }, 3500);

    // Event listener for instant cross-component updates
    const handleGlobalUpdate = () => {
      void fetchHousekeepingData();
    };
    window.addEventListener('hms:room-status-changed', handleGlobalUpdate);
    window.addEventListener('hms:rooms-updated', handleGlobalUpdate);

    return () => {
      clearInterval(autoRefreshTimer);
      window.removeEventListener('hms:room-status-changed', handleGlobalUpdate);
      window.removeEventListener('hms:rooms-updated', handleGlobalUpdate);
    };
  }, [fetchHousekeepingData]);

  // --------------------------------------------------------------------------
  // Quick-Action Toggle Button Implementation
  // Sets room to 'Clean', 'Dirty', or 'Under Maintenance' with instant auto-refresh
  // --------------------------------------------------------------------------
  const handleQuickActionStatus = async (roomNumber: string, nextStatus: 'Clean' | 'Dirty' | 'Inspected' | 'Under Maintenance') => {
    // 1. Optimistic Instant Local State Update (0ms latency)
    setStatusUpdatingRoom(roomNumber);
    setTimeout(() => setStatusUpdatingRoom(null), 600);

    setRows(prev => prev.map(r => {
      if (r.room === roomNumber) {
        let newAvailability: HousekeepingRow['availability'] = r.availability;
        if (nextStatus === 'Under Maintenance') {
          newAvailability = 'Out of Order';
        } else if (nextStatus === 'Clean' || nextStatus === 'Inspected') {
          newAvailability = (r.availability === 'Occupied' || (r.name && r.name !== 'Vacant')) ? 'Occupied' : 'Available';
        } else if (nextStatus === 'Dirty') {
          newAvailability = r.availability === 'Occupied' ? 'Occupied' : 'Available';
        }
        return {
          ...r,
          status: nextStatus,
          availability: newAvailability
        };
      }
      return r;
    }));

    // 2. Broadcast instant global room state event
    window.dispatchEvent(new CustomEvent('hms:room-status-changed', {
      detail: { roomNumber, status: nextStatus }
    }));
    window.dispatchEvent(new CustomEvent('hms:rooms-updated', {
      detail: { roomNumber, status: nextStatus }
    }));

    // 3. Instant synchronization with backend endpoints
    const mappedRoomStatus = nextStatus === 'Under Maintenance' ? 'OutOfOrder' : nextStatus;
    try {
      await Promise.allSettled([
        fetch(`/api/housekeeping/tasks/${roomNumber}/clean-status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cleanStatus: nextStatus })
        }),
        fetch(`/api/rooms/${roomNumber}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: mappedRoomStatus })
        })
      ]);
      setLastSyncTime(new Date());
    } catch (err) {
      console.warn('Backend status synchronization error', err);
    }
  };

  // Quick-action cycle toggle: Dirty -> Clean -> Inspected -> Under Maintenance -> Dirty
  const handleToggleStatusCycle = (roomNumber: string) => {
    const row = rows.find(r => r.room === roomNumber);
    if (!row) return;

    const cycleMap: Record<string, 'Clean' | 'Dirty' | 'Inspected' | 'Under Maintenance'> = {
      'Dirty': 'Clean',
      'Clean': 'Inspected',
      'Inspected': 'Under Maintenance',
      'Under Maintenance': 'Dirty',
      'Repair': 'Dirty',
      'In Process': 'Clean'
    };

    const next = cycleMap[row.status] || 'Clean';
    void handleQuickActionStatus(roomNumber, next);
  };

  // Batch Quick Actions for selected rooms
  const handleBatchUpdateStatus = async (targetStatus: 'Clean' | 'Dirty' | 'Inspected' | 'Under Maintenance') => {
    if (selectedRooms.length === 0) return;
    const roomsToUpdate = [...selectedRooms];

    // Optimistic batch update
    setRows(prev => prev.map(r => {
      if (roomsToUpdate.includes(r.room)) {
        let newAvailability: HousekeepingRow['availability'] = r.availability;
        if (targetStatus === 'Under Maintenance') {
          newAvailability = 'Out of Order';
        } else if (targetStatus === 'Clean' || targetStatus === 'Inspected') {
          newAvailability = (r.availability === 'Occupied' || (r.name && r.name !== 'Vacant')) ? 'Occupied' : 'Available';
        }
        return { ...r, status: targetStatus, availability: newAvailability };
      }
      return r;
    }));

    // Broadcast global updates
    roomsToUpdate.forEach(rm => {
      window.dispatchEvent(new CustomEvent('hms:room-status-changed', {
        detail: { roomNumber: rm, status: targetStatus }
      }));
    });
    window.dispatchEvent(new CustomEvent('hms:rooms-updated', {
      detail: { count: roomsToUpdate.length }
    }));

    // Backend sync in parallel
    const mappedStatus = targetStatus === 'Under Maintenance' ? 'OutOfOrder' : targetStatus;
    await Promise.allSettled(
      roomsToUpdate.flatMap(rm => [
        fetch(`/api/housekeeping/tasks/${rm}/clean-status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cleanStatus: targetStatus })
        }),
        fetch(`/api/rooms/${rm}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: mappedStatus })
        })
      ])
    );

    setSelectedRooms([]);
    setLastSyncTime(new Date());
  };

  // Selection handlers
  const handleToggleSelect = (room: string) => {
    setSelectedRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const handleSelectAll = () => {
    if (selectedRooms.length === rows.length) {
      setSelectedRooms([]);
    } else {
      setSelectedRooms(rows.map(r => r.room));
    }
  };

  // Create new work order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.issue) return;

    const newOrder: MaintenanceOrder = {
      id: `mwo-${Date.now()}`,
      roomNumber: newOrderForm.roomNumber,
      issue: newOrderForm.issue,
      category: newOrderForm.category,
      priority: newOrderForm.priority,
      reportedBy: newOrderForm.reportedBy,
      assignedTo: 'Vikram Singh (Tech)',
      status: 'Reported',
      remarks: newOrderForm.remarks,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setMaintenanceOrders([newOrder, ...maintenanceOrders]);
    setIsNewOrderModal(false);
    setNewOrderForm({
      roomNumber: '108',
      issue: '',
      category: 'Electrical',
      priority: 'Medium',
      reportedBy: 'Housekeeper Mobile App',
      remarks: ''
    });

    fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});
  };

  // Resolve work order
  const handleResolveOrder = (id: string) => {
    setMaintenanceOrders(prev => prev.map(m => {
      if (m.id === id) {
        fetch(`/api/maintenance/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Resolved' })
        }).catch(() => {});
        return { ...m, status: 'Resolved' as const };
      }
      return m;
    }));
  };

  // Filtered rows
  const filteredRows = viewFilter === 'All rooms' 
    ? rows 
    : viewFilter === 'Under Maintenance'
    ? rows.filter(r => r.status === 'Under Maintenance' || r.status === 'Repair')
    : rows.filter(r => r.status === viewFilter);

  // Dynamic Live Counts from rows
  const maintenanceCount = rows.filter(r => r.status === 'Under Maintenance' || r.status === 'Repair').length;
  const inProcessCount = rows.filter(r => r.status === 'In Process').length;
  const cleanCount = rows.filter(r => r.status === 'Clean').length;
  const dirtyCount = rows.filter(r => r.status === 'Dirty').length;
  const inspectedCount = rows.filter(r => r.status === 'Inspected').length;

  return (
    <div className="animate-fade-in responsive-view-container">
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER & VIEW TOGGLES */}
      {/* ---------------------------------------------------- */}
      <div className="responsive-action-header" style={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{
            fontSize: 'clamp(20px, 2.5vw, 24px)',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.3px',
            margin: 0
          }}>
            Housekeeping
          </h1>

          {/* Instant Auto-Refresh Live Status Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '3px 10px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#065F46'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
            }} />
            <span>Auto-Refresh Active</span>
            <span style={{ color: '#059669', fontSize: '10px', opacity: 0.9, marginLeft: '2px' }}>
              ({lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
            </span>
          </div>

          <button
            id="manual-instant-refresh-btn"
            onClick={() => void fetchHousekeepingData()}
            title="Trigger instant auto-refresh"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              borderRadius: '8px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'background 0.15s ease'
            }}
          >
            <RefreshCw size={13} className={isLiveSyncing ? 'animate-spin' : ''} />
            <span>Sync Now</span>
          </button>
        </div>

        {/* View Tabs & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Sub-Tabs: Table, Maintenance, Mobile App */}
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
            <button
              id="view-tab-table"
              onClick={() => setSelectedTab('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                backgroundColor: selectedTab === 'table' ? '#FFFFFF' : 'transparent',
                color: selectedTab === 'table' ? '#0F172A' : '#64748B',
                fontWeight: selectedTab === 'table' ? '700' : '600',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: selectedTab === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <ClipboardList size={14} />
              <span>Room Status</span>
            </button>

            <button
              id="view-tab-maintenance"
              onClick={() => setSelectedTab('maintenance')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                backgroundColor: selectedTab === 'maintenance' ? '#FFFFFF' : 'transparent',
                color: selectedTab === 'maintenance' ? '#0F172A' : '#64748B',
                fontWeight: selectedTab === 'maintenance' ? '700' : '600',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: selectedTab === 'maintenance' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Wrench size={14} />
              <span>Maintenance ({maintenanceOrders.filter(m => m.status !== 'Resolved').length})</span>
            </button>

            <button
              id="view-tab-mobile"
              onClick={() => setSelectedTab('mobile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                backgroundColor: selectedTab === 'mobile' ? '#FFFFFF' : 'transparent',
                color: selectedTab === 'mobile' ? '#0F172A' : '#64748B',
                fontWeight: selectedTab === 'mobile' ? '700' : '600',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: selectedTab === 'mobile' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Smartphone size={14} />
              <span>Mobile Attendant App</span>
            </button>
          </div>

          {/* Filter Reset Button */}
          <button
            id="filter-reset-btn"
            onClick={() => setViewFilter('All rooms')}
            style={{
              backgroundColor: viewFilter === 'All rooms' ? '#0E94A8' : '#FFFFFF',
              border: '1.5px solid #0E94A8',
              color: viewFilter === 'All rooms' ? '#FFFFFF' : '#0E94A8',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            All Rooms
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. DYNAMIC STATS & VIEW BY DROPDOWN */}
      {/* ---------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* 4 Interactive Stat Cards (Live Auto-Refreshing Counts) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* UNDER MAINTENANCE / REPAIR */}
          <div 
            id="stat-card-maintenance"
            onClick={() => setViewFilter(viewFilter === 'Under Maintenance' ? 'All rooms' : 'Under Maintenance')}
            style={{
              backgroundColor: viewFilter === 'Under Maintenance' ? '#DBEAFE' : '#EBF3FB',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '120px',
              border: viewFilter === 'Under Maintenance' ? '2px solid #2563EB' : '1px solid #D6E8F9',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Filter by Under Maintenance rooms"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#1E40AF', letterSpacing: '0.5px' }}>
              UNDER MAINTENANCE
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <Wrench size={18} color="#2563EB" />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E40AF' }}>{maintenanceCount}</span>
            </div>
          </div>

          {/* IN PROCESS */}
          <div 
            id="stat-card-inprocess"
            onClick={() => setViewFilter(viewFilter === 'In Process' ? 'All rooms' : 'In Process')}
            style={{
              backgroundColor: viewFilter === 'In Process' ? '#FEF3C7' : '#FFFBEB',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: viewFilter === 'In Process' ? '2px solid #D97706' : '1px solid #FDE68A',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Filter by In Process rooms"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#B45309', letterSpacing: '0.5px' }}>
              IN PROCESS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <BedDouble size={18} color="#D97706" />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#B45309' }}>{inProcessCount}</span>
            </div>
          </div>

          {/* CLEAN */}
          <div 
            id="stat-card-clean"
            onClick={() => setViewFilter(viewFilter === 'Clean' ? 'All rooms' : 'Clean')}
            style={{
              backgroundColor: viewFilter === 'Clean' ? '#DCFCE7' : '#EDFAF1',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: viewFilter === 'Clean' ? '2px solid #16A34A' : '1px solid #C9F2D5',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Filter by Clean rooms"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#15803D', letterSpacing: '0.5px' }}>
              CLEAN
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <Check size={18} color="#16A34A" strokeWidth={3} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#166534' }}>{cleanCount}</span>
            </div>
          </div>

          {/* DIRTY */}
          <div 
            id="stat-card-dirty"
            onClick={() => setViewFilter(viewFilter === 'Dirty' ? 'All rooms' : 'Dirty')}
            style={{
              backgroundColor: viewFilter === 'Dirty' ? '#FEE2E2' : '#FDF0F0',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: viewFilter === 'Dirty' ? '2px solid #DC2626' : '1px solid #FCD4D4',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Filter by Dirty rooms"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#B91C1C', letterSpacing: '0.5px' }}>
              DIRTY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <X size={18} color="#DC2626" strokeWidth={3} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#991B1B' }}>{dirtyCount}</span>
            </div>
          </div>

          {/* INSPECTED */}
          <div 
            id="stat-card-inspected"
            onClick={() => setViewFilter(viewFilter === 'Inspected' ? 'All rooms' : 'Inspected')}
            style={{
              backgroundColor: viewFilter === 'Inspected' ? '#E0F2FE' : '#F0F9FF',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: viewFilter === 'Inspected' ? '2px solid #0284C7' : '1px solid #BAE6FD',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Filter by Inspected rooms"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0369A1', letterSpacing: '0.5px' }}>
              INSPECTED
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <ShieldCheck size={18} color="#0284C7" strokeWidth={2.5} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#075985' }}>{inspectedCount}</span>
            </div>
          </div>
        </div>

        {/* View by Status Dropdown & Quick Toggle Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Filter Status:</span>
            {/* Quick-toggle pill buttons between Dirty, Clean, Inspected */}
            <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px', gap: '3px' }}>
              {(['All rooms', 'Dirty', 'Clean', 'Inspected'] as const).map(st => (
                <button
                  key={st}
                  id={`status-toggle-pill-${st.toLowerCase().replace(' ', '-')}`}
                  type="button"
                  onClick={() => setViewFilter(st)}
                  style={{
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: viewFilter === st ? '#0E94A8' : 'transparent',
                    color: viewFilter === st ? '#FFFFFF' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {st === 'All rooms' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <select
            id="housekeeping-view-filter-select"
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value as any)}
            aria-label="Filter housekeeping rooms by status"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0E94A8',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#0F172A',
              cursor: 'pointer',
              minWidth: '220px',
              outline: 'none'
            }}
          >
            <option value="All rooms">All statuses ({rows.length})</option>
            <option value="Dirty">Dirty ({dirtyCount})</option>
            <option value="Clean">Clean ({cleanCount})</option>
            <option value="Inspected">Inspected ({inspectedCount})</option>
            <option value="In Process">In Process ({inProcessCount})</option>
            <option value="Under Maintenance">Under Maintenance ({maintenanceCount})</option>
          </select>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MULTI-SELECT BATCH QUICK-ACTION BAR */}
      {/* ---------------------------------------------------- */}
      {selectedRooms.length > 0 && (
        <div 
          id="batch-quick-action-bar"
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '10px 18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.25)',
            margin: '8px 0',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
            <CheckCircle2 size={16} color="#38BDF8" />
            <span>{selectedRooms.length} room{selectedRooms.length > 1 ? 's' : ''} selected</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', opacity: 0.85 }}>Quick-Set Status:</span>
            <button
              id="batch-set-clean-btn"
              onClick={() => void handleBatchUpdateStatus('Clean')}
              style={{
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Check size={12} strokeWidth={3} />
              <span>Mark Clean</span>
            </button>
            <button
              id="batch-set-dirty-btn"
              onClick={() => void handleBatchUpdateStatus('Dirty')}
              style={{
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <X size={12} strokeWidth={3} />
              <span>Mark Dirty</span>
            </button>
            <button
              id="batch-set-inspected-btn"
              onClick={() => void handleBatchUpdateStatus('Inspected')}
              style={{
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.5} />
              <span>Mark Inspected</span>
            </button>
            <button
              id="batch-set-maintenance-btn"
              onClick={() => void handleBatchUpdateStatus('Under Maintenance')}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Wrench size={12} strokeWidth={2.5} />
              <span>Mark Under Maintenance</span>
            </button>
            <button
              onClick={() => setSelectedRooms([])}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '11px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. MAIN ROOMS TABLE WITH QUICK-ACTION TOGGLE BUTTONS */}
      {/* ---------------------------------------------------- */}
      {selectedTab === 'table' && (
        <div className="lodgify-card" style={{ padding: 0, overflowX: 'auto', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1040px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ width: '44px', padding: '14px 16px', textAlign: 'center' }}>
                  <input
                    id="select-all-rooms-checkbox"
                    type="checkbox"
                    checked={selectedRooms.length === rows.length && rows.length > 0}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#0E94A8' }}
                  />
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Room</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Room Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Current Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Quick-Action Toggle</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Availability</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Guest / Occupant</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((r) => {
                const isSelected = selectedRooms.includes(r.room);
                const isUpdating = statusUpdatingRoom === r.room;

                return (
                  <tr
                    key={r.id || r.room}
                    id={`housekeeping-row-${r.room}`}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: isUpdating ? '#EFF6FF' : isSelected ? '#F0FDFA' : '#FFFFFF',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        id={`room-checkbox-${r.room}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(r.room)}
                        style={{ cursor: 'pointer', accentColor: '#0E94A8' }}
                      />
                    </td>

                    {/* Room */}
                    <td style={{ padding: '12px 16px', fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span>{r.room}</span>
                        {isUpdating && <Sparkles size={13} color="#2563EB" className="animate-spin" />}
                      </span>
                    </td>

                    {/* Room Type */}
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                      {r.roomType}
                    </td>

                    {/* Status Badge (Clickable Quick Toggle) */}
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        id={`status-badge-toggle-${r.room}`}
                        onClick={() => handleToggleStatusCycle(r.room)}
                        title={`Click to cycle: ${r.status} → ${r.status === 'Dirty' ? 'Clean' : r.status === 'Clean' ? 'Inspected' : r.status === 'Inspected' ? 'Under Maintenance' : 'Dirty'}`}
                        style={{
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 
                            r.status === 'Clean' ? '#16A34A' :
                            r.status === 'Dirty' ? '#DC2626' :
                            r.status === 'Inspected' ? '#0284C7' :
                            (r.status === 'Under Maintenance' || r.status === 'Repair') ? '#2563EB' : '#F59E0B',
                          color: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {r.status === 'Clean' && <Check size={14} strokeWidth={2.5} />}
                        {r.status === 'Dirty' && <AlertCircle size={14} strokeWidth={2.5} />}
                        {r.status === 'Inspected' && <ShieldCheck size={14} strokeWidth={2.5} />}
                        {(r.status === 'Under Maintenance' || r.status === 'Repair') && <Wrench size={14} strokeWidth={2.5} />}
                        {r.status === 'In Process' && <RefreshCw size={14} strokeWidth={2.5} />}
                        <span>{r.status === 'Repair' ? 'Under Maintenance' : r.status}</span>
                      </button>
                    </td>

                    {/* Quick-Action Toggle Buttons Segmented Group */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: '#F8FAFC',
                        padding: '3px 4px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0'
                      }}>
                        {/* Quick Action: Dirty */}
                        <button
                          id={`quick-toggle-dirty-${r.room}`}
                          type="button"
                          onClick={() => void handleQuickActionStatus(r.room, 'Dirty')}
                          title="Instant Quick Action: Set status to Dirty"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: r.status === 'Dirty' ? '800' : '600',
                            cursor: 'pointer',
                            backgroundColor: r.status === 'Dirty' ? '#DC2626' : 'transparent',
                            color: r.status === 'Dirty' ? '#FFFFFF' : '#B91C1C',
                            boxShadow: r.status === 'Dirty' ? '0 1px 2px rgba(220, 38, 38, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <X size={12} strokeWidth={3} />
                          <span>Dirty</span>
                        </button>

                        {/* Quick Action: Clean */}
                        <button
                          id={`quick-toggle-clean-${r.room}`}
                          type="button"
                          onClick={() => void handleQuickActionStatus(r.room, 'Clean')}
                          title="Instant Quick Action: Set status to Clean"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: r.status === 'Clean' ? '800' : '600',
                            cursor: 'pointer',
                            backgroundColor: r.status === 'Clean' ? '#16A34A' : 'transparent',
                            color: r.status === 'Clean' ? '#FFFFFF' : '#15803D',
                            boxShadow: r.status === 'Clean' ? '0 1px 2px rgba(22, 163, 74, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                          <span>Clean</span>
                        </button>

                        {/* Quick Action: Inspected */}
                        <button
                          id={`quick-toggle-inspected-${r.room}`}
                          type="button"
                          onClick={() => void handleQuickActionStatus(r.room, 'Inspected')}
                          title="Instant Quick Action: Set status to Inspected"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: r.status === 'Inspected' ? '800' : '600',
                            cursor: 'pointer',
                            backgroundColor: r.status === 'Inspected' ? '#0284C7' : 'transparent',
                            color: r.status === 'Inspected' ? '#FFFFFF' : '#0369A1',
                            boxShadow: r.status === 'Inspected' ? '0 1px 2px rgba(2, 132, 199, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <ShieldCheck size={12} strokeWidth={2.5} />
                          <span>Inspected</span>
                        </button>

                        {/* Quick Action: Under Maintenance */}
                        <button
                          id={`quick-toggle-maint-${r.room}`}
                          type="button"
                          onClick={() => void handleQuickActionStatus(r.room, 'Under Maintenance')}
                          title="Instant Quick Action: Set status to Under Maintenance"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '11px',
                            fontWeight: (r.status === 'Under Maintenance' || r.status === 'Repair') ? '800' : '600',
                            cursor: 'pointer',
                            backgroundColor: (r.status === 'Under Maintenance' || r.status === 'Repair') ? '#2563EB' : 'transparent',
                            color: (r.status === 'Under Maintenance' || r.status === 'Repair') ? '#FFFFFF' : '#1D4ED8',
                            boxShadow: (r.status === 'Under Maintenance' || r.status === 'Repair') ? '0 1px 2px rgba(37, 99, 235, 0.3)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Wrench size={12} strokeWidth={2.5} />
                          <span>Under Maint</span>
                        </button>

                        {/* Cyclic Toggle Button */}
                        <button
                          id={`quick-cycle-btn-${r.room}`}
                          type="button"
                          onClick={() => handleToggleStatusCycle(r.room)}
                          title="Quick Cycle: Clean → Dirty → Under Maintenance"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            backgroundColor: '#E2E8F0',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'background 0.12s ease'
                          }}
                        >
                          <ArrowLeftRight size={12} />
                        </button>
                      </div>
                    </td>

                    {/* Availability */}
                    <td style={{ padding: '12px 16px' }}>
                      {r.availability === 'Available' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: '700', fontSize: '12px' }}>
                          <CheckCircle2 size={15} color="#0284C7" />
                          <span>Available</span>
                        </div>
                      )}
                      {r.availability === 'Cancel' && (
                        <span style={{ color: '#DC2626', fontWeight: '700', fontSize: '12px' }}>
                          Cancel
                        </span>
                      )}
                      {r.availability === 'Occupied' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontWeight: '700', fontSize: '12px' }}>
                          <Key size={14} color="#16A34A" />
                          <span>Occupied</span>
                        </div>
                      )}
                      {r.availability === 'Out of Order' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontWeight: '700', fontSize: '12px' }}>
                          <Wrench size={14} color="#2563EB" />
                          <span>Out of Order</span>
                        </div>
                      )}
                    </td>

                    {/* Guest Name */}
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                      {r.name}
                    </td>

                    {/* Remarks */}
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: r.remarks !== '...' ? '#B91C1C' : '#94A3B8', fontWeight: r.remarks !== '...' ? '700' : 'normal' }}>
                      {r.remarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. TAB B: AUTOMATED MAINTENANCE WORK ORDERS */}
      {/* ---------------------------------------------------- */}
      {selectedTab === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Automated Maintenance & Equipment Work Orders
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Track reported room issues, auto-assign technicians, and monitor resolution timelines.
              </p>
            </div>

            <button
              id="log-maintenance-ticket-btn"
              onClick={() => setIsNewOrderModal(true)}
              style={{
                backgroundColor: '#0E94A8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} />
              <span>Log Maintenance Ticket</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {maintenanceOrders.map(mo => (
              <div key={mo.id} className="lodgify-card" style={{
                padding: '18px',
                borderLeft: `4px solid ${mo.status === 'Resolved' ? '#16A34A' : mo.priority === 'High' ? '#DC2626' : '#F59E0B'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                      Room {mo.roomNumber} • {mo.category}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', margin: '2px 0 0 0' }}>
                      {mo.issue}
                    </h4>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '9999px',
                    backgroundColor: mo.status === 'Resolved' ? '#DCFCE7' : mo.status === 'InProgress' ? '#FEF3C7' : '#FEE2E2',
                    color: mo.status === 'Resolved' ? '#166534' : mo.status === 'InProgress' ? '#92400E' : '#991B1B'
                  }}>
                    {mo.status}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#475569', margin: '8px 0' }}>
                  <strong>Notes:</strong> {mo.remarks || 'Standard diagnostic dispatched.'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid #F1F5F9', paddingTop: '8px', marginTop: '10px' }}>
                  <div>
                    <span>Tech: <strong>{mo.assignedTo}</strong></span>
                  </div>
                  {mo.status !== 'Resolved' ? (
                    <button
                      onClick={() => handleResolveOrder(mo.id)}
                      style={{
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <span style={{ color: '#16A34A', fontWeight: '700' }}>✓ Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. TAB C: MOBILE ATTENDANT APP SIMULATOR */}
      {/* ---------------------------------------------------- */}
      {selectedTab === 'mobile' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          {/* Mobile phone frame */}
          <div style={{
            width: '380px',
            backgroundColor: '#0F172A',
            borderRadius: '36px',
            padding: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Screen */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '26px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '590px'
            }}>
              {/* App Top Bar */}
              <div style={{ backgroundColor: '#0E94A8', color: '#FFFFFF', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', opacity: 0.85, textTransform: 'uppercase' }}>Attendant App (Live)</div>
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>Priya Sharma</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981'
                  }} />
                  <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700' }}>
                    Floor 1 Lead
                  </span>
                </div>
              </div>

              {/* Mobile Task List with Quick Action Buttons */}
              <div style={{ padding: '14px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                    Room Queue ({rows.length} Rooms)
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>1-Tap Quick Action</span>
                </div>

                {rows.slice(0, 8).map(item => (
                  <div key={item.id || item.room} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>Room {item.room} ({item.roomType})</strong>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: item.status === 'Clean' ? '#DCFCE7' : item.status === 'Dirty' ? '#FEE2E2' : item.status === 'Inspected' ? '#E0F2FE' : '#DBEAFE',
                        color: item.status === 'Clean' ? '#166534' : item.status === 'Dirty' ? '#991B1B' : item.status === 'Inspected' ? '#0369A1' : '#1E40AF'
                      }}>
                        {item.status === 'Repair' ? 'Under Maintenance' : item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Guest: <strong>{item.name}</strong> • Notes: {item.remarks}
                    </div>

                    {/* Quick-Action Buttons in Mobile View */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '2px' }}>
                      <button
                        onClick={() => void handleQuickActionStatus(item.room, 'Dirty')}
                        style={{
                          backgroundColor: item.status === 'Dirty' ? '#DC2626' : '#FEF2F2',
                          color: item.status === 'Dirty' ? '#FFFFFF' : '#991B1B',
                          border: '1px solid #FECACA',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <X size={10} strokeWidth={3} />
                        <span>Dirty</span>
                      </button>

                      <button
                        onClick={() => void handleQuickActionStatus(item.room, 'Clean')}
                        style={{
                          backgroundColor: item.status === 'Clean' ? '#16A34A' : '#F0FDF4',
                          color: item.status === 'Clean' ? '#FFFFFF' : '#166534',
                          border: '1px solid #BBF7D0',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <Check size={10} strokeWidth={3} />
                        <span>Clean</span>
                      </button>

                      <button
                        onClick={() => void handleQuickActionStatus(item.room, 'Inspected')}
                        style={{
                          backgroundColor: item.status === 'Inspected' ? '#0284C7' : '#F0F9FF',
                          color: item.status === 'Inspected' ? '#FFFFFF' : '#0369A1',
                          border: '1px solid #BAE6FD',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <ShieldCheck size={10} strokeWidth={2.5} />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => void handleQuickActionStatus(item.room, 'Under Maintenance')}
                        style={{
                          backgroundColor: (item.status === 'Under Maintenance' || item.status === 'Repair') ? '#2563EB' : '#EFF6FF',
                          color: (item.status === 'Under Maintenance' || item.status === 'Repair') ? '#FFFFFF' : '#1D4ED8',
                          border: '1px solid #BFDBFE',
                          borderRadius: '6px',
                          padding: '6px 2px',
                          fontSize: '10px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}
                      >
                        <Wrench size={10} strokeWidth={2.5} />
                        <span>Maint</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <button
                        onClick={() => handleToggleStatusCycle(item.room)}
                        style={{
                          flex: 1,
                          backgroundColor: '#0E94A8',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <ArrowLeftRight size={11} />
                        <span>Cycle Status</span>
                      </button>
                      <button
                        onClick={() => {
                          setNewOrderForm(prev => ({ ...prev, roomNumber: item.room }));
                          setIsNewOrderModal(true);
                        }}
                        style={{
                          backgroundColor: '#FEE2E2',
                          color: '#991B1B',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Bottom Navigation */}
              <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '10px 16px', display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontWeight: '700', color: '#0E94A8' }}>
                <span>🧹 My Rooms</span>
                <span style={{ color: '#94A3B8' }}>📦 Supplies</span>
                <span style={{ color: '#94A3B8' }}>⚠️ Reports</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 7. MODAL: REPORT MAINTENANCE TICKET */}
      {/* ---------------------------------------------------- */}
      {isNewOrderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="lodgify-card animate-scale-up" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            borderRadius: '20px',
            backgroundColor: '#FFFFFF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Log Maintenance Work Order
              </h3>
              <button onClick={() => setIsNewOrderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                    Room Number
                  </label>
                  <select
                    value={newOrderForm.roomNumber}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, roomNumber: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '8px', fontSize: '13px' }}
                  >
                    {rows.map(r => (
                      <option key={r.room} value={r.room}>Room {r.room} ({r.roomType})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                    Issue Category
                  </label>
                  <select
                    value={newOrderForm.category}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, category: e.target.value as any })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="Electrical">Electrical (Lamp, Switch, TV)</option>
                    <option value="Plumbing">Plumbing (Drain, Tap, Geyser)</option>
                    <option value="HVAC">HVAC (AC, Thermostat, Vents)</option>
                    <option value="Furniture">Furniture & Minibar</option>
                    <option value="Security">Security & Locks</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                  Issue Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken bedside reading lamp & flickering switch"
                  value={newOrderForm.issue}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, issue: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                    Urgency Priority
                  </label>
                  <select
                    value={newOrderForm.priority}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, priority: e.target.value as any })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '8px', fontSize: '13px' }}
                  >
                    <option value="Emergency">🚨 Emergency (Immediate)</option>
                    <option value="High">⚠️ High Priority</option>
                    <option value="Medium">⚡ Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                    Reported By
                  </label>
                  <input
                    type="text"
                    value={newOrderForm.reportedBy}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, reportedBy: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
                  Technician Instructions / Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Enter details for technician Vikram Singh..."
                  value={newOrderForm.remarks}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, remarks: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '8px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewOrderModal(false)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#0E94A8',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HousekeepingView;
