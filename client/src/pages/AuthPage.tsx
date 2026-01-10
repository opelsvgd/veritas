import { useUser } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <Card className="w-full max-w-md mx-4 glass-card z-10 border-white/10">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold font-display tracking-tight text-white">CryptoVest</CardTitle>
            <CardDescription className="text-lg mt-2">Premium Asset Management</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            className="w-full h-12 text-lg bg-white text-black hover:bg-gray-100 font-bold"
            onClick={() => window.location.href = "/login"}
          >
            Login
          </Button>
          <Button 
            variant="outline" 
            className="w-full h-12 text-lg border-white/20 hover:bg-white/5"
            onClick={() => window.location.href = "/register"}
          >
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
