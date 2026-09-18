/**
 * ============================================================================
 * HOTEL MANAGEMENT SYSTEM (HMS) - CENTRAL DOMAIN DATA STORE
 * Supports In-Memory State, UAT Reseeding & PostgreSQL RLS Integration
 * ============================================================================
 */

import {
  initialRooms,
  initialReservations,
  initialFolios,
  initialPricingConfig,
  initialHousekeepingTasks,
  initialInventoryItems,
  initialPosOrders,
  initialLaundryBatches,
  initialStaffMembers,
  initialAttendanceRecords,
  initialLeaveRequests,
  initialFeedback,
  initialLoyaltyMembers,
  initialChannelSyncLogs,
  initialAuditLogs,
  initialMaintenanceWorkOrders,
  initialMenuItems,
  initialHotelProperty
} from './mockData.js';
import {
  Reservation,
  Room,
  HousekeepingTask,
  PosOrder,
  Folio,
  FolioItem,
  LaundryBatch,
  CustomerFeedback,
  MaintenanceWorkOrder,
  InventoryItem,
  StaffMember,
  AttendanceRecord,
  LeaveRequest,
  LoyaltyProfile,
  ChannelSyncLog,
  AuditTrail,
  DynamicPricingConfig,
  MenuItem,
  HotelProperty
} from '../types/index.js';

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  password?: string;
  passwordHash?: string;
  role: string;
  department: string;
  allowedTabs: string[];
  landingTab: string;
  createdAt: string;
}

export function getRolePermissions(role: string): { allowedTabs: string[]; landingTab: string; department: string } {
  switch (role) {
    case 'Reception':
      return {
        allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'],
        landingTab: 'reservation',
        department: 'Front Office'
      };
    case 'Housekeeping':
      return {
        allowedTabs: ['housekeeping'],
        landingTab: 'housekeeping',
        department: 'Housekeeping'
      };
    case 'Kitchen':
      return {
        allowedTabs: ['concierge', 'inventory'],
        landingTab: 'concierge',
        department: 'Food & Beverage'
      };
    case 'Admin':
    default:
      return {
        allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'admin', 'audit'],
        landingTab: 'dashboard',
        department: 'Administration'
      };
  }
}

export const initialSystemUsers: SystemUser[] = [
  {
    id: 'usr-1',
    name: 'Jaylon Dorwart',
    username: 'admin',
    password: 'admin123',
    role: 'Admin',
    department: 'Administration',
    allowedTabs: ['dashboard', 'reservation', 'rooms', 'messages', 'housekeeping', 'inventory', 'calendar', 'financials', 'reviews', 'concierge', 'staff', 'users', 'admin', 'audit'],
    landingTab: 'dashboard',
    createdAt: '2026-09-01'
  },
  {
    id: 'usr-2',
    name: 'Kavita Nair',
    username: 'reception',
    password: 'rec123',
    role: 'Reception',
    department: 'Front Office',
    allowedTabs: ['reservation', 'rooms', 'calendar', 'financials'],
    landingTab: 'reservation',
    createdAt: '2026-09-05'
  },
  {
    id: 'usr-3',
    name: 'Priya Sharma',
    username: 'cleaner',
    password: 'clean123',
    role: 'Housekeeping',
    department: 'Housekeeping',
    allowedTabs: ['housekeeping'],
    landingTab: 'housekeeping',
    createdAt: '2026-09-08'
  },
  {
    id: 'usr-4',
    name: 'Antonio Rossi',
    username: 'chef',
    password: 'chef123',
    role: 'Kitchen',
    department: 'Food & Beverage',
    allowedTabs: ['concierge', 'inventory'],
    landingTab: 'concierge',
    createdAt: '2026-09-10'
  }
];

class DomainDataStore {
  private static instance: DomainDataStore;

  public rooms: Room[] = [];
  public reservations: Reservation[] = [];
  public folios: Folio[] = [];
  public housekeepingTasks: HousekeepingTask[] = [];
  public inventoryItems: InventoryItem[] = [];
  public posOrders: PosOrder[] = [];
  public laundryBatches: LaundryBatch[] = [];
  public staffMembers: StaffMember[] = [];
  public attendanceRecords: AttendanceRecord[] = [];
  public leaveRequests: LeaveRequest[] = [];
  public feedbackList: CustomerFeedback[] = [];
  public loyaltyMembers: LoyaltyProfile[] = [];
  public auditLogs: AuditTrail[] = [];
  public maintenanceWorkOrders: MaintenanceWorkOrder[] = [];
  public channelSyncLogs: ChannelSyncLog[] = [];
  public pricingConfig: DynamicPricingConfig = { ...initialPricingConfig };
  public systemUsers: SystemUser[] = [];
  public menuItems: MenuItem[] = [];
  public hotelProperty: HotelProperty = { ...initialHotelProperty };
  public fieldValidations: any = null;

  private constructor() {
    this.reseed();
  }

  public static getInstance(): DomainDataStore {
    if (!DomainDataStore.instance) {
      DomainDataStore.instance = new DomainDataStore();
    }
    return DomainDataStore.instance;
  }

  public reseed(): void {
    this.rooms = JSON.parse(JSON.stringify(initialRooms));
    this.reservations = JSON.parse(JSON.stringify(initialReservations));
    this.folios = JSON.parse(JSON.stringify(initialFolios));
    this.housekeepingTasks = JSON.parse(JSON.stringify(initialHousekeepingTasks));
    this.inventoryItems = JSON.parse(JSON.stringify(initialInventoryItems));
    this.posOrders = JSON.parse(JSON.stringify(initialPosOrders));
    this.laundryBatches = JSON.parse(JSON.stringify(initialLaundryBatches));
    this.staffMembers = JSON.parse(JSON.stringify(initialStaffMembers));
    this.attendanceRecords = JSON.parse(JSON.stringify(initialAttendanceRecords));
    this.leaveRequests = JSON.parse(JSON.stringify(initialLeaveRequests));
    this.feedbackList = JSON.parse(JSON.stringify(initialFeedback));
    this.loyaltyMembers = JSON.parse(JSON.stringify(initialLoyaltyMembers));
    this.auditLogs = JSON.parse(JSON.stringify(initialAuditLogs));
    this.maintenanceWorkOrders = JSON.parse(JSON.stringify(initialMaintenanceWorkOrders));
    this.channelSyncLogs = JSON.parse(JSON.stringify(initialChannelSyncLogs));
    this.pricingConfig = { ...initialPricingConfig };
    this.systemUsers = JSON.parse(JSON.stringify(initialSystemUsers));
    this.menuItems = JSON.parse(JSON.stringify(initialMenuItems));
    this.hotelProperty = JSON.parse(JSON.stringify(initialHotelProperty));

    this.logAudit('System Administrator', 'Admin', 'DATABASE_RESEEDED', 'Sample data successfully reseeded for UAT enterprise validation.');
  }

  public logAudit(actor: string, role: string, action: string, details: string): void {
    const newLog: AuditTrail = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      actor,
      role,
      action,
      details,
      ipAddress: '127.0.0.1'
    };
    this.auditLogs.unshift(newLog);
    if (this.auditLogs.length > 500) {
      this.auditLogs = this.auditLogs.slice(0, 500);
    }
  }
}

export const store = DomainDataStore.getInstance();
