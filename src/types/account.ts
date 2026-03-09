// ── Risk & Severity ──

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ActionType = "WARNING" | "SUSPENSION" | "REVIEW" | "CLEARED" | "NOTE" | "FOLDER_MOVE" | "RETRIGGER" | "TAG_SNOOZED" | "TAG_UNSNOOZED" | "AUTO_SUSPEND";

// ── Detection Tags (Layer 1: automatic, multi-assign) ──

export interface DetectionTag {

  id: string;

  rule: string;

  severity: RiskLevel;

  detectedDate: string;

  lastSeenDate: string;

  autoAssigned: boolean;

  snoozed: boolean;

  snoozedBy?: string;

  snoozedUntil?: string;

}

// ── Workflow Folders (Layer 2: single-assign) ──

export type SystemFolderId = "new" | "suspicious" | "warned" | "suspended" | "cleared";

export interface WorkflowFolder {

  id: string;

  name: string;

  icon: string;

  color: string;

  position: number;

  isSystem: boolean;

}

export const SYSTEM_FOLDERS: WorkflowFolder[] = [

  { id: "new", name: "New", icon: "📥", color: "#64748b", position: 0, isSystem: true },

  { id: "suspicious", name: "Suspicious", icon: "⚠️", color: "#ef4444", position: 1, isSystem: true },

  { id: "warned", name: "Warned", icon: "⚡", color: "#f59e0b", position: 2, isSystem: true },

  { id: "suspended", name: "Suspended", icon: "⛔", color: "#dc2626", position: 3, isSystem: true },

  { id: "cleared", name: "Cleared", icon: "✅", color: "#22c55e", position: 4, isSystem: true },

];

// ── Warning History ──

export interface WarningEntry {

  id: string;

  warningNumber: number;

  sentDate: string;

  sentBy: string;

  violationIds: string[];

  tagsAtWarningTime: { rule: string; severity: RiskLevel }[];

  equityAtWarningTime: number;

  profitAtWarningTime: number;

  generatedEmailBody: string;

  sentEmailBody: string;

  wasEdited: boolean;

  emailSubject: string;

  emailRecipient: string;

}

// ── Trades ──

export interface Trade {

  id: string;

  type: "BUY" | "SELL";

  symbol: string;

  lots: number;

  openPrice: number;

  closePrice: number;

  openDate: string;

  closeDate: string;

  pnl: number;

  pips: number;

  duration: string;

  isCopied?: boolean;

  isSuspicious?: boolean;

}

// ── Copy Detection ──

export interface CopyMatch {

  id: string;

  accountId: string;

  email: string;

  matchCount: number;

  percentage: number;

}

// ── Network Fingerprint ──

export interface IPAddress {

  ip: string;

  location: string;

  startDate: string;

  endDate: string;

  activities: number;

  sharedCount: number;

  status: "CLEAN" | "SHARED";

}

export interface Device {

  id: string;

  type: "DESKTOP" | "MOBILE";

  label: string;

  os: string;

  startDate: string;

  endDate: string;

  activities: number;

  sharedAccounts?: number;

}

// ── Violations (evidence records) ──

export interface Violation {

  id: string;

  rule: string;

  description: string;

  severity: RiskLevel;

  detectedDate: string;

  status: "OPEN" | "NOTIFIED" | "RESOLVED";

}

// ── Audit Trail ──

export interface AuditEntry {

  id: string;

  timestamp: string;

  actionType: ActionType;

  performedBy: string;

  violationId?: string;

  violationRule?: string;

  details: string;

  emailSent?: boolean;

  emailRecipient?: string;

  fromFolder?: string;

  toFolder?: string;

}

// ── Account (main entity) ──

export interface Account {

  id: string;

  externalId: string;

  email: string;

  name: string;

  accountType: "LIVE" | "DEMO";

  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";

  folderId: string;

  createdDate: string;

  platform: string;

  userTags: string[];

  balance: number;

  equity: number;

  pnl: number;

  margin: number;

  credit: number;

  totalPnl: number;

  winRate: number;

  winningTrades: number;

  losingTrades: number;

  totalTrades: number;

  riskLevel: RiskLevel;

  // Detection tags (Layer 1)

  detectionTags: DetectionTag[];

  // Warning state

  warningCount: number;

  lastWarningDate?: string;

  warningHistory: WarningEntry[];

  // Trading data

  trades: Trade[];

  copyDetection: {

    suspiciousTrades: number;

    totalTrades: number;

    copyInstances: number;

    totalPnl: number;

    riskLevel: RiskLevel;

    matches: CopyMatch[];

  };

  reverseHedging: { detected: boolean };

  // Fingerprint

  ipAddresses: IPAddress[];

  devices: Device[];

  // Connections

  connectedAccounts: {

    id: string;

    email: string;

    type: string;

    status: string;

    date: string;

    warningCount?: number;

    suspended?: boolean;

    suspendedDate?: string;

    suspendedReason?: string;

  }[];

  // Evidence & history

  violations: Violation[];

  auditTrail: AuditEntry[];

  // Assignment

  assignedTo?: string;

}