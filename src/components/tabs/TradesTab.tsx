import { Account } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TradesTabProps {
  account: Account;
}

export function TradesTab({ account }: TradesTabProps) {
  return (
    <div className="space-y-4">
      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total P&L", value: `+$${account.totalPnl.toLocaleString()}`, color: "text-success" },
          { label: "Win Rate", value: `${account.winRate}%`, color: "text-foreground" },
          { label: "Winning Trades", value: `${account.winningTrades} / ${account.totalTrades}`, color: "text-success" },
          { label: "Losing Trades", value: `${account.losingTrades} / ${account.totalTrades}`, color: "text-destructive" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
            <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Trades list */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Recent Trades</h3>
          <span className="text-xs text-muted-foreground">Showing all {account.trades.length} trades</span>
        </div>
        <div className="divide-y divide-border">
          {account.trades.map((trade) => (
            <div key={trade.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-[10px] px-1.5",
                    trade.type === "BUY" ? "bg-success/20 text-success border-success/30" : "bg-destructive/20 text-destructive border-destructive/30"
                  )}>
                    {trade.type}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">{trade.symbol}</span>
                  <span className="text-xs text-muted-foreground">{trade.lots} lots</span>
                  {trade.isCopied && (
                    <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">⚠ COPIED</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-bold", trade.pnl >= 0 ? "text-success" : "text-destructive")}>
                    {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{trade.duration}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Prices & Pips</p>
                  <p className="text-xs text-foreground">Open: {trade.openPrice.toFixed(5)}</p>
                  <p className="text-xs text-foreground">Close: {trade.closePrice.toFixed(5)}</p>
                  <p className="text-xs text-success">{trade.pips.toFixed(1)} pips</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Duration</p>
                  <p className="text-xs text-foreground">{trade.duration}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Opened</p>
                  <p className="text-xs text-foreground">{trade.openDate}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Closed</p>
                  <p className="text-xs text-foreground">{trade.closeDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
