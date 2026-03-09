import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CompanyProfileSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Company Profile</h2>
      <p className="text-sm text-muted-foreground">Basic information about your prop firm. Used in email headers and audit trails.</p>

      <div className="space-y-5 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Company Name</label>
            <input defaultValue="TradeXMastery" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Display Name (in emails)</label>
            <input defaultValue="TradeXMastery Compliance" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Primary Contact Email</label>
            <input defaultValue="compliance@tradexmastery.com" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Timezone</label>
            <select defaultValue="UTC" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option>UTC</option>
              <option>America/New_York (EST)</option>
              <option>Europe/London (GMT)</option>
              <option>Asia/Dubai (GST)</option>
              <option>Asia/Tokyo (JST)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Company Logo URL</label>
          <input defaultValue="https://tradexmastery.com/logo.png" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Default Language</label>
          <select defaultValue="English" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option>English</option>
            <option>Arabic</option>
            <option>Spanish</option>
          </select>
        </div>

        <div className="pt-2">
          <Button onClick={() => toast.success("Company profile saved")} size="sm">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
