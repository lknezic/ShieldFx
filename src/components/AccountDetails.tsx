import { useState } from "react";
import { Account } from "@/types/account";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { VerdictBanner } from "@/components/VerdictBanner";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { TradesTab } from "@/components/tabs/TradesTab";
import { FingerprintTab } from "@/components/tabs/FingerprintTab";
import { NotifyTab } from "@/components/tabs/NotifyTab";
import { AuditTab } from "@/components/tabs/AuditTab";
import { X, BarChart3, Fingerprint, Mail, History, LayoutDashboard } from "lucide-react";

interface AccountDetailsProps {
  account: Account;
  onClose?: () => void;
}

export function AccountDetails({ account, onClose }: AccountDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const openViolations = account.violations.filter((v) => v.status === "OPEN").length;

  const handleWarning = () => setActiveTab("notify");
  const handleSuspend = () => setActiveTab("notify");

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Sticky: verdict banner + tabs */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="p-4 pb-3">
          <VerdictBanner
            account={account}
            onWarning={handleWarning}
            onSuspend={handleSuspend}
          />
        </div>

        <div className="border-b border-border px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-auto p-0 gap-0">
              {[
                { value: "overview", label: "Overview", icon: <LayoutDashboard className="h-3.5 w-3.5" /> },
                { value: "trades", label: "Trades", icon: <BarChart3 className="h-3.5 w-3.5" />, badge: `${account.totalTrades}` },
                { value: "fingerprint", label: "Fingerprint", icon: <Fingerprint className="h-3.5 w-3.5" />, alert: account.ipAddresses.some((ip) => ip.status === "SHARED") },
                { value: "notify", label: "Notify", icon: <Mail className="h-3.5 w-3.5" />, badgeCount: openViolations },
                { value: "audit", label: "Audit Trail", icon: <History className="h-3.5 w-3.5" />, badge: `${account.auditTrail.length}` },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-xs gap-1.5"
                >
                  {tab.icon}
                  {tab.label}
                  {tab.alert && <span className="h-1.5 w-1.5 rounded-full bg-warning" />}
                  {tab.badgeCount && tab.badgeCount > 0 ? (
                    <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[9px] px-1 py-0 min-w-0 h-4">
                      {tab.badgeCount}
                    </Badge>
                  ) : null}
                  {tab.badge && !tab.badgeCount ? (
                    <span className="text-[10px] text-muted-foreground">{tab.badge}</span>
                  ) : null}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview" className="mt-0"><OverviewTab account={account} /></TabsContent>
          <TabsContent value="trades" className="mt-0"><TradesTab account={account} /></TabsContent>
          <TabsContent value="fingerprint" className="mt-0"><FingerprintTab account={account} /></TabsContent>
          <TabsContent value="notify" className="mt-0"><NotifyTab account={account} /></TabsContent>
          <TabsContent value="audit" className="mt-0"><AuditTab account={account} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
