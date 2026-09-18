import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  Wrench, 
  Sparkles, 
  Check, 
  Filter, 
  Plus, 
  RotateCcw,
  CheckCheck
} from 'lucide-react';

export interface DailyTaskItem {
  id: string;
  type: 'housekeeping' | 'maintenance';
  title: string;
  location: string;
  assignedTo: string;
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  dueTime: string;
  status: 'Pending' | 'Completed';
  notes?: string;
}

const INITIAL_TASKS: DailyTaskItem[] = [
  {
    id: 'dt-hk-1',
    type: 'housekeeping',
    title: 'Turnover Cleaning & Disinfection',
    location: 'Room 102 (Deluxe)',
    assignedTo: 'Priya Sharma',
    priority: 'High',
    dueTime: '11:30 AM',
    status: 'Pending',
    notes: 'Guest departing at 11:00 AM. Next arrival at 14:00 PM.'
  },
  {
    id: 'dt-mwo-1',
    type: 'maintenance',
    title: 'Repair bedside reading lamp & loose switch',
    location: 'Room 108 (Standard)',
    assignedTo: 'Vikram Singh (Tech)',
    priority: 'Medium',
    dueTime: '12:00 PM',
    status: 'Pending',
    notes: 'Replacement LED fixture & socket dispatched.'
  },
  {
    id: 'dt-hk-2',
    type: 'housekeeping',
    title: 'Deep Sanitization & Luxury Bedding Setup',
    location: 'Room 204 (Presidential)',
    assignedTo: 'Lead Attendant (Priya)',
    priority: 'High',
    dueTime: '13:00 PM',
    status: 'Pending',
    notes: 'VIP Lady Eleanor Vance arriving today at 16:30 PM.'
  },
  {
    id: 'dt-mwo-2',
    type: 'maintenance',
    title: 'Digital AC Thermostat Calibration (Error E-04)',
    location: 'Room 205 (Suite)',
    assignedTo: 'Vikram Singh (Tech)',
    priority: 'High',
    dueTime: '13:30 PM',
    status: 'Pending',
    notes: 'Compressor cycling test and temperature sensor check.'
  },
  {
    id: 'dt-hk-3',
    type: 'housekeeping',
    title: 'Minibar Restocking & Glassware Polish',
    location: 'Room 104 (Deluxe)',
    assignedTo: 'Ramesh Kumar',
    priority: 'Medium',
    dueTime: '14:00 PM',
    status: 'Pending',
    notes: 'Restock sparkling water, artisan chocolates and red wine.'
  },
  {
    id: 'dt-mwo-3',
    type: 'maintenance',
    title: 'Inspect Water Pressure & Shower Mixer Valve',
    location: 'Room 302 (Executive)',
    assignedTo: 'Maintenance Team',
    priority: 'Low',
    dueTime: '15:00 PM',
    status: 'Pending',
    notes: 'Quarterly plumbing check before weekend check-in.'
  },
  {
    id: 'dt-hk-4',
    type: 'housekeeping',
    title: 'Turndown Service & Aroma Diffuser Setup',
    location: 'Room 101 (Deluxe)',
    assignedTo: 'Amit Kumar',
    priority: 'Low',
    dueTime: '18:00 PM',
    status: 'Pending',
    notes: 'VIP Sophia Laurent requested lavender essential oil.'
  }
];

