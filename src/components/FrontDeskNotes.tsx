import React, { useState, useEffect, useMemo } from 'react';
import { 
  StickyNote, 
  Plus, 
  Pin, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Sun, 
  Sunset, 
  Moon, 
  Search, 
  Filter, 
  Check, 
  X,
  MessageSquare,
  BedDouble,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export type ShiftType = 'Morning' | 'Evening' | 'Night';
export type NotePriority = 'Normal' | 'Important' | 'Urgent';
export type NoteCategory = 'General' | 'Guest Request' | 'VIP / Arrival' | 'Maintenance' | 'Handover' | 'Billing';

export interface FrontDeskNote {
  id: string;
  content: string;
  shift: ShiftType;
  author: string;
  role?: string;
  priority: NotePriority;
  category: NoteCategory;
  roomNumber?: string;
  isPinned: boolean;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
  displayTime: string;
}

const STORAGE_KEY = 'hms_front_desk_notes';

// Helper to determine active hotel shift based on current time
export const getCurrentShift = (): ShiftType => {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 15) return 'Morning';
  if (hour >= 15 && hour < 23) return 'Evening';
  return 'Night';
};

export const getShiftTimeRange = (shift: ShiftType): string => {
  switch (shift) {
    case 'Morning': return '07:00 - 15:00';
    case 'Evening': return '15:00 - 23:00';
    case 'Night': return '23:00 - 07:00';
  }
};

const INITIAL_SEED_NOTES: FrontDeskNote[] = [
  {
    id: 'note-1',
    content: 'VIP Guest Lady Eleanor Vance (Room 204) requested 2 extra feather pillows and late checkout at 1:30 PM. Fruit platter delivered.',
    shift: 'Morning',
    author: 'Priya Sharma',
    role: 'Front Desk Lead',
    priority: 'Important',
    category: 'VIP / Arrival',
    roomNumber: '204',
    isPinned: true,
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    displayTime: 'Today, 09:15 AM'
  },
  {
    id: 'note-2',
    content: 'Room 108 bedside lamp repair scheduled with engineering for 12:00 PM. Do not assign room to walk-ins until cleared by maintenance.',
    shift: 'Morning',
    author: 'Jaylon Dorwart',
    role: 'Admin / Manager',
    priority: 'Urgent',
    category: 'Maintenance',
    roomNumber: '108',
    isPinned: true,
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    displayTime: 'Today, 08:30 AM'
  },
  {
    id: 'note-3',
    content: 'Shift Handover: Front Desk cash float verified (₹15,000 in reception drop safe). POS terminal #2 printer roll replaced.',
    shift: 'Evening',
    author: 'Alex Buckmaster',
    role: 'Reception',
    priority: 'Normal',
    category: 'Handover',
    isPinned: false,
    isCompleted: true,
    completedAt: 'Yesterday, 11:00 PM',
    completedBy: 'Alex Buckmaster',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    displayTime: 'Yesterday, 10:45 PM'
  },
  {
    id: 'note-4',
    content: 'Group booking "Azure Tech Summit" (Rooms 301-305) departing tomorrow. Prepare consolidated corporate GST invoice under SAC 996311.',
    shift: 'Evening',
    author: 'Kavita Patel',
    role: 'Receptionist',
    priority: 'Important',
    category: 'Billing',
    roomNumber: '301-305',
    isPinned: false,
    isCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    displayTime: 'Today, 07:00 AM'
  },
  {
    id: 'note-5',
    content: 'Night Audit complete: All OTA channel rates synced across Booking.com & Expedia. Key drop for Room 104 guest departing at 4:30 AM verified.',
    shift: 'Night',
    author: 'Rohan Verma',
    role: 'Night Auditor',
    priority: 'Normal',
    category: 'Handover',
    isPinned: false,
    isCompleted: true,
    completedAt: 'Today, 06:15 AM',
    completedBy: 'Rohan Verma',
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    displayTime: 'Today, 05:45 AM'
  }
];

interface FrontDeskNotesProps {
  currentUser?: {
    name?: string;
    role?: string;
    username?: string;
  };
  onNavigateTab?: (tab: any) => void;
}

