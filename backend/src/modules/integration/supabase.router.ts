/**
 * ============================================================================
 * SUPABASE INTEGRATION ROUTER
 * Endpoints for database link status, credentials management, live sync,
 * and SQL schema distribution.
 * ============================================================================
 */

import { Router, Request, Response } from 'express';
import { supabase } from '../../services/supabaseService.js';
import { store } from '../../data/store.js';

export const supabaseRouter = Router();

// Get Supabase connection status & tables count
supabaseRouter.get('/integrations/supabase/status', async (req: Request, res: Response) => {
  const status = await supabase.getStatus();
  const config = supabase.getConfig();
  res.json({
    ...status,
    config
  });
});

// Update Supabase configuration credentials
supabaseRouter.post('/integrations/supabase/config', async (req: Request, res: Response) => {
  const { url, anonKey, serviceRoleKey, databaseUrl } = req.body;
  supabase.updateConfig({
    url,
    anonKey,
    serviceRoleKey,
    databaseUrl
  });

  const test = await supabase.testConnection();
  store.logAudit('Admin', 'System Administrator', 'SUPABASE_CONFIG_UPDATED', `Configured Supabase project endpoint: ${url || 'cleared'}`);

  res.json({
    success: test.success,
    message: test.message,
    status: await supabase.getStatus()
  });
});

// Trigger bidirectional Master Data Sync
supabaseRouter.post('/integrations/supabase/sync', async (req: Request, res: Response) => {
  const { direction } = req.body as { direction?: 'push' | 'pull' };
  const result = await supabase.syncMasterData(direction || 'push');
  res.json(result);
});

// Retrieve copy-paste ready SQL migration script for Supabase SQL editor
supabaseRouter.get('/integrations/supabase/schema', (req: Request, res: Response) => {
  const schemaSql = supabase.getConsolidatedSqlSchema();
  res.setHeader('Content-Type', 'text/plain');
  res.send(schemaSql);
});
