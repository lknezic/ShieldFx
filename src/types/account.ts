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

export interface CopyMatch {
  id: string;
  accountId: string;
  email: string;
  matchCount: number;
  percentage: number;
}

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

export interface Violation {
  id: string;
  rule: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detectedDate: string;
  status: "OPEN" | "NOTIFIED" | "RESOLVED";
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ActionType = "WARNING" | "SUSPENSION" | "REVIEW" | "CLEARED" | "NOTE";

export interface WarningHistoryEntry {
  warningNumber: number;
  sentDate: string;
  tagsAtWarningTime: { rule: string }[];
}

export interface ConnectedAccount {
  id: string;
  email: string;
  type: string;
  status: string;
  date: string;
  warningCount?: number;
  suspended?: boolean;
  suspendedDate?: string;
  suspendedReason?: string;
}

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
}

export interface Account {
  id: string;
  externalId: string;
  email: string;
  name: string;
  accountType: "LIVE" | "DEMO";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  folder: FolderType;
  createdDate: string;
  platform: string;
  tags: string[];
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
  trades: Trade[];
  copyDetection: {
    suspiciousTrades: number;
    totalTrades: number;
    copyInstances: number;
    totalPnl: number;
    riskLevel: RiskLevel;
    matches: CopyMatch[];
  };
  reverseHedging: {
    detected: boolean;
  };
  ipAddresses: IPAddress[];
  devices: Device[];
  connectedAccounts: ConnectedAccount[];
  detectionRules: string;
  violations: Violation[];
  auditTrail: AuditEntry[];
  warningCount: number;
  warningHistory: WarningHistoryEntry[];
}

export type FolderType = "all" | "suspicious" | "new" | "later" | "uncategorized" | "pay_later";
