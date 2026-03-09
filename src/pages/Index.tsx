import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { AccountsSidebar } from "@/components/AccountsSidebar";
import { AccountDetails } from "@/components/AccountDetails";
import { mockAccounts } from "@/data/mockData";
import { Account } from "@/types/account";

const Index = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(mockAccounts[0]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        {/* Left panel */}
        <div className="w-[460px] min-w-[400px] flex-shrink-0 overflow-y-auto scrollbar-thin border-r border-border">
          <AccountsSidebar
            accounts={mockAccounts}
            selectedAccount={selectedAccount}
            onSelectAccount={setSelectedAccount}
          />
        </div>

        {/* Right panel */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {selectedAccount ? (
            <AccountDetails account={selectedAccount} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select an account to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
