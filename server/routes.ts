import type { Express } from "express";
import type { Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (Replit Auth)
  await setupAuth(app);

  // === SEED DATA ===
  // Seed investment plans if they don't exist
  const existingPlans = await storage.getInvestmentPlans();
  if (existingPlans.length === 0) {
    await storage.createInvestmentPlan({
      name: "Conservative Starter",
      roiPercentage: "5",
      durationDays: 30,
      minAmount: "100"
    } as any);
    await storage.createInvestmentPlan({
      name: "Balanced Growth",
      roiPercentage: "12",
      durationDays: 90,
      minAmount: "500"
    } as any);
    await storage.createInvestmentPlan({
      name: "Aggressive Yield",
      roiPercentage: "25",
      durationDays: 180,
      minAmount: "1000"
    } as any);
    console.log("Seeded investment plans");
  }

  // === MIDDLEWARE ===
  const requireAuth = (req: any, res: any, next: any) => {
    console.log(`Auth check: sessionID=${req.sessionID}, authenticated=${req.isAuthenticated()}, user=${req.user?.id}`);
    if (!req.isAuthenticated()) {
      console.log(`Auth failed: no authenticated user`);
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log(`Auth passed for user ${req.user.id}`);
    next();
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };

  // === ROUTES ===

  // Me
  app.get(api.me.path, requireAuth, (req, res) => {
    res.json(req.user);
  });

  // Dashboard
  app.get(api.dashboard.path, requireAuth, async (req, res) => {
    const userId = req.user!.id;
    
    // Ensure balance exists
    let balance = await storage.getBalance(userId);
    if (!balance) {
      balance = await storage.createBalance(userId);
    }

    const activeInvestments = await storage.getInvestments(userId);
    const recentTransactions = await storage.getTransactions(userId);

    res.json({
      balance,
      activeInvestments,
      recentTransactions
    });
  });

  // Plans
  app.get(api.plans.list.path, async (req, res) => {
    const plans = await storage.getInvestmentPlans();
    res.json(plans);
  });

  // Investments
  app.post(api.investments.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.investments.create.input.parse(req.body);
      const userId = req.user!.id;
      
      const balance = await storage.getBalance(userId);
      if (!balance || Number(balance.available) < Number(input.amount)) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Deduct from available, add to locked (simplified logic, ideally atomic)
      const newAvailable = (Number(balance.available) - Number(input.amount)).toString();
      const newLocked = (Number(balance.locked) + Number(input.amount)).toString();
      
      await storage.updateBalance(userId, newAvailable, newLocked);

      const investment = await storage.createInvestment({
        ...input,
        userId,
      });

      // Record transaction
      await storage.createTransaction({
        userId,
        type: "investment",
        amount: input.amount,
        chainId: 1 // Default chain
      });

      res.status(201).json(investment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Withdrawals
  app.post(api.withdrawals.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.withdrawals.create.input.parse(req.body);
      const userId = req.user!.id;

      const balance = await storage.getBalance(userId);
      if (!balance || Number(balance.available) < Number(input.amount)) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Deduct from available (move to locked/pending state essentially)
      // For now, we just deduct from available. If rejected, we'd refund.
      const newAvailable = (Number(balance.available) - Number(input.amount)).toString();
      await storage.updateBalance(userId, newAvailable, balance.locked);

      const withdrawal = await storage.createWithdrawalRequest({
        ...input,
        userId,
      });

       // Record transaction
      await storage.createTransaction({
        userId,
        type: "withdrawal_request",
        amount: input.amount,
        chainId: 1 
      });

      res.status(201).json(withdrawal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.withdrawals.list.path, requireAuth, async (req, res) => {
    const requests = await storage.getWithdrawalRequests(req.user!.id);
    res.json(requests);
  });

  // Admin
  app.get(api.admin.deposits.path, requireAdmin, async (req, res) => {
    const deposits = await storage.getAllDeposits();
    res.json(deposits);
  });

  app.get(api.admin.withdrawals.pending.path, requireAdmin, async (req, res) => {
    const withdrawals = await storage.getPendingWithdrawals();
    res.json(withdrawals);
  });

  app.post(api.admin.withdrawals.approve.path, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { txHash } = req.body;
      
      const withdrawal = await storage.getWithdrawalRequest(id);
      if (!withdrawal) return res.status(404).json({ message: "Not found" });

      const updated = await storage.updateWithdrawalRequest(id, "completed", txHash);
      
      // Also update the transaction log if needed
      
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Internal Error" });
    }
  });

  return httpServer;
}
