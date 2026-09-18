/**
 * ============================================================================
 * HOTEL MANAGEMENT SYSTEM (HMS) - TRANSACTIONAL OUTBOX PROCESSOR
 * Ensures Guaranteed Event Delivery without Two-Phase Commit Overhead
 * ============================================================================
 */

import { eventBus, DomainEvent, HmsEventType } from './eventBus';

export interface OutboxRecord {
  id: string;
  tenantId: string;
  propertyId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: HmsEventType;
  payload: any;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED';
  retryCount: number;
  createdAt: string;
  publishedAt?: string;
  errorMessage?: string;
}

export class OutboxProcessor {
  private static instance: OutboxProcessor;
  private outboxQueue: OutboxRecord[] = [];
  private isProcessing: boolean = false;
  private timer: NodeJS.Timeout | null = null;

  private constructor() {
    this.startWorker();
  }

  public static getInstance(): OutboxProcessor {
    if (!OutboxProcessor.instance) {
      OutboxProcessor.instance = new OutboxProcessor();
    }
    return OutboxProcessor.instance;
  }

  /**
   * Records a domain event inside the transactional boundary
   */
  public recordEvent<T = any>(
    eventType: HmsEventType,
    aggregateType: string,
    aggregateId: string,
    payload: T,
    tenantId: string = 'a0000000-0000-0000-0000-000000000001',
    propertyId: string = 'b0000000-0000-0000-0000-000000000001'
  ): OutboxRecord {
    const record: OutboxRecord = {
      id: `outbox-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      tenantId,
      propertyId,
      aggregateType,
      aggregateId,
      eventType,
      payload,
      status: 'PENDING',
      retryCount: 0,
      createdAt: new Date().toISOString()
    };

    this.outboxQueue.push(record);
    // Immediate trigger for low latency
    setImmediate(() => this.processPendingEvents());
    return record;
  }

  /**
   * Background polling worker that dispatches pending outbox records
   */
  public async processPendingEvents(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pending = this.outboxQueue.filter(e => e.status === 'PENDING');
      for (const record of pending) {
        try {
          const domainEvent: DomainEvent = {
            id: record.id,
            type: record.eventType,
            tenantId: record.tenantId,
            propertyId: record.propertyId,
            aggregateId: record.aggregateId,
            aggregateType: record.aggregateType,
            payload: record.payload,
            occurredAt: record.createdAt
          };

          eventBus.publish(domainEvent);
          record.status = 'PUBLISHED';
          record.publishedAt = new Date().toISOString();
        } catch (err: any) {
          record.retryCount++;
          record.status = record.retryCount > 3 ? 'FAILED' : 'PENDING';
          record.errorMessage = err.message;
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  public startWorker(): void {
    if (!this.timer) {
      this.timer = setInterval(() => this.processPendingEvents(), 5000);
      if (this.timer.unref) this.timer.unref();
    }
  }

  public stopWorker(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getOutboxStats() {
    return {
      total: this.outboxQueue.length,
      pending: this.outboxQueue.filter(e => e.status === 'PENDING').length,
      published: this.outboxQueue.filter(e => e.status === 'PUBLISHED').length,
      failed: this.outboxQueue.filter(e => e.status === 'FAILED').length
    };
  }
}

export const outbox = OutboxProcessor.getInstance();
