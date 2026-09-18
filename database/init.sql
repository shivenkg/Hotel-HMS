-- ============================================================================
-- HOTEL MANAGEMENT SYSTEM (HMS) - ENTERPRISE POSTGRESQL DDL SPECIFICATION
-- Standard: HFTP Uniform System of Accounts for the Lodging Industry (USALI)
-- Architecture: PostgreSQL-First, Domain-Modular, Append-Only Ledgers, Multi-Tenant RLS
-- Target Versions: PostgreSQL 16 / 17+
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. TECHNICAL DOMAIN SCHEMAS
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS hotel;
CREATE SCHEMA IF NOT EXISTS guest;
CREATE SCHEMA IF NOT EXISTS reservation;
CREATE SCHEMA IF NOT EXISTS stay;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE SCHEMA IF NOT EXISTS pos;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS housekeeping;
CREATE SCHEMA IF NOT EXISTS workforce;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;
CREATE SCHEMA IF NOT EXISTS reporting;

-- ----------------------------------------------------------------------------
-- 2. IDENTITY & ACCESS CONTROL (identity)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS identity.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    subscription_tier VARCHAR(50) NOT NULL DEFAULT 'Enterprise',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Admin, Manager, Reception, Housekeeping, Kitchen, Accountant
    landing_tab VARCHAR(50) NOT NULL DEFAULT 'dashboard',
    allowed_tabs JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_tenant_username UNIQUE (tenant_id, username),
    CONSTRAINT uq_tenant_email UNIQUE (tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_tenant_role ON identity.users(tenant_id, role);

-- ----------------------------------------------------------------------------
-- 3. PROPERTY & ROOM HIERARCHY (hotel)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hotel.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    currency_code VARCHAR(3) NOT NULL DEFAULT 'INR',
    timezone VARCHAR(100) NOT NULL DEFAULT 'Asia/Kolkata',
    checkin_time TIME NOT NULL DEFAULT '14:00:00',
    checkout_time TIME NOT NULL DEFAULT '11:00:00',
    gstin VARCHAR(30),
    hsn_sac_code VARCHAR(10) NOT NULL DEFAULT '996311',
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_tenant_property_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS hotel.room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    base_occupancy INT NOT NULL DEFAULT 2,
    max_occupancy INT NOT NULL DEFAULT 4,
    base_rate NUMERIC(12, 2) NOT NULL,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_room_type_code UNIQUE (property_id, code)
);

CREATE TABLE IF NOT EXISTS hotel.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    room_type_id UUID NOT NULL REFERENCES hotel.room_types(id),
    category VARCHAR(50) NOT NULL, -- Standard, Deluxe, Executive Suite, Presidential Suite
    base_rate NUMERIC(12, 2) NOT NULL,
    max_guests INT NOT NULL DEFAULT 2,
    status VARCHAR(30) NOT NULL DEFAULT 'Available', -- Available, Occupied, Dirty, Cleaning, Inspected, OutOfOrder
    current_guest VARCHAR(255),
    current_reservation_id UUID,
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_room_number UNIQUE (property_id, room_number)
);

CREATE INDEX IF NOT EXISTS idx_rooms_status ON hotel.rooms(property_id, status);

CREATE TABLE IF NOT EXISTS hotel.outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    outlet_type VARCHAR(50) NOT NULL DEFAULT 'Restaurant', -- Restaurant, Bar, RoomService, Spa
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. GUEST CRM & KYC VERIFICATION (guest)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guest.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    nationality VARCHAR(100),
    address TEXT,
    kyc_status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- Verified, Pending, Rejected
    document_type VARCHAR(50), -- Passport, DrivingLicense, NationalID, VoterID
    document_number VARCHAR(100),
    document_url TEXT,
    loyalty_tier VARCHAR(30) NOT NULL DEFAULT 'Silver',
    loyalty_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guests_phone ON guest.guests(tenant_id, phone);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guest.guests(tenant_id, email);

