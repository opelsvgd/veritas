import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  ShieldCheck, 
  Wallet, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Layers,
  BarChart3,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-bold tracking-tight">PLATFORM</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="#plans" className="text-sm font-medium hover:text-primary transition-colors">Plans</Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Success Stories</Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
          <div className="container px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium mb-6 bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Licensed & Institutional Grade
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Secure Crypto Investing <br className="hidden md:block" /> for the Future
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground text-lg md:text-xl mb-10">
                A licensed custodial platform supporting real blockchain transactions. 
                Grow your wealth with manual withdrawal security and institutional-grade yields.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth">
                  <Button size="lg" className="min-w-[200px] h-12 bg-emerald-600 hover:bg-emerald-700 text-lg">
                    Start Investing <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" size="lg" className="min-w-[200px] h-12 text-lg">
                    View Plans
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Unrivaled Security. Professional Performance.</h2>
              <p className="text-muted-foreground max-w-[600px] mx-auto">
                We combine the best of custodial safety with real-time blockchain visibility.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Real-time Audits",
                  description: "All transactions are recorded on-chain, ensuring complete transparency of fund movements.",
                  icon: BarChart3,
                },
                {
                  title: "Manual Withdrawal Security",
                  description: "Every withdrawal is manually verified and signed by our experts for maximum protection.",
                  icon: Lock,
                },
                {
                  title: "High-Yield Plans",
                  description: "Optimized investment strategies designed to provide consistent returns in all market conditions.",
                  icon: TrendingUp,
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="hover-elevate bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <feature.icon className="h-10 w-10 text-emerald-500 mb-2" />
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Success Stories</h2>
              <p className="text-muted-foreground">Hear from our institutional and individual investors.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Portfolio Manager",
                  quote: "The manual withdrawal security is what sold me. In this market, safety is paramount, and this platform delivers.",
                  rating: 5
                },
                {
                  name: "Marcus Thorne",
                  role: "Tech Entrepreneur",
                  quote: "Consistently seeing 12% ROI on the Balanced Growth plan. The dashboard is intuitive and transparency is top-notch.",
                  rating: 5
                },
                {
                  name: "Elena Rodriguez",
                  role: "Private Investor",
                  quote: "Finally a platform that feels like a bank but moves like crypto. Professional, licensed, and highly reliable.",
                  rating: 5
                }
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-card/40">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="font-bold text-emerald-500">{t.name[0]}</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">{t.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex mb-2">
                        {Array(t.rating).fill(0).map((_, j) => (
                          <Star key={j} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                        ))}
                      </div>
                      <p className="text-sm italic text-muted-foreground">"{t.quote}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="max-w-[800px] mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Get in Touch</h2>
                <p className="text-muted-foreground">Have questions about our institutional crypto platform? Our support team is here to help.</p>
              </div>
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <form className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="your@email.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="How can we help?" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <textarea className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Your message..." />
                    </div>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-11">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-emerald-600 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your future?</h2>
            <p className="text-emerald-100 mb-10 max-w-[600px] mx-auto text-lg">
              Join thousands of investors who trust our platform for secure, high-yield crypto investments.
            </p>
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="min-w-[200px] h-12 text-lg">
                Create Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo" className="h-6 w-6" />
              <span className="font-bold">PLATFORM</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[300px]">
              Licensed custodial investment platform. Registered and regulated.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#plans">Plans</Link></li>
              <li><Link href="/auth">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Risk Disclosure</li>
            </ul>
          </div>
        </div>
        <div className="container px-4 mt-12 pt-8 border-t text-center text-xs text-muted-foreground">
          © 2026 Crypto Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Router() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/me"],
  });

  if (isLoading) return null;

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      {/* Fallback to 404 */}
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
