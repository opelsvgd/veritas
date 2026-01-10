import { usePlans, useCreateInvestment } from "@/hooks/use-investments";
import { useDashboard } from "@/hooks/use-dashboard";
import { InvestmentPlanCard } from "@/components/InvestmentPlanCard";
import { type InvestmentPlan } from "@shared/schema";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Invest() {
  const { data: plans, isLoading } = usePlans();
  const { data: dashboard } = useDashboard();
  const createInvestment = useCreateInvestment();
  const { toast } = useToast();
  
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState("");

  const handleInvest = async () => {
    if (!selectedPlan || !amount) return;

    if (Number(amount) > Number(dashboard?.balance.available || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You do not have enough funds for this investment.",
        variant: "destructive",
      });
      return;
    }

    if (Number(amount) < Number(selectedPlan.minAmount)) {
      toast({
        title: "Amount Too Low",
        description: `Minimum investment is $${selectedPlan.minAmount}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await createInvestment.mutateAsync({
        planId: selectedPlan.id,
        amount: amount,
        userId: 1, // Replaced by backend auth context
      });
      toast({
        title: "Investment Successful",
        description: `Successfully invested $${amount} in ${selectedPlan.name}`,
      });
      setSelectedPlan(null);
      setAmount("");
    } catch (error) {
      toast({
        title: "Investment Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient-primary">Investment Plans</h1>
          <p className="text-muted-foreground mt-2">Choose a plan that suits your financial goals.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 rounded-2xl bg-card animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <InvestmentPlanCard 
                plan={plan} 
                onInvest={setSelectedPlan} 
              />
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invest in {selectedPlan?.name}</DialogTitle>
            <DialogDescription>
              Enter the amount you wish to invest. 
              Available: ${dashboard?.balance.available || "0.00"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                placeholder={`Min ${selectedPlan?.minAmount}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI Rate</span>
                <span className="font-bold text-primary">{selectedPlan?.roiPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration</span>
                <span>{selectedPlan?.durationDays} Days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border/50">
                <span className="text-muted-foreground">Est. Returns</span>
                <span className="font-bold text-emerald-400">
                  ${amount ? (Number(amount) * (1 + Number(selectedPlan?.roiPercentage)/100)).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInvest} disabled={createInvestment.isPending} className="w-full">
              {createInvestment.isPending ? "Confirming..." : "Confirm Investment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