export const FrontDeskNotes: React.FC<FrontDeskNotesProps> = ({ currentUser }) => {
  const currentShift = getCurrentShift();
  const staffName = currentUser?.name || 'Front Desk Staff';
  const staffRole = currentUser?.role || 'Reception';

  // Load notes from localStorage with fallback to initial seed
  const [notes, setNotes] = useState<FrontDeskNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading front desk notes from localStorage:', e);
    }
    return INITIAL_SEED_NOTES;
  });

  // Filters
  const [shiftFilter, setShiftFilter] = useState<'All' | ShiftType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed' | 'Urgent'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add Note Form Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [noteShift, setNoteShift] = useState<ShiftType>(currentShift);
  const [notePriority, setNotePriority] = useState<NotePriority>('Normal');
  const [noteCategory, setNoteCategory] = useState<NoteCategory>('General');
  const [noteRoomNumber, setNoteRoomNumber] = useState('');
  const [noteIsPinned, setNoteIsPinned] = useState(false);

  // Sync to localStorage whenever notes change
  const persistNotes = (updatedNotes: FrontDeskNote[]) => {
    setNotes(updatedNotes);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      window.dispatchEvent(new CustomEvent('hms_notes_updated', { detail: updatedNotes }));
    } catch (e) {
      console.error('Error persisting front desk notes:', e);
    }
  };

  // Cross-tab and custom event synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setNotes(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<FrontDeskNote[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setNotes(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('hms_notes_updated', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('hms_notes_updated', handleCustomChange);
    };
  }, []);

  // Format current time helper
  const getFormattedNow = () => {
    const now = new Date();
    return `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Add new note
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    const newNote: FrontDeskNote = {
      id: `note-${Date.now()}`,
      content: noteContent.trim(),
      shift: noteShift,
      author: staffName,
      role: staffRole,
      priority: notePriority,
      category: noteCategory,
      roomNumber: noteRoomNumber.trim() ? noteRoomNumber.trim() : undefined,
      isPinned: noteIsPinned,
      isCompleted: false,
      createdAt: new Date().toISOString(),
      displayTime: getFormattedNow()
    };

    const updated = [newNote, ...notes];
    persistNotes(updated);

    // Reset Form
    setNoteContent('');
    setNoteRoomNumber('');
    setNotePriority('Normal');
    setNoteCategory('General');
    setNoteIsPinned(false);
    setIsAddModalOpen(false);
  };

  // Toggle complete / acknowledged
  const handleToggleComplete = (id: string) => {
    const updated = notes.map(note => {
      if (note.id === id) {
        const nextCompleted = !note.isCompleted;
        return {
          ...note,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? getFormattedNow() : undefined,
          completedBy: nextCompleted ? staffName : undefined
        };
      }
      return note;
    });
    persistNotes(updated);
  };

  // Toggle pin
  const handleTogglePin = (id: string) => {
    const updated = notes.map(note => {
      if (note.id === id) {
        return { ...note, isPinned: !note.isPinned };
      }
      return note;
    });
    persistNotes(updated);
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    persistNotes(updated);
  };

  // Quick stats
  const activeCount = notes.filter(n => !n.isCompleted).length;
  const urgentCount = notes.filter(n => !n.isCompleted && n.priority === 'Urgent').length;
  const currentShiftNotesCount = notes.filter(n => n.shift === currentShift && !n.isCompleted).length;

  // Filtered and sorted notes (Pinned first, then newest)
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        // Shift filter
        if (shiftFilter !== 'All' && note.shift !== shiftFilter) {
          return false;
        }
        // Status filter
        if (statusFilter === 'Active' && note.isCompleted) return false;
        if (statusFilter === 'Completed' && !note.isCompleted) return false;
        if (statusFilter === 'Urgent' && note.priority !== 'Urgent') return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchContent = note.content.toLowerCase().includes(q);
          const matchAuthor = note.author.toLowerCase().includes(q);
          const matchRoom = note.roomNumber ? note.roomNumber.toLowerCase().includes(q) : false;
          const matchCat = note.category.toLowerCase().includes(q);
          if (!matchContent && !matchAuthor && !matchRoom && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [notes, shiftFilter, statusFilter, searchQuery]);

  const getShiftIcon = (shift: ShiftType) => {
    switch (shift) {
      case 'Morning': return <Sun size={13} color="#D97706" />;
      case 'Evening': return <Sunset size={13} color="#4F46E5" />;
      case 'Night': return <Moon size={13} color="#9333EA" />;
    }
  };

  const getShiftColor = (shift: ShiftType) => {
    switch (shift) {
      case 'Morning': return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
      case 'Evening': return { bg: '#EEF2FF', text: '#3730A3', border: '#C7D2FE' };
      case 'Night': return { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' };
    }
  };

  const getPriorityBadge = (priority: NotePriority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            fontSize: '11px',
            fontWeight: '800',
            padding: '2px 7px',
            borderRadius: '9999px',
            border: '1px solid #FECDD3'
          }}>
            <AlertTriangle size={11} /> Urgent
          </span>
        );
      case 'Important':
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: '#FEF08A',
            color: '#854D0E',
            fontSize: '11px',
            fontWeight: '700',
            padding: '2px 7px',
            borderRadius: '9999px',
            border: '1px solid #FDE047'
          }}>
            <Clock size={11} /> Important
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      id="front-desk-notes-widget"
      className="lodgify-card front-desk-notes-card" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '16px',
        padding: '22px'
      }}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#D4F05B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(212, 240, 91, 0.4)'
          }}>
            <StickyNote size={18} color="#0F172A" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.2px' }}>
                Front Desk Notes
              </h2>
              {urgentCount > 0 && (
                <span style={{
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: '800',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  animation: 'pulse 2s infinite'
                }}>
                  {urgentCount} Urgent
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Shift handovers & special guest instructions
            </div>
          </div>
        </div>

        {/* Action Button: Add Note */}
        <button
          id="btn-add-front-desk-note"
          onClick={() => {
            setNoteShift(currentShift);
            setIsAddModalOpen(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#D4F05B',
            color: '#0F172A',
            border: 'none',
            borderRadius: '9999px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={14} />
          <span>Add Shift Note</span>
        </button>
      </div>

      {/* Active Shift Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: 'var(--bg-subtle)',
        borderRadius: '10px',
        fontSize: '11px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            display: 'inline-block',
            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)'
          }} />
          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>Current Shift:</span>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: getShiftColor(currentShift).bg,
            color: getShiftColor(currentShift).text,
            fontWeight: '700'
          }}>
            {getShiftIcon(currentShift)} {currentShift} ({getShiftTimeRange(currentShift)})
          </span>
        </div>
        <div style={{ color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{currentShiftNotesCount}</span> pending on this shift
        </div>
      </div>

      {/* Shift Filter Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
        {(['All', 'Morning', 'Evening', 'Night'] as const).map((s) => {
          const isSelected = shiftFilter === s;
          const count = s === 'All' ? notes.length : notes.filter(n => n.shift === s).length;
          return (
            <button
              key={s}
              onClick={() => setShiftFilter(s)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 11px',
                borderRadius: '9999px',
                border: isSelected ? '1px solid #0F172A' : '1px solid var(--border-subtle)',
                backgroundColor: isSelected ? '#0F172A' : 'var(--bg-card)',
                color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                fontSize: '11px',
                fontWeight: isSelected ? '700' : '600',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {s !== 'All' && getShiftIcon(s)}
              <span>{s === 'All' ? 'All Shifts' : s}</span>
              <span style={{
                fontSize: '10px',
                opacity: isSelected ? 0.9 : 0.7,
                backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-subtle)',
                padding: '0 5px',
                borderRadius: '9999px'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Search & Status Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search notes, rooms, staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '30px',
              paddingRight: '24px',
              paddingTop: '6px',
              paddingBottom: '6px',
              fontSize: '11px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Status dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          style={{
            fontSize: '11px',
            fontWeight: '600',
            padding: '6px 8px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-main)',
            cursor: 'pointer',
            outline: 'none'
          }}
        >
          <option value="All">All Status</option>
          <option value="Active">Pending Only</option>
          <option value="Completed">Acknowledged</option>
          <option value="Urgent">Urgent Only</option>
        </select>
      </div>

      {/* Notes List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '380px',
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {filteredNotes.length === 0 ? (
          <div style={{
            padding: '30px 16px',
            textAlign: 'center',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: '12px',
            border: '1px dashed var(--border-subtle)'
          }}>
            <StickyNote size={28} color="#94A3B8" style={{ margin: '0 auto 8px auto', opacity: 0.6 }} />
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
              No notes found
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '240px', margin: '0 auto 12px auto' }}>
              {searchQuery 
                ? 'Try a different search term or clear the filter' 
                : `No notes logged for ${shiftFilter === 'All' ? 'any shift' : `${shiftFilter} Shift`}.`}
            </div>
            <button
              onClick={() => {
                setNoteShift(currentShift);
                setIsAddModalOpen(true);
              }}
              style={{
                fontSize: '11px',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '9999px',
                backgroundColor: '#D4F05B',
                color: '#0F172A',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + Create Note
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => {
            const shiftStyle = getShiftColor(note.shift);
            const isCompleted = note.isCompleted;

            return (
              <div
                key={note.id}
                style={{
                  backgroundColor: isCompleted ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  border: note.isPinned 
                    ? '1.5px solid #F59E0B' 
                    : note.priority === 'Urgent' && !isCompleted
                    ? '1.5px solid #F87171' 
                    : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative',
                  opacity: isCompleted ? 0.72 : 1,
                  transition: 'all 0.15s ease',
                  boxShadow: note.isPinned ? '0 2px 8px rgba(245, 158, 11, 0.08)' : 'none'
                }}
              >
                {/* Note Top Bar: Badges + Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {/* Shift Pill */}
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      backgroundColor: shiftStyle.bg,
                      color: shiftStyle.text,
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      border: `1px solid ${shiftStyle.border}`
                    }}>
                      {getShiftIcon(note.shift)} {note.shift}
                    </span>

                    {/* Category */}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {note.category}
                    </span>

                    {/* Room tag if available */}
                    {note.roomNumber && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#E0F2FE',
                        color: '#0369A1',
                        border: '1px solid #BAE6FD'
                      }}>
                        <BedDouble size={10} /> Rm {note.roomNumber}
                      </span>
                    )}

                    {/* Priority Badge */}
                    {getPriorityBadge(note.priority)}
                  </div>

                  {/* Right Actions: Pin & Delete */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '3px',
                        color: note.isPinned ? '#F59E0B' : '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                    >
                      <Pin size={13} fill={note.isPinned ? '#F59E0B' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete note"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '3px',
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Content Text with complete checkbox */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <button
                    onClick={() => handleToggleComplete(note.id)}
                    title={isCompleted ? 'Mark as active / pending' : 'Mark as acknowledged / resolved'}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      marginTop: '2px',
                      color: isCompleted ? '#10B981' : '#94A3B8',
                      flexShrink: 0
                    }}
                  >
                    {isCompleted ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} />}
                  </button>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: isCompleted ? '500' : '600',
                    color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    lineHeight: 1.45,
                    flex: 1
                  }}>
                    {note.content}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  paddingTop: '4px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{note.author}</span>
                    {note.role && <span>({note.role})</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isCompleted && note.completedBy && (
                      <span style={{ color: '#10B981', fontWeight: '700' }}>
                        ✓ Acknowledged by {note.completedBy}
                      </span>
                    )}
                    <span>{note.displayTime}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD SHIFT NOTE */}
      {isAddModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1050 }}>
          <div className="modal-container" style={{ maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#D4F05B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <StickyNote size={18} color="#0F172A" />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Add Front Desk Note
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Log a shift handover, guest request, or operational notice
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Note Content */}
              <div className="form-field">
                <label className="form-label">
                  Note Details <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  className="input-clean"
                  placeholder="e.g. VIP guest requested extra pillows, late checkout approved, cash drawer float balanced..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Shift Selector */}
              <div className="form-field">
                <label className="form-label">Shift Handover Target</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['Morning', 'Evening', 'Night'] as const).map((s) => {
                    const isSelected = noteShift === s;
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNoteShift(s)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #0F172A' : '1px solid var(--border-subtle)',
                          backgroundColor: isSelected ? '#F4FBD0' : 'var(--bg-subtle)',
                          color: isSelected ? '#0F172A' : 'var(--text-main)',
                          fontSize: '12px',
                          fontWeight: isSelected ? '800' : '600',
                          cursor: 'pointer'
                        }}
                      >
                        {getShiftIcon(s)}
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row: Category & Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-field">
                  <label className="form-label">Category</label>
                  <select
                    className="input-clean"
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as NoteCategory)}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="General">General</option>
                    <option value="Guest Request">Guest Request</option>
                    <option value="VIP / Arrival">VIP / Arrival</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Handover">Shift Handover</option>
                    <option value="Billing">Billing & Ledger</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Priority</label>
                  <select
                    className="input-clean"
                    value={notePriority}
                    onChange={(e) => setNotePriority(e.target.value as NotePriority)}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent (Red Alert)</option>
                  </select>
                </div>
              </div>

              {/* Room Number & Pin Checkbox */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', alignItems: 'center' }}>
                <div className="form-field">
                  <label className="form-label">Associated Room (Optional)</label>
                  <input
                    type="text"
                    className="input-clean"
                    placeholder="e.g. 108, 204"
                    value={noteRoomNumber}
                    onChange={(e) => setNoteRoomNumber(e.target.value)}
                    style={{ fontSize: '12px' }}
                  />
                </div>

                <div style={{ paddingTop: '18px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="checkbox"
                      checked={noteIsPinned}
                      onChange={(e) => setNoteIsPinned(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#F59E0B' }}
                    />
                    <span>Pin to top of list</span>
                  </label>
                </div>
              </div>

              {/* Author Preview */}
              <div style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-subtle)',
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>Author: <strong>{staffName}</strong> ({staffRole})</span>
                <span>Storage: <strong>localStorage</strong></span>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontSize: '12px' }}
                >
                  Save Shift Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
