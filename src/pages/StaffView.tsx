import React, { useState } from 'react';
import { Fingerprint } from 'lucide-react';

export const StaffView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'attendance' | 'leave'>('roster');
  
  const [staff] = useState([
    { id: 'stf-1', name: 'Rajesh Menon', role: 'General Manager', department: 'Administration', shift: 'Morning (06:00-14:00)', status: 'On Duty', punchIn: '08:45' },
    { id: 'stf-2', name: 'Kavita Nair', role: 'Front Desk Officer', department: 'Front Office', shift: 'Morning (06:00-14:00)', status: 'On Duty', punchIn: '06:00' },
    { id: 'stf-3', name: 'Anita Desai', role: 'Housekeeping Lead', department: 'Housekeeping', shift: 'Morning (06:00-14:00)', status: 'On Duty', punchIn: '06:15' },
    { id: 'stf-4', name: 'Priya Sharma', role: 'Housekeeping Lead', department: 'Housekeeping', shift: 'Morning (06:00-14:00)', status: 'On Duty', punchIn: '06:20' },
    { id: 'stf-5', name: 'Antonio Rossi', role: 'Executive Chef', department: 'Food & Beverage', shift: 'Evening (14:00-22:00)', status: 'On Duty', punchIn: '13:50' },
    { id: 'stf-6', name: 'Vikram Singh', role: 'Maintenance Tech', department: 'Engineering', shift: 'Morning (06:00-14:00)', status: 'On Duty', punchIn: '07:30' }
  ]);

  const [attendance, setAttendance] = useState([
    { id: 'att-1', staffName: 'Kavita Nair', time: '06:00:12', method: 'Biometric Fingerprint', status: 'Present (On Time)' },
    { id: 'att-2', staffName: 'Anita Desai', time: '06:15:40', method: 'Biometric Fingerprint', status: 'Present (On Time)' },
    { id: 'att-3', staffName: 'Priya Sharma', time: '06:20:05', method: 'Mobile App Geofence', status: 'Present (On Time)' },
    { id: 'att-4', staffName: 'Rajesh Menon', time: '08:45:10', method: 'Mobile App Geofence', status: 'Present (On Time)' }
  ]);

  const [leaves, setLeaves] = useState([
    { id: 'lv-1', staffName: 'Priya Sharma', type: 'Casual Leave', dates: '22 Sep - 24 Sep', reason: 'Family wedding event', status: 'Pending' },
    { id: 'lv-2', staffName: 'Vikram Singh', type: 'Medical Leave', dates: '10 Sep - 12 Sep', reason: 'Viral fever recovery', status: 'Approved' }
  ]);

  const handlePunchClock = () => {
    const timeString = new Date().toTimeString().slice(0, 8);
    const newAtt = {
      id: `att-${Date.now()}`,
      staffName: 'Kavita Nair (Front Desk)',
      time: timeString,
      method: 'Biometric Fingerprint',
      status: 'Present (Punch Recorded)'
    };
    setAttendance([newAtt, ...attendance]);
    alert(`Biometric Clock punch logged successfully at ${timeString}!`);
  };

  const handleApproveLeave = (id: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Staff Management & Duty Rosters
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Shift scheduling, biometric attendance tracking, and HR leave approval workflows.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handlePunchClock} className="btn-primary">
            <Fingerprint size={16} color="#0F172A" />
            <span>Biometric Clock-In</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'roster', label: 'Duty Roster & Shifts' },
          { id: 'attendance', label: 'Attendance Records' },
          { id: 'leave', label: 'Leave Requests' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id as any)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              backgroundColor: activeSubTab === t.id ? '#D4F05B' : '#FFFFFF',
              color: activeSubTab === t.id ? '#0F172A' : '#64748B',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: activeSubTab === t.id ? '#D4F05B' : '#E2E8F0'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeSubTab === 'roster' && (
        <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Designation & Dept</th>
                <th>Current Shift</th>
                <th>Shift Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{s.name}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0F172A' }}>{s.role}</div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>{s.department}</div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: s.shift.includes('Morning') ? '#E0F2FE' : '#FEF3C7',
                      color: s.shift.includes('Morning') ? '#0369A1' : '#92400E',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      {s.shift}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Punch In: {s.punchIn}</div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      ● {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'attendance' && (
        <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Clock Time</th>
                <th>Verification Mode</th>
                <th>Attendance State</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.staffName}</strong></td>
                  <td>{a.time}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Fingerprint size={14} color="#64748B" />
                      <span>{a.method}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      ✓ {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'leave' && (
        <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Leave Type</th>
                <th>Requested Dates</th>
                <th>Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.staffName}</strong></td>
                  <td>{l.type}</td>
                  <td>{l.dates}</td>
                  <td>{l.reason}</td>
                  <td>
                    <span style={{
                      backgroundColor: l.status === 'Approved' ? '#D1FAE5' : '#FEF3C7',
                      color: l.status === 'Approved' ? '#065F46' : '#92400E',
                      fontWeight: '700',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {l.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveLeave(l.id)}
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Approve Leave
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
