import { usePendingWithdrawals, useApproveWithdrawal } from "@/hooks/use-withdrawals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Check } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Admin() {
  const { data: pending, isLoading } = usePendingWithdrawals();
  const approve = useApproveWithdrawal();
  const { toast } = useToast();
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [txHash, setTxHash] = useState("");

  const handleApprove = async () => {
    if (!selectedId || !txHash) return;
    try {
      await approve.mutateAsync({ id: selectedId, txHash });
      toast({ title: "Withdrawal Approved", description: "Status updated to completed." });
      setSelectedId(null);
      setTxHash("");
    } catch (error) {
      toast({ title: "Error", variant: "destructive", description: "Failed to approve withdrawal." });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-xl">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient-primary">Admin Console</h1>
          <p className="text-muted-foreground">Manage withdrawals and platform settings.</p>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Pending Withdrawals ({pending?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
               {[1,2].map(i => <div key={i} className="h-16 bg-muted/50 rounded animate-pulse" />)}
            </div>
          ) : !pending?.length ? (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
              No pending requests.
            </div>
          ) : (
            <div className="space-y-4">
              {pending.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/50">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">${item.amount}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 capitalize">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p>To: {item.toAddress}</p>
                      <p>Requested: {format(new Date(item.createdAt || new Date()), 'PP p')}</p>
                    </div>
                  </div>
                  <Button onClick={() => setSelectedId(item.id)} size="sm" className="gap-2">
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Transaction Hash (TXID)</Label>
              <Input 
                placeholder="0x..." 
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Enter the blockchain transaction hash as proof of payment.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleApprove} disabled={approve.isPending}>
              {approve.isPending ? "Approving..." : "Confirm & Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
