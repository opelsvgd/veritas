import { useUser } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"choice" | "login" | "register">("choice");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/login", data);
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/me"], user);
      window.location.href = "/";
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loginForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  if (userLoading) return null;

  if (mode === "choice") {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
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
              onClick={() => setMode("login")}
            >
              Login
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-lg border-white/20 hover:bg-white/5"
              onClick={() => setMode("register")}
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLogin = mode === "login";
  const form = isLogin ? loginForm : registerForm;
  const mutation = isLogin ? loginMutation : registerMutation;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <Card className="w-full max-w-md mx-4 glass-card z-10 border-white/10">
        <CardHeader className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit p-0 hover:bg-transparent text-muted-foreground hover:text-white"
            onClick={() => setMode("choice")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin ? "Enter your credentials to access your account" : "Join the premium asset management platform"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Username</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/5 border-white/10 text-white" 
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password" 
                        className="bg-white/5 border-white/10 text-white" 
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-bold mt-2" 
                disabled={mutation.isPending}
              >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
