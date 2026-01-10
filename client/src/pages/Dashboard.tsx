import { useDashboard } from "@/hooks/use-dashboard";
import { useUser } from "@/hooks/use-auth";
import { StatsCard } from "@/components/StatsCard";
import { Wallet, TrendingUp, History, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user } = useUser();
  const { data, isLoading } = useDashboard();

  // Mock chart data - generate from transactions in real app
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex gap-4">
          <Skeleton className="h-32 w-full rounded-2xl bg-card" />
          <Skeleton className="h-32 w-full rounded-2xl bg-card" />
          <Skeleton className="h-32 w-full rounded-2xl bg-card" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl bg-card" />
      </div>
    );
  }

  const activeInvestmentsTotal = data?.activeInvestments.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-gradient-primary">
            Welcome back, {user?.username}
          </h1>
          <p className="text-muted-foreground mt-1">Here's your portfolio overview for today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-4 py-2 rounded-full border border-border/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          System Status: Operational
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <StatsCard 
            title="Available Balance" 
            value={`$${data?.balance.available || "0.00"}`} 
            icon={Wallet} 
            trend="+12.5%" 
            trendUp={true}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard 
            title="Total Invested" 
            value={`$${activeInvestmentsTotal.toFixed(2)}`} 
            icon={TrendingUp} 
          />
        </motion.div>
        <motion.div variants={item}>
          <StatsCard 
            title="Locked Balance" 
            value={`$${data?.balance.locked || "0.00"}`} 
            icon={History} 
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Chart & Active Investments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart Section */}
          <motion.div variants={item} className="glass-card rounded-2xl p-6 border-border/50">
            <h3 className="text-lg font-bold font-display mb-6">Portfolio Growth</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#f3f4f6' }}
                    itemStyle={{ color: '#10b981' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Active Investments List */}
          <motion.div variants={item} className="glass-card rounded-2xl p-6 border-border/50">
            <h3 className="text-lg font-bold font-display mb-4">Active Investments</h3>
            {!data?.activeInvestments.length ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                No active investments found.
              </div>
            ) : (
              <div className="space-y-4">
                {data.activeInvestments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{inv.planName}</h4>
                        <p className="text-xs text-muted-foreground">Started {format(new Date(inv.startDate || new Date()), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${inv.amount}</p>
                      <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Recent Transactions */}
        <motion.div variants={item} className="glass-card rounded-2xl p-6 h-fit border-border/50">
          <h3 className="text-lg font-bold font-display mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {!data?.recentTransactions.length ? (
               <div className="text-center py-8 text-muted-foreground">No transactions yet.</div>
            ) : (
              data.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      tx.type === 'deposit' ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(tx.createdAt || new Date()), 'MMM d, HH:mm')}</p>
                    </div>
                  </div>
                  <span className={cn(
                    "font-medium text-sm",
                    tx.type === 'deposit' ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {tx.type === 'deposit' ? '+' : '-'}${tx.amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
