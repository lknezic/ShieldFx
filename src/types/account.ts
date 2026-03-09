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

export interface Account {
  id: string;
  externalId: string;
  email: string;
  name: string;
  accountType: "LIVE" | "DEMO";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  folder: "suspicious" | "new" | "later" | "uncategorized" | "pay_later";
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
  trades: Trade[];
  copyDetection: {
    suspiciousTrades: number;
    totalTrades: number;
    copyInstances: number;
    totalPnl: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    matches: CopyMatch[];
  };
  reverseHedging: {
    detected: boolean;
  };
  ipAddresses: IPAddress[];
  devices: Device[];
  connectedAccounts: { id: string; email: string; type: string; status: string; date: string }[];
  detectionRules: string;
  violations: Violation[];
}

export interface Violation {
  id: string;
  rule: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detectedDate: string;
  status: "OPEN" | "NOTIFIED" | "RESOLVED";
}

export type FolderType = "all" | "suspicious" | "new" | "later" | "uncategorized" | "pay_later";
