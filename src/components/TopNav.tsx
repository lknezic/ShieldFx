import { Shield, Settings, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm text-foreground tracking-tight">ShieldFX</span>
        </button>
        <span className="text-muted-foreground text-xs">| TradeXMastery</span>
        <span className="text-xs text-muted-foreground italic">
          Find A Cheater
        </span>
        <span className="text-[10px] text-muted-foreground/60 hidden md:inline">
          ShieldFX Is Like An Anti-Virus For Prop Firms
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/settings")}
          className={cn(
            "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors",
            location.pathname === "/settings"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Settings className="h-3.5 w-3.5" />
          Settings
        </button>
        <button className="flex items-center justify-center h-7 w-7 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <User className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
