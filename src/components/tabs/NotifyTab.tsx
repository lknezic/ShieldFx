import { useState } from "react";
import { Account, Violation } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Send, AlertTriangle, CheckCircle, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface NotifyTabProps {
  account: Account;
}

function getEmailTemplate(account: Account, violation: Violation): string {
  const templates: Record<string, string> = {
    "Copy Trading": `Dear ${account.name},

We are writing to inform you that our automated risk management system has detected suspicious copy trading activity on your account (${account.externalId}).

Specifically, the following was detected:
${violation.description}

This activity is in violation of our Terms of Service, Section 4.2 – Prohibited Trading Practices, which explicitly prohibits the use of copy trading strategies, trade mirroring, or any form of coordinated trading across accounts.

Required Actions:
1. Cease all copy trading activities immediately
2. Provide a written explanation within 48 hours
3. Any further violations may result in account suspension or termination

If you believe this detection is in error, please respond to this email with supporting evidence within 48 hours.

Regards,
Risk Management Team`,

    "Shared IP Address": `Dear ${account.name},

Our security monitoring system has flagged unusual IP address activity on your trading account (${account.externalId}).

Details of the finding:
${violation.description}

Per our Terms of Service, Section 3.1 – Account Security, sharing account access or trading from shared infrastructure with other traders is prohibited as it may indicate coordinated trading or account sharing.

Required Actions:
1. Confirm you are the sole operator of this trading account
2. Provide an explanation for the shared IP addresses within 48 hours
3. Ensure your account credentials have not been shared with third parties

Failure to respond may result in a temporary account restriction pending further investigation.

Regards,
Risk Management Team`,
  };

  return templates[violation.rule] || `Dear ${account.name},

Our risk management system has detected a potential violation on your account (${account.externalId}).

${violation.description}

Please review your trading activity and respond to this notice within 48 hours.

Regards,
Risk Management Team`;
}

export function NotifyTab({ account }: NotifyTabProps) {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    account.violations.length > 0 ? account.violations[0] : null
  );
  const [emailBody, setEmailBody] = useState(
    account.violations.length > 0 ? getEmailTemplate(account, account.violations[0]) : ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(
    account.violations.length > 0
      ? `[Action Required] ${account.violations[0].rule} Violation Detected – Account ${account.externalId}`
      : ""
  );

  const handleSelectViolation = (v: Violation) => {
    setSelectedViolation(v);
    setEmailBody(getEmailTemplate(account, v));
    setSubject(`[Action Required] ${v.rule} Violation Detected – Account ${account.externalId}`);
    setIsEditing(false);
  };

  const handleSend = () => {
    toast.success(`Email notification sent to ${account.email}`, {
      description: `Violation: ${selectedViolation?.rule}`,
    });
  };

  if (account.violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-12 w-12 text-success mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Violations Detected</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This account has no active rule violations. The notification system will be available when violations are detected.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active Violations */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Active Violations</h3>
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] ml-auto">
            {account.violations.filter((v) => v.status === "OPEN").length} OPEN
          </Badge>
        </div>
        <div className="divide-y divide-border">
          {account.violations.map((v) => (
            <button
              key={v.id}
              onClick={() => handleSelectViolation(v)}
              className={cn(
                "w-full p-4 text-left transition-colors",
                selectedViolation?.id === v.id ? "bg-primary/10" : "hover:bg-accent"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{v.rule}</span>
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-[10px]",
                    v.severity === "HIGH" || v.severity === "CRITICAL"
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : v.severity === "MEDIUM"
                      ? "bg-warning/20 text-warning border-warning/30"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {v.severity}
                  </Badge>
                  <Badge className={cn(
                    "text-[10px]",
                    v.status === "OPEN"
                      ? "bg-destructive/20 text-destructive border-destructive/30"
                      : v.status === "NOTIFIED"
                      ? "bg-warning/20 text-warning border-warning/30"
                      : "bg-success/20 text-success border-success/30"
                  )}>
                    {v.status}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{v.description}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Detected: {v.detectedDate}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Email Composer */}
      {selectedViolation && (
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Send Violation Notice</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs gap-1 text-muted-foreground hover:text-foreground"
            >
              <Edit3 className="h-3 w-3" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
          </div>
          <div className="p-4 space-y-3">
            {/* To */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">To:</span>
              <span className="text-sm text-foreground">{account.email}</span>
            </div>

            {/* Subject */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Subject:</span>
              {isEditing ? (
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-1 text-sm text-foreground bg-secondary/50 border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                />
              ) : (
                <span className="text-sm text-foreground">{subject}</span>
              )}
            </div>

            {/* Body */}
            <div className="border-t border-border pt-3">
              {isEditing ? (
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={16}
                  className="w-full text-sm text-foreground bg-secondary/50 border border-border rounded p-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none scrollbar-thin font-mono"
                />
              ) : (
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed bg-secondary/20 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-thin">
                  {emailBody}
                </pre>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">
                This email is pre-filled based on the detected violation. You can edit it before sending.
              </p>
              <Button onClick={handleSend} size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Send Notification
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
