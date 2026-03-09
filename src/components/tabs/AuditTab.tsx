import { useState } from "react";
import { Account, AuditEntry, ActionType } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, Ban, Eye, CheckCircle, MessageSquare, Mail, Plus, Send } from "lucide-react";
import { toast } from "sonner";

interface AuditTabProps {
  account: Account;
}

const ACTION_CONFIG: Record<ActionType, { icon: React.ReactNode; color: string; label: string }> = {
  WARNING: { icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "text-warning", label: "Warning Sent" },
  SUSPENSION: { icon: <Ban className="h-3.5 w-3.5" />, color: "text-destructive", label: "Account Suspended" },
  REVIEW: { icon: <Eye className="h-3.5 w-3.5" />, color: "text-primary", label: "Reviewed" },
  CLEARED: { icon: <CheckCircle className="h-3.5 w-3.5" />, color: "text-success", label: "Cleared" },
  NOTE: { icon: <MessageSquare className="h-3.5 w-3.5" />, color: "text-muted-foreground", label: "Note Added" },
};

function AuditEntryRow({ entry }: { entry: AuditEntry }) {
  const config = ACTION_CONFIG[entry.actionType];

  return (
    <div className="flex gap-3 p-4">
      {/* Timeline dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={cn("rounded-full p-1.5 border border-border bg-card", config.color)}>
          {config.icon}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("text-sm font-semibold", config.color)}>{config.label}</span>
          {entry.violationRule && (
            <Badge variant="secondary" className="text-[10px] px-1.5">
              {entry.violationRule}
            </Badge>
          )}
        </div>
        <p className="text-xs text-foreground mb-2">{entry.details}</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span>{entry.timestamp}</span>
          <span>by {entry.performedBy}</span>
          {entry.emailSent && (
            <span className="flex items-center gap-1 text-primary">
              <Mail className="h-3 w-3" />
              Sent to {entry.emailRecipient}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function AuditTab({ account }: AuditTabProps) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");

  const sortedAudit = [...account.auditTrail].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    toast.success("Note added to audit trail");
    setNoteText("");
    setShowNoteForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Header with add note */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Audit Trail</h3>
          <p className="text-xs text-muted-foreground">Complete history of actions taken on this account</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={() => setShowNoteForm(!showNoteForm)}
        >
          <Plus className="h-3 w-3" />
          Add Note
        </Button>
      </div>

      {/* Add note form */}
      {showNoteForm && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <p className="text-xs font-semibold text-foreground mb-2">Add a note to the audit trail</p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="e.g., Trader responded to warning — claims using VPN. Escalating for review."
            rows={3}
            className="w-full text-sm text-foreground bg-secondary/50 border border-border rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-ring resize-none mb-3 placeholder:text-muted-foreground"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowNoteForm(false)}>
              Cancel
            </Button>
            <Button size="sm" className="text-xs gap-1" onClick={handleAddNote}>
              <Send className="h-3 w-3" />
              Save Note
            </Button>
          </div>
        </div>
      )}

      {/* Timeline */}
      {sortedAudit.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Eye className="h-10 w-10 text-muted-foreground/30 mb-3" />
          <h3 className="text-sm font-semibold text-foreground mb-1">No Actions Recorded</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            No warnings, suspensions, or reviews have been logged for this account yet. Actions will appear here as they are taken.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
          {sortedAudit.map((entry) => (
            <AuditEntryRow key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {/* Summary stats */}
      {sortedAudit.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Warnings", count: sortedAudit.filter(e => e.actionType === "WARNING").length, color: "text-warning" },
            { label: "Suspensions", count: sortedAudit.filter(e => e.actionType === "SUSPENSION").length, color: "text-destructive" },
            { label: "Reviews", count: sortedAudit.filter(e => e.actionType === "REVIEW").length, color: "text-primary" },
            { label: "Notes", count: sortedAudit.filter(e => e.actionType === "NOTE").length, color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-2.5 text-center">
              <p className={cn("text-lg font-bold font-mono", s.color)}>{s.count}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