export const DailyTaskListWidget: React.FC = () => {
  const [tasks, setTasks] = useState<DailyTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('hms_daily_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'housekeeping' | 'maintenance' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLocation, setNewTaskLocation] = useState('Room 101');
  const [newTaskType, setNewTaskType] = useState<'housekeeping' | 'maintenance'>('housekeeping');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskAssigned, setNewTaskAssigned] = useState('Priya Sharma');
  const [newTaskDue, setNewTaskDue] = useState('Today 15:00');

  useEffect(() => {
    try {
      localStorage.setItem('hms_daily_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: task.status === 'Pending' ? 'Completed' : 'Pending'
        };
      }
      return task;
    }));
  };

  const markAllComplete = () => {
    setTasks(prev => prev.map(t => ({ ...t, status: 'Completed' })));
  };

  const resetDefaultTasks = () => {
    setTasks(INITIAL_TASKS);
    try {
      localStorage.setItem('hms_daily_tasks', JSON.stringify(INITIAL_TASKS));
    } catch {}
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: DailyTaskItem = {
      id: `dt-custom-${Date.now()}`,
      type: newTaskType,
      title: newTaskTitle.trim(),
      location: newTaskLocation,
      assignedTo: newTaskAssigned,
      priority: newTaskPriority,
      dueTime: newTaskDue,
      status: 'Pending'
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const pendingCount = tasks.filter(t => t.status === 'Pending').length;
  const hkPendingCount = tasks.filter(t => t.type === 'housekeeping' && t.status === 'Pending').length;
  const maintPendingCount = tasks.filter(t => t.type === 'maintenance' && t.status === 'Pending').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'completed') return task.status === 'Completed';
    if (activeFilter === 'housekeeping') return task.type === 'housekeeping' && task.status === 'Pending';
    if (activeFilter === 'maintenance') return task.type === 'maintenance' && task.status === 'Pending';
    return task.status === 'Pending'; // 'all' shows all pending
  });

  return (
    <div className="lodgify-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Widget Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main, #0F172A)', margin: 0 }}>
              Daily Task List
            </h2>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: pendingCount > 0 ? '#FEE2E2' : '#D1FAE5',
              color: pendingCount > 0 ? '#991B1B' : '#065F46'
            }}>
              {pendingCount} Pending
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted, #64748B)', margin: '2px 0 0 0' }}>
            Housekeeping turnovers & maintenance work orders
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setShowAddModal(true)}
            title="Add New Task"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#D4F05B',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
              fontWeight: '700'
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '6px',
        backgroundColor: 'var(--bg-subtle, #F1F4F9)',
        padding: '4px',
        borderRadius: '10px',
        fontSize: '12px'
      }}>
        <button
          onClick={() => setActiveFilter('all')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: activeFilter === 'all' ? 'var(--bg-card, #FFFFFF)' : 'transparent',
            color: activeFilter === 'all' ? 'var(--text-main, #0F172A)' : 'var(--text-muted, #64748B)',
            boxShadow: activeFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          All ({pendingCount})
        </button>

        <button
          onClick={() => setActiveFilter('housekeeping')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: activeFilter === 'housekeeping' ? 'var(--bg-card, #FFFFFF)' : 'transparent',
            color: activeFilter === 'housekeeping' ? '#0369A1' : 'var(--text-muted, #64748B)',
            boxShadow: activeFilter === 'housekeeping' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          🧹 HK ({hkPendingCount})
        </button>

        <button
          onClick={() => setActiveFilter('maintenance')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: activeFilter === 'maintenance' ? 'var(--bg-card, #FFFFFF)' : 'transparent',
            color: activeFilter === 'maintenance' ? '#92400E' : 'var(--text-muted, #64748B)',
            boxShadow: activeFilter === 'maintenance' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          🔧 Maint ({maintPendingCount})
        </button>

        <button
          onClick={() => setActiveFilter('completed')}
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: activeFilter === 'completed' ? 'var(--bg-card, #FFFFFF)' : 'transparent',
            color: activeFilter === 'completed' ? '#065F46' : 'var(--text-muted, #64748B)',
            boxShadow: activeFilter === 'completed' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          ✓ Done ({completedCount})
        </button>
      </div>

      {/* Task List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '340px',
        overflowY: 'auto',
        paddingRight: '2px'
      }}>
        {filteredTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '28px 16px',
            color: 'var(--text-muted, #94A3B8)',
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            borderRadius: '12px',
            border: '1px dashed var(--border-subtle, #E2E8F0)'
          }}>
            <CheckCheck size={28} color="#10B981" style={{ margin: '0 auto 8px auto' }} />
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main, #0F172A)' }}>
              {activeFilter === 'completed' ? 'No completed tasks yet' : 'All tasks completed in this view!'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '2px' }}>
              Staff has cleared all assigned duties.
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  backgroundColor: isCompleted ? 'rgba(209, 250, 229, 0.25)' : 'var(--bg-subtle, #F8FAFC)',
                  border: isCompleted ? '1px solid #A7F3D0' : '1px solid var(--border-subtle, #E8EEF5)',
                  transition: 'all 0.2s ease'
                }}
                className="hover:border-slate-400"
              >
                {/* Complete / Checkbox Button */}
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  title={isCompleted ? 'Mark as Pending' : 'Mark Complete'}
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    border: isCompleted ? '2px solid #059669' : '2px solid #94A3B8',
                    backgroundColor: isCompleted ? '#059669' : 'transparent',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginTop: '2px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isCompleted && <Check size={14} strokeWidth={3} />}
                </button>

                {/* Task Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: isCompleted ? 'var(--text-muted, #64748B)' : 'var(--text-main, #0F172A)',
                      textDecoration: isCompleted ? 'line-through' : 'none',
                      lineHeight: 1.3
                    }}>
                      {task.title}
                    </span>

                    {/* Badge */}
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      backgroundColor: task.type === 'housekeeping' ? '#E0F2FE' : '#FEF3C7',
                      color: task.type === 'housekeeping' ? '#0369A1' : '#92400E'
                    }}>
                      {task.type === 'housekeeping' ? 'Housekeeping' : 'Maintenance'}
                    </span>

                    {task.priority === 'High' && !isCompleted && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B'
                      }}>
                        High
                      </span>
                    )}
                  </div>

                  <div style={{
                    fontSize: '11px',
                    color: 'var(--text-muted, #64748B)',
                    marginTop: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexWrap: 'wrap'
                  }}>
                    <strong style={{ color: 'var(--text-main, #0F172A)' }}>{task.location}</strong>
                    <span>• {task.assignedTo}</span>
                    <span>• Due: {task.dueTime}</span>
                  </div>

                  {task.notes && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748B)', marginTop: '3px', fontStyle: 'italic' }}>
                      {task.notes}
                    </div>
                  )}
                </div>

                {/* Quick Action button on hover */}
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  style={{
                    backgroundColor: isCompleted ? '#F1F5F9' : '#0F172A',
                    color: isCompleted ? '#64748B' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {isCompleted ? 'Reopen' : 'Done ✓'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer controls: quick completion & reset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid var(--border-subtle, #E8EEF5)',
        fontSize: '11px',
        color: 'var(--text-muted, #64748B)'
      }}>
        <span>
          Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          {pendingCount > 0 && (
            <button
              onClick={markAllComplete}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '11px'
              }}
            >
              Mark All Done
            </button>
          )}

          <button
            onClick={resetDefaultTasks}
            title="Reset daily shift tasks"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #94A3B8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px'
            }}
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>
      </div>

      {/* ADD TASK MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card, #FFFFFF)',
            borderRadius: '16px',
            padding: '24px',
            width: '420px',
            maxWidth: '92vw',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-main, #0F172A)', margin: '0 0 14px 0' }}>
              Add Daily Staff Task
            </h3>

            <form onSubmit={handleAddNewTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748B)', display: 'block', marginBottom: '4px' }}>
                  Task Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspect balcony drain, Restock luxury kit..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748B)', display: 'block', marginBottom: '4px' }}>
                    Type
                  </label>
                  <select
                    value={newTaskType}
                    onChange={(e) => setNewTaskType(e.target.value as any)}
                    className="input-clean"
                    style={{ width: '100%' }}
                  >
                    <option value="housekeeping">Housekeeping 🧹</option>
                    <option value="maintenance">Maintenance 🔧</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748B)', display: 'block', marginBottom: '4px' }}>
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="input-clean"
                    style={{ width: '100%' }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748B)', display: 'block', marginBottom: '4px' }}>
                    Room / Location
                  </label>
                  <input
                    type="text"
                    value={newTaskLocation}
                    onChange={(e) => setNewTaskLocation(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748B)', display: 'block', marginBottom: '4px' }}>
                    Assigned Staff
                  </label>
                  <input
                    type="text"
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="input-clean"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted, #64748B)', display: 'block', marginBottom: '4px' }}>
                  Target Due Time
                </label>
                <input
                  type="text"
                  value={newTaskDue}
                  onChange={(e) => setNewTaskDue(e.target.value)}
                  className="input-clean"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
