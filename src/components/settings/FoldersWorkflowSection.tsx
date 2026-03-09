import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GripVertical, Plus, Settings2, Trash2, ChevronDown, Lock } from "lucide-react";
import { SYSTEM_FOLDERS } from "@/types/account";
import { toast } from "sonner";

const MOCK_CUSTOM_FOLDERS = [
  { id: "vip_watch", name: "VIP Watch", icon: "👁", color: "#8b5cf6", position: 5, isSystem: false, accountCount: 3 },
  { id: "pay_later", name: "Pay Later", icon: "💰", color: "#06b6d4", position: 6, isSystem: false, accountCount: 7 },
];

const FOLDER_COUNTS: Record<string, number> = {
  new: 34, suspicious: 12, warned: 3, suspended: 1, cleared: 89,
};

interface FolderAutoRule {
  id: string;
  tagRule: string;
  minSeverity: string;
  sourceFolder: string;
}

const MOCK_AUTO_RULES: Record<string, FolderAutoRule[]> = {
  suspicious: [
    { id: "ar1", tagRule: "any", minSeverity: "MEDIUM", sourceFolder: "new" },
    { id: "ar2", tagRule: "any_new_type", minSeverity: "MEDIUM", sourceFolder: "cleared" },
  ],
  vip_watch: [
    { id: "ar3", tagRule: "any", minSeverity: "LOW", sourceFolder: "any" },
  ],
};

function FolderCard({ folder, count, isExpanded, onToggle }: {
  folder: { id: string; name: string; icon: string; color: string; isSystem: boolean };
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const autoRules = MOCK_AUTO_RULES[folder.id] || [];

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 bg-card hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground/40 cursor-grab" />
          <span className="text-lg">{folder.icon}</span>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{folder.name}</span>
              {folder.isSystem && <Lock className="h-3 w-3 text-muted-foreground/50" />}
              <span className="text-xs text-muted-foreground">{count} accounts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: folder.color }} />
          {autoRules.length > 0 && (
            <Badge variant="outline" className="text-[10px]">{autoRules.length} auto-rule{autoRules.length > 1 ? "s" : ""}</Badge>
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-5 border-t border-border">
          {/* Basic properties */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</label>
              <input defaultValue={folder.name} className="w-full rounded-md border border-border bg-secondary/50 py-1.5 px-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Icon</label>
              <input defaultValue={folder.icon} className="w-full rounded-md border border-border bg-secondary/50 py-1.5 px-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Color</label>
              <div className="flex items-center gap-2">
                <input type="color" defaultValue={folder.color} className="h-8 w-8 rounded border border-border cursor-pointer" />
                <input defaultValue={folder.color} className="flex-1 rounded-md border border-border bg-secondary/50 py-1.5 px-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>
          </div>

          {/* Auto-assignment rules */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Auto-Assignment Rules</p>
            <p className="text-[10px] text-muted-foreground">Accounts matching ANY of these rules will automatically move into this folder.</p>

            {autoRules.length > 0 ? (
              <div className="space-y-1.5">
                {autoRules.map((rule, i) => (
                  <div key={rule.id} className="flex items-center gap-2 text-xs bg-secondary/30 rounded-md px-3 py-2 flex-wrap">
                    {i > 0 && <span className="text-primary font-mono text-[10px]">OR</span>}
                    <span className="text-muted-foreground">When</span>
                    <select defaultValue={rule.tagRule} className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="any">Any detection tag</option>
                      <option value="any_new_type">Any NEW tag type</option>
                      <option value="copy_trading">Copy Trading</option>
                      <option value="reverse_hedging">Reverse Hedging</option>
                      <option value="ip_sharing">IP Sharing</option>
                      <option value="device_anomaly">Device Anomaly</option>
                    </select>
                    <span className="text-muted-foreground">with severity ≥</span>
                    <select defaultValue={rule.minSeverity} className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span className="text-muted-foreground">on account in</span>
                    <select defaultValue={rule.sourceFolder} className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                      <option value="any">Any folder</option>
                      <option value="new">New</option>
                      <option value="cleared">Cleared</option>
                      <option value="warned">Warned</option>
                    </select>
                    <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No auto-assignment rules. Accounts must be moved here manually.</p>
            )}
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
              <Plus className="h-3 w-3" /> Add Auto-Rule
            </Button>
          </div>

          {/* Allowed transitions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Allowed Transitions</p>
            <p className="text-[10px] text-muted-foreground">Which folders can accounts move TO from this folder?</p>
            <div className="flex flex-wrap gap-2">
              {[...SYSTEM_FOLDERS, ...MOCK_CUSTOM_FOLDERS].filter(f => f.id !== folder.id).map(f => (
                <label key={f.id} className="flex items-center gap-1.5 text-xs text-foreground bg-secondary/30 rounded-md px-2.5 py-1.5 cursor-pointer hover:bg-secondary/50">
                  <input type="checkbox" defaultChecked className="rounded border-border" />
                  <span>{f.icon} {f.name}</span>
                </label>
              ))}
            </div>
          </div>

          {!folder.isSystem && (
            <div className="pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive hover:text-destructive">
                <Trash2 className="h-3 w-3" /> Delete Folder
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function FoldersWorkflowSection() {
  const [expandedId, setExpandedId] = useState<string | null>("suspicious");

  const allFolders = [
    ...SYSTEM_FOLDERS.map(f => ({ ...f, count: FOLDER_COUNTS[f.id] || 0 })),
    ...MOCK_CUSTOM_FOLDERS.map(f => ({ ...f, count: f.accountCount })),
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Folders & Workflow</h2>
      <p className="text-sm text-muted-foreground">
        Configure your review pipeline. Drag folders to reorder. Each folder can have auto-assignment rules
        that automatically move accounts when detection tags fire.
      </p>

      <div className="space-y-2">
        {allFolders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            count={folder.count}
            isExpanded={expandedId === folder.id}
            onToggle={() => setExpandedId(expandedId === folder.id ? null : folder.id)}
          />
        ))}
      </div>

      <Button variant="outline" size="sm" className="text-xs gap-1 w-full">
        <Plus className="h-3 w-3" /> Create Custom Folder
      </Button>

      <div className="pt-2">
        <Button onClick={() => toast.success("Folder configuration saved")} size="sm">Save Changes</Button>
      </div>
    </div>
  );
}
