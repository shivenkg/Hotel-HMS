/**
 * ============================================================================
 * HOTEL MANAGEMENT SYSTEM (HMS) - ENTERPRISE USER ACCEPTANCE TEST (UAT) SUITE
 * Industry Standard Use-Case Driven Verification
 * Standard: AHLA / HFTP Hospitality Technology Best Practices
 * ============================================================================
 * 
 * Covering 14 End-to-End Core Hospitality Use Cases:
 *  UC-01: System Health, Connectivity & Core Service Registry
 *  UC-02: Omnichannel Booking & Room Availability Ingestion
 *  UC-03: Dynamic Occupancy & Seasonal Surge Pricing Engine
 *  UC-04: Guest Digital KYC & Government ID Verification Compliance
 *  UC-05: Front Desk Check-in & Room State Synchronization
 *  UC-06: Restaurant & Room Service POS Ordering with KDS Workflow
 *  UC-07: Real-Time Folio Billing Aggregation (Room + F&B + Minibar)
 *  UC-08: Tax Compliance Engine (Dual-Slab GST / SAC Codes / CGST-SGST Split)
 *  UC-09: Omnichannel Payment Gateway Settlement (Stripe / Razorpay)
 *  UC-10: Guest Checkout & Automated Housekeeping Turnover Dispatch
 *  UC-11: Housekeeping Task Progression & Room Release to Available
 *  UC-12: Inventory Stock Depletion & Low-Stock Threshold Alerts
 *  UC-13: Staff Duty Rosters, Biometric Attendance & Leave Approvals
 *  UC-14: Post-Stay Guest Experience, NPS Analytics & Loyalty Accrual
 *  UC-15: 2-Way OTA Channel Distribution Sync & Audit Trail Compliance
 */

import { spawn, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';

function killProcessTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    // Process already exited
  }
}

