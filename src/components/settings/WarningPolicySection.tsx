import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  return (
    <button className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${defaultChecked ? "bg-primary" : "bg-muted"}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${defaultChecked ? "translate-x-4.5" : "translate-x-1"}`} />
    </button>
  );
}

function NumberInput({ defaultValue, suffix, width = "w-20" }: { defaultValue: number; suffix?: string; width?: string }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" defaultValue={defaultValue} className={`${width} text-sm text-center bg-secondary/50 border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring`} />
      {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
    </div>
  );
}

export function WarningPolicySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Warning & Suspension Policy</h2>
      <p className="text-sm text-muted-foreground">
        Configure how warnings escalate, when warned accounts get re-reviewed, and what happens on suspension.
      </p>

      {/* Warning Limits */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Warning Limits</h3>
          <Badge variant="outline" className="text-[10px]">Phase 1</Badge>
        </div>
        <p className="text-xs text-muted-foreground">How many warnings before automatic escalation.</p>

        <div className="space-y-0">
          <SettingRow label="Max Warnings Before Auto-Suspend" description="After this many warnings, the account is automatically suspended.">
            <div className="flex items-center gap-2">
              <NumberInput defaultValue={3} />
              <span className="text-xs text-muted-foreground">warnings</span>
            </div>
          </SettingRow>
          <SettingRow label="Require Manager Approval for Suspension" description="If enabled, auto-suspension creates a pending action instead of suspending immediately.">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="Cool-down Between Warnings" description="Minimum time between sending warnings to the same account.">
            <NumberInput defaultValue={48} suffix="hours" />
          </SettingRow>
        </div>
      </div>

      {/* Re-Trigger Thresholds */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Re-Trigger Thresholds</h3>
          <Badge variant="outline" className="text-[10px]">Phase 2</Badge>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>When a warned account should come back to the Suspicious folder for re-review.</p>
          <p>If ANY condition is met, the account is re-triggered.</p>
        </div>

        <div className="space-y-0">
          <SettingRow label="New Tag Type Detected" description="A detection tag fires for a rule that wasn't part of the original warning.">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="Same Tag Severity Increases" description="An existing tag's severity escalates (e.g., MEDIUM → HIGH).">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="New Copy Match Found" description="A new copy-trading match is detected with a different account.">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="Minimum Days After Warning" description="Don't re-trigger until this many days have passed since the last warning.">
            <NumberInput defaultValue={7} suffix="days" />
          </SettingRow>
          <SettingRow label="Auto Re-Trigger on New Data" description="Automatically move account back to Suspicious when new trades are imported.">
            <Toggle />
          </SettingRow>
          <SettingRow label="Notify Reviewer on Re-Trigger" description="Send a notification to the assigned reviewer when an account is re-triggered.">
            <Toggle defaultChecked />
          </SettingRow>
        </div>
      </div>

      {/* Suspension Policy */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Suspension Policy</h3>
          <Badge variant="outline" className="text-[10px]">Phase 1</Badge>
        </div>
        <p className="text-xs text-muted-foreground">What happens when an account is suspended.</p>

        <div className="space-y-0">
          <SettingRow label="Freeze Open Positions" description="Prevent the trader from opening or closing positions while suspended.">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="Disable Withdrawals" description="Block withdrawal requests while account is suspended.">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="Profit Handling" description="How to handle profits from suspicious trades.">
            <select defaultValue="manual" className="text-sm bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="manual">Manual Decision</option>
              <option value="forfeit_all">Forfeit All Profits</option>
              <option value="forfeit_suspicious">Forfeit Suspicious Profits Only</option>
            </select>
          </SettingRow>
          <SettingRow label="Auto-Send Suspension Email" description="Automatically send the suspension notification email.">
            <Toggle defaultChecked />
          </SettingRow>
          <SettingRow label="CC Manager on Suspension" description="Send a copy of the suspension email to a manager.">
            <input defaultValue="manager@tradexmastery.com" className="w-64 text-sm bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-foreground" />
          </SettingRow>
        </div>
      </div>

      {/* Auto-Move Threshold */}
      <div className="border border-border rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Auto-Move Threshold</h3>
        <p className="text-xs text-muted-foreground">Minimum detection tag severity to automatically move accounts to Suspicious.</p>
        <div className="space-y-0">
          <SettingRow label="Minimum Severity" description="Tags below this severity won't trigger auto-move.">
            <select defaultValue="MEDIUM" className="text-sm bg-secondary/50 border border-border rounded-md px-3 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option>LOW</option>
              <option>MEDIUM</option>
              <option>HIGH</option>
              <option>CRITICAL</option>
            </select>
          </SettingRow>
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={() => toast.success("Warning & suspension policy saved")} size="sm">Save Changes</Button>
      </div>
    </div>
  );
}
