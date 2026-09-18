/**
 * ============================================================================
 * AUDIT TRAIL DOMAIN MODULE
 * Handles Immutable Security Audit Logs, Event Tracing, and Regulatory Compliance
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { store } from '../../data/store.js';

export const auditRouter = Router();

auditRouter.get('/audit', (req: Request, res: Response) => {
  res.json(store.auditLogs);
});