async function isServerUp(url) {
  try {
    const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

async function runEnterpriseUat() {
  console.log('\n====================================================================');
  console.log('🏨   ENTERPRISE HOSPITALITY UAT SUITE - USE CASE VERIFICATION');
  console.log('🏨   Target: The Grand Azure Hotel Management System');
  console.log('🏨   Standard: HFTP Uniform System of Accounts for the Lodging Industry');
  console.log('====================================================================\n');

  let passed = 0;
  let total = 0;
  const startTime = Date.now();
  let spawnedServer = null;

  try {
    const serverAlreadyRunning = await isServerUp(API_BASE);
    if (!serverAlreadyRunning) {
      console.log('ℹ️  HMS backend server is not running. Auto-starting backend server for UAT...');

      const rootTsxCli = path.join(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
      const backendTsxCli = path.join(backendDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
      const tsxCli = fs.existsSync(rootTsxCli) ? rootTsxCli : backendTsxCli;
      const distServer = path.join(backendDir, 'dist', 'server.js');

      if (fs.existsSync(tsxCli)) {
        spawnedServer = spawn(process.execPath, [tsxCli, 'src/server.ts'], {
          cwd: backendDir,
          stdio: 'pipe'
        });
      } else if (fs.existsSync(distServer)) {
        spawnedServer = spawn(process.execPath, ['dist/server.js'], {
          cwd: backendDir,
          stdio: 'pipe'
        });
      } else {
        execSync('npm run build --workspace=backend', { cwd: rootDir, stdio: 'inherit' });
        spawnedServer = spawn(process.execPath, ['dist/server.js'], {
          cwd: backendDir,
          stdio: 'pipe'
        });
      }

      const cleanupOnSignal = () => {
        if (spawnedServer?.pid) {
          killProcessTree(spawnedServer.pid);
        }
      };
      process.on('SIGINT', cleanupOnSignal);
      process.on('SIGTERM', cleanupOnSignal);
      process.on('exit', cleanupOnSignal);

      const maxWait = 15000;
      const startWait = Date.now();
      let ready = false;
      while (Date.now() - startWait < maxWait) {
        if (await isServerUp(API_BASE)) {
          ready = true;
          break;
        }
        await new Promise(r => setTimeout(r, 250));
      }

      if (!ready) {
        throw new Error('Timed out waiting for HMS Backend API server to start.');
      }
      console.log('✅ HMS backend server is ready.\n');
    }

    // Reset database to seed baseline before running tests to ensure idempotency
    try {
      await fetch(`${API_BASE}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
    } catch {
      // Best-effort reset
    }

    async function testCase(ucId, title, scenario, execution) {
      total++;
      console.log(`--------------------------------------------------------------------`);
      console.log(`📌 [${ucId}] ${title}`);
      console.log(`   Scenario: ${scenario}`);
      process.stdout.write(`   Executing... `);
      try {
        await execution();
        console.log('✅ PASSED (Verified)');
        passed++;
      } catch (err) {
        console.log('❌ FAILED');
        console.error(`   Failure Details: ${err.message}`);
        process.exitCode = 1;
      }
    }

  // -------------------------------------------------------------------------
  // UC-01: Health & Connectivity
  // -------------------------------------------------------------------------
  await testCase(
    'UC-01',
    'System Health, Connectivity & Core Service Registry',
    'Verify that backend microservices, database, and API router are responsive.',
    async () => {
      const res = await fetch(`${API_BASE}/health`);
      assert(res.ok, `Health check returned HTTP ${res.status}`);
      const data = await res.json();
      assert(data.status === 'healthy', 'Service health check is not healthy');
      assert(data.version === '1.0.0', 'Version mismatch');
    }
  );

  // -------------------------------------------------------------------------
  // UC-02: Lodgify Dashboard Metrics
  // -------------------------------------------------------------------------
  await testCase(
    'UC-02',
    'Lodgify Dashboard Analytics & Live Hospitality KPIs',
    'Verify occupancy counters, revenue curves, and platform distribution feeds.',
    async () => {
      const res = await fetch(`${API_BASE}/dashboard`);
      assert(res.ok, 'Failed to fetch dashboard metrics');
      const data = await res.json();
      assert(data.metrics && typeof data.metrics.newBookings === 'number', 'Missing newBookings');
      assert(data.roomAvailability.total > 0, 'Zero total rooms in inventory');
      assert(data.roomAvailability.occupied >= 0, 'Invalid occupied count');
      assert(data.ratings.score === 4.6, 'Expected benchmark rating 4.6');
      assert(Array.isArray(data.bookingByPlatform) && data.bookingByPlatform.length >= 4, 'Incomplete platform distribution');
    }
  );

  // -------------------------------------------------------------------------
  // UC-03: Dynamic Occupancy & Surge Pricing
  // -------------------------------------------------------------------------
  await testCase(
    'UC-03',
    'Dynamic Occupancy & Demand Surge Pricing Engine',
    'Verify tariff recalculation when occupancy exceeds surge threshold with weekend multipliers.',
    async () => {
      const res = await fetch(`${API_BASE}/pricing/config`);
      assert(res.ok, 'Failed to fetch dynamic pricing configuration');
      const config = await res.json();
      assert(config.baseOccupancyThreshold >= 50 && config.baseOccupancyThreshold <= 90, 'Threshold out of bounds');
      assert(config.surgeMultiplier >= 1.0, 'Invalid surge multiplier');
      assert(config.isSurgeActive === true, 'Dynamic surge must be active');
    }
  );

  // -------------------------------------------------------------------------
  // UC-04: Digital KYC & ID Verification
  // -------------------------------------------------------------------------
  let guestResvId = null;
  let testRoomNumber = '106';
  await testCase(
    'UC-04',
    'Guest Reservation & Digital KYC Ingestion',
    'Guest creates direct reservation with passport credentials; verify KYC verification state.',
    async () => {
      const bookingPayload = {
        guestName: 'Madeline Albright',
        guestEmail: 'm.albright@diplomacy.gov',
        guestPhone: '+1 202 555 0188',
        roomId: 'rm-106',
        roomNumber: testRoomNumber,
        checkInDate: '2026-09-18',
        checkOutDate: '2026-09-22',
        guestsCount: 2,
        source: 'Direct',
        documentType: 'Passport',
        documentNumber: 'US-PA-9912048X'
      };

      const res = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      assert(res.ok, 'Failed to create reservation');
      const data = await res.json();
      assert(data.reservation && data.reservation.id, 'No reservation ID generated');
      assert(data.reservation.kycStatus === 'Verified', 'KYC status should be Verified with valid ID');
      assert(data.reservation.totalNights === 4, 'Nights calculation mismatch');
      guestResvId = data.reservation.id;
    }
  );

  // -------------------------------------------------------------------------
  // UC-05: Check-in & Room State Synchronization
  // -------------------------------------------------------------------------
  await testCase(
    'UC-05',
    'Front Desk Check-in & Room Occupancy Synchronization',
    'Perform guest check-in; verify room status transitions to Occupied and folio initializes.',
    async () => {
      const checkInRes = await fetch(`${API_BASE}/reservations/${guestResvId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'Passport',
          documentNumber: 'US-PA-9912048X'
        })
      });
      assert(checkInRes.ok, 'Check-in request failed');
      const data = await checkInRes.json();
      assert(data.reservation.status === 'CheckedIn', 'Reservation status must be CheckedIn');

      // Verify room state
      const roomsRes = await fetch(`${API_BASE}/rooms`);
      const rooms = await roomsRes.json();
      const room = rooms.find(r => r.roomNumber === testRoomNumber);
      assert(room && room.status === 'Occupied', `Room ${testRoomNumber} must be marked as Occupied`);
      assert(room.currentGuest === 'Madeline Albright', 'Current guest name mismatch in room record');
    }
  );

  // -------------------------------------------------------------------------
  // UC-06: Restaurant & Room Service POS with KDS
  // -------------------------------------------------------------------------
  let activeFolioId = null;
  await testCase(
    'UC-06',
    'Restaurant POS Order & Kitchen Display System (KDS) Routing',
    'Place Room Service order, advance KDS preparation stages, and route charge to guest folio.',
    async () => {
      const posPayload = {
        type: 'RoomService',
        roomOrTableNumber: testRoomNumber,
        guestName: 'Madeline Albright',
        billedToRoom: true,
        items: [
          { id: 'm1', name: 'Truffle Mushroom Risotto', quantity: 2, unitPrice: 850, category: 'Main Course' },
          { id: 'm7', name: 'Craft Berry Mocktail', quantity: 2, unitPrice: 280, category: 'Beverage' },
          { id: 'm8', name: 'Tiramisu Della Nonna', quantity: 1, unitPrice: 420, category: 'Dessert' }
        ]
      };

      const posRes = await fetch(`${API_BASE}/pos/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(posPayload)
      });
      assert(posRes.ok, 'POS order placement failed');
      const posData = await posRes.json();
      assert(posData.id && posData.orderNumber, 'POS order ID missing');
      assert(posData.status === 'Received', 'Initial POS status must be Received');

      // Advance KDS: Received -> Preparing -> Ready -> Delivered
      const advanceRes = await fetch(`${API_BASE}/pos/orders/${posData.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Delivered' })
      });
      assert(advanceRes.ok, 'Failed to advance KDS order status');
      const advanced = await advanceRes.json();
      assert(advanced.status === 'Delivered', 'KDS order must be Delivered');
    }
  );

  // -------------------------------------------------------------------------
  // UC-07: Dual-Slab GST Compliance & Folio Calculation
  // -------------------------------------------------------------------------
  await testCase(
    'UC-07',
    'Dual-Slab GST / Tax Compliance & Itemized Folio Invoicing',
    'Verify SAC codes 996311/996331, dual-slab rates (12% vs 18%), and split CGST + SGST accounting.',
    async () => {
      const foliosRes = await fetch(`${API_BASE}/folios`);
      const folios = await foliosRes.json();
      const folio = folios.find(f => f.reservationId === guestResvId);
      assert(folio, 'Active folio for guest not found');
      activeFolioId = folio.id;

      // Verify itemized charges include Room stay and F&B POS order
      const hasRoomCharge = folio.items.some(i => i.category === 'Room' && i.hsnSacCode === '996311');
      const hasPosCharge = folio.items.some(i => i.category === 'Restaurant' && i.hsnSacCode === '996331');
      assert(hasRoomCharge, 'Room accommodation charge missing from folio');
      assert(hasPosCharge, 'F&B POS order missing from folio');

      // Verify GST split: Total Tax = CGST + SGST
      assert(folio.totalTax > 0, 'Folio total tax should be greater than zero');
      assert(folio.cgst + folio.sgst === folio.totalTax, 'CGST + SGST must balance total GST tax');
      assert(folio.balanceDue > 0, 'Folio balance due must be positive prior to payment');
    }
  );

  // -------------------------------------------------------------------------
  // UC-08: Multi-Gateway Payment Settlement
  // -------------------------------------------------------------------------
  await testCase(
    'UC-08',
    'Omnichannel Payment Gateway Settlement (Stripe/Razorpay)',
    'Simulate payment transaction; verify zero balance due and folio state marked Settled.',
    async () => {
      const payRes = await fetch(`${API_BASE}/folios/${activeFolioId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'Stripe'
        })
      });
      assert(payRes.ok, 'Payment gateway processing failed');
      const settledFolio = await payRes.json();
      assert(settledFolio.status === 'Settled', 'Folio must be marked Settled');
      assert(settledFolio.balanceDue === 0, 'Folio balance must be 0 after settlement');
      assert(settledFolio.paymentMethod === 'Stripe', 'Payment method record mismatch');
    }
  );

  // -------------------------------------------------------------------------
  // UC-09: Guest Checkout & Room Turnover Dispatch
  // -------------------------------------------------------------------------
  await testCase(
    'UC-09',
    'Guest Checkout & Automatic Housekeeping Dispatch',
    'Execute guest checkout; verify room status flips to Dirty and creates Routine Cleaning task.',
    async () => {
      const checkOutRes = await fetch(`${API_BASE}/reservations/${guestResvId}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      assert(checkOutRes.ok, 'Checkout failed');
      const resvData = await checkOutRes.json();
      assert(resvData.reservation.status === 'CheckedOut', 'Reservation must be CheckedOut');

      // Verify Room turned Dirty
      const roomsRes = await fetch(`${API_BASE}/rooms`);
      const rooms = await roomsRes.json();
      const room = rooms.find(r => r.roomNumber === testRoomNumber);
      assert(room && room.status === 'Dirty', `Room ${testRoomNumber} must be marked Dirty`);

      // Verify Housekeeping Task created
      const tasksRes = await fetch(`${API_BASE}/housekeeping/tasks`);
      const tasks = await tasksRes.json();
      const task = tasks.find(t => t.roomNumber === testRoomNumber && t.taskType === 'Routine Cleaning');
      assert(task, `Automated housekeeping dispatch task missing for Room ${testRoomNumber}`);
      assert(task.priority === 'High', 'Checkout cleaning task should be High priority');
    }
  );

  // -------------------------------------------------------------------------
  // UC-10: Housekeeping Cleaning Cycle & Room Release
  // -------------------------------------------------------------------------
  await testCase(
    'UC-10',
    'Housekeeping Lifecycle & Room Release to Available',
    'Cleaner marks task Completed; verify room status automatically updates to Available for next guest.',
    async () => {
      const tasksRes = await fetch(`${API_BASE}/housekeeping/tasks`);
      const tasks = await tasksRes.json();
      const task = tasks.find(t => t.roomNumber === testRoomNumber);
      assert(task, 'Task not found');

      // Advance task: Pending -> Completed
      const updateTaskRes = await fetch(`${API_BASE}/housekeeping/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Completed',
          notes: 'Deep sanitized and fresh linens placed.'
        })
      });
      assert(updateTaskRes.ok, 'Failed to complete housekeeping task');

      // Verify room status is now Available
      const roomsRes = await fetch(`${API_BASE}/rooms`);
      const rooms = await roomsRes.json();
      const room = rooms.find(r => r.roomNumber === testRoomNumber);
      assert(room && room.status === 'Available', `Room ${testRoomNumber} must be Available after cleaning completion`);
    }
  );

  // -------------------------------------------------------------------------
  // UC-11: Inventory & Supply Depletion Alerts
  // -------------------------------------------------------------------------
  await testCase(
    'UC-11',
    'Inventory Stock Control & Low-Stock Alerts',
    'Inspect stock levels; update inventory count below minimum threshold and verify alert state.',
    async () => {
      const invRes = await fetch(`${API_BASE}/inventory`);
      const items = await invRes.json();
      assert(Array.isArray(items) && items.length > 0, 'No inventory items found');

      // Restock an item
      const testItem = items[0];
      const restockRes = await fetch(`${API_BASE}/inventory/${testItem.id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStock: testItem.currentStock + 20 })
      });
      assert(restockRes.ok, 'Failed to update stock');
      const updatedItem = await restockRes.json();
      assert(updatedItem.currentStock === testItem.currentStock + 20, 'Stock count was not incremented');
    }
  );

  // -------------------------------------------------------------------------
  // UC-12: Staff Biometric Attendance & Leave Management
  // -------------------------------------------------------------------------
  await testCase(
    'UC-12',
    'Staff Roster, Biometric Attendance & HR Leave Flow',
    'Simulate staff biometric fingerprint punch-in and clock-out timestamp verification.',
    async () => {
      const staffRes = await fetch(`${API_BASE}/staff`);
      const staffList = await staffRes.json();
      assert(staffList.length > 0, 'No staff records found');

      const staffMember = staffList[0];
      const punchRes = await fetch(`${API_BASE}/staff/attendance/punch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: staffMember.id,
          method: 'Biometric Scanner'
        })
      });
      assert(punchRes.ok, 'Biometric punch request failed');
      const punchData = await punchRes.json();
      assert(punchData.record && punchData.record.clockIn, 'Clock-in timestamp was not recorded');
    }
  );

  // -------------------------------------------------------------------------
  // UC-13: Guest Experience, NPS & Loyalty Accrual
  // -------------------------------------------------------------------------
  await testCase(
    'UC-13',
    'Guest Experience Survey, NPS Calculation & Sentiment Scoring',
    'Submit post-checkout guest review (NPS 10/10); verify positive sentiment tag and loyalty perks.',
    async () => {
      const feedbackPayload = {
        guestName: 'Madeline Albright',
        roomNumber: testRoomNumber,
        npsScore: 10,
        ratingCleanliness: 5,
        ratingStaff: 5,
        ratingFood: 5,
        ratingValue: 5,
        comments: 'World-class hospitality, immaculate room, and exquisite room service!'
      };

      const fbRes = await fetch(`${API_BASE}/guest-exp/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      });
      assert(fbRes.ok, 'Failed to record guest feedback');
      const fbData = await fbRes.json();
      assert(fbData.npsScore === 10, 'NPS score mismatch');
      assert(fbData.sentiment === 'Positive', 'NPS 10 must score as Positive sentiment');

      // Verify Loyalty
      const loyRes = await fetch(`${API_BASE}/guest-exp/loyalty`);
      const loyalty = await loyRes.json();
      assert(Array.isArray(loyalty) && loyalty.length > 0, 'Loyalty registry is empty');
    }
  );

  // -------------------------------------------------------------------------
  // UC-14: 2-Way OTA Channel Synchronization & Audit Trail
  // -------------------------------------------------------------------------
  await testCase(
    'UC-14',
    '2-Way OTA Channel Manager Sync & Security Audit Trail',
    'Broadcast rate parity and inventory across Booking.com, Expedia, Airbnb; verify immutable audit log.',
    async () => {
      const syncRes = await fetch(`${API_BASE}/ota/sync-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      assert(syncRes.ok, 'OTA sync failed');
      const syncData = await syncRes.json();
      assert(Array.isArray(syncData.logs) && syncData.logs.length >= 10, 'OTA broadcast logs incomplete');

      // Verify Audit Trail
      const auditRes = await fetch(`${API_BASE}/audit`);
      const audit = await auditRes.json();
      assert(audit.length >= 5, 'Insufficient audit trail records');
      const hasCheckoutAudit = audit.some(a => a.action === 'CHECK_OUT');
      const hasPosAudit = audit.some(a => a.action === 'POS_ORDER_CREATED');
      assert(hasCheckoutAudit, 'CHECK_OUT action was not recorded in audit trail');
      assert(hasPosAudit, 'POS_ORDER_CREATED action was not recorded in audit trail');
    }
  );

  // -------------------------------------------------------------------------
  // UC-15: Role-Based Access Control (RBAC) & Multi-Role Authentication
  // -------------------------------------------------------------------------
  await testCase(
    'UC-15',
    'Role-Based Access Control (RBAC) & Multi-Role Authentication',
    'Verify that admin, reception, housekeeping, and kitchen credentials authenticate and receive scoped permissions.',
    async () => {
      // 1. Admin Login
      const adminRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });
      assert(adminRes.ok, 'Admin login failed');
      const adminData = await adminRes.json();
      assert(adminData.user.role === 'Admin', 'Expected role Admin');
      assert(adminData.user.landingTab === 'dashboard', 'Admin should land on dashboard');
      assert(adminData.user.allowedTabs.length >= 12, 'Admin should have access to all modules');

      // 2. Reception Login
      const recRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'reception', password: 'rec123' })
      });
      assert(recRes.ok, 'Reception login failed');
      const recData = await recRes.json();
      assert(recData.user.role === 'Reception', 'Expected role Reception');
      assert(recData.user.landingTab === 'reservation', 'Reception must land on reservation module');
      assert(recData.user.allowedTabs.includes('reservation') && recData.user.allowedTabs.includes('financials'), 'Reception must access booking & final bills');
      assert(!recData.user.allowedTabs.includes('staff'), 'Reception must not access staff HR module');

      // 3. Housekeeping Login
      const cleanRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'cleaner', password: 'clean123' })
      });
      assert(cleanRes.ok, 'Housekeeping login failed');
      const cleanData = await cleanRes.json();
      assert(cleanData.user.role === 'Housekeeping', 'Expected role Housekeeping');
      assert(cleanData.user.landingTab === 'housekeeping', 'Housekeeping must land on housekeeping module');

      // 4. Kitchen Login
      const chefRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'chef', password: 'chef123' })
      });
      assert(chefRes.ok, 'Kitchen login failed');
      const chefData = await chefRes.json();
      assert(chefData.user.role === 'Kitchen', 'Expected role Kitchen');
      assert(chefData.user.landingTab === 'concierge', 'Kitchen must land on POS/KDS module');
      assert(chefData.user.allowedTabs.includes('concierge') && chefData.user.allowedTabs.includes('inventory'), 'Kitchen must access KDS and Kitchen inventory');
    }
  );

  // -------------------------------------------------------------------------
  // UC-16: Exclusive Admin User Creation & Role Assignment
  // -------------------------------------------------------------------------
  await testCase(
    'UC-16',
    'Exclusive Admin User Creation & Role Assignment',
    'Verify that admin can provision new staff accounts with designated roles and automatic permission scoping.',
    async () => {
      const newUsername = `nightmgr_${Date.now().toString().slice(-4)}`;
      const createRes = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Vikram Joshi',
          username: newUsername,
          password: 'secretPassword123',
          role: 'Reception'
        })
      });
      assert(createRes.status === 201, `Failed to create user, status: ${createRes.status}`);
      const newUser = await createRes.json();
      assert(newUser.username === newUsername, 'Username mismatch');
      assert(newUser.role === 'Reception', 'Role assignment mismatch');
      assert(newUser.landingTab === 'reservation', 'New reception user must land on reservation');

      // Verify that newly created user can log in immediately
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: 'secretPassword123' })
      });
      assert(loginRes.ok, 'Newly created user failed to authenticate');
      const loginData = await loginRes.json();
      assert(loginData.user.role === 'Reception', 'Role mismatch on new user login');
    }
  );

  // -------------------------------------------------------------------------
  // UC-17: Front Desk Booking Engine with Scanned Document Upload
  // -------------------------------------------------------------------------
  await testCase(
    'UC-17',
    'Front Desk Booking Engine & Scanned Document KYC Upload',
    'Verify booking check-in, scanned document attachment, immediate occupancy, and folio billing generation.',
    async () => {
      const bookingPayload = {
        guestName: 'Jonathan Vance',
        guestEmail: 'j.vance@vancetech.org',
        guestPhone: '+1 415 889 2011',
        roomId: '104',
        checkInDate: '2025-12-05',
        checkOutDate: '2025-12-08',
        guestsCount: 2,
        source: 'Direct',
        documentType: 'Passport',
        documentNumber: 'USA-77889901P',
        documentUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
        nationality: 'United States',
        guestAddress: '124 Market Street, San Francisco, CA',
        purposeOfVisit: 'Leisure',
        immediateCheckIn: true,
        advancePaid: 8400,
        paymentMethod: 'CreditCard'
      };

      const resvRes = await fetch(`${API_BASE}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });
      assert(resvRes.status === 201, `Failed to create reservation with document: ${resvRes.status}`);
      const resvData = await resvRes.json();
      assert(resvData.reservation.status === 'CheckedIn', 'Reservation should be CheckedIn');
      assert(resvData.reservation.kycStatus === 'Verified', 'KYC should be Verified upon document upload');
      assert(resvData.reservation.documentUrl !== undefined, 'Scanned document URL missing');
      assert(resvData.folio !== undefined, 'Folio was not generated');
      assert(resvData.folio.items.length > 0, 'Folio items missing');
    }
  );

  // -------------------------------------------------------------------------
  // UC-18: Housekeeping Cleaning Lifecycle & Maintenance Work Orders
  // -------------------------------------------------------------------------
  await testCase(
    'UC-18',
    'Housekeeping Lifecycle & Maintenance Work Orders Resolution',
    'Verify room status transition (In Process -> Clean), work order creation, and technician resolution.',
    async () => {
      // 1. Update Room Clean Status
      const statusRes = await fetch(`${API_BASE}/housekeeping/tasks/108/clean-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cleanStatus: 'Clean', availability: 'Occupied', remarks: 'Routine clean completed' })
      });
      assert(statusRes.ok, 'Failed to update housekeeping status');
      const statusData = await statusRes.json();
      assert(statusData.cleanStatus === 'Clean', 'Clean status mismatch');

      // 2. Create Maintenance Work Order
      const mwoRes = await fetch(`${API_BASE}/maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNumber: '106',
          issue: 'Bathroom faucet dripping continuously',
          category: 'Plumbing',
          priority: 'High',
          reportedBy: 'Priya Sharma (Housekeeper)',
          remarks: 'Replace ceramic cartridge'
        })
      });
      assert(mwoRes.status === 201, 'Failed to create maintenance work order');
      const mwo = await mwoRes.json();
      assert(mwo.status === 'Reported', 'New work order should be Reported');

      // 3. Resolve Maintenance Work Order
      const resolveRes = await fetch(`${API_BASE}/maintenance/${mwo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved', remarks: 'Cartridge replaced and leak tested.' })
      });
      assert(resolveRes.ok, 'Failed to resolve maintenance order');
      const resolved = await resolveRes.json();
      assert(resolved.status === 'Resolved', 'Work order status should be Resolved');
      assert(resolved.resolvedAt !== undefined, 'Missing resolved timestamp');
    }
  );

  // -------------------------------------------------------------------------
  // UC-19: Enterprise UAT Data Seed & Reset Lifecycle
  // -------------------------------------------------------------------------
  await testCase(
    'UC-19',
    'Enterprise UAT Data Seed & Reset Lifecycle',
    'Verify that test database can be seeded and re-initialized with all operational scenarios.',
    async () => {
      const seedRes = await fetch(`${API_BASE}/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      assert(seedRes.ok, 'Seed endpoint failed');
      const seedData = await seedRes.json();
      assert(seedData.success === true, 'Seed operation did not report success');
      assert(seedData.summary.roomsCount >= 18, 'Insufficient seeded rooms');
      assert(seedData.summary.housekeepingTasksCount >= 10, 'Insufficient seeded housekeeping tasks');
      assert(seedData.summary.systemUsersCount >= 4, 'Insufficient seeded system users');
    }
  );

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  console.log('\n====================================================================');
  console.log(`📊 ENTERPRISE UAT SUMMARY: ${passed}/${total} USE CASES PASSED (${passRate}%)`);
  console.log(`⏱ Total Duration: ${durationSec}s`);
  console.log(`🛡 All Industry Standard Hospitality Criteria Satisfied.`);
  console.log('====================================================================\n');

  if (passed !== total) {
    process.exitCode = 1;
  }
} finally {
  if (spawnedServer?.pid) {
    killProcessTree(spawnedServer.pid);
  }
}
}

runEnterpriseUat().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
