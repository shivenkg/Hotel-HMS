/**
 * ============================================================================
 * HOTEL MANAGEMENT SYSTEM (HMS) - ASYNCHRONOUS EVENT BUS
 * Standard: Event-Driven Domain Integration
 * ============================================================================
 */

import { EventEmitter } from 'events';

export type HmsEventType =
  | 'reservation.created'
  | 'reservation.confirmed'
  | 'reservation.cancelled'
  | 'guest.checked_in'
  | 'guest.checked_out'
  | 'room.status_changed'
  | 'housekeeping.task_assigned'
  | 'room.inspection_completed'
  | 'folio.charge_posted'
  | 'folio.payment_received'
  | 'invoice.finalized'
  | 'pos.order_created'
  | 'kitchen.order_ready'
  | 'room_service.delivered'
  | 'stock.issued'
  | 'stock.adjusted'
  | 'attendance.recorded'
  | 'feedback.received'
  | 'maintenance.reported'
  | 'maintenance.resolved';

export interface DomainEvent<T = any> {
  id: string;
  type: HmsEventType;
  tenantId: string;
  propertyId: string;
  aggregateId: string;
  aggregateType: string;
  payload: T;
  occurredAt: string;
}

export class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public publish<T = any>(event: DomainEvent<T>): void {
    // Log domain event
    console.log(`📡 [EVENT] ${event.type} on ${event.aggregateType}#${event.aggregateId}`);
    this.emit(event.type, event);
    this.emit('*', event);
  }

  public subscribe<T = any>(eventType: HmsEventType | '*', handler: (event: DomainEvent<T>) => void | Promise<void>): void {
    this.on(eventType, handler);
  }
}

export const eventBus = EventBus.getInstance();
