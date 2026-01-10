import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConnect = () => {
    // Mock wallet connection for demo
    // In production, integrate Wagmi/Viem here
    setTimeout(() => {
      const mockAddr = "0x71C...9A21";
      setAddress(mockAddr);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockAddr}`,
      });
    }, 500);
  };

  return (
    <Button 
      variant={address ? "outline" : "default"} 
      onClick={handleConnect}
      className={address ? "border-primary/50 text-primary bg-primary/5" : ""}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {address ? address : "Connect Wallet"}
    </Button>
  );
}
