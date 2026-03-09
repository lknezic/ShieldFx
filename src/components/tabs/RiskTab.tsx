import { Account } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskTabProps {
  account: Account;
}

export function RiskTab({ account }: RiskTabProps) {
  const cd = account.copyDetection;

  return (
    <div className="space-y-4">
      {/* Copy Trading Detection */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30">
          <h3 className="text-sm font-semibold text-foreground">Copy Trading Detection</h3>
        </div>
        <div className="p-4 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Suspicious Trades", value: `${cd.suspiciousTrades} / ${cd.totalTrades}`, color: cd.suspiciousTrades > 0 ? "text-warning" : "text-foreground" },
              { label: "Copy Instances", value: `${cd.copyInstances}`, color: "text-foreground" },
              { label: "Total P&L", value: `+$${cd.totalPnl.toFixed(2)}`, color: "text-success" },
              { label: "Risk Level", value: cd.riskLevel, color: cd.riskLevel === "HIGH" ? "text-destructive" : cd.riskLevel === "MEDIUM" ? "text-warning" : "text-foreground" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
                <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Matches */}
          {cd.matches.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2">Most Frequent Copy Trading Matches</h4>
              <div className="space-y-2">
                {cd.matches.map((m, i) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                      <div>
                        <p className="text-xs font-mono text-foreground">{m.accountId}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{m.matchCount} MATCH</p>
                      <p className="text-xs text-muted-foreground">{m.percentage}% of suspicious trades</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reverse Hedging */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30">
          <h3 className="text-sm font-semibold text-foreground">Reverse Hedging Detection</h3>
        </div>
        <div className="p-4">
          {account.reverseHedging.detected ? (
            <p className="text-sm text-destructive">Reverse hedging detected.</p>
          ) : (
            <p className="text-sm text-muted-foreground">No trades found for analysis</p>
          )}
        </div>
      </div>
    </div>
  );
}
