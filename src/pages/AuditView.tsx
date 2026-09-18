import React, { useState } from 'react';
import { RefreshCw, Globe, History } from 'lucide-react';

export const AuditView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [channelLogs, setChannelLogs] = useState([
    { id: 'csl-1', channel: 'Booking.com', event: 'Rates Push', status: 'Success', details: 'Surge pricing multiplier (1.25x) pushed across 16 available units', time: '10 mins ago' },
    { id: 'csl-2', channel: 'Expedia', event: 'Inventory Update', status: 'Success', details: 'Room 201 marked as Occupied (Blocked across partner network)', time: '45 mins ago' },
    { id: 'csl-3', channel: 'Airbnb', event: 'New Reservation', status: 'Success', details: 'Imported reservation BK-2026-904 for Amina Al-Mansoor', time: '1 hr ago' },
    { id: 'csl-4', channel: 'Agoda', event: 'Availability Broadcast', status: 'Success', details: 'Direct sync completed. 0 rate parity discrepancies detected.', time: '2 hrs ago' }
  ]);

  const [auditTrails] = useState([
    { id: 'aud-1', time: '2026-09-16 10:15', actor: 'Kavita Nair', role: 'Front Desk', action: 'GUEST_CHECK_IN', details: 'Checked in Marcus Chen into Room 102. KYC verified with SG National ID.', ip: '192.168.1.104' },
    { id: 'aud-2', time: '2026-09-16 11:30', actor: 'Rajesh Menon', role: 'General Manager', action: 'DYNAMIC_PRICING_UPDATED', details: 'Enabled weekend surge factor (1.15x) due to local festival demand.', ip: '192.168.1.101' },
    { id: 'aud-3', time: '2026-09-16 11:45', actor: 'Anita Desai', role: 'Housekeeping Lead', action: 'ROOM_INSPECTED', details: 'Room 202 inspection approved and marked ready for occupancy.', ip: '192.168.1.115' },
    { id: 'aud-4', time: '2026-09-16 13:20', actor: 'Antonio Rossi', role: 'Executive Chef', action: 'POS_ORDER_BILLED_TO_ROOM', details: 'Order POS-2026-041 amount ₹1,669.50 billed to Room 101 Folio.', ip: '192.168.1.130' }
  ]);

  const handleSyncChannels = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newLog = {
        id: `csl-${Date.now()}`,
        channel: 'Booking.com, Expedia, Airbnb',
        event: 'Manual Parity Sync',
        status: 'Success',
        details: 'Broadcast 100% room availability & dynamic tariff rates across all OTA channels.',
        time: 'Just now'
      };
      setChannelLogs([newLog, ...channelLogs]);
      alert('All connected OTA channel managers synchronized successfully!');
    }, 1200);
  };

  return (
    <div className="animate-fade-in responsive-view-container">
      
      {/* Header */}
      <div className="responsive-action-header">
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 2vw, 20px)', fontWeight: '800', color: '#0F172A', margin: 0 }}>
            Channel Manager Sync & Security Audit
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Two-way OTA distribution sync (Booking.com, Expedia, Airbnb) & tamper-proof audit trails.
          </p>
        </div>

        <button onClick={handleSyncChannels} disabled={isSyncing} className="btn-primary">
          <RefreshCw size={15} className={isSyncing ? 'animate-spin' : ''} color="#0F172A" />
          <span>{isSyncing ? 'Syncing...' : 'Sync All OTAs Now'}</span>
        </button>
      </div>

      {/* Grid: OTA Channels (Top) + Audit Trail (Bottom) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Channel Status Overview */}
        <div className="responsive-auto-grid">
          {[
            { name: 'Booking.com XML API', status: '2-Way Live', latency: '120ms', icon: '🏨' },
            { name: 'Expedia Partner Central', status: '2-Way Live', latency: '145ms', icon: '✈️' },
            { name: 'Airbnb Host API', status: 'Connected', latency: '98ms', icon: '🏡' },
            { name: 'Agoda YCS API', status: 'Connected', latency: '110ms', icon: '🌏' }
          ].map((c) => (
            <div key={c.name} className="lodgify-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>{c.icon}</span>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#065F46', backgroundColor: '#D1FAE5', padding: '2px 8px', borderRadius: '9999px' }}>
                  {c.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>{c.name}</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Heartbeat Latency: {c.latency}</div>
            </div>
          ))}
        </div>

        {/* Channel Sync Events */}
        <div className="lodgify-card responsive-table-wrapper" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8EEF5', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={18} color="#0F172A" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Recent OTA Channel Synchronization Events
            </h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Event Type</th>
                <th>Details</th>
                <th>Sync Status</th>
                <th style={{ textAlign: 'right' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {channelLogs.map((log) => (
                <tr key={log.id}>
                  <td><strong>{log.channel}</strong></td>
                  <td>{log.event}</td>
                  <td style={{ color: '#475569' }}>{log.details}</td>
                  <td>
                    <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px' }}>
                      ✓ {log.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', color: '#94A3B8', fontSize: '11px' }}>{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Security Audit Trails */}
        <div className="lodgify-card responsive-table-wrapper" style={{ padding: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8EEF5', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="#0F172A" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Immutable Manager Audit Logs
            </h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Staff Actor</th>
                <th>Action Code</th>
                <th>Activity Description</th>
                <th style={{ textAlign: 'right' }}>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {auditTrails.map((aud) => (
                <tr key={aud.id}>
                  <td style={{ fontSize: '11px', color: '#64748B' }}>{aud.time}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0F172A' }}>{aud.actor}</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>{aud.role}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                      {aud.action}
                    </span>
                  </td>
                  <td style={{ color: '#334155' }}>{aud.details}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: '11px', color: '#94A3B8' }}>{aud.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