-- ----------------------------------------------------------------------------
-- 5. DAILY AVAILABILITY & RESERVATION ENGINE (reservation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reservation.room_inventory_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES hotel.room_types(id) ON DELETE CASCADE,
    stay_date DATE NOT NULL,
    physical_rooms INT NOT NULL DEFAULT 0,
    out_of_order_rooms INT NOT NULL DEFAULT 0,
    sellable_rooms INT NOT NULL DEFAULT 0,
    confirmed_rooms INT NOT NULL DEFAULT 0,
    tentative_rooms INT NOT NULL DEFAULT 0,
    blocked_rooms INT NOT NULL DEFAULT 0,
    overbooking_limit INT NOT NULL DEFAULT 0,
    available_to_sell INT NOT NULL DEFAULT 0,
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_daily_inv_date_type UNIQUE (property_id, room_type_id, stay_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_inv_lookup ON reservation.room_inventory_daily(property_id, stay_date, room_type_id);

CREATE TABLE IF NOT EXISTS reservation.pricing_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE UNIQUE,
    base_occupancy_threshold INT NOT NULL DEFAULT 75,
    surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.25,
    weekend_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.15,
    peak_season_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.30,
    is_surge_active BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reservation.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    booking_ref VARCHAR(50) NOT NULL,
    guest_id UUID REFERENCES guest.guests(id),
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255),
    guest_phone VARCHAR(50),
    room_id UUID REFERENCES hotel.rooms(id),
    room_number VARCHAR(20) NOT NULL,
    room_category VARCHAR(50) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests_count INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'Confirmed', -- Confirmed, CheckedIn, CheckedOut, Cancelled, NoShow
    source VARCHAR(50) NOT NULL DEFAULT 'Direct', -- Direct, Booking.com, Expedia, Airbnb, WalkIn
    total_nights INT NOT NULL,
    room_rate_per_night NUMERIC(12, 2) NOT NULL,
    total_room_amount NUMERIC(12, 2) NOT NULL,
    tax_amount NUMERIC(12, 2) NOT NULL,
    grand_total NUMERIC(12, 2) NOT NULL,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'Unpaid', -- Unpaid, Partial, Paid
    kyc_status VARCHAR(30) NOT NULL DEFAULT 'Verified',
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    document_url TEXT,
    nationality VARCHAR(100),
    guest_address TEXT,
    purpose_of_visit VARCHAR(100),
    special_requests TEXT,
    business_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_booking_ref UNIQUE (property_id, booking_ref)
);

CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservation.reservations(property_id, check_in_date, check_out_date, status);
CREATE INDEX IF NOT EXISTS idx_reservations_room ON reservation.reservations(property_id, room_number);

-- ----------------------------------------------------------------------------
-- 6. FRONT DESK & GUEST STAY TRACKING (stay)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS stay.checkin_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    reservation_id UUID NOT NULL REFERENCES reservation.reservations(id),
    room_id UUID NOT NULL REFERENCES hotel.rooms(id),
    actual_checkin_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    checked_in_by VARCHAR(100) NOT NULL,
    kyc_verified BOOLEAN NOT NULL DEFAULT true,
    document_type VARCHAR(50),
    document_number VARCHAR(100),
    initial_folio_id UUID,
    business_date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS stay.checkout_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    reservation_id UUID NOT NULL REFERENCES reservation.reservations(id),
    room_id UUID NOT NULL REFERENCES hotel.rooms(id),
    actual_checkout_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    checked_out_by VARCHAR(100) NOT NULL,
    folio_settled BOOLEAN NOT NULL DEFAULT true,
    keycards_returned BOOLEAN NOT NULL DEFAULT true,
    business_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ----------------------------------------------------------------------------
-- 7. FINANCIAL FOLIO & APPEND-ONLY LEDGER (billing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS billing.folios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservation.reservations(id),
    guest_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    cgst NUMERIC(12, 2) NOT NULL DEFAULT 0,
    sgst NUMERIC(12, 2) NOT NULL DEFAULT 0,
    igst NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    balance_due NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'Open', -- Open, Settled, Refunded, Void
    payment_method VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_invoice_number UNIQUE (property_id, invoice_number)
);

-- Append-Only Folio Entry Ledger
CREATE TABLE IF NOT EXISTS billing.folio_entries (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    folio_id UUID NOT NULL REFERENCES billing.folios(id) ON DELETE CASCADE,
    business_date DATE NOT NULL DEFAULT CURRENT_DATE,
    entry_type VARCHAR(50) NOT NULL, -- ROOM_CHARGE, RESTAURANT_CHARGE, LAUNDRY_CHARGE, MINIBAR_CHARGE, PAYMENT, DISCOUNT, REVERSAL
    category VARCHAR(50) NOT NULL, -- Room, Restaurant, Minibar, Laundry, Spa, Tax, Payment
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    hsn_sac_code VARCHAR(20) NOT NULL,
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    source_module VARCHAR(50) NOT NULL, -- Reservation, POS, Laundry, FrontDesk
    source_document_id VARCHAR(100),
    idempotency_key VARCHAR(100),
    reversal_of_entry_id UUID,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    posted_by VARCHAR(100) NOT NULL DEFAULT 'System',
    PRIMARY KEY (id, business_date)
) PARTITION BY RANGE (business_date);

