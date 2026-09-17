import React, { useState } from 'react';
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
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface HousekeepingRow {
  id: string;
  room: string;
  roomType: 'Deluxe' | 'Suite' | 'Standard';
  status: 'In Process' | 'Clean' | 'Dirty' | 'Repair';
  availability: 'Available' | 'Cancel' | 'Occupied';
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
  const [viewFilter, setViewFilter] = useState<'All rooms' | 'In Process' | 'Clean' | 'Dirty' | 'Repair'>('All rooms');
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showTurnoverDrilldown, setShowTurnoverDrilldown] = useState(false);

  // Rows matching Image 2 ("Housekeeping")
  const [rows, setRows] = useState<HousekeepingRow[]>([
    { id: 'hk-1', room: '101', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Daniel Hamilton', remarks: '...' },
    { id: 'hk-2', room: '102', roomType: 'Deluxe', status: 'In Process', availability: 'Cancel', name: 'Corina McCoy', remarks: '...' },
    { id: 'hk-3', room: '103', roomType: 'Deluxe', status: 'Clean', availability: 'Occupied', name: 'Dennis Callis', remarks: '...' },
    { id: 'hk-4', room: '104', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Katie Sims', remarks: 'Bar is totally empty' },
    { id: 'hk-5', room: '105', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Jerry Helfer', remarks: '...' },
    { id: 'hk-6', room: '106', roomType: 'Deluxe', status: 'Dirty', availability: 'Cancel', name: 'Chris Glasser', remarks: '...' },
    { id: 'hk-7', room: '107', roomType: 'Deluxe', status: 'Clean', availability: 'Occupied', name: 'Paula Mora', remarks: '...' },
    { id: 'hk-8', room: '108', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'Alex Buckmaster', remarks: 'Broken lamp' },
    { id: 'hk-9', room: '109', roomType: 'Deluxe', status: 'Clean', availability: 'Occupied', name: 'Rhonda Rhodes', remarks: '...' },
    { id: 'hk-10', room: '110', roomType: 'Deluxe', status: 'In Process', availability: 'Available', name: 'David Elson', remarks: '...' },
    { id: 'hk-11', room: 'Suite1', roomType: 'Suite', status: 'In Process', availability: 'Available', name: 'Joshua Jones', remarks: '...' },
    { id: 'hk-12', room: 'Suite2', roomType: 'Suite', status: 'Dirty', availability: 'Cancel', name: 'Kimberly Mastrangelo', remarks: 'Missed things. Need security' },
    { id: 'hk-13', room: 'Suite3', roomType: 'Suite', status: 'Clean', availability: 'Occupied', name: 'Judith Rodriguez', remarks: '...' }
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

  // Toggle selection
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

  // Cycle room status: In Process -> Clean -> Dirty -> Repair -> In Process
  const handleCycleStatus = async (id: string) => {
    const statusCycle: HousekeepingRow['status'][] = ['In Process', 'Clean', 'Dirty', 'Repair'];
    setRows(prev => prev.map(r => {
      if (r.id === id) {
        const nextIdx = (statusCycle.indexOf(r.status) + 1) % statusCycle.length;
        const nextStatus = statusCycle[nextIdx];
        
        // Sync with backend
        fetch(`/api/housekeeping/tasks/${r.room}/clean-status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cleanStatus: nextStatus })
        }).catch(() => {});

        return { ...r, status: nextStatus };
      }
      return r;
    }));
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

  const filteredRows = viewFilter === 'All rooms' 
    ? rows 
    : rows.filter(r => r.status === viewFilter);

  return (
    <div className="animate-fade-in" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ---------------------------------------------------- */}
      {/* 1. TOP HEADER & VIEW TOGGLES */}
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
            Housekeeping Operations & Turnover Board
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Real-time room sanitization status, maintenance work tickets, and linen logistics.
          </p>
        </div>

        {/* View Tabs & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sub-Tabs: Table, Maintenance, Mobile App */}
          <div style={{ display: 'flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
            <button
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
              <span>Maintenance Orders ({maintenanceOrders.filter(m => m.status !== 'Resolved').length})</span>
            </button>

            <button
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

          {/* Filter Button matching image */}
          <button
            onClick={() => setViewFilter('All rooms')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #0E94A8',
              color: '#0E94A8',
              borderRadius: '8px',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Filter
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. STATS & VIEW BY DROPDOWN (MATCHING IMAGE 2) */}
      {/* ---------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* 4 Stat Cards - Clickable for Room-Wise Drilldown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* REPAIR 6 */}
          <div 
            onClick={() => setShowTurnoverDrilldown(true)}
            title="Click to drill down room-wise"
            style={{
              backgroundColor: '#EBF3FB',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: '1px solid #D6E8F9',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            className="hover:scale-105"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#4B7FB5', letterSpacing: '0.5px' }}>
              REPAIR
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <BedDouble size={18} color="#3B82F6" />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#1E40AF' }}>6</span>
            </div>
          </div>

          {/* IN PROCESS 26 */}
          <div 
            onClick={() => setShowTurnoverDrilldown(true)}
            title="Click to drill down room-wise"
            style={{
              backgroundColor: '#FFFBEB',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: '1px solid #FDE68A',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            className="hover:scale-105"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#B45309', letterSpacing: '0.5px' }}>
              IN PROCESS
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <BedDouble size={18} color="#D97706" />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#B45309' }}>26</span>
            </div>
          </div>

          {/* CLEAN 8 */}
          <div 
            onClick={() => setShowTurnoverDrilldown(true)}
            title="Click to drill down room-wise"
            style={{
              backgroundColor: '#EDFAF1',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: '1px solid #C9F2D5',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            className="hover:scale-105"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#15803D', letterSpacing: '0.5px' }}>
              CLEAN
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <Check size={18} color="#16A34A" strokeWidth={3} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#166534' }}>8</span>
            </div>
          </div>

          {/* DIRTY 3 */}
          <div 
            onClick={() => setShowTurnoverDrilldown(true)}
            title="Click to drill down room-wise"
            style={{
              backgroundColor: '#FDF0F0',
              borderRadius: '12px',
              padding: '10px 18px',
              minWidth: '115px',
              border: '1px solid #FCD4D4',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            className="hover:scale-105"
          >
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#B91C1C', letterSpacing: '0.5px' }}>
              DIRTY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <X size={18} color="#DC2626" strokeWidth={3} />
              <span style={{ fontSize: '20px', fontWeight: '800', color: '#991B1B' }}>3</span>
            </div>
          </div>

          <button
            onClick={() => setShowTurnoverDrilldown(true)}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} color="#D4F05B" />
            <span>Room-wise Turnover Drill-Down</span>
          </button>
        </div>

        {/* View by Dropdown */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>View by</span>
          <select
            value={viewFilter}
            onChange={(e) => setViewFilter(e.target.value as any)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#0F172A',
              cursor: 'pointer',
              minWidth: '180px'
            }}
          >
            <option value="All rooms">All rooms</option>
            <option value="In Process">In Process</option>
            <option value="Clean">Clean</option>
            <option value="Dirty">Dirty</option>
            <option value="Repair">Repair</option>
          </select>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MAIN CONTENT BASED ON SELECTED TAB */}
      {/* ---------------------------------------------------- */}
      
      {/* TAB A: MAIN ROOMS TABLE (EXACT MATCH OF IMAGE 2) */}
      {selectedTab === 'table' && (
        <div className="lodgify-card" style={{ padding: 0, overflowX: 'auto', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '950px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ width: '48px', padding: '14px 16px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selectedRooms.length === rows.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#0E94A8' }}
                  />
                </th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Room</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Room Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Availability</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Name</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((r) => {
                const isSelected = selectedRooms.includes(r.room);

                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: isSelected ? '#F0FDFA' : '#FFFFFF',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Checkbox */}
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(r.room)}
                        style={{ cursor: 'pointer', accentColor: '#0E94A8' }}
                      />
                    </td>

                    {/* Room */}
                    <td style={{ padding: '12px 16px', fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>
                      {r.room}
                    </td>

                    {/* Room Type */}
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#475569' }}>
                      {r.roomType}
                    </td>

                    {/* Status Badge (Clickable to cycle!) */}
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleCycleStatus(r.id)}
                        title="Click to cycle status: In Process -> Clean -> Dirty -> Repair"
                        style={{
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 
                            r.status === 'In Process' ? '#F59E0B' :
                            r.status === 'Clean' ? '#16A34A' :
                            r.status === 'Dirty' ? '#DC2626' : '#2563EB',
                          color: '#FFFFFF',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span>{r.status}</span>
                      </button>
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

      {/* TAB B: AUTOMATED MAINTENANCE WORK ORDERS */}
      {selectedTab === 'maintenance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Automated Maintenance & Equipment Work Orders
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Track reported room issues, auto-assign technicians, and monitor resolution timelines.
              </p>
            </div>

            <button
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

      {/* TAB C: MOBILE APP SIMULATOR FOR HOUSEKEEPING ATTENDANTS */}
      {selectedTab === 'mobile' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
          {/* Mobile phone frame */}
          <div style={{
            width: '360px',
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
              height: '560px'
            }}>
              {/* App Top Bar */}
              <div style={{ backgroundColor: '#0E94A8', color: '#FFFFFF', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', opacity: 0.8, textTransform: 'uppercase' }}>Attendant App</div>
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>Priya Sharma</div>
                </div>
                <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: '700' }}>
                  Floor 1 Lead
                </span>
              </div>

              {/* Mobile Task List */}
              <div style={{ padding: '14px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', marginBottom: '2px' }}>
                  Today's Room Queue (3 Remaining)
                </div>

                {rows.slice(0, 5).map(item => (
                  <div key={item.id} style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: '#0F172A' }}>Room {item.room}</strong>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: item.status === 'Clean' ? '#DCFCE7' : item.status === 'Dirty' ? '#FEE2E2' : '#FEF3C7',
                        color: item.status === 'Clean' ? '#166534' : item.status === 'Dirty' ? '#991B1B' : '#92400E'
                      }}>
                        {item.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Guest: {item.name} • Note: {item.remarks}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <button
                        onClick={() => handleCycleStatus(item.id)}
                        style={{
                          flex: 1,
                          backgroundColor: '#0E94A8',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Update Status
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
                        Report Issue
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
      {/* 4. MODAL: REPORT MAINTENANCE TICKET */}
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

      {/* ROOM-WISE TURNOVER & CLEANING DRILLDOWN MODAL */}
      {showTurnoverDrilldown && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: '750px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} color="#0284C7" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    Housekeeping: Room-Wise Turnover & Sanitization Drill-Down
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Detailed cleaning phase checklist, attendant allocation, and turnover priority per room.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowTurnoverDrilldown(false)} 
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  room: 'Room 101',
                  type: 'Deluxe King',
                  attendant: 'Sunita Sharma (Floor 1)',
                  cleanStatus: 'Dirty (Checkout Today)',
                  guestNext: 'Sophia Laurent (Check-in 14:00)',
                  priority: 'HIGH PRIORITY',
                  stage: 'Strip Linen & Trash Removed',
                  inspectionReady: false
                },
                {
                  room: 'Room 104',
                  type: 'Standard Twin',
                  attendant: 'Ramesh Patel (Floor 1)',
                  cleanStatus: 'In Process (Sanitization)',
                  guestNext: 'Katie Sims (Check-in 15:30)',
                  priority: 'MEDIUM',
                  stage: 'Bathroom Sanitization & Fresh Linens',
                  inspectionReady: false
                },
                {
                  room: 'Room 106',
                  type: 'Presidential Suite',
                  attendant: 'Anita Roy (Floor 2)',
                  cleanStatus: 'Dirty (Guest Checked Out)',
                  guestNext: 'Lord Sterling (Arrival 16:00)',
                  priority: 'VIP EXPEDITE',
                  stage: 'Deep Clean & Minibar Restock',
                  inspectionReady: false
                },
                {
                  room: 'Room 108',
                  type: 'Deluxe Suite',
                  attendant: 'Vikram Singh (Maintenance)',
                  cleanStatus: 'Repair & Inspection',
                  guestNext: 'Pending HVAC repair sign-off',
                  priority: 'MAINTENANCE',
                  stage: 'AC Filter Replacement in progress',
                  inspectionReady: false
                },
                {
                  room: 'Room 103',
                  type: 'Standard King',
                  attendant: 'Sunita Sharma (Floor 1)',
                  cleanStatus: 'Clean & Inspected',
                  guestNext: 'Occupied (Dennis Callis)',
                  priority: 'COMPLETED',
                  stage: 'Passed Supervisor Checklist',
                  inspectionReady: true
                }
              ].map((item, idx) => (
                <div key={idx} style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
                        🏨 {item.room}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                        {item.type}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      backgroundColor: item.priority.includes('VIP') ? '#FEE2E2' : item.priority.includes('HIGH') ? '#FEF3C7' : item.priority.includes('COMPLETED') ? '#D1FAE5' : '#E2E8F0',
                      color: item.priority.includes('VIP') ? '#991B1B' : item.priority.includes('HIGH') ? '#92400E' : item.priority.includes('COMPLETED') ? '#065F46' : '#334155'
                    }}>
                      {item.priority}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                    <div>
                      <div>👤 Attendant: <strong>{item.attendant}</strong></div>
                      <div>📋 Status: <strong>{item.cleanStatus}</strong></div>
                    </div>
                    <div>
                      <div>⏳ Stage: <strong>{item.stage}</strong></div>
                      <div>➡️ Next: <strong>{item.guestNext}</strong></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #E8EEF5', paddingTop: '10px' }}>
                    <button 
                      onClick={() => alert(`Room ${item.room} marked as Clean and Ready for Inspection!`)}
                      style={{
                        padding: '6px 14px',
                        backgroundColor: '#D4F05B',
                        color: '#0F172A',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Mark Clean & Inspected
                    </button>
                    <button 
                      onClick={() => alert(`Housekeeper dispatched to Room ${item.room}!`)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Notify Attendant
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HousekeepingView;
