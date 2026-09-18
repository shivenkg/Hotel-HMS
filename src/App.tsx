import React, { useState } from 'react';
import { Sidebar, type TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './pages/DashboardView';
import { ReservationsView } from './pages/ReservationsView';
import { CalendarView } from './pages/CalendarView';
import { HousekeepingView } from './pages/HousekeepingView';
import { FinancialsView } from './pages/FinancialsView';
import { ConciergeView } from './pages/ConciergeView';
import { InventoryView } from './pages/InventoryView';
import { StaffView } from './pages/StaffView';
import { ReviewsView } from './pages/ReviewsView';
import { AuditView } from './pages/AuditView';
import { LoginView } from './pages/LoginView';
import { UsersView } from './pages/UsersView';
import { AdminMasterView } from './pages/AdminMasterView';

interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: 'Admin' | 'Reception' | 'Housekeeping' | 'Kitchen';
  department: string;
  allowedTabs: string[];
  landingTab: string;
}

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('hms_auth_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'Admin' && !u.allowedTabs.includes('admin')) {
          u.allowedTabs.push('admin');
        }
        return u;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      const saved = localStorage.getItem('hms_auth_user');
      if (saved) {
        const u = JSON.parse(saved);
        return (u.landingTab as TabType) || 'dashboard';
      }
    } catch {
      // default
    }
    return 'dashboard';
  });

  const [isSyncingOta, setIsSyncingOta] = useState(false);

  const handleLoginSuccess = (user: AuthUser) => {
    if (user.role === 'Admin' && !user.allowedTabs.includes('admin')) {
      user.allowedTabs.push('admin');
    }
    setCurrentUser(user);
    localStorage.setItem('hms_auth_user', JSON.stringify(user));
    const target = (user.landingTab as TabType) || 'dashboard';
    setActiveTab(target);
  };

  const handleLogout = () => {
    localStorage.removeItem('hms_auth_user');
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleSyncOta = () => {
    setIsSyncingOta(true);
    setTimeout(() => {
      setIsSyncingOta(false);
      alert('OTA Channels (Booking.com, Expedia, Airbnb) successfully synchronized!');
    }, 1200);
  };

  const getPageTitle = (tab: TabType): string => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'reservation': return 'Front Desk Reservations';
      case 'rooms': return 'Rooms & Suites Matrix';
      case 'messages': return 'Guest Messages';
      case 'housekeeping': return 'Housekeeping & Maintenance';
      case 'inventory': return currentUser?.role === 'Kitchen' ? 'Kitchen Inventory' : 'Inventory & Operations';
      case 'calendar': return 'Front Desk';
      case 'financials': return 'Billing & Invoicing';
      case 'reviews': return 'Guest Reviews & Loyalty';
      case 'concierge': return currentUser?.role === 'Kitchen' ? 'Kitchen Display & POS' : 'Concierge & POS';
      case 'staff': return 'Staff & HR';
      case 'users': return 'User Access & RBAC Administration';
      case 'admin': return 'Master Data & Admin Center';
      case 'audit': return 'Audit Logs & OTA Sync';
      default: return 'Hotel Management System';
    }
  };

  // If user is not logged in, render the Lodgify Login Page
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ display: 'flex', width: '100%', maxWidth: '100vw', minHeight: '100vh', backgroundColor: 'var(--bg-app)', overflowX: 'hidden', transition: 'background-color 0.2s ease' }}>
      {/* Left Sidebar (default hidden, visible on mouse hover, with pin support) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        allowedTabs={currentUser.allowedTabs}
        userRole={currentUser.role}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        overflowX: 'hidden'
      }}>
        <Header 
          title={getPageTitle(activeTab)} 
          onSyncOta={handleSyncOta} 
          isSyncing={isSyncingOta} 
          currentUser={currentUser}
          onLogout={handleLogout}
          onNavigateTab={setActiveTab}
        />

        <main style={{ flex: 1 }}>
          {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} currentUser={currentUser} />}
          {activeTab === 'reservation' && <ReservationsView onNavigateTab={setActiveTab} />}
          {activeTab === 'rooms' && <CalendarView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'housekeeping' && <HousekeepingView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'financials' && <FinancialsView />}
          {activeTab === 'concierge' && <ConciergeView />}
          {activeTab === 'staff' && <StaffView />}
          {activeTab === 'reviews' && <ReviewsView />}
          {activeTab === 'audit' && <AuditView />}
          {activeTab === 'users' && currentUser.role === 'Admin' && <UsersView />}
          {activeTab === 'admin' && currentUser.role === 'Admin' && <AdminMasterView />}
          {activeTab === 'messages' && (
            <div className="animate-fade-in" style={{ padding: '32px' }}>
              <div className="lodgify-card" style={{ maxWidth: '640px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '12px' }}>
                  Guest Messages & Auto-Alerts
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#0F172A', fontSize: '13px' }}>Sophia Laurent (Room 101)</strong>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>10 mins ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569' }}>
                      "Could we please arrange for extra feather pillows and a late turndown service tonight?"
                    </p>
                  </div>
                  <div style={{ padding: '14px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#0F172A', fontSize: '13px' }}>Marcus Chen (Room 102)</strong>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>1 hour ago</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#475569' }}>
                      "Confirmed arrival at 21:00. The digital check-in link worked smoothly."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