-- Partition creation helper for billing folio entries
CREATE TABLE IF NOT EXISTS billing.folio_entries_default PARTITION OF billing.folio_entries DEFAULT;

-- Double-Entry Accounting Journal Layer
CREATE TABLE IF NOT EXISTS billing.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    business_date DATE NOT NULL DEFAULT CURRENT_DATE,
    journal_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    reference_type VARCHAR(50) NOT NULL, -- FolioSettlement, NightAudit, PosRevenue
    reference_id UUID NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    posted_by VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS billing.journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES billing.journal_entries(id) ON DELETE CASCADE,
    account_code VARCHAR(50) NOT NULL, -- 1100 (Folio Receivable), 4100 (Room Revenue), 4200 (F&B Revenue), 2100 (GST Output)
    account_name VARCHAR(150) NOT NULL,
    debit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    credit NUMERIC(12, 2) NOT NULL DEFAULT 0,
    CONSTRAINT chk_debit_or_credit CHECK ((debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0))
);

-- ----------------------------------------------------------------------------
-- 8. RESTAURANT POS & KITCHEN DISPLAY SYSTEM (pos)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pos.pos_orders (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    outlet_id UUID,
    order_number VARCHAR(50) NOT NULL,
    order_type VARCHAR(50) NOT NULL DEFAULT 'RoomService', -- DineIn, RoomService, Takeaway
    room_or_table_number VARCHAR(50) NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    billed_to_room BOOLEAN NOT NULL DEFAULT true,
    folio_id UUID,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'Received', -- Received, Preparing, Ready, Delivered, Cancelled
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    business_date DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id, business_date)
) PARTITION BY RANGE (business_date);

CREATE TABLE IF NOT EXISTS pos.pos_orders_default PARTITION OF pos.pos_orders DEFAULT;

CREATE TABLE IF NOT EXISTS pos.pos_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pos_order_id UUID NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- Appetizer, Main Course, Beverage, Dessert
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    hsn_sac_code VARCHAR(10) NOT NULL DEFAULT '996331'
);

-- ----------------------------------------------------------------------------
-- 9. INVENTORY & STOCK LEDGER (inventory)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inventory.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES identity.tenants(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Kitchen, Amenities, Minibar, Linen, Housekeeping Supplies
    unit VARCHAR(30) NOT NULL DEFAULT 'pcs',
    min_threshold INT NOT NULL DEFAULT 10,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_sku UNIQUE (property_id, sku)
);

CREATE TABLE IF NOT EXISTS inventory.stock_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES hotel.properties(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES inventory.items(id) ON DELETE CASCADE,
    quantity_on_hand INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    quantity_available INT NOT NULL DEFAULT 0,
    last_restocked_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_item_balance UNIQUE (property_id, item_id)
);

-- Append-Only Stock Movement Ledger
CREATE TABLE IF NOT EXISTS inventory.stock_ledger (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    item_id UUID NOT NULL REFERENCES inventory.items(id),
    transaction_type VARCHAR(50) NOT NULL, -- PURCHASE_RECEIPT, STORE_ISSUE, KITCHEN_ISSUE, ROOM_MINIBAR_ISSUE, DAMAGE, WASTAGE
    quantity_in INT NOT NULL DEFAULT 0,
    quantity_out INT NOT NULL DEFAULT 0,
    unit_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
    source_document_type VARCHAR(50), -- PosOrder, HousekeepingRestock, PurchaseInvoice
    source_document_id VARCHAR(100),
    business_date DATE NOT NULL DEFAULT CURRENT_DATE,
    performed_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, business_date)
) PARTITION BY RANGE (business_date);

CREATE TABLE IF NOT EXISTS inventory.stock_ledger_default PARTITION OF inventory.stock_ledger DEFAULT;

