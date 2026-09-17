import React from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  BedDouble, 
  MessageSquare, 
  Sparkles, 
  Package, 
  Calendar, 
  ReceiptText, 
  Star, 
  UtensilsCrossed, 
  Users, 
  ShieldCheck,
  UserCog,
  LogOut
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'reservation' 
  | 'rooms' 
  | 'messages' 
  | 'housekeeping' 
  | 'inventory' 
  | 'calendar' 
  | 'financials' 
  | 'reviews' 
  | 'concierge' 
  | 'staff' 
  | 'users'
  | 'audit';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  allowedTabs?: string[];
  userRole?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  allowedTabs,
  userRole,
  onLogout
}) => {
  const allMenuItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reservation' as TabType, label: 'Reservation', icon: CalendarCheck },
    { id: 'rooms' as TabType, label: 'Rooms', icon: BedDouble },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare, badge: '2' },
    { id: 'housekeeping' as TabType, label: 'Housekeeping', icon: Sparkles },
    { id: 'inventory' as TabType, label: userRole === 'Kitchen' ? 'Kitchen Inventory' : 'Inventory', icon: Package },
    { id: 'calendar' as TabType, label: 'Calendar', icon: Calendar },
    { id: 'financials' as TabType, label: 'Billing & Invoicing', icon: ReceiptText },
    { id: 'reviews' as TabType, label: 'Reviews', icon: Star },
    { id: 'concierge' as TabType, label: userRole === 'Kitchen' ? 'Kitchen Display & POS' : 'Concierge & POS', icon: UtensilsCrossed },
    { id: 'staff' as TabType, label: 'Staff & HR', icon: Users },
    { id: 'users' as TabType, label: 'Users & RBAC', icon: UserCog },
    { id: 'audit' as TabType, label: 'Audit & Sync', icon: ShieldCheck },
  ];

  // Filter menu items by user's assigned role permissions
  const menuItems = allowedTabs 
    ? allMenuItems.filter(item => allowedTabs.includes(item.id))
    : allMenuItems;

  return (
    <aside style={{
      width: '230px',
      minWidth: '230px',
      backgroundColor: '#0E94A8',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      minHeight: '100vh',
      color: '#FFFFFF'
    }}>
      {/* Brand Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        paddingLeft: '10px',
        marginBottom: '22px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 4px)',
          gap: '2px',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{
              width: '4px',
              height: '4px',
              backgroundColor: '#FFFFFF',
              borderRadius: '1px'
            }} />
          ))}
        </div>
        <span style={{
          fontSize: '19px',
          fontWeight: '800',
          color: '#FFFFFF',
          letterSpacing: '-0.3px'
        }}>
          Lodgify
        </span>
        <span style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: '700',
          padding: '2px 7px',
          borderRadius: '9999px',
          marginLeft: '4px'
        }}>
          v1.0
        </span>
      </div>

      {/* Role Pill Banner */}
      {userRole && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          borderRadius: '10px',
          marginBottom: '14px',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' }}>Portal:</span>
          <span style={{ fontWeight: '800', color: '#FFFFFF' }}>
            {userRole === 'Admin' ? '👑 Admin' : userRole === 'Reception' ? '🏨 Reception' : userRole === 'Housekeeping' ? '🧹 Housekeeping' : '🍳 Kitchen'}
          </span>
        </div>
      )}

      {/* Nav Menu Items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? '#0E94A8' : '#FFFFFF',
                fontWeight: isActive ? '800' : '600',
                fontSize: '13px',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? '#0E94A8' : '#FFFFFF'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sign Out Action Button */}
      {onLogout && (
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          <LogOut size={15} color="#FFFFFF" />
          <span>Sign Out</span>
        </button>
      )}

      {/* Footer Pill */}
      <div style={{
        marginTop: 'auto',
        padding: '10px 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#A7F3D0'
        }} />
        <div style={{ fontSize: '10px' }}>
          <div style={{ fontWeight: '700', color: '#FFFFFF' }}>Azure AKS Host</div>
          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>PMS Channels Active</div>
        </div>
      </div>
    </aside>
  );
};
