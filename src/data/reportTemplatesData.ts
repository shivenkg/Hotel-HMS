export interface ReportTemplateSection {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  isRequired?: boolean;
  columns?: string[];
}

export interface ReportTemplate {
  id: string;
  code: string;
  title: string;
  category: 'Night Audit & Finance' | 'Front Office & KYC' | 'Executive & Management' | 'Statutory & Tax' | 'Housekeeping & Operations' | 'Food & Beverage';
  description: string;
  frequency: 'Per Shift' | 'Daily' | 'Nightly' | 'Weekly' | 'Monthly' | 'On-Demand';
  orientation: 'Portrait' | 'Landscape';
  authorRole: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
  headerTitle: string;
  headerSubtitle: string;
  includeHotelLogo: boolean;
  includeGstinSac: boolean;
  disclaimerText: string;
  footerNote: string;
  signOffRoles: string[];
  sections: ReportTemplateSection[];
  isActive: boolean;
  sampleSummaryMetrics?: { label: string; value: string; delta?: string }[];
}

export const STORAGE_KEY_REPORT_TEMPLATES = 'hms_report_templates';

export const DEFAULT_PREFORMATTED_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl-1',
    code: 'REP-NIGHT-AUDIT',
    title: 'Night Audit Ledger & Daily Revenue Reconciliation',
    category: 'Night Audit & Finance',
    description: 'Statutory daily revenue balancing, room tariff postings, city ledger settlements, advance deposits, and POS revenue audit conforming to HFTP USALI standard.',
    frequency: 'Nightly',
    orientation: 'Portrait',
    authorRole: 'Admin / Financial Controller',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-18 03:30',
    headerTitle: 'DAILY NIGHT AUDIT & REVENUE REPORT',
    headerSubtitle: 'HFTP USALI 11th Edition • Standard Financial Ledger Certification',
    includeHotelLogo: true,
    includeGstinSac: true,
    disclaimerText: 'Certified tamper-proof audit output generated from automated PMS close-of-day sequence. All discrepancies above ₹500 require GM review.',
    footerNote: 'CONFIDENTIAL • Certified for internal audit and statutory compliance.',
    signOffRoles: ['Night Auditor', 'Front Office Manager', 'Financial Controller'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Rooms Occupied', value: '42 / 50 (84%)', delta: '+4% vs Yesterday' },
      { label: 'Room Revenue (SAC 996311)', value: '₹4,82,500', delta: '+12% vs Target' },
      { label: 'F&B Revenue (SAC 996331)', value: '₹1,24,800', delta: '+6% vs Target' },
      { label: 'Total Net Settlement', value: '₹6,07,300', delta: 'Balanced 100%' }
    ],
    sections: [
      { id: 'sec-rooms-summary', title: 'Room Revenue & Occupancy Analysis', description: 'Itemized breakdown by room class (Standard, Deluxe, Executive, Presidential).', enabled: true, isRequired: true, columns: ['Category', 'Total Units', 'Occupied', 'ADR', 'RevPAR', 'Net Revenue'] },
      { id: 'sec-pos-postings', title: 'Point-of-Sale (F&B / Spa / Minibar) Postings', description: 'Charges posted to guest room folios vs cash/card counter settlements.', enabled: true, columns: ['Outlet', 'Folio Postings', 'Direct POS', 'Total Sales', 'Tax Collected'] },
      { id: 'sec-payments-ledger', title: 'Payment Gateway & Cash Float Reconciliations', description: 'Stripe, Razorpay, UPI QR, Corporate Direct Billing, and Front Desk cash drop safe.', enabled: true, isRequired: true, columns: ['Method', 'Opening Float', 'Transactions', 'Settled Inward', 'Net Float'] },
      { id: 'sec-discrepancies', title: 'Rate Parity & OTA Variance Exceptions', description: 'Discounts, comp stays, and OTA commission deductions.', enabled: true, columns: ['Channel', 'Bookings', 'Net Revenue', 'Commission (15%)', 'Net Payable'] },
      { id: 'sec-sign-off', title: 'Statutory Certification & Sign-Off Block', description: 'Physical or digital sign-off blocks for Auditor and General Manager.', enabled: true, isRequired: true }
    ]
  },
  {
    id: 'tpl-2',
    code: 'REP-DAILY-FLASH',
    title: "General Manager's Daily Operational Flash Report",
    category: 'Executive & Management',
    description: 'Executive morning briefing showing 24-hour revenue, RevPAR, in-house VIP arrivals, out-of-order rooms, and staff attendance index.',
    frequency: 'Daily',
    orientation: 'Portrait',
    authorRole: 'Admin',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-18 07:00',
    headerTitle: "EXECUTIVE MANAGER'S DAILY FLASH REPORT",
    headerSubtitle: 'The Grand Azure Luxury Hotel & Suites • Operational Overview',
    includeHotelLogo: true,
    includeGstinSac: false,
    disclaimerText: 'Morning flash digest for General Manager and Department Heads. Key performance indicators compared with monthly budgetary targets.',
    footerNote: 'Generated automatically at 07:00 AM daily for morning briefing.',
    signOffRoles: ['Executive Housekeeper', 'Front Desk Lead', 'General Manager'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Forecast Occupancy', value: '88%', delta: 'Peak Weekend' },
      { label: 'Projected ADR', value: '₹11,480', delta: '+₹800 vs Budget' },
      { label: 'RevPAR', value: '₹9,643', delta: '+9.2%' },
      { label: 'VIP In-House Count', value: '6 Guests', delta: 'All Rooms Cleared' }
    ],
    sections: [
      { id: 'sec-kpis', title: 'Executive KPI Dashboard', description: 'Occupancy %, ADR, RevPAR, Average Length of Stay (ALOS), and Total Spend Per Guest.', enabled: true, isRequired: true, columns: ['Metric', 'Today', 'MTD Actual', 'Budget MTD', 'Variance %'] },
      { id: 'sec-vips', title: 'VIP & High Net Worth Guest Movements', description: 'Expected arrivals, special dietary preferences, and late checkout approvals.', enabled: true, columns: ['Guest Name', 'Room #', 'Loyalty Tier', 'Arrival Time', 'Special Protocol'] },
      { id: 'sec-room-inventory', title: 'Room Inventory & Out-of-Order (OOO) Status', description: 'Maintenance blocks, deep clean status, and rooms ready for early check-in.', enabled: true, columns: ['Room #', 'Category', 'Status', 'Technician Assigned', 'Target Clearance'] },
      { id: 'sec-guest-satisfaction', title: 'Guest Satisfaction & Net Promoter Score (NPS)', description: 'Real-time sentiment score from post-stay digital survey ingestion.', enabled: true, columns: ['Survey ID', 'Guest Name', 'NPS (1-10)', 'Sentiment', 'Staff Commended'] }
    ]
  },
  {
    id: 'tpl-3',
    code: 'REP-GST-TAX-FOLIO',
    title: 'Dual-Slab GST Tax Invoice & SAC Folio Statement',
    category: 'Statutory & Tax',
    description: 'Indian Goods & Services Tax (GST) compliant tax invoice template under SAC 996311 (Accommodation 12% vs 18%) and SAC 996331 (F&B / Banqueting 5% / 18%).',
    frequency: 'On-Demand',
    orientation: 'Portrait',
    authorRole: 'Admin / Tax Compliance Lead',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-17 18:20',
    headerTitle: 'TAX INVOICE / GUEST FOLIO STATEMENT',
    headerSubtitle: 'Rule 46 of CGST Rules, 2017 • Reverse Charge: No',
    includeHotelLogo: true,
    includeGstinSac: true,
    disclaimerText: 'Original for Recipient. This is a computer generated invoice requiring no physical signature if verified digitally via QR-code.',
    footerNote: 'Subject to local city jurisdiction. Thank you for choosing The Grand Azure Hotel.',
    signOffRoles: ['Billing Clerk', 'Guest Acknowledgment'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'SAC 996311 Taxable', value: '₹31,500', delta: 'Room Tariff' },
      { label: 'SAC 996331 Taxable', value: '₹4,850', delta: 'Restaurant / Minibar' },
      { label: 'CGST + SGST Split', value: '₹3,780 + ₹3,780', delta: 'Total GST: ₹7,560' },
      { label: 'Total Invoice Amount', value: '₹43,910', delta: 'Paid in Full' }
    ],
    sections: [
      { id: 'sec-hotel-tax-info', title: 'Hotel GSTIN & State SAC Header Block', description: 'Mandatory GSTIN, PAN, State Code, Invoice Serial Number, and Place of Supply.', enabled: true, isRequired: true },
      { id: 'sec-guest-tax-info', title: 'Guest Billing & Corporate GSTIN Profile', description: 'Guest name, company name, address, corporate GSTIN for B2B input tax credit.', enabled: true, isRequired: true },
      { id: 'sec-folio-itemization', title: 'SAC-Itemized Folio Transactions', description: 'Room nights, laundry, restaurant, and minibar categorized by individual SAC codes.', enabled: true, isRequired: true, columns: ['Date', 'SAC / HSN', 'Description', 'Rate', 'Qty', 'Taxable Val', 'GST %', 'Total (₹)'] },
      { id: 'sec-tax-slab-summary', title: 'Dual-Slab GST Tax Calculation Table', description: 'Breakup of 5%, 12%, and 18% taxes with exact CGST and SGST allocation.', enabled: true, isRequired: true, columns: ['SAC Code', 'Tax Rate', 'Taxable Amount', 'CGST Amount', 'SGST Amount', 'Total Tax'] },
      { id: 'sec-payment-settlement', title: 'Payment Method & Zero-Balance Settlement', description: 'Payment gateway auth codes, card last 4 digits, cash vouchers, and net balance due.', enabled: true, isRequired: true }
    ]
  },
  {
    id: 'tpl-4',
    code: 'REP-POLICE-FRRO',
    title: 'Foreign Guest C-Form Police / FRRO Verification',
    category: 'Front Office & KYC',
    description: 'Mandatory Bureau of Immigration & Local Police Foreigners Registration Office (FRRO) C-Form preformatted compliance document for all non-resident arrivals.',
    frequency: 'On-Demand',
    orientation: 'Portrait',
    authorRole: 'Admin / Security Head',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-17 14:15',
    headerTitle: 'FORM C - HOTEL ARRIVAL REPORT OF FOREIGNER',
    headerSubtitle: 'Rule 14 of Foreigners Order, 1948 • Bureau of Immigration Compliance',
    includeHotelLogo: true,
    includeGstinSac: false,
    disclaimerText: 'Statutory mandate: Must be submitted electronically to the Foreigners Regional Registration Officer within 24 hours of guest check-in.',
    footerNote: 'Strictly Confidential • Authorized for Local Police & Intelligence Bureau inspection only.',
    signOffRoles: ['Guest Signature', 'Front Desk KYC Verification Officer'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Foreign Arrivals Today', value: '4 Guests', delta: '100% Verified' },
      { label: 'Pending FRRO Uploads', value: '0 Pending', delta: 'Compliant' },
      { label: 'Passport OCR Match', value: '100%', delta: 'High Confidence' }
    ],
    sections: [
      { id: 'sec-guest-id', title: 'Passport & Identification Record', description: 'Passport Number, Issuing Country, Date of Expiry, Scanned ID Attachment Reference.', enabled: true, isRequired: true, columns: ['Field', 'Verified Value', 'Scanned Document Ref'] },
      { id: 'sec-visa-details', title: 'Visa / e-Visa & Entry Endorsement', description: 'Indian Visa number, Visa type (Tourist/Business/Employment), port of entry.', enabled: true, isRequired: true },
      { id: 'sec-travel-details', title: 'Arrival & Forward Itinerary', description: 'Previous address, next destination, purpose of visit, local contact phone.', enabled: true, isRequired: true },
      { id: 'sec-police-seal', title: 'Hotel Keeper Declaration & Official Seal', description: 'Official hotel keeper declaration certifying physical inspection of original travel document.', enabled: true, isRequired: true }
    ]
  },
  {
    id: 'tpl-5',
    code: 'REP-FRONTDESK-HANDOVER',
    title: 'Front Desk Shift Handover & Cash Float Reconciliation',
    category: 'Front Office & KYC',
    description: 'Morning, Evening, and Night shift handover document covering cash float balancing, pending arrivals, room moves, keycard inventory, and VIP requests.',
    frequency: 'Per Shift',
    orientation: 'Portrait',
    authorRole: 'Admin / Front Office Manager',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-18 09:00',
    headerTitle: 'FRONT DESK SHIFT LOG & HANDOVER REPORT',
    headerSubtitle: 'Front Office Operations • Shift Balancing & Keycard Audit',
    includeHotelLogo: true,
    includeGstinSac: false,
    disclaimerText: 'Incoming and Outgoing Shift Supervisors must jointly verify drop safe cash count, POS receipts, and outstanding VIP guest requests prior to relieving duties.',
    footerNote: 'Retained in Front Desk shift registry for 90 days.',
    signOffRoles: ['Outgoing Shift Officer', 'Incoming Shift Officer', 'Duty Manager'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Cash Float Count', value: '₹15,000 Verified', delta: 'Matched 100%' },
      { label: 'Active Shift Notes', value: '5 Logged', delta: '2 Handed Over' },
      { label: 'Keycards Issued', value: '38 Active', delta: '12 Available' }
    ],
    sections: [
      { id: 'sec-shift-info', title: 'Shift Timings & Duty Officers', description: 'Morning (07:00-15:00), Evening (15:00-23:00), or Night (23:00-07:00) roster.', enabled: true, isRequired: true },
      { id: 'sec-cash-float', title: 'Reception Cash Float & Safe Drop', description: 'Denomination count, petty cash vouchers, and terminal credit card batch closures.', enabled: true, isRequired: true, columns: ['Currency / Note', 'Count', 'Subtotal', 'Verified By'] },
      { id: 'sec-pending-checkins', title: 'Pending Check-Ins & Late Arrivals', description: 'Reservations with flight delays, credit pre-authorizations, and room assignments.', enabled: true, columns: ['Guest Name', 'Room #', 'ETA', 'Special Request', 'Follow-up Status'] },
      { id: 'sec-operational-notes', title: 'Shift Handover Notes & Special Instructions', description: 'Critical guest follow-ups, wake-up calls, airport transfers, and maintenance alerts.', enabled: true, isRequired: true }
    ]
  },
  {
    id: 'tpl-6',
    code: 'REP-HK-LINEN-INSPECT',
    title: 'Housekeeping Quality Audit, Linen & Room Inspection',
    category: 'Housekeeping & Operations',
    description: 'Comprehensive housekeeping inspection report tracking room cleanliness scores, deep clean schedules, linen exchange counts, and maintenance work orders.',
    frequency: 'Daily',
    orientation: 'Portrait',
    authorRole: 'Admin / Executive Housekeeper',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-17 11:00',
    headerTitle: 'DAILY HOUSEKEEPING & LINEN AUDIT REPORT',
    headerSubtitle: 'Facility Standards & Room Cleanliness Certification',
    includeHotelLogo: true,
    includeGstinSac: false,
    disclaimerText: 'Certified by Floor Supervisor. Any cleanliness score below 90% requires immediate re-cleaning before releasing room to Front Desk Available status.',
    footerNote: 'Housekeeping Department Standards • Quality Assurance Protocol',
    signOffRoles: ['Floor Supervisor', 'Executive Housekeeper'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Rooms Cleaned Today', value: '34 Units', delta: '100% Target Met' },
      { label: 'Avg Cleanliness Score', value: '98.4%', delta: '+1.2% this week' },
      { label: 'Maintenance Dispatched', value: '4 Tickets', delta: '2 Resolved' }
    ],
    sections: [
      { id: 'sec-room-clean-status', title: 'Room Cleanliness & Turnaround Audit', description: 'Clean, Dirty, In-Progress, and Inspected units across floors 1, 2, and 3.', enabled: true, isRequired: true, columns: ['Room #', 'Category', 'Housekeeper', 'Inspection Score', 'Status'] },
      { id: 'sec-linen-count', title: 'Daily Linen & Towel Par Count', description: 'Bed sheets, duvet covers, bath towels, and hand towels issued vs returned to laundry.', enabled: true, columns: ['Item Description', 'Opening Par', 'Issued', 'Laundry In', 'Damaged / Discarded'] },
      { id: 'sec-minibar-restock', title: 'Minibar & Guest Supplies Restocking', description: 'Beverages and snacks replenished across occupied rooms, billed to guest folios.', enabled: true, columns: ['Room #', 'Items Consumed', 'Restocked Date', 'Folio Charge (₹)'] },
      { id: 'sec-maintenance-escalations', title: 'Escalated Maintenance Work Orders', description: 'Plumbing, HVAC, electrical, and furniture repairs logged during room rounds.', enabled: true, columns: ['Ticket ID', 'Room #', 'Issue Summary', 'Priority', 'Assigned Tech'] }
    ]
  },
  {
    id: 'tpl-7',
    code: 'REP-KITCHEN-POS-SALES',
    title: 'Restaurant POS Sales, Room Service & Food Cost Analysis',
    category: 'Food & Beverage',
    description: 'F&B revenue reconciliation report detailing breakfast covers, room service orders posted to guest folios, kitchen inventory usage, and wastage.',
    frequency: 'Daily',
    orientation: 'Portrait',
    authorRole: 'Admin / Executive Chef',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-17 22:30',
    headerTitle: 'DAILY F&B POS SALES & KITCHEN PRODUCTION REPORT',
    headerSubtitle: 'Azure Fine Dining & 24/7 Room Service Operations',
    includeHotelLogo: true,
    includeGstinSac: true,
    disclaimerText: 'Daily food consumption and beverage sales audited against kitchen inventory requisitions. GST reported under SAC 996331 (5% non-alcohol / 18% alcohol).',
    footerNote: 'Executive Chef & F&B Controller Daily Audit Sheet.',
    signOffRoles: ['Restaurant Manager', 'Executive Chef', 'F&B Cost Controller'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Total F&B Sales', value: '₹1,48,200', delta: '+14% vs Forecast' },
      { label: 'Room Service Folio Billed', value: '₹58,400', delta: '39 Orders' },
      { label: 'Food Cost Percentage', value: '28.4%', delta: 'Optimal Range (<30%)' }
    ],
    sections: [
      { id: 'sec-outlet-breakdown', title: 'Outlet Revenue Breakdown', description: 'Main Dining Room, Azure Lounge Bar, Poolside Bistro, and 24/7 In-Room Dining.', enabled: true, isRequired: true, columns: ['Outlet', 'Covers Served', 'Avg Check / Cover', 'Food Sales', 'Beverage Sales', 'Total (₹)'] },
      { id: 'sec-room-service-orders', title: 'In-Room Dining Charges Posted to Guest Folios', description: 'Orders routed directly to guest room invoices with guest digital signature verification.', enabled: true, columns: ['Order #', 'Room #', 'Guest Name', 'Items Ordered', 'Taxable Val', 'Billed Folio'] },
      { id: 'sec-kitchen-wastage', title: 'Kitchen Inventory Depletion & Spoilage Log', description: 'Perishables, fresh seafood, dairy, and meat wastage recorded by sous chef.', enabled: true, columns: ['Item Name', 'Category', 'Quantity', 'Unit Cost', 'Reason / Disposal'] }
    ]
  },
  {
    id: 'tpl-8',
    code: 'REP-CORP-LEDGER',
    title: 'Monthly Corporate Ledger & OTA Commission Statement',
    category: 'Night Audit & Finance',
    description: 'B2B accounts receivable statement showing corporate credit balances, 30/60/90 day aging, and OTA distribution commissions (Booking.com, Expedia, Agoda).',
    frequency: 'Monthly',
    orientation: 'Landscape',
    authorRole: 'Admin / Finance Director',
    lastModifiedBy: 'Admin (System)',
    lastModifiedAt: '2026-09-16 16:00',
    headerTitle: 'CORPORATE ACCOUNTS & OTA COMMISSION LEDGER',
    headerSubtitle: 'Accounts Receivable Aging & Online Travel Agency Commission Statement',
    includeHotelLogo: true,
    includeGstinSac: true,
    disclaimerText: 'Subject to contractual payment terms (Net 30 days). Interest at 18% per annum applicable on balances overdue beyond 60 days.',
    footerNote: 'Financial Services Department • Monthly Reconciled Statement',
    signOffRoles: ['Credit Manager', 'Chief Financial Officer'],
    isActive: true,
    sampleSummaryMetrics: [
      { label: 'Total Receivables', value: '₹18,45,000', delta: '24 Corporate Accounts' },
      { label: 'Current (< 30 Days)', value: '₹14,20,000', delta: '77% on time' },
      { label: 'OTA Commission Total', value: '₹2,64,000', delta: 'Avg 15.2%' }
    ],
    sections: [
      { id: 'sec-corp-aging', title: 'Corporate Client Accounts Receivable Aging', description: 'Itemized client balances split into Current, 30 Days, 60 Days, and 90+ Days.', enabled: true, isRequired: true, columns: ['Corporate Client', 'Contract ID', 'Current', '31-60 Days', '61-90 Days', 'Total Due (₹)'] },
      { id: 'sec-ota-commissions', title: 'OTA Channel Manager Commission Accruals', description: 'Booking.com, Expedia, Airbnb, and Agoda channel commissions and net payout reconciliation.', enabled: true, isRequired: true, columns: ['OTA Channel', 'Gross Bookings', 'Room Nights', 'Commission Rate', 'Commission Payable (₹)'] },
      { id: 'sec-payment-instructions', title: 'Bank Settlement & RTGS / NEFT Wire Instructions', description: 'Official hotel bank account, IFSC code, SWIFT BIC, and corporate billing contact.', enabled: true }
    ]
  }
];

export const loadReportTemplates = (): ReportTemplate[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_REPORT_TEMPLATES);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading report templates:', e);
  }
  return DEFAULT_PREFORMATTED_TEMPLATES;
};

export const saveReportTemplates = (templates: ReportTemplate[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_REPORT_TEMPLATES, JSON.stringify(templates));
    window.dispatchEvent(new CustomEvent('hms_report_templates_updated', { detail: templates }));
  } catch (e) {
    console.error('Error saving report templates:', e);
  }
};

export const resetReportTemplatesToDefaults = (): ReportTemplate[] => {
  try {
    localStorage.setItem(STORAGE_KEY_REPORT_TEMPLATES, JSON.stringify(DEFAULT_PREFORMATTED_TEMPLATES));
    window.dispatchEvent(new CustomEvent('hms_report_templates_updated', { detail: DEFAULT_PREFORMATTED_TEMPLATES }));
  } catch (e) {}
  return DEFAULT_PREFORMATTED_TEMPLATES;
};
