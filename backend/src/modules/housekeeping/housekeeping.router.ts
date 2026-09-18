/**
 * ============================================================================
 * HOUSEKEEPING & MAINTENANCE DOMAIN MODULE
 * Handles Turnover Cleaning Tasks, Room Inspections, and Maintenance Orders
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { HousekeepingTask, MaintenanceWorkOrder } from '../../types/index.js';
import { OtaChannelSyncService } from '../../services/otaChannelSync.js';
import { outbox } from '../../events/outboxProcessor.js';

export const housekeepingRouter = Router();
const channelSyncService = new OtaChannelSyncService(store.channelSyncLogs);

housekeepingRouter.get('/housekeeping/tasks', (req: Request, res: Response) => {
  res.json(store.housekeepingTasks);
});

housekeepingRouter.post('/housekeeping/tasks', (req: Request, res: Response) => {
  const { roomId, roomNumber, taskType, priority, assignedTo, notes, dueTime } = req.body;
  const task: HousekeepingTask = {
    id: `hk-${Date.now()}`,
    roomId,
    roomNumber,
    taskType,
    priority: priority || 'Medium',
    assignedTo: assignedTo || 'Unassigned',
    status: 'Pending',
    notes,
    dueTime: dueTime || '15:00',
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };
  store.housekeepingTasks.unshift(task);

  outbox.recordEvent('housekeeping.task_assigned', 'HousekeepingTask', task.id, {
    roomNumber,
    taskType,
    assignedTo: task.assignedTo
  });

  res.status(201).json(task);
});

housekeepingRouter.patch('/housekeeping/tasks/:id', (req: Request, res: Response) => {
  const task = store.housekeepingTasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { status, assignedTo, notes } = req.body;
  if (status) task.status = status;
  if (assignedTo) task.assignedTo = assignedTo;
  if (notes) task.notes = notes;
  task.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  // If completed inspection or cleaning, update room status
  if (task.status === 'Completed') {
    const room = store.rooms.find(r => r.id === task.roomId || r.roomNumber === task.roomNumber);
    if (room && room.status !== 'Occupied') {
      room.status = task.taskType === 'Inspection' ? 'Inspected' : 'Available';
      channelSyncService.broadcastRoomAvailability(room);

      outbox.recordEvent('room.inspection_completed', 'Room', room.id, {
        roomNumber: room.roomNumber,
        status: room.status
      });
    }
  }

  res.json(task);
});

housekeepingRouter.patch('/housekeeping/tasks/:id/clean-status', (req: Request, res: Response) => {
  let task = store.housekeepingTasks.find(t => t.id === req.params.id || t.roomNumber === req.params.id || t.roomId === req.params.id);
  const { cleanStatus, availability, remarks } = req.body;

  if (!task) {
    const room = store.rooms.find(r => r.id === req.params.id || r.roomNumber === req.params.id);
    if (room) {
      task = {
        id: `hk-${room.roomNumber}`,
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: (room.category === 'Deluxe' ? 'Deluxe' : room.category.includes('Suite') ? 'Suite' : 'Standard') as any,
        cleanStatus: cleanStatus || 'Clean',
        availability: (room.status === 'Occupied' ? 'Occupied' : 'Available') as any,
        guestName: room.currentGuest || 'Vacant',
        taskType: 'Routine Cleaning',
        priority: 'Medium',
        assignedTo: 'Priya Sharma',
        status: cleanStatus === 'Clean' ? 'Completed' : 'Pending',
        dueTime: '15:00',
        remarks: remarks || '...',
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      store.housekeepingTasks.push(task);
    } else {
      return res.status(404).json({ error: 'Housekeeping task not found' });
    }
  }

  if (cleanStatus) task.cleanStatus = cleanStatus;
  if (availability) task.availability = availability;
  if (remarks !== undefined) task.remarks = remarks;
  task.updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

  // Sync with Room status
  const room = store.rooms.find(r => r.id === task!.roomId || r.roomNumber === task!.roomNumber);
  if (room) {
    const oldStatus = room.status;
    if (cleanStatus === 'Clean') {
      room.status = (availability === 'Occupied' || (room.currentGuest && availability !== 'Available')) ? 'Occupied' : 'Available';
      task.status = 'Completed';
    } else if (cleanStatus === 'Dirty') {
      room.status = 'Dirty';
      task.status = 'Pending';
    } else if (cleanStatus === 'In Process') {
      room.status = 'Cleaning';
      task.status = 'InProgress';
    } else if (cleanStatus === 'Repair' || cleanStatus === 'Under Maintenance') {
      room.status = 'OutOfOrder';
      task.status = 'Pending';
    }

    outbox.recordEvent('room.status_changed', 'Room', room.id, {
      roomNumber: room.roomNumber,
      oldStatus,
      newStatus: room.status
    });
  }

  store.logAudit('Housekeeping Staff', 'Attendant', 'HOUSEKEEPING_STATUS_UPDATE', `Room ${task.roomNumber} updated to ${cleanStatus} (${availability || room?.status || ''})`);
  res.json(task);
});

// Maintenance Work Orders
housekeepingRouter.get('/maintenance', (req: Request, res: Response) => {
  res.json(store.maintenanceWorkOrders);
});

housekeepingRouter.post('/maintenance', (req: Request, res: Response) => {
  const { roomNumber, issue, category, priority, reportedBy, remarks, assignedTo } = req.body;
  if (!roomNumber || !issue) {
    return res.status(400).json({ error: 'Room number and issue description are required' });
  }

  const newOrder: MaintenanceWorkOrder = {
    id: `mwo-${Date.now()}`,
    roomNumber,
    issue,
    category: category || 'Electrical',
    priority: priority || 'Medium',
    reportedBy: reportedBy || 'Housekeeping Staff',
    assignedTo: assignedTo || 'Vikram Singh (Tech)',
    status: 'Reported',
    remarks: remarks || '',
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
  };

  store.maintenanceWorkOrders.unshift(newOrder);

  outbox.recordEvent('maintenance.reported', 'MaintenanceWorkOrder', newOrder.id, {
    roomNumber,
    issue,
    priority: newOrder.priority
  });

  store.logAudit(reportedBy || 'Staff', 'Maintenance', 'MAINTENANCE_ORDER_CREATED', `Work order logged for Room ${roomNumber}: ${issue}`);
  res.status(201).json(newOrder);
});

housekeepingRouter.patch('/maintenance/:id', (req: Request, res: Response) => {
  const order = store.maintenanceWorkOrders.find(m => m.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Maintenance order not found' });

  const { status, remarks, assignedTo } = req.body;
  if (status) {
    order.status = status;
    if (status === 'Resolved') {
      order.resolvedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

      outbox.recordEvent('maintenance.resolved', 'MaintenanceWorkOrder', order.id, {
        roomNumber: order.roomNumber,
        resolvedAt: order.resolvedAt
      });
    }
  }
  if (remarks !== undefined) order.remarks = remarks;
  if (assignedTo) order.assignedTo = assignedTo;

  store.logAudit('Maintenance Tech', 'Engineering', 'MAINTENANCE_ORDER_UPDATED', `Work order ${order.id} for Room ${order.roomNumber} updated to ${order.status}`);
  res.json(order);
});
