import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import { store } from './backend/src/data/store.js';
import { db } from './backend/src/config/database.js';
import { outbox } from './backend/src/events/outboxProcessor.js';

// Domain Module Routers from Cloned HMS Repository
import { identityRouter } from './backend/src/modules/identity/identity.router.js';
import { hotelRouter } from './backend/src/modules/hotel/hotel.router.js';
import { reservationRouter } from './backend/src/modules/reservation/reservation.router.js';
import { billingRouter } from './backend/src/modules/billing/billing.router.js';
import { posRouter } from './backend/src/modules/pos/pos.router.js';
import { housekeepingRouter } from './backend/src/modules/housekeeping/housekeeping.router.js';
import { inventoryRouter } from './backend/src/modules/inventory/inventory.router.js';
import { workforceRouter } from './backend/src/modules/workforce/workforce.router.js';
import { feedbackRouter } from './backend/src/modules/feedback/feedback.router.js';
import { integrationRouter } from './backend/src/modules/integration/integration.router.js';
import { auditRouter } from './backend/src/modules/audit/audit.router.js';
import { supabaseRouter } from './backend/src/modules/integration/supabase.router.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Tenant Context & Audit Context Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || 'a0000000-0000-0000-0000-000000000001';
    const propertyId = (req.headers['x-property-id'] as string) || 'b0000000-0000-0000-0000-000000000001';
    db.setTenantContext({ tenantId, propertyId });
    next();
  });

  // API Directory Overview
  app.get('/api', (req: Request, res: Response) => {
    res.json({
      name: 'The Grand Azure Hotel Management System API',
      version: '1.0.0',
      status: 'operational',
      architecture: 'Modular Monolith with Transactional Outbox',
      docs: '/api/docs',
      endpoints: {
        health: '/api/health',
        dashboard: '/api/dashboard',
        rooms: '/api/rooms',
        reservations: '/api/reservations',
        folios: '/api/folios',
        housekeeping: '/api/housekeeping/tasks',
        maintenance: '/api/maintenance',
        inventory: '/api/inventory',
        posOrders: '/api/pos/orders',
        staff: '/api/staff',
        feedback: '/api/guest-exp/feedback',
        loyalty: '/api/guest-exp/loyalty',
        pricing: '/api/pricing/config',
        users: '/api/users',
        auth: '/api/auth/login',
        ota: '/api/ota/logs',
        audit: '/api/audit',
        supabase: '/api/integrations/supabase/status',
        menu: '/api/pos/menu',
        seed: '/api/seed'
      }
    });
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: db.isPostgresActive() ? 'PostgreSQL-Active' : 'PostgreSQL-Ready (Hybrid)',
      services: {
        rooms: store.rooms.length,
        reservations: store.reservations.length,
        folios: store.folios.length,
        housekeeping: store.housekeepingTasks.length,
        maintenance: store.maintenanceWorkOrders.length,
        inventory: store.inventoryItems.length,
        users: store.systemUsers.length,
        outbox: outbox.getOutboxStats()
      }
    });
  });

  // OpenAPI Documentation Endpoints
  const openApiSpecPath = path.resolve(process.cwd(), 'backend/src/docs/openapi.json');
  app.get('/api/openapi.json', (req: Request, res: Response) => {
    if (fs.existsSync(openApiSpecPath)) {
      return res.sendFile(openApiSpecPath);
    }
    res.status(404).json({ error: 'OpenAPI specification not found' });
  });

  app.get('/api/docs', (req: Request, res: Response) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Grand Azure HMS - OpenAPI Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body style="margin:0; background: #fafafa;">
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [SwaggerUIBundle.presets.apis],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  });

  // Outbox Stats
  app.get('/api/outbox/stats', (req: Request, res: Response) => {
    res.json(outbox.getOutboxStats());
  });

  // UAT Data Seed & Reset Engine
  app.post('/api/seed', (req: Request, res: Response) => {
    store.reseed();
    res.json({
      success: true,
      message: 'Sample data seeded successfully for UAT testing & hospitality scenarios',
      summary: {
        roomsCount: store.rooms.length,
        reservationsCount: store.reservations.length,
        foliosCount: store.folios.length,
        housekeepingTasksCount: store.housekeepingTasks.length,
        maintenanceOrdersCount: store.maintenanceWorkOrders.length,
        inventoryItemsCount: store.inventoryItems.length,
        posOrdersCount: store.posOrders.length,
        staffCount: store.staffMembers.length,
        systemUsersCount: store.systemUsers.length
      }
    });
  });

  app.get('/api/seed/status', (req: Request, res: Response) => {
    res.json({
      seeded: true,
      counts: {
        rooms: store.rooms.length,
        reservations: store.reservations.length,
        folios: store.folios.length,
        housekeepingTasks: store.housekeepingTasks.length,
        maintenanceOrders: store.maintenanceWorkOrders.length,
        inventory: store.inventoryItems.length,
        users: store.systemUsers.length
      }
    });
  });

  // MOUNT ALL DOMAIN MODULE ROUTERS
  app.use('/api', identityRouter);
  app.use('/api', hotelRouter);
  app.use('/api', reservationRouter);
  app.use('/api', billingRouter);
  app.use('/api', posRouter);
  app.use('/api', housekeepingRouter);
  app.use('/api', inventoryRouter);
  app.use('/api', workforceRouter);
  app.use('/api', feedbackRouter);
  app.use('/api', integrationRouter);
  app.use('/api', auditRouter);
  app.use('/api', supabaseRouter);

  // Fallback for unmatched API routes
  app.all('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'API endpoint not found',
      method: req.method,
      path: req.originalUrl,
      health: '/api/health',
      docs: '/api/docs'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🏨 The Grand Azure HMS running on http://0.0.0.0:${PORT}`);
    console.log(`📖 API Documentation available at http://0.0.0.0:${PORT}/api/docs`);
  });
}

startServer();
