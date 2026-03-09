import { useState } from "react";
import { Search, Filter, FolderOpen, AlertTriangle, ChevronDown, Inbox, Clock, CreditCard, X, CheckSquare, Square, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Account, FolderType, RiskLevel } from "@/types/account";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getViolationIcon, getViolationShortLabel, RISK_BADGE_STYLES, SEVERITY_BADGE_CLASSES } from "@/lib/violations";

interface AccountsSidebarProps {
  accounts: Account[];
  selectedAccount: Account | null;
  onSelectAccount: (account: Account) => void;
  onClose?: () => void;
}

const folders: { id: FolderType; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "All Accounts", icon: <FolderOpen className="h-4 w-4" /> },
  { id: "uncategorized", label: "Uncategorized", icon: <Inbox className="h-4 w-4" /> },
  { id: "pay_later", label: "Pay Later", icon: <CreditCard className="h-4 w-4" /> },
  { id: "new", label: "New", icon: <FolderOpen className="h-4 w-4" /> },
  { id: "later", label: "Later", icon: <Clock className="h-4 w-4" /> },
  { id: "suspicious", label: "Suspicious", icon: <AlertTriangle className="h-4 w-4" /> },
];

export function AccountsSidebar({ accounts, selectedAccount, onSelectAccount, onClose }: AccountsSidebarProps) {
  const [activeFolder, setActiveFolder] = useState<FolderType>("suspicious");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  const [sortBy, setSortBy] = useState<"risk" | "newest" | "pnl">("risk");

  const folderCounts = folders.map((f) => ({
    ...f,
    count: f.id === "all" ? accounts.length : accounts.filter((a) => a.folder === f.id).length,
  }));

  const filteredAccounts = accounts
    .filter((a) => activeFolder === "all" || a.folder === activeFolder)
    .filter((a) =>
      searchQuery === "" ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.externalId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "risk") {
        const order: Record<RiskLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
        return order[a.riskLevel] - order[b.riskLevel];
      }
      if (sortBy === "pnl") return b.totalPnl - a.totalPnl;
      return 0;
    });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredAccounts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAccounts.map((a) => a.id)));
    }
  };

  const handleBulkWarning = () => {
    toast.success(`Bulk warning sent to ${selectedIds.size} account(s)`);
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  const handleBulkSuspend = () => {
    toast.success(`${selectedIds.size} account(s) suspended`);
    setSelectedIds(new Set());
    setBulkMode(false);
  };

  return (
    <div className="flex h-full flex-col bg-background border-r border-border">
      <div className="flex items-center justify-between p-4 pb-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Accounts</h2>
          <p className="text-xs text-muted-foreground">AI-powered rule breach detection</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant={bulkMode ? "default" : "ghost"}
            size="sm"
            className="text-[10px] h-7 px-2"
            onClick={() => { setBulkMode(!bulkMode); setSelectedIds(new Set()); }}
          >
            {bulkMode ? "Done" : "Bulk"}
          </Button>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {bulkMode && selectedIds.size > 0 && (
        <div className="mx-4 mb-2 p-2.5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between">
          <span className="text-xs font-semibold text-primary">{selectedIds.size} selected</span>
          <div className="flex gap-1.5">
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 border-warning/50 text-warning hover:bg-warning/10" onClick={handleBulkWarning}>
              <AlertTriangle className="h-3 w-3" /> Warn All
            </Button>
            <Button size="sm" className="h-7 text-[10px] gap-1 bg-destructive hover:bg-destructive/90" onClick={handleBulkSuspend}>
              <Ban className="h-3 w-3" /> Suspend All
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 px-4 pt-2">
        {folderCounts.slice(0, 3).map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activeFolder === f.id
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
            )}
          >
            {f.icon}
            {f.label}
            <span className="ml-1 text-muted-foreground">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 pt-1.5 pb-3">
        {folderCounts.slice(3).map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFolder(f.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              activeFolder === f.id
                ? f.id === "suspicious"
                  ? "bg-destructive/20 text-destructive border border-destructive/30"
                  : "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-secondary-foreground"
            )}
          >
            {f.icon}
            {f.label}
            <span className="ml-1">{f.count}</span>
          </button>
        ))}
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          + New Folder
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search accounts, IDs, emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-4 pb-2">
        {bulkMode && (
          <button
            onClick={selectAll}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 mr-2"
          >
            {selectedIds.size === filteredAccounts.length ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
            {selectedIds.size === filteredAccounts.length ? "Deselect" : "Select"} all
          </button>
        )}
        {(["risk", "newest", "pnl"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            className={cn(
              "text-[10px] px-2 py-1 rounded border transition-colors",
              sortBy === s
                ? "bg-secondary text-foreground border-border"
                : "text-muted-foreground border-transparent hover:border-border"
            )}
          >
            {s === "risk" ? "Risk ↓" : s === "newest" ? "Newest" : "P&L"}
          </button>
        ))}
        <span className="text-[10px] text-muted-foreground ml-auto">{filteredAccounts.length} accounts</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        {filteredAccounts.map((account) => {
          const isSelected = selectedAccount?.id === account.id;
          const isChecked = selectedIds.has(account.id);

          return (
            <div
              key={account.id}
              className={cn(
                "w-full rounded-lg border p-3 mb-2 text-left transition-colors cursor-pointer",
                isSelected
                  ? "border-primary/50 bg-primary/10"
                  : "border-border bg-card hover:bg-accent"
              )}
              onClick={() => {
                if (bulkMode) {
                  toggleSelect(account.id);
                } else {
                  onSelectAccount(account);
                }
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {bulkMode && (
                  <span className="flex-shrink-0">
                    {isChecked ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                  </span>
                )}
                <span className="text-sm font-semibold text-foreground font-mono">{account.externalId}</span>
                <span className={cn(
                  "ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded",
                  RISK_BADGE_STYLES[account.riskLevel]
                )}>
                  {account.riskLevel}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground truncate mb-1.5">
                {account.email}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {account.violations.length > 0 ? (
                    [...new Set(account.violations.map(v => v.rule))].map((rule) => {
                      const maxSeverity = account.violations
                        .filter(v => v.rule === rule)
                        .reduce((max, v) => {
                          const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                          return order[v.severity] < order[max] ? v.severity : max;
                        }, "LOW" as string);

                      return (
                        <span
                          key={rule}
                          className={cn(
                            "inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border",
                            maxSeverity === "CRITICAL" || maxSeverity === "HIGH"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : maxSeverity === "MEDIUM"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted text-muted-foreground border-border"
                          )}
                        >
                          {getViolationIcon(rule, "sm")}
                          {getViolationShortLabel(rule)}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-success">Clean</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{account.platform}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
