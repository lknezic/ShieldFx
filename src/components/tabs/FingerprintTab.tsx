import { Account } from "@/types/account";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";

interface FingerprintTabProps {
  account: Account;
}

export function FingerprintTab({ account }: FingerprintTabProps) {
  const sharedIPs = account.ipAddresses.filter((ip) => ip.status === "SHARED").length;
  const sharedDevices = account.devices.filter((d) => d.sharedAccounts && d.sharedAccounts > 0).length;

  return (
    <div className="space-y-4">
      {/* IP Addresses */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30">
          <h3 className="text-sm font-semibold text-foreground">IP Addresses Used</h3>
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Total IP Addresses:</span>
              <span className="text-sm font-bold text-foreground">{account.ipAddresses.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Shared with Others:</span>
              <span className="text-sm font-bold text-foreground">{sharedIPs}</span>
            </div>
          </div>
          <div className="space-y-2">
            {account.ipAddresses.map((ip) => (
              <div key={ip.ip} className="p-3 rounded-lg bg-secondary/20 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono font-medium text-foreground">{ip.ip}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{ip.activities} ACTIVITIES</span>
                    {ip.sharedCount > 0 && (
                      <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">
                        ⚠ {ip.sharedCount} SHARED
                      </Badge>
                    )}
                    <Badge className={cn(
                      "text-[10px]",
                      ip.status === "CLEAN" ? "bg-success/20 text-success border-success/30" : "bg-warning/20 text-warning border-warning/30"
                    )}>
                      {ip.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Location</p>
                    <p className="text-xs text-foreground">{ip.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Start</p>
                    <p className="text-xs text-foreground">{ip.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">End</p>
                    <p className="text-xs text-foreground">{ip.endDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-secondary/30">
          <h3 className="text-sm font-semibold text-foreground">Devices Used</h3>
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Total Devices:</span>
              <span className="text-sm font-bold text-foreground">{account.devices.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Shared with Others:</span>
              <span className="text-sm font-bold text-foreground">{sharedDevices}</span>
            </div>
          </div>
          <div className="space-y-2">
            {account.devices.map((device) => (
              <div key={device.id} className="p-3 rounded-lg bg-secondary/20 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px] gap-1">
                    {device.type === "DESKTOP" ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
                    {device.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">{device.type.toLowerCase()}</span>
                </div>
                <p className="text-xs font-mono text-foreground mb-2">{device.label}</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Operating System</p>
                    <p className="text-xs text-foreground">{device.os}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">Start</p>
                    <p className="text-xs text-foreground">{device.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-muted-foreground">End</p>
                    <p className="text-xs text-foreground">{device.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{device.activities} ACTIVITIES</span>
                  {device.sharedAccounts && device.sharedAccounts > 0 && (
                    <Badge className="bg-warning/20 text-warning border-warning/30 text-[10px]">
                      ⚠ {device.sharedAccounts} ACCOUNT
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
