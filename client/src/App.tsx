import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import Dashboard from "@/pages/Dashboard";
import AuthPage from "@/pages/AuthPage";
import Invest from "@/pages/Invest";
import Withdrawals from "@/pages/Withdrawals";
import Admin from "@/pages/Admin";
import { Navigation } from "@/components/Navigation";

function Router() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/me"],
  });

  if (isLoading) return null;

  if (!user) {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={AuthPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/invest" component={Invest} />
          <Route path="/withdrawals" component={Withdrawals} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
