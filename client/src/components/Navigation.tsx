import { Link, useLocation } from "wouter";
import { LayoutDashboard, TrendingUp, Wallet, Settings, LogOut, ShieldCheck, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, logout } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAdmin } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/invest", label: "Investments", icon: TrendingUp },
    { href: "/withdraw", label: "Withdrawals", icon: Wallet },
    ...(isAdmin ? [{ href: "/admin", label: "Admin Panel", icon: ShieldCheck }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/auth";
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full space-y-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-bold tracking-tight text-primary font-display flex items-center gap-2">
          <TrendingUp className="h-6 w-6" />
          CryptoVest
        </h2>
        <p className="px-4 text-xs text-muted-foreground mb-6">
          Premium Custodial Assets
        </p>
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive ? "bg-secondary text-primary font-medium" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t border-border/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.username}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-muted-foreground border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/30 backdrop-blur-xl h-screen fixed left-0 top-0 z-40">
        <NavContent />
      </aside>

      {/* Mobile Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-md px-4 flex items-center justify-between">
         <span className="font-bold font-display text-lg text-primary flex items-center gap-2">
           <TrendingUp className="h-5 w-5" /> CryptoVest
         </span>
         <Sheet open={isOpen} onOpenChange={setIsOpen}>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon">
               <Menu className="h-5 w-5" />
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="w-72 p-0 bg-background border-r border-border">
             <NavContent />
           </SheetContent>
         </Sheet>
      </div>
    </>
  );
}
