import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Check, 
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Calendar,
  Sparkles,
  UtensilsCrossed,
  Package,
  ReceiptText,
  MessageSquare,
  Star,
  Users as UsersIcon,
  UserCog,
  ShieldCheck
} from 'lucide-react';

interface SystemUser {
  id: string;
  name: string;
  username: string;
  role: 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen';
  department: string;
  allowedTabs: string[];
  landingTab: string;
  createdAt: string;
}

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard & KPIs', desc: 'Executive & departmental key KPI metrics with drill-down', icon: LayoutDashboard },
  { id: 'reservation', label: 'Front Desk Reservations', desc: 'Guest booking, digital KYC & room check-in', icon: CalendarCheck },
  { id: 'rooms', label: 'Rooms & Matrix', desc: 'Inventory, floor plans & room statuses', icon: BedDouble },
  { id: 'calendar', label: 'Tape Chart Calendar', desc: 'Multi-day room occupancy & drag calendar', icon: Calendar },
  { id: 'housekeeping', label: 'Housekeeping & Maintenance', desc: 'Turnover cleaning board & work orders', icon: Sparkles },
  { id: 'concierge', label: 'Kitchen Display & POS', desc: 'Dining orders, room service & kitchen tickets', icon: UtensilsCrossed },
  { id: 'inventory', label: 'Inventory & Operations', desc: 'Stock replenishment & low threshold alerts', icon: Package },
  { id: 'financials', label: 'Billing & GST Invoicing', desc: 'Itemized folios, split CGST/SGST & payments', icon: ReceiptText },
  { id: 'messages', label: 'Guest Messages & Notes', desc: 'Operational logs, VIP requests & notifications', icon: MessageSquare },
  { id: 'reviews', label: 'Guest Experience & NPS', desc: 'Guest sentiment scoring & loyalty perks', icon: Star },
  { id: 'staff', label: 'Staff Rosters & HR', desc: 'Biometric punches & shift rosters', icon: UsersIcon },
  { id: 'users', label: 'Users & RBAC Management', desc: 'Admin provisioning & security rights', icon: UserCog },
  { id: 'audit', label: 'Audit Logs & OTA Sync', desc: 'Channel distribution & immutable audit trails', icon: ShieldCheck }
];

const DEFAULT_ROLE_MODULES: Record<string, { tabs: string[]; landing: string; dept: string }> = {
  Admin: {
    tabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'audit'],
    landing: 'dashboard',
    dept: 'Administration'
  },
  Reception: {
    tabs: ['dashboard', 'reservation', 'rooms', 'calendar', 'financials', 'messages'],
    landing: 'reservation',
    dept: 'Front Office'
  },
  Housekeeping: {
    tabs: ['dashboard', 'housekeeping', 'inventory'],
    landing: 'housekeeping',
    dept: 'Housekeeping'
  },
  Kitchen: {
    tabs: ['dashboard', 'concierge', 'inventory'],
    landing: 'concierge',
    dept: 'Food & Beverage'
  }
};

