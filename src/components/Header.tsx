import React, { useState, useEffect } from 'react';
import { Search, Bell, Settings, RefreshCw, LogOut, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
  onSyncOta?: () => void;
  isSyncing?: boolean;
  isSyncingOta?: boolean;
  currentUser?: {
    name: string;
    username: string;
    role: string;
    department?: string;
  };
  onLogout?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSyncOta, 
  isSyncing,
  isSyncingOta,
  currentUser,
  onLogout,
  onNavigateTab
}) => {
  const syncing = Boolean(isSyncing || isSyncingOta);
  const userName = currentUser?.name || 'Jaylon Dorwart';
  const userRole = currentUser?.role || 'Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') || localStorage.getItem('hms_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return document.body.classList.contains('dark') ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('theme', theme);
    localStorage.setItem('hms_theme', theme);
    window.dispatchEvent(new CustomEvent('hms_theme_changed', { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return { bg: '#FEF08A', color: '#854D0E' };
      case 'Reception': return { bg: '#BAE6FD', color: '#0369A1' };
      case 'Housekeeping': return { bg: '#A7F3D0', color: '#065F46' };
      case 'Kitchen': return { bg: '#FECDD3', color: '#991B1B' };
      default: return { bg: '#E2E8F0', color: '#334155' };
    }
  };

  const roleStyle = getRoleColor(userRole);

  return (
    <header className="app-header" style={{
      height: '76px',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: 'clamp(18px, 2vw, 22px)',
        fontWeight: '800',
        color: 'var(--text-main)',
        letterSpacing: '-0.3px',
        margin: 0
      }}>
        {title}
      </h1>

      {/* Right controls: Search + Actions + User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search input pill */}
        <div className="app-header-search" style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '260px'
        }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
          <input
            type="text"
            placeholder="Search room, guest, book, etc"
            className="input-clean"
            style={{
              width: '100%',
              paddingLeft: '42px',
              paddingRight: '16px',
              backgroundColor: '#F8FAFC',
              borderColor: '#E8EEF5',
              fontSize: '13px'
            }}
          />
        </div>

        {/* OTA Channel Sync button */}
        {onSyncOta && userRole === 'Admin' && (
          <button
            id="ota-sync-btn"
            onClick={onSyncOta}
            disabled={syncing}
            title={syncing ? 'Synchronizing OTA channels (Booking.com, Expedia, Airbnb)...' : 'Synchronize OTA Channels'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '700',
              padding: '8px 14px',
              borderRadius: '9999px',
              border: syncing ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
              backgroundColor: syncing ? 'rgba(14, 148, 168, 0.08)' : 'var(--bg-card)',
              color: syncing ? 'var(--color-primary)' : 'var(--text-main)',
              cursor: syncing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: syncing ? '0 0 10px rgba(14, 148, 168, 0.2)' : 'none'
            }}
          >
            <RefreshCw 
              size={13} 
              className={syncing ? 'animate-spin' : ''} 
              style={{
                animation: syncing ? 'spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
                display: 'inline-block',
                transformOrigin: 'center'
              }}
              color={syncing ? 'var(--color-primary)' : '#10B981'} 
            />
            <span>{syncing ? 'Syncing OTA...' : 'OTA Sync'}</span>
          </button>
        )}

        {/* Theme Toggle Button (Dark / Light Scheme) */}
        <button
          id="theme-toggle-btn"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: theme === 'dark' ? 'rgba(251, 191, 36, 0.12)' : '#F1F5F9',
            border: theme === 'dark' ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid var(--border-subtle)',
            cursor: 'pointer',
            padding: '7px 12px',
            color: theme === 'dark' ? '#FBBF24' : '#475569',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
            transition: 'all 0.18s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {theme === 'light' ? (
            <>
              <Moon size={15} color="#475569" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun size={15} color="#FBBF24" />
              <span style={{ color: '#FDE047' }}>Light Mode</span>
            </>
          )}
        </button>

        {/* Settings Button */}
        {userRole === 'Admin' && (
          <button 
            onClick={() => onNavigateTab?.('admin')}
            title="Master Data & Admin Settings"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: '#64748B',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Settings size={18} />
          </button>
        )}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: '#64748B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={18} />
          </button>
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: '#EF4444',
            borderRadius: '50%',
            border: '2px solid #FFFFFF'
          }} />
        </div>

        {/* User Profile Badge */}
        <div 
          onClick={() => userRole === 'Admin' && onNavigateTab?.('admin')}
          title={userRole === 'Admin' ? 'Open Master Data & Admin Profile' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            paddingLeft: '12px',
            borderLeft: '1px solid #E8EEF5',
            cursor: userRole === 'Admin' ? 'pointer' : 'default'
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFE4E6, #FECDD3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            color: '#E11D48',
            fontSize: '13px',
            border: '2px solid #FFFFFF',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            {initials}
          </div>
          <div className="header-user-info">
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
              {userName}
            </div>
            <span style={{
              display: 'inline-block',
              backgroundColor: roleStyle.bg,
              color: roleStyle.color,
              fontSize: '10px',
              fontWeight: '800',
              padding: '1px 6px',
              borderRadius: '9999px',
              marginTop: '2px'
            }}>
              {userRole}
            </span>
          </div>

          {/* Sign Out Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                padding: '6px',
                borderRadius: '8px'
              }}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
