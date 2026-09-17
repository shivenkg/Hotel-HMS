import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (rememberMe) {
          localStorage.setItem('hms_auth_user', JSON.stringify(data.user));
        }
        onLoginSuccess(data.user);
      } else {
        setErrorMessage(data.error || 'Invalid User ID or Password');
      }
    } catch {
      // Fallback for standalone frontend if backend network fails
      let fallbackUser: any = null;
      if (username === 'admin' && password === 'admin123') {
        fallbackUser = {
          id: 'usr-1',
          name: 'Jaylon Dorwart',
          username: 'admin',
          role: 'Admin',
          department: 'Administration',
          allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'audit'],
          landingTab: 'dashboard'
        };
      } else if (username === 'reception' && password === 'rec123') {
        fallbackUser = {
          id: 'usr-2',
          name: 'Kavita Nair',
          username: 'reception',
          role: 'Reception',
          department: 'Front Office',
          allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'],
          landingTab: 'reservation'
        };
      } else if (username === 'cleaner' && password === 'clean123') {
        fallbackUser = {
          id: 'usr-3',
          name: 'Priya Sharma',
          username: 'cleaner',
          role: 'Housekeeping',
          department: 'Housekeeping',
          allowedTabs: ['housekeeping'],
          landingTab: 'housekeeping'
        };
      } else if (username === 'chef' && password === 'chef123') {
        fallbackUser = {
          id: 'usr-4',
          name: 'Antonio Rossi',
          username: 'chef',
          role: 'Kitchen',
          department: 'Food & Beverage',
          allowedTabs: ['concierge', 'inventory'],
          landingTab: 'concierge'
        };
      }

      if (fallbackUser) {
        if (rememberMe) {
          localStorage.setItem('hms_auth_user', JSON.stringify(fallbackUser));
        }
        onLoginSuccess(fallbackUser);
      } else {
        setErrorMessage('Invalid User ID or Password. Try quick-selecting a role above.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#F5F7FA',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background soft ambient glowing circles */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 240, 91, 0.25) 0%, rgba(212, 240, 91, 0) 70%)',
        filter: 'blur(40px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(167, 243, 208, 0.3) 0%, rgba(167, 243, 208, 0) 70%)',
        filter: 'blur(40px)',
        zIndex: 0
      }} />

      {/* Main Login Card */}
      <div className="lodgify-card animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        position: 'relative',
        zIndex: 1,
        borderRadius: '24px',
        boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(0, 0, 0, 0.05)',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5EBF2'
      }}>
        {/* Brand Logo & Version Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '24px'
        }}>
          {/* Lodgify 9-dot cube icon */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 5px)',
            gap: '3px',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{
                width: '5px',
                height: '5px',
                backgroundColor: '#0F172A',
                borderRadius: '1.5px'
              }} />
            ))}
          </div>
          <span style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#0F172A',
            letterSpacing: '-0.5px'
          }}>
            Lodgify
          </span>
          <span style={{
            backgroundColor: '#F4FBD0',
            color: '#4D6B00',
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '9999px',
            border: '1px solid #D4F05B'
          }}>
            v1.0
          </span>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#0F172A',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            Welcome Back
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
            Sign in to access your hotel operations portal
          </p>
        </div>

        {/* Quick Role Demo Selector */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '12px 14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quick-Select Role Account
            </span>
            <span style={{ fontSize: '10px', color: '#0F172A', fontWeight: '700', backgroundColor: '#E2E8F0', padding: '2px 8px', borderRadius: '9999px' }}>
              4 Profiles
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => { setUsername('admin'); setPassword('admin123'); setErrorMessage(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '10px',
                border: username === 'admin' ? '2px solid #0F172A' : '1px solid #E2E8F0',
                backgroundColor: username === 'admin' ? '#F4FBD0' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '14px' }}>👑</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>Admin</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>admin / admin123</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setUsername('reception'); setPassword('rec123'); setErrorMessage(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '10px',
                border: username === 'reception' ? '2px solid #0284C7' : '1px solid #E2E8F0',
                backgroundColor: username === 'reception' ? '#E0F2FE' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '14px' }}>🏨</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#0284C7' }}>Reception</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>reception / rec123</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setUsername('cleaner'); setPassword('clean123'); setErrorMessage(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '10px',
                border: username === 'cleaner' ? '2px solid #059669' : '1px solid #E2E8F0',
                backgroundColor: username === 'cleaner' ? '#D1FAE5' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '14px' }}>🧹</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#059669' }}>Housekeeping</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>cleaner / clean123</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setUsername('chef'); setPassword('chef123'); setErrorMessage(''); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 10px',
                borderRadius: '10px',
                border: username === 'chef' ? '2px solid #DC2626' : '1px solid #E2E8F0',
                backgroundColor: username === 'chef' ? '#FEE2E2' : '#FFFFFF',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '14px' }}>🍳</span>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#DC2626' }}>Kitchen</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>chef / chef123</div>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            borderRadius: '12px',
            padding: '12px 14px',
            fontSize: '12px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* User ID Field */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: '6px'
            }}>
              User ID
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                required
                placeholder="Enter user id (admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-clean"
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#0F172A' }}>
                Password
              </label>
              <span style={{ fontSize: '11px', color: '#64748B', cursor: 'pointer' }}>
                Forgot?
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '16px' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password (admin123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-clean"
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: '44px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#D4F05B' }}
              />
              <span>Remember this session</span>
            </label>
            <span style={{ color: '#10B981', fontWeight: '600', fontSize: '11px' }}>
              ● Production v1.0
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '13px 20px',
              fontSize: '14px',
              marginTop: '8px',
              borderRadius: '9999px',
              boxShadow: '0 4px 14px rgba(212, 240, 91, 0.4)'
            }}
          >
            <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={16} color="#0F172A" />
          </button>
        </form>

        {/* Footer Security Note */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '11px',
          color: '#94A3B8'
        }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Role-Based Access Control (RBAC) • 256-Bit Encryption</span>
        </div>
      </div>
    </div>
  );
};
