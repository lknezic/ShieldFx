import { useState } from "react";
import { Account, Violation } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChevronDown, Zap, Globe, Smartphone, ArrowLeftRight, AlertTriangle, TrendingUp, Users, Info } from "lucide-react";

interface OverviewTabProps {
  account: Account;
}

const VIOLATION_ICONS: Record<string, React.ReactNode> = {
  "Copy Trading": <Zap className="h-4 w-4" />,
  "Reverse Hedging": <ArrowLeftRight className="h-4 w-4" />,
  "Shared IP Address": <Globe className="h-4 w-4" />,
  "Device Anomaly": <Smartphone className="h-4 w-4" />,
  "Device Sharing": <Smartphone className="h-4 w-4" />,
};

const SEVERITY_BORDER: Record<string, string> = {
  CRITICAL: "border-l-red-500",
  HIGH: "border-l-orange-500",
  MEDIUM: "border-l-yellow-500",
  LOW: "border-l-emerald-500",
};

function EvidenceCard({ violation, account }: { violation: Violation; account: Account }) {
  const [expanded, setExpanded] = useState(violation.severity === "HIGH" || violation.severity === "CRITICAL");

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden border-l-4", SEVERITY_BORDER[violation.severity])}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-muted-foreground">
            {VIOLATION_ICONS[violation.rule] || <AlertTriangle className="h-4 w-4" />}
          </span>
          <div>
            <span className="text-sm font-semibold text-foreground">{violation.rule}</span>
            <p className="text-xs text-muted-foreground mt-0.5">{violation.description.substring(0, 80)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge className={cn(
            "text-[10px]",
            violation.severity === "CRITICAL" || violation.severity === "HIGH"
              ? "bg-destructive/20 text-destructive border-destructive/30"
              : violation.severity === "MEDIUM"
              ? "bg-warning/20 text-warning border-warning/30"
              : "bg-muted text-muted-foreground"
          )}>
            {violation.severity}
          </Badge>
          <Badge className={cn(
            "text-[10px]",
            violation.status === "OPEN"
              ? "bg-destructive/20 text-destructive border-destructive/30"
              : violation.status === "NOTIFIED"
              ? "bg-warning/20 text-warning border-warning/30"
              : "bg-success/20 text-success border-success/30"
          )}>
            {violation.status}
          </Badge>
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <p className="text-xs text-muted-foreground mb-3">{violation.description}</p>

          {/* Copy Trading specific evidence */}
          {violation.rule === "Copy Trading" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-secondary/50 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Suspicious / Total</p>
                  <p className="text-lg font-bold text-warning font-mono">{account.copyDetection.suspiciousTrades} / {account.copyDetection.totalTrades}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Copy Instances</p>
                  <p className="text-lg font-bold text-foreground font-mono">{account.copyDetection.copyInstances}</p>
                </div>
                <div className="rounded-md bg-secondary/50 p-2.5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">P&L from Copies</p>
                  <p className="text-lg font-bold text-success font-mono">+${account.copyDetection.totalPnl.toFixed(2)}</p>
                </div>
              </div>

              {account.copyDetection.matches.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Matched Accounts</p>
                  {account.copyDetection.matches.map((m, i) => (
                    <div key={m.id} className="flex items-center justify-between p-2.5 rounded-md bg-secondary/30 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                        <span className="text-xs text-foreground">{m.email}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{m.matchCount} match{m.matchCount > 1 ? "es" : ""} · {m.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show copied trades */}
              {account.trades.filter(t => t.isCopied).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Copied Trades</p>
                  {account.trades.filter(t => t.isCopied).map((t) => (
                    <div key={t.id} className={cn("p-2.5 rounded-md mb-1.5 border-l-2", t.pnl >= 0 ? "border-l-success bg-secondary/30" : "border-l-destructive bg-secondary/30")}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-[10px] px-1.5", t.type === "BUY" ? "bg-success/20 text-success border-success/30" : "bg-destructive/20 text-destructive border-destructive/30")}>
                            {t.type}
                          </Badge>
                          <span className="text-xs font-semibold text-foreground">{t.symbol}</span>
                          <span className="text-[10px] text-muted-foreground">{t.lots} lots</span>
                          <Badge className="bg-warning/20 text-warning border-warning/30 text-[9px]">⚠ COPIED</Badge>
                        </div>
                        <span className={cn("text-xs font-bold font-mono", t.pnl >= 0 ? "text-success" : "text-destructive")}>
                          {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[10px] text-muted-foreground">
                        <span>Open: {t.openPrice.toFixed(5)} → Close: {t.closePrice.toFixed(5)}</span>
                        <span>Duration: {t.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* IP Sharing specific evidence */}
          {(violation.rule === "Shared IP Address") && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-secondary/50 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Shared IPs</p>
                <p className="text-lg font-bold text-warning font-mono">
                  {account.ipAddresses.filter(ip => ip.status === "SHARED").length} / {account.ipAddresses.length}
                </p>
              </div>
              <div className="rounded-md bg-secondary/50 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Max Shared With</p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {Math.max(...account.ipAddresses.map(ip => ip.sharedCount))} accounts
                </p>
              </div>
            </div>
          )}

          {/* Device specific evidence */}
          {(violation.rule === "Device Anomaly" || violation.rule === "Device Sharing") && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-md bg-secondary/50 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Devices</p>
                <p className="text-lg font-bold text-foreground font-mono">{account.devices.length}</p>
              </div>
              <div className="rounded-md bg-secondary/50 p-2.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Shared Devices</p>
                <p className="text-lg font-bold text-warning font-mono">
                  {account.devices.filter(d => d.sharedAccounts && d.sharedAccounts > 0).length}
                </p>
              </div>
            </div>
          )}

          {/* Reverse Hedging evidence */}
          {violation.rule === "Reverse Hedging" && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
              <p className="text-xs text-destructive font-medium">
                Opposing positions detected within configurable time windows. This is a strong indicator of coordinated hedging across accounts.
              </p>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground mt-3">Detected: {violation.detectedDate}</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-lg font-bold font-mono", color || "text-foreground")}>{value}</p>
    </div>
  );
}

function CollapsibleSection({ title, icon, badge, defaultOpen = false, children }: {
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/30 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {badge && <span className="text-xs text-muted-foreground">{badge}</span>}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="p-4 border-t border-border">{children}</div>}
    </div>
  );
}

export function OverviewTab({ account }: OverviewTabProps) {
  const hasViolations = account.violations.length > 0;

  return (
    <div className="space-y-4">
      {/* SECTION 1: Evidence (only if violations exist) */}
      {hasViolations && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Evidence · {account.violations.length} violation{account.violations.length > 1 ? "s" : ""} detected
            </h3>
          </div>
          <div className="space-y-2">
            {account.violations
              .sort((a, b) => {
                const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                return order[a.severity] - order[b.severity];
              })
              .map((v) => (
                <EvidenceCard key={v.id} violation={v} account={account} />
              ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Trading Performance */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trading Performance</h3>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <StatCard label="Total P&L" value={`+$${account.totalPnl.toLocaleString()}`} color="text-success" />
          <StatCard label="Win Rate" value={`${account.winRate}%`} color={account.winRate > 90 ? "text-warning" : "text-foreground"} />
          <StatCard label="Winners" value={`${account.winningTrades} / ${account.totalTrades}`} color="text-success" />
          <StatCard label="Losers" value={`${account.losingTrades} / ${account.totalTrades}`} color="text-destructive" />
        </div>
      </div>

      {/* SECTION 3: Account Metadata (collapsed by default) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Account Details</h3>
        </div>
        <div className="space-y-2">
          <CollapsibleSection title="Balance & Equity">
            <div className="grid grid-cols-5 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Balance</p>
                <p className="text-sm font-semibold text-foreground font-mono">${account.balance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Equity</p>
                <p className="text-sm font-semibold text-foreground font-mono">${account.equity.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">P&L</p>
                <p className="text-sm font-semibold text-success font-mono">+${account.pnl.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Margin</p>
                <p className="text-sm font-semibold text-foreground font-mono">${account.margin.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Credit</p>
                <p className="text-sm font-semibold text-foreground font-mono">${account.credit.toFixed(2)}</p>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Connected Accounts" badge={`${account.connectedAccounts.length}`}>
            {account.connectedAccounts.length === 0 ? (
              <p className="text-xs text-muted-foreground">No connected accounts found.</p>
            ) : (
              <div className="space-y-1.5">
                {account.connectedAccounts.map((ca) => (
                  <div key={ca.id} className="flex items-center justify-between p-2.5 rounded-md bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground font-mono">{ca.id}</span>
                      <span className="text-xs text-muted-foreground">{ca.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/20 text-success border-success/30 text-[10px]">{ca.status}</Badge>
                      <span className="text-[10px] text-muted-foreground">{ca.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Trader Information" icon={<Users className="h-4 w-4 text-muted-foreground" />}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Name</p>
                <p className="text-sm text-foreground">{account.name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                <p className="text-sm text-foreground">{account.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">External ID</p>
                <p className="text-sm text-foreground font-mono">{account.externalId}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Created</p>
                <p className="text-sm text-foreground">{account.createdDate}</p>
              </div>
            </div>
            {account.tags.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tags</p>
                <div className="flex gap-1">{account.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
              </div>
            )}
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
