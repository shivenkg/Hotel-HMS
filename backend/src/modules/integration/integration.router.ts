/**
 * ============================================================================
 * OTA CHANNEL INTEGRATION DOMAIN MODULE
 * Handles 2-Way Channel Distribution, Parity Broadcast, and Channel Audit
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';
import { OtaChannelSyncService } from '../../services/otaChannelSync.js';

export const integrationRouter = Router();
const channelSyncService = new OtaChannelSyncService(store.channelSyncLogs);

integrationRouter.get('/ota/logs', (req: Request, res: Response) => {
  res.json(channelSyncService.getLogs());
});

integrationRouter.post('/ota/sync-all', (req: Request, res: Response) => {
  const results: any[] = [];
  store.rooms.forEach(r => {
    results.push(...channelSyncService.broadcastRoomAvailability(r));
  });
  store.logAudit('System Cron', 'Channel Manager', 'FULL_OTA_SYNC', `Synced all ${store.rooms.length} room inventories across Booking.com, Expedia, Airbnb.`);
  res.json({ message: 'Synchronized with all OTA channels', logs: results });
});
