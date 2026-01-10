import { useWithdrawals, useCreateWithdrawal } from "@/hooks/use-withdrawals";
import { useDashboard } from "@/hooks/use-dashboard";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Wallet, History, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Withdrawals() {
  const { data: withdrawals, isLoading } = useWithdrawals();
  const { data: dashboard } = useDashboard();
  const createWithdrawal = useCreateWithdrawal();
  const { toast } = useToast();

  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !address) return;

    if (Number(amount) > Number(dashboard?.balance.available || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You requested more than your available balance.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createWithdrawal.mutateAsync({
        amount,
        toAddress: address,
        userId: 1, // handled by backend
      });
      toast({
        title: "Request Submitted",
        description: "Your withdrawal request is pending approval.",
      });
      setAmount("");
      setAddress("");
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to submit request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display text-gradient-primary">Wallet & Withdrawals</h1>
        <p className="text-muted-foreground mt-2">Manage your funds and request payouts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                New Withdrawal
              </CardTitle>
              <CardDescription>
                Available Balance: <span className="text-primary font-bold">${dashboard?.balance.available || "0.00"}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Amount (USD)</Label>
                  <Input 
                    placeholder="0.00" 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wallet Address (ERC20/TRC20)</Label>
                  <Input 
                    placeholder="0x..." 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex gap-2 text-sm text-primary/80">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>Withdrawals are processed manually within 24 hours for security reasons.</p>
                </div>
                <Button type="submit" className="w-full" disabled={createWithdrawal.isPending}>
                  {createWithdrawal.isPending ? "Submitting..." : "Request Withdrawal"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* History Table */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-12 bg-muted/50 rounded-lg animate-pulse" />)}
                </div>
              ) : !withdrawals?.length ? (
                <div className="text-center py-8 text-muted-foreground">No withdrawal history.</div>
              ) : (
                <div className="space-y-4">
                  {withdrawals.map((w) => (
                    <div key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div>
                        <p className="font-bold">${w.amount}</p>
                        <p className="text-xs text-muted-foreground truncate w-32">{w.toAddress}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={w.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                          {w.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(w.createdAt || new Date()), 'MMM d')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
