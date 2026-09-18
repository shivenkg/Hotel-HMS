-- ============================================================================
-- HOTEL MANAGEMENT SYSTEM (HMS) - MASTER SEED DATA
-- Default Tenant: Grand Azure Hospitality Group
-- Default Property: The Grand Azure Hotel & Suites (Goa)
-- ============================================================================

-- 1. Master Tenant
INSERT INTO identity.tenants (id, code, name, subscription_tier)
VALUES ('a0000000-0000-0000-0000-000000000001', 'GRAND_AZURE_GROUP', 'Grand Azure Hospitality Group', 'Enterprise')
ON CONFLICT (code) DO NOTHING;

-- 2. Master Property
INSERT INTO hotel.properties (id, tenant_id, code, name, currency_code, timezone, gstin, hsn_sac_code)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'GA-GOA',
    'The Grand Azure Hotel & Suites',
    'INR',
    'Asia/Kolkata',
    '27AAAAA0000A1Z5',
    '996311'
)
ON CONFLICT (tenant_id, code) DO NOTHING;

-- 3. Room Types
INSERT INTO hotel.room_types (id, tenant_id, property_id, code, name, base_occupancy, max_occupancy, base_rate, amenities)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'STD', 'Standard Room', 2, 3, 4500.00, '["High-Speed Wi-Fi", "Smart TV", "Coffee Maker"]'::jsonb),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'DLX', 'Deluxe Room', 2, 4, 7200.00, '["High-Speed Wi-Fi", "Balcony", "Minibar", "Rain Shower"]'::jsonb),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'EXE', 'Executive Suite', 2, 4, 12500.00, '["Panoramic Ocean View", "Jacuzzi", "Butler Service", "Lounge Access"]'::jsonb),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'PRS', 'Presidential Suite', 4, 6, 28000.00, '["Private Plunge Pool", "Dedicated Chauffeur", "Private Chef Kitchen"]'::jsonb)
ON CONFLICT (property_id, code) DO NOTHING;

-- 4. Initial System Users
INSERT INTO identity.users (tenant_id, username, email, password_hash, full_name, role, landing_tab, allowed_tabs)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'admin', 'admin@grandazure.com', 'admin123', 'Rajesh Sharma (General Manager)', 'Admin', 'dashboard', '["dashboard", "reservation", "billing", "concierge", "room", "inventory", "housekeeping", "feedback", "analytics", "admin"]'::jsonb),
('a0000000-0000-0000-0000-000000000001', 'reception', 'frontdesk@grandazure.com', 'reception123', 'Ananya Patel (Front Office Executive)', 'Reception', 'reservation', '["reservation", "billing", "concierge", "room"]'::jsonb),
('a0000000-0000-0000-0000-000000000001', 'housekeeper', 'housekeeping@grandazure.com', 'clean123', 'Priya Sharma (Head of Housekeeping)', 'Housekeeping', 'room', '["room", "inventory"]'::jsonb),
('a0000000-0000-0000-0000-000000000001', 'chef', 'kitchen@grandazure.com', 'chef123', 'Chef Marco Rossi (Executive Chef)', 'Kitchen', 'concierge', '["concierge", "inventory"]'::jsonb)
ON CONFLICT (tenant_id, username) DO NOTHING;

-- 5. Outlets
INSERT INTO hotel.outlets (tenant_id, property_id, code, name, outlet_type)
VALUES
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'AZURE_BISTRO', 'The Azure Bistro & Lounge', 'Restaurant'),
('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ROOM_SERVICE', 'In-Room Dining', 'RoomService')
ON CONFLICT DO NOTHING;

-- 6. Pricing Configuration
INSERT INTO reservation.pricing_configs (property_id, base_occupancy_threshold, surge_multiplier, weekend_multiplier, peak_season_multiplier, is_surge_active)
VALUES ('b0000000-0000-0000-0000-000000000001', 75, 1.25, 1.15, 1.30, true)
ON CONFLICT (property_id) DO NOTHING;
