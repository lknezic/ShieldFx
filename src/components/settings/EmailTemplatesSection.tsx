import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Upload, Plus, Trash2, ChevronDown, Eye } from "lucide-react";
import { toast } from "sonner";

const TOS_MAPPINGS = [
  { id: "m1", violationType: "Copy Trading", section: "Section 4.2", title: "Prohibited Trading Practices", keyLanguage: "prohibits copy trading, trade mirroring, or any form of coordinated trading across accounts" },
  { id: "m2", violationType: "Reverse Hedging", section: "Section 4.3", title: "Prohibited Hedging Strategies", keyLanguage: "opposing positions across linked accounts within narrow time windows" },
  { id: "m3", violationType: "Shared IP Address", section: "Section 3.1", title: "Account Security", keyLanguage: "sharing account access or trading from shared infrastructure with other traders" },
  { id: "m4", violationType: "Device Anomaly", section: "Section 3.1", title: "Account Security", keyLanguage: "maintaining exclusive access to trading accounts and devices" },
];

const TEMPLATE_VARS = [
  "{trader_name}", "{account_id}", "{violation_type}", "{violation_details}",
  "{warning_number}", "{prior_warnings}", "{connected_history}", "{tos_reference}",
  "{required_actions}", "{consequences}", "{appeal_process}", "{response_deadline}",
  "{company_name}", "{sender_name}",
];

export function EmailTemplatesSection() {
  const [activeSubTab, setActiveSubTab] = useState<"sender" | "tos" | "privacy" | "templates">("sender");

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Email Templates & Legal Documents</h2>
      <p className="text-sm text-muted-foreground">
        Configure email sender info, upload Terms of Service, map violations to ToS sections, and customize email templates.
      </p>

      {/* Sub-tabs */}
      <div className="flex border-b border-border">
        {[
          { id: "sender", label: "Sender Config" },
          { id: "tos", label: "Terms of Service" },
          { id: "privacy", label: "Privacy Policy" },
          { id: "templates", label: "Templates" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={cn("px-4 py-2 text-xs font-medium border-b-2 transition-colors",
              activeSubTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "sender" && (
        <div className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Sender Name</label>
              <input defaultValue="TradeXMastery Compliance" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground" />
              <p className="text-[10px] text-muted-foreground">Shown in the email "From" field</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Reply-To Email</label>
              <input defaultValue="compliance@tradexmastery.com" className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground" />
              <p className="text-[10px] text-muted-foreground">Where trader responses go</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email Footer</label>
            <textarea defaultValue="TradeXMastery Ltd. | compliance@tradexmastery.com | This is an automated message from our risk management system." rows={3}
              className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground resize-none" />
            <p className="text-[10px] text-muted-foreground">Appended to all warning and suspension emails</p>
          </div>
          <div className="pt-2">
            <Button onClick={() => toast.success("Sender config saved")} size="sm">Save</Button>
          </div>
        </div>
      )}

      {activeSubTab === "tos" && (
        <div className="space-y-6">
          {/* Upload */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Upload Terms of Service</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drop PDF here or click to upload</p>
              <p className="text-[10px] text-muted-foreground mt-1">The system will store this document. You manually map sections below.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-foreground font-medium">Uploaded: TradeXMastery_ToS_v3.pdf</span>
              <span>Last updated: Feb 15, 2026</span>
            </div>
          </div>

          {/* Mapping table */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Section Mapping</h3>
            <p className="text-xs text-muted-foreground">
              Map each violation type to the relevant ToS section. The email template engine uses this to generate
              accurate legal references: "This violates Section 4.2 — Prohibited Trading Practices."
            </p>

            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-[140px_100px_180px_1fr_40px] gap-2 px-3 py-2 bg-secondary/30 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span>Violation Type</span>
                <span>Section</span>
                <span>Section Title</span>
                <span>Key Language (used in emails)</span>
                <span></span>
              </div>
              {TOS_MAPPINGS.map(m => (
                <div key={m.id} className="grid grid-cols-[140px_100px_180px_1fr_40px] gap-2 px-3 py-2 border-t border-border items-center">
                  <span className="text-xs font-medium text-foreground">{m.violationType}</span>
                  <input defaultValue={m.section} className="text-xs bg-secondary/50 border border-border rounded px-2 py-1 text-foreground" />
                  <input defaultValue={m.title} className="text-xs bg-secondary/50 border border-border rounded px-2 py-1 text-foreground" />
                  <input defaultValue={m.keyLanguage} className="text-xs bg-secondary/50 border border-border rounded px-2 py-1 text-foreground" />
                  <button className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3 w-3" /></button>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
              <Plus className="h-3 w-3" /> Add Mapping
            </Button>
          </div>

          <div className="pt-2">
            <Button onClick={() => toast.success("ToS mapping saved")} size="sm">Save Mappings</Button>
          </div>
        </div>
      )}

      {activeSubTab === "privacy" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Upload Privacy Policy</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Drop PDF here or click to upload</p>
              <p className="text-[10px] text-muted-foreground mt-1">Used when emails need to justify monitoring activity.</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Monitoring Justification Language</label>
            <p className="text-[10px] text-muted-foreground">This paragraph is included when traders question how their activity is monitored.</p>
            <textarea
              defaultValue="As outlined in our Privacy Policy and Terms of Service, TradeXMastery employs automated monitoring systems to ensure fair trading practices across all funded accounts. This monitoring includes analysis of trade patterns, IP addresses, and device fingerprints to detect potential violations of our trading rules."
              rows={4}
              className="w-full rounded-md border border-border bg-secondary/50 py-2 px-3 text-sm text-foreground resize-none"
            />
          </div>
          <div className="border-t border-border pt-4">
            <Button onClick={() => toast.success("Privacy policy settings saved")} size="sm">Save</Button>
          </div>
        </div>
      )}

      {activeSubTab === "templates" && (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground">
            Customize email templates for each warning level. The system auto-generates context-aware content using the variables below.
            Reviewers can edit emails before sending and use "Reset to Generated" to revert.
          </p>

          {/* Available variables */}
          <div className="border border-border rounded-lg p-4 bg-secondary/20">
            <p className="text-xs font-semibold text-foreground mb-2">Available Template Variables</p>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATE_VARS.map(v => (
                <span key={v} className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded cursor-pointer hover:bg-primary/20">{v}</span>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              Variables in curly braces are replaced with account-specific data at send time.
              {"{prior_warnings}"} and {"{connected_history}"} are auto-generated blocks — they cannot be pre-edited but are computed from live data.
            </p>
          </div>

          {/* Template list */}
          {[
            { id: "warning_first", label: "First Warning", description: "No prior history. Professional, factual." },
            { id: "warning_escalated", label: "Warning #2+", description: "References prior warnings by date and violation." },
            { id: "warning_final", label: "Final Warning", description: "Explicit 'next violation = suspension' language." },
            { id: "suspension", label: "Suspension Notice", description: "Full recap of all prior warnings. Freeze and forfeiture details." },
          ].map(t => (
            <div key={t.id} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-card">
                <div>
                  <span className="text-sm font-semibold text-foreground">{t.label}</span>
                  <p className="text-[10px] text-muted-foreground">{t.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                    <Eye className="h-3 w-3" /> Preview
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs h-7">Edit Template</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
