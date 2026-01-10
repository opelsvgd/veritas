import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Dashboard from "@/pages/Dashboard";
import Invest from "@/pages/Invest";
import Withdrawals from "@/pages/Withdrawals";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/Navigation";
import { ConnectWallet } from "@/components/ConnectWallet";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect logic handled in AuthPage component for smooth transition
    return <AuthPage />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <div className="flex-1 md:ml-64 relative">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-border bg-background/80 backdrop-blur-md px-8">
           <ConnectWallet />
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/">
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </Route>
      <Route path="/invest">
        <MainLayout>
          <Invest />
        </MainLayout>
      </Route>
      <Route path="/withdraw">
        <MainLayout>
          <Withdrawals />
        </MainLayout>
      </Route>
      <Route path="/admin">
        <MainLayout>
          <Admin />
        </MainLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
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
