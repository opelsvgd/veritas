import { 
  users, wallets, balances, investmentPlans, investments, transactions, withdrawalRequests,
  type User, type InsertUser, type Wallet, type InsertWallet, type Balance,
  type InvestmentPlan, type Investment, type InsertInvestment, type Transaction, 
  type WithdrawalRequest, type InsertWithdrawalRequest, type InsertTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User & Wallet
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWallet(userId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  
  // Balance
  getBalance(userId: number): Promise<Balance | undefined>;
  createBalance(userId: number): Promise<Balance>;
  updateBalance(userId: number, available: string, locked: string): Promise<Balance>;
  
  // Plans
  getInvestmentPlans(): Promise<InvestmentPlan[]>;
  createInvestmentPlan(plan: InvestmentPlan): Promise<InvestmentPlan>; // For seeding
  
  // Investments
  getInvestments(userId: number): Promise<(Investment & { planName: string })[]>;
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  
  // Transactions
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(tx: InsertTransaction): Promise<Transaction>;
  getAllDeposits(): Promise<Transaction[]>; // For admin
  
  // Withdrawals
  createWithdrawalRequest(req: InsertWithdrawalRequest): Promise<WithdrawalRequest>;
  getWithdrawalRequests(userId: number): Promise<WithdrawalRequest[]>;
  getPendingWithdrawals(): Promise<WithdrawalRequest[]>; // For admin
  updateWithdrawalRequest(id: number, status: string, txHash?: string): Promise<WithdrawalRequest>;
  getWithdrawalRequest(id: number): Promise<WithdrawalRequest | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getWallet(userId: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, userId));
    return wallet;
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }

  async getBalance(userId: number): Promise<Balance | undefined> {
    const [balance] = await db.select().from(balances).where(eq(balances.userId, userId));
    return balance;
  }

  async createBalance(userId: number): Promise<Balance> {
    const [balance] = await db.insert(balances).values({ userId, available: "0", locked: "0" }).returning();
    return balance;
  }

  async updateBalance(userId: number, available: string, locked: string): Promise<Balance> {
    const [balance] = await db.update(balances)
      .set({ available, locked })
      .where(eq(balances.userId, userId))
      .returning();
    return balance;
  }

  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    return await db.select().from(investmentPlans);
  }

  async createInvestmentPlan(plan: InvestmentPlan): Promise<InvestmentPlan> {
    const [newPlan] = await db.insert(investmentPlans).values(plan).returning();
    return newPlan;
  }

  async getInvestments(userId: number): Promise<(Investment & { planName: string })[]> {
    const result = await db.select({
      id: investments.id,
      userId: investments.userId,
      planId: investments.planId,
      amount: investments.amount,
      startDate: investments.startDate,
      endDate: investments.endDate,
      status: investments.status,
      planName: investmentPlans.name,
    })
    .from(investments)
    .innerJoin(investmentPlans, eq(investments.planId, investmentPlans.id))
    .where(eq(investments.userId, userId));
    
    return result;
  }

  async createInvestment(investment: InsertInvestment): Promise<Investment> {
    const [newInvestment] = await db.insert(investments).values(investment).returning();
    return newInvestment;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(tx: InsertTransaction): Promise<Transaction> {
    const [newTx] = await db.insert(transactions).values(tx).returning();
    return newTx;
  }

  async getAllDeposits(): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.type, "deposit")).orderBy(desc(transactions.createdAt));
  }

  async createWithdrawalRequest(req: InsertWithdrawalRequest): Promise<WithdrawalRequest> {
    const [request] = await db.insert(withdrawalRequests).values(req).returning();
    return request;
  }

  async getWithdrawalRequests(userId: number): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.userId, userId)).orderBy(desc(withdrawalRequests.createdAt));
  }

  async getPendingWithdrawals(): Promise<WithdrawalRequest[]> {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.status, "pending")).orderBy(desc(withdrawalRequests.createdAt));
  }

  async updateWithdrawalRequest(id: number, status: string, txHash?: string): Promise<WithdrawalRequest> {
    const [request] = await db.update(withdrawalRequests)
      .set({ status, txHash })
      .where(eq(withdrawalRequests.id, id))
      .returning();
    return request;
  }

  async getWithdrawalRequest(id: number): Promise<WithdrawalRequest | undefined> {
    const [request] = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.id, id));
    return request;
  }
}

export const storage = new DatabaseStorage();
