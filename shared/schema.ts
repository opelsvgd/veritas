import { pgTable, text, serial, integer, boolean, timestamp, numeric, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // Will map to Replit Auth username
  role: text("role").default("user").notNull(), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  address: text("address").notNull(),
  chainId: integer("chain_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const balances = pgTable("balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  available: numeric("available").default("0").notNull(),
  locked: numeric("locked").default("0").notNull(),
});

export const investmentPlans = pgTable("investment_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roiPercentage: numeric("roi_percentage").notNull(),
  durationDays: integer("duration_days").notNull(),
  minAmount: numeric("min_amount").default("0"),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  amount: numeric("amount").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: text("status").default("active").notNull(), // 'active', 'completed'
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  txHash: text("tx_hash"), // Can be null for internal transfers
  type: text("type").notNull(), // 'deposit', 'withdrawal', 'investment', 'payout'
  amount: numeric("amount").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'success', 'failed'
  chainId: integer("chain_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: numeric("amount").notNull(),
  toAddress: text("to_address").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'approved', 'rejected', 'completed'
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Session table for connect-pg-simple
export const sessions = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [users.id],
    references: [wallets.userId],
  }),
  balance: one(balances, {
    fields: [users.id],
    references: [balances.userId],
  }),
  investments: many(investments),
  transactions: many(transactions),
  withdrawalRequests: many(withdrawalRequests),
}));

export const investmentsRelations = relations(investments, ({ one }) => ({
  user: one(users, {
    fields: [investments.userId],
    references: [users.id],
  }),
  plan: one(investmentPlans, {
    fields: [investments.planId],
    references: [investmentPlans.id],
  }),
}));

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
}).omit({ id: true, createdAt: true });
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, createdAt: true });
export const insertBalanceSchema = createInsertSchema(balances).omit({ id: true });
export const insertInvestmentPlanSchema = createInsertSchema(investmentPlans).omit({ id: true });
export const insertInvestmentSchema = createInsertSchema(investments).omit({ id: true, startDate: true, endDate: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests).omit({ id: true, txHash: true, createdAt: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Balance = typeof balances.$inferSelect;
export type InvestmentPlan = typeof investmentPlans.$inferSelect;
export type Investment = typeof investments.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type InsertWithdrawalRequest = z.infer<typeof insertWithdrawalRequestSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
