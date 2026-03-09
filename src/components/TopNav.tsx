import { Shield } from "lucide-react";

export function TopNav() {
  return (
    <header className="flex items-center gap-3 h-12 px-4 border-b border-border bg-card">
      <Shield className="h-5 w-5 text-primary" />
      <span className="text-sm font-bold text-foreground">ShieldFX</span>
      <span className="text-xs text-muted-foreground">| TradeXMastery</span>
      <button className="ml-3 rounded-full bg-success px-3 py-1 text-[11px] font-semibold text-success-foreground">
        Find A Cheater
      </button>
      <span className="text-xs text-muted-foreground italic ml-2">ShieldFX Is Like An Anti-Virus For Prop Firms</span>
    </header>
  );
}
