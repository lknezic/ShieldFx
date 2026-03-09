import { Account } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  account: Account;
}

function SectionCard({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/30">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StatItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={cn("text-sm font-semibold text-foreground", className)}>{value}</p>
    </div>
  );
}

export function OverviewTab({ account }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <SectionCard title="Account Main Information">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">{account.externalId}</span>
          </div>
          <p className="text-xs text-muted-foreground">{account.email} · [{account.accountType} Account] Instant Funding – No Time Limit</p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-muted-foreground">Folder</span>
            <Badge className="bg-suspicious/20 text-suspicious border-suspicious/30 text-xs capitalize">{account.folder}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <StatItem label="Account Type" value={account.accountType} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Status</p>
              <Badge className={cn(
                "text-xs",
                account.status === "ACTIVE" ? "bg-success/20 text-success border-success/30" : "bg-muted text-muted-foreground"
              )}>
                {account.status}
              </Badge>
            </div>
            <StatItem label="Created" value={account.createdDate} />
          </div>
          <StatItem label="External ID" value={account.externalId} />
        </div>
      </SectionCard>

      <SectionCard title="Account Balance">
        <div className="grid grid-cols-5 gap-4">
          <StatItem label="Balance" value={`$${account.balance.toLocaleString()}`} />
          <StatItem label="Equity" value={`$${account.equity.toLocaleString()}`} />
          <StatItem label="P&L" value={`+$${account.pnl.toFixed(2)}`} className="text-success" />
          <StatItem label="Margin" value={`$${account.margin.toLocaleString()}`} />
          <StatItem label="Credit" value={`$${account.credit.toFixed(2)}`} />
        </div>
      </SectionCard>

      <SectionCard title="Trader Information">
        <div className="grid grid-cols-2 gap-4">
          <StatItem label="Name" value={account.name} />
          <StatItem label="Email Address" value={account.email} />
        </div>
        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Tags</p>
          {account.tags.length === 0 ? (
            <p className="text-xs text-muted-foreground">+ No tags yet – click + to add</p>
          ) : (
            <div className="flex gap-1">{account.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
          )}
        </div>
      </SectionCard>

      <SectionCard title={`Connected Accounts  ${account.connectedAccounts.length}`}>
        {account.connectedAccounts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No connected accounts found.</p>
        ) : (
          <div className="space-y-2">
            {account.connectedAccounts.map((ca) => (
              <div key={ca.id} className="flex items-center gap-2 p-2 rounded bg-secondary/30">
                <span className="text-sm font-medium text-foreground">{ca.id}</span>
                <span className="text-xs text-muted-foreground">({ca.email} – {ca.type})</span>
                <Badge className="bg-success/20 text-success border-success/30 text-[10px] ml-auto">{ca.status}</Badge>
                <span className="text-xs text-muted-foreground">{ca.type}</span>
                <span className="text-xs text-muted-foreground">· {ca.date}</span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
