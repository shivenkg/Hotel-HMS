/**
 * ============================================================================
 * WORKFORCE & ATTENDANCE DOMAIN MODULE
 * Handles Staff Rosters, Biometric Clock-in/out, and Leave Approvals
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { StaffMember } from '../../types/index.js';
import { outbox } from '../../events/outboxProcessor.js';

export const workforceRouter = Router();

workforceRouter.get('/staff', (req: Request, res: Response) => {
  res.json(store.staffMembers);
});

// Master Data: Create Staff Member
workforceRouter.post('/staff', (req: Request, res: Response) => {
  const { name, role, department, shift, phone, email, status } = req.body;
  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required' });
  }

  const newStaff: StaffMember = {
    id: `stf-${Date.now()}`,
    name: String(name),
    role: role || 'Front Desk Officer',
    department: department || 'Front Office',
    shift: shift || 'Morning (06:00-14:00)',
    phone: phone || '+91 98450 00000',
    email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@grandazure.com`,
    status: status || 'On Duty'
  };

  store.staffMembers.push(newStaff);
  store.logAudit('Admin', 'HR Administration', 'STAFF_MEMBER_CREATED', `Onboarded new staff member: ${newStaff.name} (${newStaff.role} - ${newStaff.department})`);
  res.status(201).json(newStaff);
});

// Master Data: Update Staff Member
workforceRouter.put('/staff/:id', (req: Request, res: Response) => {
  const staffIndex = store.staffMembers.findIndex(s => s.id === req.params.id);
  if (staffIndex === -1) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  const current = store.staffMembers[staffIndex];
  const { name, role, department, shift, phone, email, status } = req.body;

  store.staffMembers[staffIndex] = {
    ...current,
    name: name !== undefined ? String(name) : current.name,
    role: role || current.role,
    department: department || current.department,
    shift: shift || current.shift,
    phone: phone !== undefined ? String(phone) : current.phone,
    email: email !== undefined ? String(email) : current.email,
    status: status || current.status
  };

  store.logAudit('Admin', 'HR Administration', 'STAFF_MEMBER_UPDATED', `Updated staff record for ${store.staffMembers[staffIndex].name}`);
  res.json(store.staffMembers[staffIndex]);
});

// Master Data: Delete Staff Member
workforceRouter.delete('/staff/:id', (req: Request, res: Response) => {
  const staffIndex = store.staffMembers.findIndex(s => s.id === req.params.id);
  if (staffIndex === -1) {
    return res.status(404).json({ error: 'Staff member not found' });
  }

  const deleted = store.staffMembers.splice(staffIndex, 1)[0];
  store.logAudit('Admin', 'HR Administration', 'STAFF_MEMBER_DELETED', `Offboarded staff member: ${deleted.name}`);
  res.json({ message: `Staff member ${deleted.name} removed successfully`, staff: deleted });
});

workforceRouter.get('/staff/attendance', (req: Request, res: Response) => {
  res.json(store.attendanceRecords);
});

workforceRouter.post('/staff/attendance/punch', (req: Request, res: Response) => {
  const { staffId, method } = req.body;
  const staff = store.staffMembers.find(s => s.id === staffId);
  if (!staff) return res.status(404).json({ error: 'Staff member not found' });

  const now = new Date();
  const timeString = now.toTimeString().slice(0, 8);
  const dateString = now.toISOString().slice(0, 10);

  const existingPunch = store.attendanceRecords.find(a => a.staffId === staffId && a.date === dateString);
  if (existingPunch && !existingPunch.clockOut) {
    existingPunch.clockOut = timeString;
    staff.status = 'Off Duty';

    outbox.recordEvent('attendance.recorded', 'Staff', staff.id, {
      staffName: staff.name,
      type: 'ClockOut',
      time: timeString
    });

    store.logAudit(staff.name, staff.role, 'STAFF_CLOCK_OUT', `Clocked out at ${timeString}`);
    return res.json({ message: 'Clocked out successfully', record: existingPunch });
  }

  const newRecord = {
    id: `att-${Date.now()}`,
    staffId: staff.id,
    staffName: staff.name,
    date: dateString,
    clockIn: timeString,
    method: method || 'Mobile App GPS',
    status: 'Present' as const
  };

  store.attendanceRecords.unshift(newRecord);
  staff.status = 'On Duty';
  staff.punchInTime = timeString;

  outbox.recordEvent('attendance.recorded', 'Staff', staff.id, {
    staffName: staff.name,
    type: 'ClockIn',
    time: timeString
  });

  store.logAudit(staff.name, staff.role, 'STAFF_CLOCK_IN', `Clocked in at ${timeString} via ${method}`);
  res.json({ message: 'Clocked in successfully', record: newRecord });
});

workforceRouter.get('/staff/leave', (req: Request, res: Response) => {
  res.json(store.leaveRequests);
});