-- ----------------------------------------------------------------------------
-- 10. HOUSEKEEPING & MAINTENANCE (housekeeping)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS housekeeping.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    room_id UUID NOT NULL REFERENCES hotel.rooms(id),
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50),
    task_type VARCHAR(50) NOT NULL, -- Routine Cleaning, Deep Clean, Inspection, Linen Change, Maintenance
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium', -- High, Medium, Low
    assigned_to VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- Pending, InProgress, Completed
    clean_status VARCHAR(30) DEFAULT 'Dirty', -- Clean, In Process, Dirty, Repair
    availability VARCHAR(30) DEFAULT 'Occupied', -- Available, Occupied, Cancel
    guest_name VARCHAR(255),
    remarks TEXT,
    notes TEXT,
    due_time VARCHAR(50),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS housekeeping.maintenance_work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    issue TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- Electrical, Plumbing, HVAC, Furniture, Keycard, Security
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium', -- Emergency, High, Medium, Low
    reported_by VARCHAR(100) NOT NULL,
    assigned_to VARCHAR(100) NOT NULL DEFAULT 'Duty Engineer',
    status VARCHAR(30) NOT NULL DEFAULT 'Reported', -- Reported, Assigned, InProgress, Resolved
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 11. WORKFORCE & ATTENDANCE (workforce)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workforce.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    employee_code VARCHAR(30) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL, -- Front Office, Housekeeping, F&B Service, Kitchen, Engineering, Admin
    shift VARCHAR(50) NOT NULL, -- Morning, Evening, Night, General
    status VARCHAR(30) NOT NULL DEFAULT 'OnDuty', -- OnDuty, OffDuty, OnLeave
    phone VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_property_employee_code UNIQUE (property_id, employee_code)
);

CREATE TABLE IF NOT EXISTS workforce.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    staff_id UUID NOT NULL REFERENCES workforce.staff(id),
    staff_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in_time VARCHAR(20),
    check_out_time VARCHAR(20),
    verification_type VARCHAR(50) NOT NULL DEFAULT 'Biometric Fingerprint',
    status VARCHAR(30) NOT NULL DEFAULT 'Present',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workforce.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    staff_id UUID NOT NULL REFERENCES workforce.staff(id),
    staff_name VARCHAR(255) NOT NULL,
    leave_type VARCHAR(50) NOT NULL, -- Sick Leave, Casual Leave, Annual Leave
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12. GUEST FEEDBACK & LOYALTY (guest)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS guest.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    property_id UUID NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    nps_score INT NOT NULL CHECK (nps_score BETWEEN 0 AND 10),
    sentiment VARCHAR(20) NOT NULL, -- Positive, Neutral, Negative
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guest.loyalty_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    tier VARCHAR(30) NOT NULL DEFAULT 'Silver', -- Silver, Gold, Platinum
    points INT NOT NULL DEFAULT 0,
    nights_stayed INT NOT NULL DEFAULT 0,
    perks JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 13. IMMUTABLE SECURITY AUDIT TRAIL (audit)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit.audit_log (
    id UUID DEFAULT gen_random_uuid(),
    tenant_id UUID,
    property_id UUID,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL DEFAULT '127.0.0.1',
    business_date DATE NOT NULL DEFAULT CURRENT_DATE,
    PRIMARY KEY (id, business_date)
) PARTITION BY RANGE (business_date);

CREATE TABLE IF NOT EXISTS audit.audit_log_default PARTITION OF audit.audit_log DEFAULT;

-- ----------------------------------------------------------------------------
-- 14. TRANSACTIONAL OUTBOX & EVENT LOG (integration)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS integration.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    property_id UUID,
    aggregate_type VARCHAR(100) NOT NULL, -- Reservation, Folio, Room, PosOrder, Inventory, Housekeeping
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- reservation.created, guest.checked_in, folio.charge_posted, etc.
    payload JSONB NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PUBLISHED, FAILED
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON integration.outbox_events(status, created_at) WHERE status = 'PENDING';

CREATE TABLE IF NOT EXISTS integration.ota_channel_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL,
    channel_name VARCHAR(100) NOT NULL, -- Booking.com, Expedia, Airbnb
    rate_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    inventory_count INT NOT NULL,
    sync_status VARCHAR(30) NOT NULL DEFAULT 'Synced',
    latency_ms INT NOT NULL DEFAULT 120,
    last_sync_time TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 15. ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE hotel.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing.folios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping.tasks ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_rooms_policy') THEN
        CREATE POLICY tenant_rooms_policy ON hotel.rooms 
        USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_reservations_policy') THEN
        CREATE POLICY tenant_reservations_policy ON reservation.reservations 
        USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tenant_folios_policy') THEN
        CREATE POLICY tenant_folios_policy ON billing.folios 
        USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
    END IF;
END $$;
