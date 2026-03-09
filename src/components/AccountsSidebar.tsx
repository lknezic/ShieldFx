import { useState } from "react";
import { Search, Filter, FolderOpen, AlertTriangle, ChevronDown, Inbox, Clock, CreditCard, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Account, FolderType } from "@/types/account";
import { cn } from "@/lib/utils";

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
    );

  return (
    <div className="flex h-full flex-col bg-background border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Suspicious Accounts</h2>
          <p className="text-xs text-muted-foreground">Accounts with suspicious trading patterns detected by AI analysis.</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Folder tabs - row 1 */}
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

      {/* Folder tabs - row 2 */}
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

      {/* Detection Rules */}
      <div className="flex items-center gap-2 px-4 py-2 border-t border-border">
        <span className="text-xs text-muted-foreground">Detection Rules —</span>
        <span className="text-xs text-suspicious font-medium">Suspicious</span>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">3 GROUPS · 7 RULES</Badge>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          Expand <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by account ID, email, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-1.5">
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <Filter className="h-3 w-3" /> Filters
        </button>
      </div>
      <div className="flex gap-2 px-4 pb-2">
        {["Status", "User Group", "Tags"].map((f) => (
          <button key={f} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary">
            {f} <ChevronDown className="h-3 w-3" />
          </button>
        ))}
        <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-secondary ml-auto">
          Newest First <ChevronDown className="h-3 w-3" />
        </button>
      </div>

      {/* Account list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        {filteredAccounts.map((account) => (
          <button
            key={account.id}
            onClick={() => onSelectAccount(account)}
            className={cn(
              "w-full rounded-lg border p-3 mb-2 text-left transition-colors",
              selectedAccount?.id === account.id
                ? "border-primary/50 bg-primary/10"
                : "border-border bg-card hover:bg-accent"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground truncate">{account.externalId}</span>
              <span className="text-xs text-muted-foreground truncate">({account.email.substring(0, 15)}...)</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">{account.platform}</span>
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              {account.folder === "suspicious" && (
                <Badge className="bg-suspicious/20 text-suspicious border-suspicious/30 text-[10px] px-1.5">
                  ⚠ SUSPICIOUS
                </Badge>
              )}
              <Badge className={cn(
                "text-[10px] px-1.5",
                account.status === "ACTIVE" ? "bg-success/20 text-success border-success/30" : "bg-muted text-muted-foreground"
              )}>
                {account.status}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {account.email} · {account.accountType} Account | Instant Funding – No Time Limit
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
