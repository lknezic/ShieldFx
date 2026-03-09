import { Account, RiskLevel } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, Ban, Zap, Globe, Smartphone, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerdictBannerProps {
  account: Account;
  onWarning: () => void;
  onSuspend: () => void;
}

const RISK_STYLES: Record<RiskLevel, { bg: string; border: string; text: string; glow: string }> = {
  CRITICAL: { bg: "bg-red-600", border: "border-red-500", text: "text-red-400", glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
  HIGH: { bg: "bg-orange-600", border: "border-orange-500", text: "text-orange-400", glow: "shadow-[0_0_20px_rgba(249,115,22,0.15)]" },
  MEDIUM: { bg: "bg-yellow-600", border: "border-yellow-500", text: "text-yellow-400", glow: "shadow-[0_0_15px_rgba(234,179,8,0.1)]" },
  LOW: { bg: "bg-emerald-600", border: "border-emerald-500", text: "text-emerald-400", glow: "" },
};

const VIOLATION_ICONS: Record<string, React.ReactNode> = {
  "Copy Trading": <Zap className="h-3 w-3" />,
  "Reverse Hedging": <ArrowLeftRight className="h-3 w-3" />,
  "Shared IP Address": <Globe className="h-3 w-3" />,
  "Device Anomaly": <Smartphone className="h-3 w-3" />,
  "Device Sharing": <Smartphone className="h-3 w-3" />,
};

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500/10 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export function VerdictBanner({ account, onWarning, onSuspend }: VerdictBannerProps) {
  const risk = RISK_STYLES[account.riskLevel];
  const openViolations = account.violations.filter((v) => v.status === "OPEN").length;
  const hasViolations = account.violations.length > 0;

  return (
    <div className={cn(
      "rounded-lg border-l-4 p-4",
      risk.border,
      risk.glow,
      "bg-card border border-border"
    )}>
      <div className="flex items-start justify-between gap-4">
        {/* Left: account info + violations */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-lg font-bold text-foreground font-mono">{account.externalId}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              {account.accountType === "LIVE" ? "Live" : "Demo"} · {account.platform}
            </Badge>
            <Badge className={cn(
              "text-[10px] px-1.5 py-0",
              account.status === "ACTIVE"
                ? "bg-success/20 text-success border-success/30"
                : account.status === "SUSPENDED"
                ? "bg-destructive/20 text-destructive border-destructive/30"
                : "bg-muted text-muted-foreground"
            )}>
              {account.status}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground mb-3">
            {account.name} · {account.email} · Created {account.createdDate}
          </p>

          {/* Violation pills */}
          {hasViolations ? (
            <div className="flex flex-wrap gap-1.5">
              {account.violations.map((v) => (
                <span
                  key={v.id}
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                    SEVERITY_COLORS[v.severity]
                  )}
                >
                  {VIOLATION_ICONS[v.rule] || <AlertTriangle className="h-3 w-3" />}
                  {v.rule}
                  {v.status === "NOTIFIED" && (
                    <span className="text-[9px] opacity-70 ml-0.5">· Notified</span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-success">
              <ShieldAlert className="h-3.5 w-3.5" />
              No violations detected
            </div>
          )}
        </div>

        {/* Right: risk level + actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Badge className={cn("text-xs font-bold px-3 py-1 tracking-wide", risk.bg, "text-white border-0")}>
            {account.riskLevel} RISK
          </Badge>

          {hasViolations && (
            <>
              <span className="text-[10px] text-muted-foreground">
                {openViolations} open violation{openViolations !== 1 ? "s" : ""}
              </span>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onWarning}
                  className="h-8 text-xs gap-1 border-warning/50 text-warning hover:bg-warning/10 hover:text-warning"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Warning
                </Button>
                <Button
                  size="sm"
                  onClick={onSuspend}
                  className="h-8 text-xs gap-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Ban className="h-3 w-3" />
                  Suspend
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
