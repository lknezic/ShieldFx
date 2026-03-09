import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Plus, Trash2, Zap, ArrowLeftRight, Globe, Smartphone, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface RuleCondition {
  parameter: string;
  operator: string;
  value: string;
}

interface RuleSet {
  id: string;
  name: string;
  conditions: RuleCondition[];
  severityMode: "static" | "dynamic";
  staticSeverity: string;
  dynamicThresholds: { metric: string; value: number; severity: string }[];
}

interface DetectionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  enabled: boolean;
  ruleSets: RuleSet[];
}

const DEFAULT_CATEGORIES: DetectionCategory[] = [
  {
    id: "copy_trading",
    name: "Copy Trading",
    icon: <Zap className="h-4 w-4" />,
    enabled: true,
    ruleSets: [
      {
        id: "rs1",
        name: "Standard Detection",
        conditions: [
          { parameter: "time_window_seconds", operator: "<=", value: "60" },
          { parameter: "match_mode", operator: "=", value: "BOTH_OPEN_AND_CLOSE" },
          { parameter: "direction", operator: "=", value: "COPIED_FROM_OTHERS" },
          { parameter: "min_matches", operator: ">=", value: "2" },
        ],
        severityMode: "dynamic",
        staticSeverity: "HIGH",
        dynamicThresholds: [
          { metric: "matched_trades", value: 10, severity: "CRITICAL" },
          { metric: "matched_trades", value: 5, severity: "HIGH" },
          { metric: "matched_trades", value: 2, severity: "MEDIUM" },
        ],
      },
    ],
  },
  {
    id: "reverse_hedging",
    name: "Reverse Hedging",
    icon: <ArrowLeftRight className="h-4 w-4" />,
    enabled: true,
    ruleSets: [
      {
        id: "rs2",
        name: "Standard Detection",
        conditions: [
          { parameter: "detection_window_seconds", operator: "<=", value: "180" },
          { parameter: "match_mode", operator: "=", value: "BOTH_OPEN_AND_CLOSE" },
          { parameter: "same_symbol_only", operator: "=", value: "true" },
        ],
        severityMode: "static",
        staticSeverity: "HIGH",
        dynamicThresholds: [],
      },
    ],
  },
  {
    id: "ip_sharing",
    name: "IP Sharing",
    icon: <Globe className="h-4 w-4" />,
    enabled: true,
    ruleSets: [
      {
        id: "rs3",
        name: "Standard Detection",
        conditions: [
          { parameter: "min_shared_ips", operator: ">=", value: "3" },
          { parameter: "min_shared_accounts", operator: ">=", value: "2" },
        ],
        severityMode: "dynamic",
        staticSeverity: "MEDIUM",
        dynamicThresholds: [
          { metric: "shared_ip_count", value: 20, severity: "HIGH" },
          { metric: "shared_ip_count", value: 5, severity: "MEDIUM" },
          { metric: "shared_ip_count", value: 1, severity: "LOW" },
        ],
      },
    ],
  },
  {
    id: "device_anomaly",
    name: "Device Anomaly",
    icon: <Smartphone className="h-4 w-4" />,
    enabled: true,
    ruleSets: [
      {
        id: "rs4",
        name: "Standard Detection",
        conditions: [
          { parameter: "max_devices", operator: ">", value: "5" },
          { parameter: "time_period_days", operator: "<=", value: "30" },
        ],
        severityMode: "static",
        staticSeverity: "LOW",
        dynamicThresholds: [],
      },
    ],
  },
  {
    id: "statistical",
    name: "Statistical Anomaly",
    icon: <BarChart3 className="h-4 w-4" />,
    enabled: false,
    ruleSets: [
      {
        id: "rs5",
        name: "Win Rate Anomaly",
        conditions: [
          { parameter: "win_rate_pct", operator: ">", value: "95" },
          { parameter: "min_trades", operator: ">=", value: "20" },
        ],
        severityMode: "static",
        staticSeverity: "MEDIUM",
        dynamicThresholds: [],
      },
    ],
  },
];

const PARAM_LABELS: Record<string, string> = {
  time_window_seconds: "Time Window (seconds)",
  match_mode: "Match Mode",
  direction: "Detection Direction",
  min_matches: "Minimum Matches",
  min_copy_pnl: "Minimum Copy P&L ($)",
  common_ip_required: "Require Common IP",
  common_device_required: "Require Common Device",
  detection_window_seconds: "Detection Window (seconds)",
  same_symbol_only: "Same Symbol Only",
  min_position_size: "Min Position Size (lots)",
  min_shared_ips: "Minimum Shared IPs",
  min_shared_accounts: "Min Shared Accounts",
  exclude_known_vpns: "Exclude Known VPNs",
  max_devices: "Max Devices",
  max_shared_devices: "Max Shared Devices",
  time_period_days: "Time Period (days)",
  win_rate_pct: "Win Rate (%)",
  min_trades: "Minimum Trades",
};

