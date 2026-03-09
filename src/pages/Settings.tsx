import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { cn } from "@/lib/utils";
import { Building2, Shield, FolderCog, AlertTriangle, Mail, Users, Plug, CreditCard, ArrowLeft } from "lucide-react";
import { CompanyProfileSection } from "@/components/settings/CompanyProfileSection";
import { DetectionRulesSection } from "@/components/settings/DetectionRulesSection";
import { FoldersWorkflowSection } from "@/components/settings/FoldersWorkflowSection";
import { WarningPolicySection } from "@/components/settings/WarningPolicySection";
import { EmailTemplatesSection } from "@/components/settings/EmailTemplatesSection";
import { MembersSection } from "@/components/settings/MembersSection";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { id: "company", label: "Company Profile", icon: Building2, description: "Name, timezone, branding" },
  { id: "detection", label: "Detection Rules", icon: Shield, description: "Configure cheating detection" },
  { id: "folders", label: "Folders & Workflow", icon: FolderCog, description: "Pipeline stages & auto-rules" },
  { id: "warnings", label: "Warning & Suspension", icon: AlertTriangle, description: "Thresholds & re-trigger" },
  { id: "emails", label: "Email Templates & ToS", icon: Mail, description: "Templates, ToS mapping" },
  { id: "members", label: "Members & Roles", icon: Users, description: "Team access & permissions" },
  { id: "integrations", label: "Integrations", icon: Plug, description: "Trading platforms, email" },
  { id: "billing", label: "Billing", icon: CreditCard, description: "Plan & invoices" },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("company");
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeSection) {
      case "company": return <CompanyProfileSection />;
      case "detection": return <DetectionRulesSection />;
      case "folders": return <FoldersWorkflowSection />;
      case "warnings": return <WarningPolicySection />;
      case "emails": return <EmailTemplatesSection />;
      case "members": return <MembersSection />;
      case "integrations": return <PlaceholderSection title="Integrations" description="Connect trading platforms, email providers, and other tools." />;
      case "billing": return <PlaceholderSection title="Billing" description="Manage your subscription, view invoices, and update payment methods." />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        {/* Settings sidebar */}
        <div className="w-[280px] min-w-[260px] flex-shrink-0 overflow-y-auto scrollbar-thin border-r border-border">
          <div className="p-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">ShieldFX</h2>
                <p className="text-[10px] text-muted-foreground">Company Settings</p>
              </div>
            </div>

            <nav className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-start gap-2.5 px-3 py-2.5 rounded-md text-left transition-colors",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium">{item.label}</p>
                    <p className="text-[10px] opacity-60">{item.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

function PlaceholderSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="rounded-lg border border-border bg-secondary/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">Coming in Phase 3</p>
      </div>
    </div>
  );
}

export default Settings;
