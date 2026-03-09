import { useState, useEffect } from "react";
import { Account, Violation } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Send, AlertTriangle, CheckCircle, Edit3, Ban, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/templates";

interface NotifyTabProps {
  account: Account;
  initialMode?: "WARNING" | "SUSPENSION";
}

type NotifyMode = "WARNING" | "SUSPENSION";

export function NotifyTab({ account, initialMode = "WARNING" }: NotifyTabProps) {
  const openViolations = account.violations.filter((v) => v.status === "OPEN");
  const [mode, setMode] = useState<NotifyMode>(initialMode);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(
    openViolations.length > 0 ? openViolations[0] : account.violations[0] || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [wasManuallyEdited, setWasManuallyEdited] = useState(false);

  // Generate email from template engine
  const generated = selectedViolation ? generateEmail(account, selectedViolation, mode) : { subject: "", body: "" };
  const [subject, setSubject] = useState(generated.subject);
  const [emailBody, setEmailBody] = useState(generated.body);

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  // Regenerate when violation or mode changes
  useEffect(() => {
    if (selectedViolation) {
      const t = generateEmail(account, selectedViolation, mode);
      setSubject(t.subject);
      setEmailBody(t.body);
      setWasManuallyEdited(false);
    }
  }, [selectedViolation?.id, mode]);

  const handleSelectViolation = (v: Violation) => {
    setSelectedViolation(v);
    setIsEditing(false);
  };

  const handleModeChange = (newMode: NotifyMode) => {
    setMode(newMode);
    setIsEditing(false);
  };

  const handleResetToGenerated = () => {
    if (selectedViolation) {
      const t = generateEmail(account, selectedViolation, mode);
      setSubject(t.subject);
      setEmailBody(t.body);
      setWasManuallyEdited(false);
      toast.info("Email reset to generated template");
    }
  };

  const handleSend = () => {
    toast.success(
      mode === "WARNING"
        ? `Warning #${account.warningCount + 1} sent to ${account.email}`
        : `Suspension notice sent to ${account.email}`,
      { description: `Violation: ${selectedViolation?.rule}` }
    );
  };

  if (account.violations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-12 w-12 text-success mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Violations Detected</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This account has no active rule violations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeChange("WARNING")}
          className={cn("flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-semibold",
            mode === "WARNING" ? "border-warning bg-warning/10 text-warning" : "border-border text-muted-foreground hover:border-warning/30")}>
          <AlertTriangle className="h-4 w-4" />
          Send Warning
          {account.warningCount > 0 && <span className="text-[10px] font-normal opacity-70">#{account.warningCount + 1}</span>}
        </button>
        <button
          onClick={() => handleModeChange("SUSPENSION")}
          className={cn("flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all text-sm font-semibold",
            mode === "SUSPENSION" ? "border-destructive bg-destructive/10 text-destructive" : "border-border text-muted-foreground hover:border-destructive/30")}>
          <Ban className="h-4 w-4" />
          Send Suspension
        </button>
      </div>

      {/* Warning history context */}
      {account.warningCount > 0 && mode === "WARNING" && (
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-semibold text-warning">
              {account.warningCount} prior warning{account.warningCount > 1 ? "s" : ""} on record
            </span>
          </div>
          <div className="space-y-1">
            {account.warningHistory.map((w) => (
              <div key={w.id} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono font-semibold">#{w.warningNumber}</span>
                <span>{w.sentDate}</span>
                <span>{"\u2014"}</span>
                <span>{w.tagsAtWarningTime.map(t => t.rule).join(", ")}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            The email below automatically references this history.
          </p>
        </div>
      )}

      {/* Select violation */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">Select Violation</h3>
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 text-[10px] ml-auto">
            {openViolations.length} OPEN
          </Badge>
        </div>
        <div className="divide-y divide-border">
          {account.violations.map((v) => (
            <button
              key={v.id}
              onClick={() => handleSelectViolation(v)}
              className={cn("w-full p-3 text-left transition-colors",
                selectedViolation?.id === v.id ? "bg-primary/10" : "hover:bg-accent")}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-foreground">{v.rule}</span>
                <div className="flex items-center gap-1.5">
                  <Badge className={cn("text-[10px]",
                    v.severity === "HIGH" || v.severity === "CRITICAL" ? "bg-destructive/20 text-destructive border-destructive/30"
                    : v.severity === "MEDIUM" ? "bg-warning/20 text-warning border-warning/30"
                    : "bg-muted text-muted-foreground")}>
                    {v.severity}
                  </Badge>
                  <Badge className={cn("text-[10px]",
                    v.status === "OPEN" ? "bg-destructive/20 text-destructive border-destructive/30"
                    : v.status === "NOTIFIED" ? "bg-warning/20 text-warning border-warning/30"
                    : "bg-success/20 text-success border-success/30")}>
                    {v.status}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{v.description}</p>
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
              <h3 className="text-sm font-semibold text-foreground">
                {mode === "WARNING" ? `Warning #${account.warningCount + 1}` : "Suspension"} Email
              </h3>
              {wasManuallyEdited && (
                <Badge variant="secondary" className="text-[9px]">edited</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {wasManuallyEdited && (
                <Button variant="ghost" size="sm" onClick={handleResetToGenerated}
                  className="text-xs gap-1 text-muted-foreground hover:text-foreground h-7">
                  <RotateCcw className="h-3 w-3" />
                  Reset to Generated
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}
                className="text-xs gap-1 text-muted-foreground hover:text-foreground h-7">
                <Edit3 className="h-3 w-3" />
                {isEditing ? "Preview" : "Edit"}
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">To:</span>
              <span className="text-sm text-foreground">{account.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-16">Subject:</span>
              {isEditing ? (
                <input
                  value={subject}
                  onChange={(e) => { setSubject(e.target.value); setWasManuallyEdited(true); }}
                  className="flex-1 text-sm text-foreground bg-secondary/50 border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring" />
              ) : (
                <span className="text-sm text-foreground">{subject}</span>
              )}
            </div>
            <div className="border-t border-border pt-3">
              {isEditing ? (
                <textarea
                  value={emailBody}
                  onChange={(e) => { setEmailBody(e.target.value); setWasManuallyEdited(true); }}
                  rows={16}
                  className="w-full text-sm text-foreground bg-secondary/50 border border-border rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none scrollbar-thin font-mono" />
              ) : (
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed bg-secondary/20 rounded-lg p-4 max-h-96 overflow-y-auto scrollbar-thin">
                  {emailBody}
                </pre>
              )}
            </div>

            {/* Consequence warning */}
            <div className={cn("rounded-lg border p-3",
              mode === "WARNING" ? "bg-warning/5 border-warning/20" : "bg-destructive/5 border-destructive/20")}>
              <p className={cn("text-xs", mode === "WARNING" ? "text-warning" : "text-destructive")}>
                {mode === "WARNING"
                  ? `This will send warning #${account.warningCount + 1} and log it to the audit trail. The account will remain active and move to the Warned folder.`
                  : "This will suspend the account immediately, freeze all open positions, and move it to the Suspended folder. This action can be reversed by an admin."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-[10px] text-muted-foreground">
                {wasManuallyEdited ? "Email has been manually edited." : "Auto-generated from account history and current violations."}
              </p>
              <Button onClick={handleSend} size="sm"
                className={cn("gap-1.5", mode === "SUSPENSION" && "bg-destructive hover:bg-destructive/90")}>
                <Send className="h-3.5 w-3.5" />
                {mode === "WARNING" ? `Send Warning #${account.warningCount + 1}` : "Confirm Suspension"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}