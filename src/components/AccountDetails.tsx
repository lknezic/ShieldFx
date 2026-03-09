import { Account } from "@/types/account";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { TradesTab } from "@/components/tabs/TradesTab";
import { RiskTab } from "@/components/tabs/RiskTab";
import { FingerprintTab } from "@/components/tabs/FingerprintTab";
import { NotifyTab } from "@/components/tabs/NotifyTab";
import { X, Shield, BarChart3, Fingerprint, FileText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountDetailsProps {
  account: Account;
  onClose?: () => void;
}

export function AccountDetails({ account, onClose }: AccountDetailsProps) {
  const openViolations = account.violations.filter((v) => v.status === "OPEN").length;

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4 pb-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Account Details</h2>
            <p className="text-xs text-muted-foreground">View detailed information about the selected account</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 px-4 pb-2">
          <span className="text-sm font-bold text-foreground">{account.externalId}</span>
          <span className="text-xs text-muted-foreground">{account.name}</span>
          <Badge className={cn(
            "text-[10px]",
            account.status === "ACTIVE" ? "bg-success/20 text-success border-success/30" : "bg-muted text-muted-foreground"
          )}>
            {account.status}
          </Badge>
          <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
            <span>Balance: <span className="text-foreground font-semibold">${account.balance.toLocaleString()}</span></span>
            <span>P&L: <span className="text-success font-semibold">+${account.totalPnl.toLocaleString()}</span></span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex flex-col flex-1 min-h-0">
        <div className="border-b border-border px-4">
          <TabsList className="bg-transparent h-auto p-0 gap-0">
            {[
              { value: "overview", label: "Overview", icon: <FileText className="h-3.5 w-3.5" /> },
              { value: "trades", label: "Trades", icon: <BarChart3 className="h-3.5 w-3.5" /> },
              { value: "risk", label: "Risk Detection", icon: <Shield className="h-3.5 w-3.5" />, badge: account.copyDetection.suspiciousTrades > 0 },
              { value: "fingerprint", label: "Fingerprint", icon: <Fingerprint className="h-3.5 w-3.5" />, badge: account.ipAddresses.some((ip) => ip.status === "SHARED") },
              { value: "notify", label: "Notify", icon: <Mail className="h-3.5 w-3.5" />, badgeCount: openViolations },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-xs gap-1.5"
              >
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                )}
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[9px] px-1 py-0 min-w-0 h-4">
                    {tab.badgeCount}
                  </Badge>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          <TabsContent value="overview" className="mt-0"><OverviewTab account={account} /></TabsContent>
          <TabsContent value="trades" className="mt-0"><TradesTab account={account} /></TabsContent>
          <TabsContent value="risk" className="mt-0"><RiskTab account={account} /></TabsContent>
          <TabsContent value="fingerprint" className="mt-0"><FingerprintTab account={account} /></TabsContent>
          <TabsContent value="notify" className="mt-0"><NotifyTab account={account} /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
