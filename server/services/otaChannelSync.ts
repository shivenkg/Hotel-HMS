import { ChannelSyncLog, Room, Reservation } from '../types/index.js';

export class OtaChannelSyncService {
  private syncLogs: ChannelSyncLog[] = [];

  constructor(initialLogs: ChannelSyncLog[]) {
    this.syncLogs = [...initialLogs];
  }

  public getLogs(): ChannelSyncLog[] {
    return [...this.syncLogs].reverse();
  }

  /**
   * Broadcast inventory updates across connected OTAs
   */
  public broadcastRoomAvailability(room: Room): ChannelSyncLog[] {
    const channels: Array<'Booking.com' | 'Expedia' | 'Airbnb'> = ['Booking.com', 'Expedia', 'Airbnb'];
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newLogs: ChannelSyncLog[] = [];

    channels.forEach(ch => {
      const log: ChannelSyncLog = {
        id: `csl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        channel: ch,
        eventType: 'Inventory Update',
        status: 'Success',
        details: `Room ${room.roomNumber} (${room.category}) updated to status: [${room.status}] on ${ch}`,
        timestamp: now
      };
      this.syncLogs.push(log);
      newLogs.push(log);
    });

    return newLogs;
  }

  /**
   * Broadcast dynamic rates update to OTAs
   */
  public broadcastRateUpdates(roomCategory: string, newRate: number): ChannelSyncLog[] {
    const channels: Array<'Booking.com' | 'Expedia' | 'Airbnb'> = ['Booking.com', 'Expedia', 'Airbnb'];
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newLogs: ChannelSyncLog[] = [];

    channels.forEach(ch => {
      const log: ChannelSyncLog = {
        id: `csl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        channel: ch,
        eventType: 'Rates Push',
        status: 'Success',
        details: `Updated ${roomCategory} standard tariff to ₹${newRate}/night with parity guarantee on ${ch}`,
        timestamp: now
      };
      this.syncLogs.push(log);
      newLogs.push(log);
    });

    return newLogs;
  }

  /**
   * Simulate inbound OTA reservation webhook
   */
  public logInboundOtaReservation(channel: 'Booking.com' | 'Expedia' | 'Airbnb', reservation: Reservation): ChannelSyncLog {
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const log: ChannelSyncLog = {
      id: `csl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      channel,
      eventType: 'New Reservation',
      status: 'Success',
      details: `Inbound OTA booking [${reservation.bookingRef}] received from ${channel} for ${reservation.guestName}`,
      timestamp: now
    };
    this.syncLogs.push(log);
    return log;
  }
}
