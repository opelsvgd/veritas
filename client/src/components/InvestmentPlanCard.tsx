import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import { type InvestmentPlan } from "@shared/schema";

interface Props {
  plan: InvestmentPlan;
  onInvest: (plan: InvestmentPlan) => void;
  isLoading?: boolean;
}

export function InvestmentPlanCard({ plan, onInvest, isLoading }: Props) {
  return (
    <Card className="glass-card overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            {plan.durationDays} Days Lock
          </Badge>
          <span className="text-2xl font-bold text-primary font-display">{plan.roiPercentage}% ROI</span>
        </div>
        <h3 className="text-xl font-bold mt-2 font-display">{plan.name}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span>Min. Investment: ${plan.minAmount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>Duration: {plan.durationDays} Days</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Principal Returned</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20" 
          onClick={() => onInvest(plan)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Invest Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}