const SEV_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
  HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function RuleSetCard({ ruleSet, index, isLast }: { ruleSet: RuleSet; index: number; isLast: boolean }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-secondary/20 hover:bg-secondary/40 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm">
          {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          <span className="font-medium text-foreground">{ruleSet.name}</span>
          <span className="text-xs text-muted-foreground">{ruleSet.conditions.length} conditions</span>
        </div>
        <div className="flex items-center gap-2">
          {ruleSet.severityMode === "static" ? (
            <Badge variant="outline" className={cn("text-[10px]", SEV_COLORS[ruleSet.staticSeverity])}>{ruleSet.staticSeverity}</Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">Dynamic severity</Badge>
          )}
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-4 border-t border-border">
          {/* Conditions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Conditions (ALL must match)
            </p>
            <div className="space-y-1.5">
              {ruleSet.conditions.map((cond, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <span className="text-[10px] text-primary font-mono">AND</span>}
                  <div className="flex items-center gap-2 flex-1 bg-secondary/30 rounded-md px-3 py-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">{PARAM_LABELS[cond.parameter] || cond.parameter}</span>
                    <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {cond.operator}
                    </span>
                    <input
                      defaultValue={cond.value}
                      className="flex-1 text-xs bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
              <Plus className="h-3 w-3" /> Add Condition
            </Button>
          </div>

          {/* Severity output */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Severity Output</p>
            <div className="flex gap-2">
              <button className={cn("text-xs px-3 py-1.5 rounded-md border transition-colors",
                ruleSet.severityMode === "static" ? "bg-secondary border-primary/30 text-foreground" : "border-border text-muted-foreground")}>
                <span className="flex items-center gap-1">Static</span>
              </button>
              <button className={cn("text-xs px-3 py-1.5 rounded-md border transition-colors",
                ruleSet.severityMode === "dynamic" ? "bg-secondary border-primary/30 text-foreground" : "border-border text-muted-foreground")}>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Dynamic (based on match strength)</span>
              </button>
            </div>

            {ruleSet.severityMode === "static" ? (
              <div className="flex gap-2">
                {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(s => (
                  <Badge key={s} variant="outline" className={cn("text-[10px] cursor-pointer", SEV_COLORS[s], s === ruleSet.staticSeverity && "ring-1 ring-foreground")}>{s}</Badge>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {ruleSet.dynamicThresholds.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-secondary/30 rounded-md px-3 py-2">
                    <span className="text-muted-foreground">If</span>
                    <span className="font-mono text-foreground">{t.metric}</span>
                    <span className="text-primary">≥</span>
                    <input defaultValue={t.value} className="w-16 bg-background border border-border rounded px-2 py-1 text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                    <span className="text-muted-foreground">→</span>
                    <Badge variant="outline" className={cn("text-[10px]", SEV_COLORS[t.severity])}>{t.severity}</Badge>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-3">
                  <span>Otherwise →</span>
                  <Badge variant="outline" className={cn("text-[10px]", SEV_COLORS["LOW"])}>LOW</Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
                  <Plus className="h-3 w-3" /> Add Threshold
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {!isLast && (
        <div className="flex items-center justify-center py-1 bg-secondary/10">
          <span className="text-[10px] text-primary font-mono">OR</span>
        </div>
      )}
    </div>
  );
}

export function DetectionRulesSection() {
  const [categories] = useState(DEFAULT_CATEGORIES);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Detection Rules</h2>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Configure what constitutes cheating for your firm. Rules are evaluated automatically against all accounts.</p>
        <p className="text-xs">These are global defaults. Reviewers can temporarily override parameters when investigating individual accounts.</p>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-border rounded-xl overflow-hidden">
            {/* Category header */}
            <div className="flex items-center justify-between px-4 py-3 bg-card">
              <div className="flex items-center gap-2.5">
                <span className="text-primary">{cat.icon}</span>
                <span className="text-sm font-semibold text-foreground">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.ruleSets.length} rule set{cat.ruleSets.length > 1 ? "s" : ""}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className={cn("relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  cat.enabled ? "bg-primary" : "bg-muted")}>
                  <span className={cn("inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform",
                    cat.enabled ? "translate-x-4.5" : "translate-x-1")} />
                </button>
                <span className="text-xs text-muted-foreground">{cat.enabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>

            {cat.enabled && (
              <div className="p-4 space-y-3 bg-secondary/5">
                {cat.ruleSets.map((rs, i) => (
                  <RuleSetCard key={rs.id} ruleSet={rs} index={i} isLast={i === cat.ruleSets.length - 1} />
                ))}
                <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground w-full">
                  <Plus className="h-3 w-3" /> Add Rule Set (OR condition)
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Button onClick={() => toast.success("Detection rules saved")} size="sm">Save All Rules</Button>
      </div>
    </div>
  );
}
