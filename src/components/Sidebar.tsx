import React, { useState, useEffect } from 'react';
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
  SlidersHorizontal,
  LogOut,
  Menu,
  Pin,
  PinOff
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
  | 'admin'
  | 'audit';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  allowedTabs?: string[];
  userRole?: string;
  onLogout?: () => void;
  onPinnedChange?: (pinned: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  allowedTabs,
  userRole,
  onLogout,
  onPinnedChange
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(() => {
    return localStorage.getItem('hms_sidebar_pinned') === 'true';
  });

  const [isScreenSmall, setIsScreenSmall] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1100 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth < 1100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    return localStorage.getItem('hms_hotel_logo');
  });

  const effectivePinned = isPinned && !isScreenSmall;

  useEffect(() => {
    onPinnedChange?.(effectivePinned);
  }, [effectivePinned, onPinnedChange]);

  const togglePin = () => {
    const next = !isPinned;
    setIsPinned(next);
    localStorage.setItem('hms_sidebar_pinned', String(next));
    onPinnedChange?.(next);
  };

  useEffect(() => {
    const updateLogo = () => {
      setCustomLogo(localStorage.getItem('hms_hotel_logo'));
    };

    window.addEventListener('hms_logo_updated', updateLogo);
    window.addEventListener('storage', updateLogo);

    const cached = localStorage.getItem('hms_hotel_logo');
    if (!cached) {
      fetch('/api/hotel/properties')
        .then(res => res.json())
        .then(data => {
          if (data.property?.logoUrl) {
            setCustomLogo(data.property.logoUrl);
            localStorage.setItem('hms_hotel_logo', data.property.logoUrl);
          }
        })
        .catch(() => {});
    }

    return () => {
      window.removeEventListener('hms_logo_updated', updateLogo);
      window.removeEventListener('storage', updateLogo);
    };
  }, []);

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
    { id: 'admin' as TabType, label: 'Master Data & Admin', icon: SlidersHorizontal },
    { id: 'users' as TabType, label: 'Users & RBAC', icon: UserCog },
    { id: 'audit' as TabType, label: 'Audit & Sync', icon: ShieldCheck },
  ];

  // Filter menu items by user's assigned role permissions
  const menuItems = allowedTabs 
    ? allMenuItems.filter(item => allowedTabs.includes(item.id))
    : allMenuItems;

  const isVisible = effectivePinned || isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: effectivePinned ? 'relative' : 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: effectivePinned ? '240px' : '0px',
        minWidth: effectivePinned ? '240px' : '0px',
        zIndex: 1000,
        display: 'flex'
      }}
    >
      {/* Floating Peek Handle (Shown only when unpinned and not hovering) */}
      {!effectivePinned && !isHovered && (
        <div
          className="sidebar-peek-handle"
          title="Hover to open navigation menu"
          style={{
            position: 'fixed',
            left: 0,
            top: '16px',
            width: '38px',
            height: '44px',
            backgroundColor: '#0E94A8',
            borderRadius: '0 12px 12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '2px 3px 12px rgba(14, 148, 168, 0.4)',
            zIndex: 999,
            transition: 'transform 0.15s ease, background-color 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Menu size={20} />
        </div>
      )}

      {/* Main Collapsible / Hoverable Sidebar Aside */}
      <aside 
        className="app-sidebar"
        style={{
        width: '240px',
        minWidth: '240px',
        backgroundColor: '#0E94A8',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        minHeight: '100vh',
        height: '100vh',
        color: '#FFFFFF',
        transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s ease',
        boxShadow: (!effectivePinned && isVisible) ? '10px 0 35px rgba(0, 0, 0, 0.35)' : 'none',
        overflowY: 'auto'
      }}>
        {/* Brand Logo & Pin Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          paddingLeft: '4px',
          marginBottom: '20px'
        }}>
          {customLogo ? (
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              flexShrink: 0
            }}>
              <img
                src={customLogo}
                alt="Hotel Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          ) : (
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
          )}
          <span style={{
            fontSize: '18px',
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: '-0.3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            Lodgify
          </span>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 6px',
            borderRadius: '9999px',
            marginLeft: 'auto'
          }}>
            v1.0
          </span>

          {/* Pin / Unpin Button */}
          <button
            onClick={togglePin}
            title={isPinned ? 'Unpin sidebar (Auto-hide on hover)' : 'Pin sidebar open'}
            style={{
              background: isPinned ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              padding: '4px',
              cursor: 'pointer',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s ease'
            }}
          >
            {isPinned ? <PinOff size={15} /> : <Pin size={15} />}
          </button>
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
              onClick={() => {
                setActiveTab(item.id);
                if (!effectivePinned) setIsHovered(false);
              }}
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
    </div>
  );
};
