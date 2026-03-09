import { Zap, Globe, Smartphone, ArrowLeftRight, AlertTriangle, Scale } from "lucide-react";
import { RiskLevel } from "@/types/account";

// ── Violation type configuration (single source of truth) ──

export interface ViolationTypeConfig {
  icon: React.ReactNode;
  iconSmall: React.ReactNode;
  shortLabel: string;
}

export const VIOLATION_TYPE_CONFIG: Record<string, ViolationTypeConfig> = {
  "Copy Trading": {
    icon: <Zap className="h-4 w-4" />,
    iconSmall: <Zap className="h-3 w-3" />,
    shortLabel: "Copy",
  },
  "Reverse Hedging": {
    icon: <ArrowLeftRight className="h-4 w-4" />,
    iconSmall: <ArrowLeftRight className="h-3 w-3" />,
    shortLabel: "Hedge",
  },
  "Shared IP Address": {
    icon: <Globe className="h-4 w-4" />,
    iconSmall: <Globe className="h-3 w-3" />,
    shortLabel: "IP",
  },
  "Device Anomaly": {
    icon: <Smartphone className="h-4 w-4" />,
    iconSmall: <Smartphone className="h-3 w-3" />,
    shortLabel: "Device",
  },
  "Device Sharing": {
    icon: <Smartphone className="h-4 w-4" />,
    iconSmall: <Smartphone className="h-3 w-3" />,
    shortLabel: "Device",
  },
};

export function getViolationIcon(rule: string, size: "sm" | "md" = "md"): React.ReactNode {
  const config = VIOLATION_TYPE_CONFIG[rule];
  if (!config) return size === "sm" ? <AlertTriangle className="h-3 w-3" /> : <AlertTriangle className="h-4 w-4" />;
  return size === "sm" ? config.iconSmall : config.icon;
}

export function getViolationShortLabel(rule: string): string {
  return VIOLATION_TYPE_CONFIG[rule]?.shortLabel || rule.split(" ")[0];
}

// ── Severity styling ──

export const SEVERITY_BADGE_CLASSES: Record<string, string> = {
  CRITICAL: "bg-destructive/20 text-destructive border-destructive/30",
  HIGH: "bg-destructive/20 text-destructive border-destructive/30",
  MEDIUM: "bg-warning/20 text-warning border-warning/30",
  LOW: "bg-muted text-muted-foreground",
};

export const SEVERITY_PILL_CLASSES: Record<string, string> = {
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export const SEVERITY_BORDER_LEFT: Record<string, string> = {
  CRITICAL: "border-l-red-500",
  HIGH: "border-l-orange-500",
  MEDIUM: "border-l-yellow-500",
  LOW: "border-l-emerald-500",
};

export const STATUS_BADGE_CLASSES: Record<string, string> = {
  OPEN: "bg-destructive/20 text-destructive border-destructive/30",
  NOTIFIED: "bg-warning/20 text-warning border-warning/30",
  RESOLVED: "bg-success/20 text-success border-success/30",
};

// ── Risk level styling ──

export const RISK_BADGE_STYLES: Record<RiskLevel, string> = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-orange-600 text-white",
  MEDIUM: "bg-yellow-600 text-black",
  LOW: "bg-emerald-600 text-white",
};

export const RISK_BORDER_STYLES: Record<RiskLevel, { border: string; glow: string }> = {
  CRITICAL: { border: "border-red-500", glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
  HIGH: { border: "border-orange-500", glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]" },
  MEDIUM: { border: "border-yellow-500", glow: "shadow-[0_0_15px_rgba(234,179,8,0.1)]" },
  LOW: { border: "border-emerald-500", glow: "" },
};