export const UsersView: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([
    {
      id: 'usr-1',
      name: 'Jaylon Dorwart',
      username: 'admin',
      role: 'Admin',
      department: 'Administration',
      allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'audit'],
      landingTab: 'dashboard',
      createdAt: '2026-09-01'
    },
    {
      id: 'usr-2',
      name: 'Kavita Nair',
      username: 'reception',
      role: 'Reception',
      department: 'Front Office',
      allowedTabs: ['dashboard', 'reservation', 'rooms', 'calendar', 'financials', 'messages'],
      landingTab: 'reservation',
      createdAt: '2026-09-05'
    },
    {
      id: 'usr-3',
      name: 'Priya Sharma',
      username: 'cleaner',
      role: 'Housekeeping',
      department: 'Housekeeping',
      allowedTabs: ['dashboard', 'housekeeping', 'inventory'],
      landingTab: 'housekeeping',
      createdAt: '2026-09-08'
    },
    {
      id: 'usr-4',
      name: 'Antonio Rossi',
      username: 'chef',
      role: 'Kitchen',
      department: 'Food & Beverage',
      allowedTabs: ['dashboard', 'concierge', 'inventory'],
      landingTab: 'concierge',
      createdAt: '2026-09-10'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Reception' as 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen',
    department: 'Front Office',
    landingTab: 'reservation',
    allowedTabs: ['dashboard', 'reservation', 'rooms', 'calendar', 'financials', 'messages'] as string[]
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data)) setUsers(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUserId(null);
    setFormData({
      name: '',
      username: '',
      password: '',
      role: 'Reception',
      department: 'Front Office',
      landingTab: 'reservation',
      allowedTabs: [...DEFAULT_ROLE_MODULES.Reception.tabs]
    });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (user: SystemUser) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role,
      department: user.department,
      landingTab: user.landingTab,
      allowedTabs: [...(user.allowedTabs || DEFAULT_ROLE_MODULES[user.role]?.tabs || ['dashboard'])]
    });
    setError('');
    setModalOpen(true);
  };

  const handleRoleSelect = (role: 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen') => {
    const preset = DEFAULT_ROLE_MODULES[role];
    setFormData(prev => ({
      ...prev,
      role,
      department: preset.dept,
      landingTab: preset.landing,
      allowedTabs: [...preset.tabs]
    }));
  };

  const toggleModule = (moduleId: string) => {
    setFormData(prev => {
      const exists = prev.allowedTabs.includes(moduleId);
      const updated = exists
        ? prev.allowedTabs.filter(id => id !== moduleId)
        : [...prev.allowedTabs, moduleId];
      
      // If removed module was landing tab, re-assign landing tab
      let newLanding = prev.landingTab;
      if (exists && prev.landingTab === moduleId) {
        newLanding = updated[0] || 'dashboard';
      } else if (!exists && updated.length === 1) {
        newLanding = moduleId;
      }

      return {
        ...prev,
        allowedTabs: updated,
        landingTab: newLanding
      };
    });
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
      ...prev,
      allowedTabs: AVAILABLE_MODULES.map(m => m.id)
    }));
  };

  const handleDeselectAll = () => {
    setFormData(prev => ({
      ...prev,
      allowedTabs: ['dashboard'],
      landingTab: 'dashboard'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.name || !formData.username) {
      setError('Please provide user name and username.');
      return;
    }

    if (!editingUserId && !formData.password) {
      setError('Password is required for new accounts.');
      return;
    }

    if (formData.allowedTabs.length === 0) {
      setError('Please select at least one accessible module.');
      return;
    }

    try {
      if (editingUserId) {
        // Update existing user
        const res = await fetch(`/api/users/${editingUserId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            role: formData.role,
            department: formData.department,
            allowedTabs: formData.allowedTabs,
            landingTab: formData.landingTab,
            ...(formData.password ? { password: formData.password } : {})
          })
        });

        if (res.ok) {
          const updated = await res.json();
          setUsers(users.map(u => u.id === editingUserId ? updated : u));
          setSuccessMsg(`Permissions updated successfully for user "${updated.username}"!`);
          setModalOpen(false);
        } else {
          const d = await res.json();
          setError(d.error || 'Failed to update user.');
        }
      } else {
        // Create new user
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            username: formData.username,
            password: formData.password,
            role: formData.role,
            department: formData.department,
            allowedTabs: formData.allowedTabs,
            landingTab: formData.landingTab
          })
        });

        const data = await res.json();
        if (res.ok) {
          setUsers([data, ...users]);
          setSuccessMsg(`User "${data.username}" created successfully with ${data.role} access and ${formData.allowedTabs.length} granted modules!`);
          setModalOpen(false);
        } else {
          setError(data.error || 'Failed to create user');
        }
      }
    } catch {
      // Local state fallback
      if (editingUserId) {
        setUsers(users.map(u => u.id === editingUserId ? {
          ...u,
          name: formData.name,
          role: formData.role,
          department: formData.department,
          allowedTabs: formData.allowedTabs,
          landingTab: formData.landingTab
        } : u));
        setSuccessMsg(`User updated locally!`);
      } else {
        const newUser: SystemUser = {
          id: `usr-${Date.now()}`,
          name: formData.name,
          username: formData.username.toLowerCase().trim(),
          role: formData.role,
          department: formData.department,
          allowedTabs: formData.allowedTabs,
          landingTab: formData.landingTab,
          createdAt: new Date().toISOString().slice(0, 10)
        };
        setUsers([newUser, ...users]);
        setSuccessMsg(`User "${newUser.username}" created locally!`);
      }
      setModalOpen(false);
    }
  };

  const handleDeleteUser = async (id: string, username: string) => {
    if (username === 'admin') {
      alert('Cannot delete primary Administrator account.');
      return;
    }
    if (!confirm(`Are you sure you want to revoke and delete account "${username}"?`)) return;

    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setSuccessMsg(`User "${username}" account deleted successfully.`);
      }
    } catch {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return { bg: '#FEF3C7', color: '#92400E', label: '👑 Administrator' };
      case 'Reception':
        return { bg: '#E0F2FE', color: '#0369A1', label: '🏨 Reception / Front Desk' };
      case 'Housekeeping':
        return { bg: '#D1FAE5', color: '#065F46', label: '🧹 Housekeeping' };
      case 'Kitchen':
        return { bg: '#FEE2E2', color: '#991B1B', label: '🍳 Kitchen & F&B' };
      default:
        return { bg: '#F1F5F9', color: '#475569', label: role };
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>
            User Accounts & Functional Module Access Control
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Provision staff accounts, assign functional roles, and customize granular module authorization rights.
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={16} color="#0F172A" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div style={{
          backgroundColor: '#D1FAE5',
          border: '1px solid #A7F3D0',
          color: '#065F46',
          borderRadius: '12px',
          padding: '12px 18px',
          fontSize: '13px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Scoping Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { role: 'Admin', title: 'Administrator', access: 'All 13 Modules + User Management', landing: 'Dashboard', bg: '#FEF9C3', border: '#FEF08A' },
          { role: 'Reception', title: 'Reception / Front Desk', access: 'Bookings, Tape Chart, Folios & KYC', landing: 'Reservation', bg: '#E0F2FE', border: '#BAE6FD' },
          { role: 'Housekeeping', title: 'Housekeeping Team', access: 'Room Status Board, Maintenance & Linen', landing: 'Housekeeping', bg: '#D1FAE5', border: '#A7F3D0' },
          { role: 'Kitchen', title: 'Kitchen & F&B Crew', access: 'Kitchen POS, KDS Tickets & Ingredients', landing: 'Concierge (KDS)', bg: '#FEE2E2', border: '#FECDD3' }
        ].map((info) => (
          <div key={info.role} className="lodgify-card" style={{ padding: '16px', backgroundColor: info.bg, borderColor: info.border }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '4px' }}>
              {info.title}
            </div>
            <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4, marginBottom: '8px' }}>
              {info.access}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>
              📍 Landing tab: <u>{info.landing}</u>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="lodgify-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #E8EEF5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} color="#0F172A" />
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Configured Staff Accounts & Granular Module Rights ({users.length})
            </h3>
          </div>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Role-based access dynamically controls UI dashboards and visible tabs.
          </span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Username</th>
              <th>Assigned Role</th>
              <th>Department</th>
              <th>Authorized Functional Modules</th>
              <th>Landing View</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const badge = getRoleBadge(u.role);
              const allowed = u.allowedTabs || [];
              return (
                <tr key={u.id}>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0F172A' }}>{u.name}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>Created: {u.createdAt}</div>
                  </td>
                  <td>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      backgroundColor: '#F1F5F9',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#0F172A'
                    }}>
                      {u.username}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      backgroundColor: badge.bg,
                      color: badge.color,
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '9999px'
                    }}>
                      {badge.label}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>
                      {u.department}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {allowed.map((modId) => (
                        <span key={modId} style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'capitalize'
                        }}>
                          {modId}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0F172A',
                      backgroundColor: '#E2E8F0',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {u.landingTab}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => openEditModal(u)}
                        title="Edit Role & Module Rights"
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#0F172A'
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Edit Rights</span>
                      </button>
                      {u.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.username)}
                          title="Delete User"
                          style={{
                            padding: '6px 8px',
                            backgroundColor: '#FEF2F2',
                            border: '1px solid #FEE2E2',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#EF4444'
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CREATE / EDIT USER MODAL WITH FUNCTION MODULE ACCESS RIGHTS */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '28px', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#D4F05B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {editingUserId ? <Edit3 size={20} color="#0F172A" /> : <UserPlus size={20} color="#0F172A" />}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {editingUserId ? 'Edit Staff Role & Module Access Rights' : 'Add New User & Assign Access Rights'}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                    Select role presets or customize individual module access for staff logins.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Basic Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Username / Login ID *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingUserId)}
                    placeholder="e.g. sarah_frontdesk"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px', backgroundColor: editingUserId ? '#F1F5F9' : '#FFFFFF' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    {editingUserId ? 'Password (Leave blank to keep unchanged)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    required={!editingUserId}
                    placeholder="Enter account password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Front Office, F&B, Housekeeping"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="input-clean"
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                </div>
              </div>

              {/* 1. Base Role Selection */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                  Select Base Role Preset
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {(['Admin', 'Reception', 'Housekeeping', 'Kitchen'] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => handleRoleSelect(r)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: formData.role === r ? '2px solid #0F172A' : '1px solid #E2E8F0',
                        backgroundColor: formData.role === r ? '#F8FAFC' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{r}</span>
                        {formData.role === r && <Check size={14} color="#0F172A" />}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                        {r === 'Admin' ? 'Full Access' : r === 'Reception' ? 'Front Desk & KYC' : r === 'Housekeeping' ? 'Turnover & Tasks' : 'KDS POS & Food'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Granular Functional Module Access Rights */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', margin: 0, display: 'block' }}>
                      Functional Module Access Rights ({formData.allowedTabs.length} / {AVAILABLE_MODULES.length} Selected)
                    </label>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Toggle individual modules to grant or restrict specific application capabilities.
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#0369A1',
                        backgroundColor: '#E0F2FE',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#64748B',
                        backgroundColor: '#E2E8F0',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {AVAILABLE_MODULES.map((mod) => {
                    const IconComp = mod.icon;
                    const isChecked = formData.allowedTabs.includes(mod.id);
                    return (
                      <div
                        key={mod.id}
                        onClick={() => toggleModule(mod.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px',
                          borderRadius: '8px',
                          backgroundColor: isChecked ? '#FFFFFF' : '#F1F5F9',
                          border: isChecked ? '1.5px solid #0E94A8' : '1px solid #E2E8F0',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleModule(mod.id)}
                          style={{ accentColor: '#0E94A8', width: '16px', height: '16px' }}
                        />
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: isChecked ? '#E0F2FE' : '#E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <IconComp size={15} color={isChecked ? '#0369A1' : '#64748B'} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: isChecked ? '#0F172A' : '#64748B' }}>
                            {mod.label}
                          </div>
                          <div style={{ fontSize: '10px', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {mod.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Landing View Selection */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Initial Landing Tab on Login
                </label>
                <select
                  value={formData.landingTab}
                  onChange={(e) => setFormData({ ...formData, landingTab: e.target.value })}
                  className="input-clean"
                  style={{ width: '100%', borderRadius: '10px' }}
                >
                  {formData.allowedTabs.map(tabId => {
                    const mod = AVAILABLE_MODULES.find(m => m.id === tabId);
                    return (
                      <option key={tabId} value={tabId}>
                        {mod ? mod.label : tabId} ({tabId})
                      </option>
                    );
                  })}
                </select>
                <p style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  When this user signs in, they will automatically land on this functional workspace.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingUserId ? 'Save Permissions' : 'Create User & Assign Access'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
