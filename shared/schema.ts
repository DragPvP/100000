import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stakes = pgTable("stakes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  token: varchar("token", { length: 10 }).notNull(), // 'BNB' or 'USDT'
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  apy: decimal("apy", { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stakeId: varchar("stake_id").references(() => stakes.id),
  type: varchar("type", { length: 20 }).notNull(), // 'stake', 'unstake', 'reward'
  token: varchar("token", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  txHash: text("tx_hash"),
  treasuryWallet: text("treasury_wallet"), // Destination wallet for staked funds
  status: varchar("status", { length: 20 }).default("completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  stakeId: varchar("stake_id").references(() => stakes.id).notNull(),
  token: varchar("token", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
  distributedAt: timestamp("distributed_at"),
  isDistributed: boolean("is_distributed").default(false).notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  walletAddress: true,
});

export const insertStakeSchema = createInsertSchema(stakes).pick({
  userId: true,
  token: true,
  amount: true,
  apy: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  stakeId: true,
  type: true,
  token: true,
  amount: true,
  txHash: true,
  treasuryWallet: true,
  status: true,
});

export const insertRewardSchema = createInsertSchema(rewards).pick({
  userId: true,
  stakeId: true,
  token: true,
  amount: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Stake = typeof stakes.$inferSelect;
export type InsertStake = z.infer<typeof insertStakeSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
