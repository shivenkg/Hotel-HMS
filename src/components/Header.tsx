import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  RefreshCw, 
  LogOut, 
  X, 
  BedDouble, 
  User, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Command,
  Crown,
  History,
  Trash2
} from 'lucide-react';
import { HOTEL_SEARCH_DATABASE, SearchResultItem } from '../data/hotelSearchData';
import { TOP_GUESTS, GuestProfile, getGuestByNameOrRef } from '../data/topGuestsData';
import { GuestProfileModal } from './GuestProfileModal';

interface HeaderProps {
  title: string;
  onSyncOta?: () => void;
  isSyncing?: boolean;
  currentUser?: {
    name: string;
    username: string;
    role: string;
    department?: string;
  };
  onLogout?: () => void;
  onNavigateTab?: (tab: string) => void;
}

const DEFAULT_RECENT_SEARCHES = [
  'Sophia Laurent',
  'Room 101',
  'Lord Alistair Sterling',
  'Presidential Suite',
  'BK-2026-905'
];

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onSyncOta, 
  isSyncing,
  currentUser,
  onLogout,
  onNavigateTab
}) => {
  const userName = currentUser?.name || 'Jaylon Dorwart';
  const userRole = currentUser?.role || 'Admin';
  const initials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'top_guests' | 'guest' | 'booking' | 'room'>('all');
  const [selectedGuestProfile, setSelectedGuestProfile] = useState<GuestProfile | null>(null);

  // Recent Searches state with localStorage persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('hms_recent_searches');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('hms_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(t => t !== term);
      try {
        localStorage.setItem('hms_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('hms_recent_searches');
    } catch {}
  };

  // Global Keyboard shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Top Guests
  const filteredTopGuests = TOP_GUESTS.filter(guest => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      guest.name.toLowerCase().includes(q) ||
      guest.vipTier.toLowerCase().includes(q) ||
      guest.currentRoom?.toLowerCase().includes(q) ||
      guest.nationality.toLowerCase().includes(q) ||
      guest.currentBookingRef?.toLowerCase().includes(q)
    );
  });

  // Filter search results
  const filteredResults = HOTEL_SEARCH_DATABASE.filter(item => {
    if (activeFilter === 'top_guests') return false; // Handled separately
    const matchesCategory = activeFilter === 'all' || item.type === activeFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchTitle = item.title.toLowerCase().includes(query);
    const matchSubtitle = item.subtitle.toLowerCase().includes(query);
    const matchRoom = item.details.roomNumber?.toLowerCase().includes(query);
    const matchBooking = item.details.bookingId?.toLowerCase().includes(query);
    const matchGuest = item.details.guestName?.toLowerCase().includes(query);
    const matchStatus = item.details.status?.toLowerCase().includes(query);
    const matchCategory = item.details.category?.toLowerCase().includes(query);

    return matchTitle || matchSubtitle || matchRoom || matchBooking || matchGuest || matchStatus || matchCategory;
  });

  // Filter matching recent searches
  const filteredRecentSearches = searchQuery.trim()
    ? recentSearches.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : recentSearches;

  const guestsCount = HOTEL_SEARCH_DATABASE.filter(i => i.type === 'guest').length;
  const bookingsCount = HOTEL_SEARCH_DATABASE.filter(i => i.type === 'booking').length;
  const roomsCount = HOTEL_SEARCH_DATABASE.filter(i => i.type === 'room').length;

  const handleSelectItem = (item: SearchResultItem) => {
    saveRecentSearch(item.title);
    setIsSearchOpen(false);
    setSearchQuery('');
    if (item.type === 'guest') {
      const profile = getGuestByNameOrRef(item.title) || getGuestByNameOrRef(item.details.guestName || '');
      if (profile) {
        setSelectedGuestProfile(profile);
        return;
      }
    }
    if (onNavigateTab) {
      onNavigateTab(item.targetTab);
    }
  };

  const handleSelectTopGuest = (guest: GuestProfile) => {
    saveRecentSearch(guest.name);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSelectedGuestProfile(guest);
  };

  const handleSelectRecentSearch = (term: string) => {
    setSearchQuery(term);
    saveRecentSearch(term);
    // If exact guest match, open profile
    const profile = getGuestByNameOrRef(term);
    if (profile) {
      setIsSearchOpen(false);
      setSelectedGuestProfile(profile);
    } else {
      searchInputRef.current?.focus();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SuperAdmin': return { bg: '#F3E8FF', color: '#6B21A8' };
      case 'Admin': return { bg: '#FEF08A', color: '#854D0E' };
      case 'Reception': return { bg: '#BAE6FD', color: '#0369A1' };
      case 'Housekeeping': return { bg: '#A7F3D0', color: '#065F46' };
      case 'Kitchen': return { bg: '#FECDD3', color: '#991B1B' };
      default: return { bg: '#E2E8F0', color: '#334155' };
    }
  };

  const roleStyle = getRoleColor(userRole);

  return (
    <header style={{
      height: '76px',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E8EEF5',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Title */}
      <h1 style={{
        fontSize: '22px',
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: '-0.3px',
        margin: 0
      }}>
        {title}
      </h1>

      {/* Right controls: Search + Actions + User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* CROSS-ENTITY SEARCH BAR (Guests, Bookings, Room Numbers) */}
        <div 
          ref={searchContainerRef} 
          style={{ position: 'relative', width: '340px' }}
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} />
            
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isSearchOpen) setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search guests, bookings, rooms... (⌘K)"
              className="input-clean"
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '66px',
                backgroundColor: isSearchOpen ? '#FFFFFF' : '#F8FAFC',
                borderColor: isSearchOpen ? '#0E94A8' : '#E8EEF5',
                boxShadow: isSearchOpen ? '0 0 0 3px rgba(14, 148, 168, 0.12)' : 'none',
                fontSize: '13px',
                transition: 'all 0.2s ease',
                height: '40px',
                borderRadius: '10px'
              }}
            />

            {/* Clear Button or ⌘K Shortcut Pill */}
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={14} />
              </button>
            ) : (
              <div style={{
                position: 'absolute',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                backgroundColor: '#EDF2F7',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '2px 6px',
                fontSize: '10px',
                fontWeight: '700',
                color: '#64748B',
                pointerEvents: 'none'
              }}>
                <span>⌘K</span>
              </div>
            )}
          </div>

          {/* SEARCH RESULTS DROPDOWN POPUP */}
          {isSearchOpen && (
            <div 
              className="animate-fade-in"
              style={{
                position: 'absolute',
                top: '48px',
                left: 0,
                width: '460px',
                maxHeight: '480px',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.15)',
                zIndex: 100,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Filter Tabs Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                overflowX: 'auto'
              }}>
                {[
                  { id: 'all', label: `All (${HOTEL_SEARCH_DATABASE.length})`, icon: Sparkles },
                  { id: 'top_guests', label: `Top Guests (${TOP_GUESTS.length})`, icon: Crown },
                  { id: 'guest', label: `Guests (${guestsCount})`, icon: User },
                  { id: 'booking', label: `Bookings (${bookingsCount})`, icon: FileText },
                  { id: 'room', label: `Rooms (${roomsCount})`, icon: BedDouble }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id as any)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      border: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: activeFilter === tab.id ? '#0F172A' : '#FFFFFF',
                      color: activeFilter === tab.id ? '#FFFFFF' : '#64748B',
                      cursor: 'pointer',
                      boxShadow: activeFilter === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.03)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <tab.icon size={12} color={tab.id === 'top_guests' && activeFilter !== tab.id ? '#D97706' : undefined} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Scrollable Content (Recent Searches + Top Guests + Results) */}
              <div style={{ overflowY: 'auto', maxHeight: '400px', padding: '10px' }}>
                
                {/* 1. RECENT SEARCHES DROPDOWN LIST */}
                {filteredRecentSearches.length > 0 && activeFilter === 'all' && (
                  <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <History size={12} /> Recent Searches
                      </span>
                      <button
                        onClick={clearAllRecentSearches}
                        style={{ background: 'none', border: 'none', fontSize: '10px', color: '#94A3B8', cursor: 'pointer', fontWeight: '600' }}
                        className="hover:text-red-500"
                      >
                        Clear All
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {filteredRecentSearches.map((term, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectRecentSearch(term)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          className="hover:bg-slate-200"
                        >
                          <Clock size={11} color="#64748B" />
                          <span>{term}</span>
                          <button
                            onClick={(e) => removeRecentSearch(term, e)}
                            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', color: '#94A3B8', cursor: 'pointer' }}
                            className="hover:text-red-500"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TOP GUESTS DROPDOWN LIST */}
                {(activeFilter === 'all' || activeFilter === 'top_guests') && filteredTopGuests.length > 0 && (
                  <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: activeFilter === 'all' ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', padding: '0 4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#B45309', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <Crown size={13} color="#D97706" /> Top VIP Guests (High LTV)
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>
                        Click to view profile & history
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {filteredTopGuests.slice(0, activeFilter === 'top_guests' ? 10 : 4).map((tg) => (
                        <div
                          key={tg.id}
                          onClick={() => handleSelectTopGuest(tg)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            backgroundColor: '#FEFCE8',
                            border: '1px solid #FEF08A',
                            transition: 'all 0.15s ease'
                          }}
                          className="hover:bg-amber-100/70"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: tg.avatarColor,
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '11px',
                              flexShrink: 0
                            }}>
                              {tg.avatarInitials}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                                  {tg.name}
                                </span>
                                <span style={{
                                  fontSize: '9px',
                                  fontWeight: '800',
                                  backgroundColor: tg.vipTierColor.bg,
                                  color: tg.vipTierColor.text,
                                  border: `1px solid ${tg.vipTierColor.border}`,
                                  padding: '1px 5px',
                                  borderRadius: '4px'
                                }}>
                                  {tg.vipTier}
                                </span>
                              </div>
                              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '1px' }}>
                                {tg.currentRoom ? `In-House (Room ${tg.currentRoom})` : 'Frequent Guest'} • {tg.totalVisits} Stays ({tg.totalNights} Nights)
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
                            <div>
                              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                                ₹{tg.lifetimeValue.toLocaleString()}
                              </div>
                              <div style={{ fontSize: '9px', color: '#059669', fontWeight: '700' }}>
                                Lifetime Value
                              </div>
                            </div>
                            <ArrowRight size={13} color="#94A3B8" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. STANDARD FILTERED RESULTS (Guests, Bookings, Rooms) */}
                {activeFilter !== 'top_guests' && (
                  <div>
                    {activeFilter === 'all' && (
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '6px', padding: '0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Property Database Results
                      </div>
                    )}

                    {filteredResults.length === 0 && filteredTopGuests.length === 0 ? (
                      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94A3B8' }}>
                        <Search size={26} style={{ margin: '0 auto 6px auto', opacity: 0.5 }} />
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>
                          No matching hotel records found
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                          Try typing a guest name (e.g. "Sophia"), room number (e.g. "101"), or booking ID.
                        </div>
                      </div>
                    ) : (
                      filteredResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectItem(item)}
                          style={{
                            padding: '9px 10px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                            marginBottom: '3px'
                          }}
                          className="hover:bg-slate-50"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Icon based on entity type */}
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: 
                                item.type === 'room' ? '#E0F2FE' :
                                item.type === 'guest' ? '#ECFDF5' : '#FEF3C7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {item.type === 'room' && <BedDouble size={16} color="#0369A1" />}
                              {item.type === 'guest' && <User size={16} color="#065F46" />}
                              {item.type === 'booking' && <FileText size={16} color="#92400E" />}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                                  {item.title}
                                </span>
                                <span style={{
                                  fontSize: '9px',
                                  fontWeight: '800',
                                  backgroundColor: item.badgeColor.bg,
                                  color: item.badgeColor.text,
                                  border: item.badgeColor.border ? `1px solid ${item.badgeColor.border}` : 'none',
                                  padding: '1px 5px',
                                  borderRadius: '4px'
                                }}>
                                  {item.badge}
                                </span>
                              </div>
                              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px' }}>
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {item.details.amount && (
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>
                                {item.details.amount}
                              </span>
                            )}
                            <ArrowRight size={13} color="#94A3B8" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Quick Navigation Footer */}
              <div style={{
                padding: '9px 14px',
                backgroundColor: '#F8FAFC',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#64748B'
              }}>
                <span>Press <strong>ESC</strong> to dismiss</span>
                <span style={{ color: '#0E94A8', fontWeight: '700' }}>
                  Click to inspect details & guest profile
                </span>
              </div>
            </div>
          )}
        </div>

        {/* OTA Channel Sync button */}
        {onSyncOta && userRole === 'Admin' && (
          <button
            onClick={onSyncOta}
            disabled={isSyncing}
            className={isSyncing ? 'ota-sync-pulse' : ''}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '12px',
              fontWeight: '700',
              padding: '8px 15px',
              borderRadius: '9999px',
              border: isSyncing ? '1px solid #10B981' : '1px solid #E2E8F0',
              backgroundColor: isSyncing ? '#ECFDF5' : '#FFFFFF',
              color: isSyncing ? '#065F46' : '#0F172A',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease'
            }}
          >
            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} color={isSyncing ? '#059669' : '#10B981'} />
            <span>{isSyncing ? 'Syncing Channels...' : 'Sync Channels'}</span>
            {isSyncing && (
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'inline-block'
                }}
                className="animate-pulse"
              />
            )}
          </button>
        )}

        {/* Settings Button */}
        {userRole === 'Admin' && (
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingLeft: '12px',
          borderLeft: '1px solid #E8EEF5'
        }}>
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
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', lineHeight: 1.2 }}>
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

      {/* Guest Profile Modal from Global Header Search */}
      {selectedGuestProfile && (
        <GuestProfileModal
          guest={selectedGuestProfile}
          onClose={() => setSelectedGuestProfile(null)}
          onSelectBooking={(ref) => {
            setSelectedGuestProfile(null);
            if (onNavigateTab) onNavigateTab('reservations');
          }}
        />
      )}
    </header>
  );
};

