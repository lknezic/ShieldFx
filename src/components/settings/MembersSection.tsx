import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Eye, UserCog } from "lucide-react";
import { toast } from "sonner";

const MOCK_MEMBERS = [
  { id: "1", name: "Matej Serbec", email: "matej.serbec@gmail.com", role: "Admin", lastActive: "Today", avatar: "MS" },
  { id: "2", name: "Ahmed Risk", email: "ahmed@tradexmastery.com", role: "Reviewer", lastActive: "2h ago", avatar: "AR", assignedFolders: ["Suspicious", "Warned"] },
  { id: "3", name: "Sara Ops", email: "sara@tradexmastery.com", role: "Reviewer", lastActive: "Yesterday", avatar: "SO", assignedFolders: ["New"] },
  { id: "4", name: "Dan Finance", email: "dan@tradexmastery.com", role: "Viewer", lastActive: "3 days ago", avatar: "DF" },
];

const ROLE_CONFIG = {
  Admin: { color: "bg-primary/20 text-primary border-primary/30", icon: <Shield className="h-3.5 w-3.5" />, description: "Full access. Can configure settings, manage members, and perform all actions." },
  Reviewer: { color: "bg-warning/20 text-warning border-warning/30", icon: <UserCog className="h-3.5 w-3.5" />, description: "Can review accounts, send warnings, suspend, move folders. Cannot change settings." },
  Viewer: { color: "bg-muted text-muted-foreground", icon: <Eye className="h-3.5 w-3.5" />, description: "Read-only access. Can view accounts and audit trails but cannot take actions." },
};

export function MembersSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Members & Roles</h2>
      <p className="text-sm text-muted-foreground">
        Manage who has access to ShieldFX and what they can do. Assign reviewers to specific folders for workload distribution.
      </p>

      {/* Invite */}
      <div className="flex items-center gap-2">
        <input placeholder="email@company.com" className="flex-1 rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        <select className="rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option>Reviewer</option>
          <option>Admin</option>
          <option>Viewer</option>
        </select>
        <Button size="sm" className="gap-1" onClick={() => toast.success("Invitation sent")}><Plus className="h-3.5 w-3.5" /> Invite</Button>
      </div>

      {/* Role descriptions */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(ROLE_CONFIG).map(([role, config]) => (
          <div key={role} className="border border-border rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-primary">{config.icon}</span>
              <span className="text-xs font-semibold text-foreground">{role}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{config.description}</p>
          </div>
        ))}
      </div>

      {/* Member list */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_60px] gap-2 px-4 py-2 bg-secondary/30 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          <span>Member</span>
          <span>Role</span>
          <span>Last Active</span>
          <span></span>
        </div>
        {MOCK_MEMBERS.map(m => {
          const roleConf = ROLE_CONFIG[m.role as keyof typeof ROLE_CONFIG];
          return (
            <div key={m.id} className="grid grid-cols-[1fr_100px_100px_60px] gap-2 px-4 py-3 border-t border-border items-center">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  <p>{m.avatar}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">{m.email}</p>
                  {"assignedFolders" in m && m.assignedFolders && (
                    <div className="flex gap-1 mt-0.5">
                      {m.assignedFolders.map(f => (
                        <Badge key={f} variant="outline" className="text-[9px] py-0">{f}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="outline" className={`text-[10px] ${roleConf.color}`}>{m.role}</Badge>
              <span className="text-xs text-muted-foreground">{m.lastActive}</span>
              <Button variant="ghost" size="sm" className="text-xs h-7">Edit</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
