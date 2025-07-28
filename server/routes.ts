import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStakeSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

const stakeRequestSchema = z.object({
  token: z.enum(["BNB", "USDT"]),
  amount: z.string().refine((val) => parseFloat(val) > 0, "Amount must be greater than 0"),
  walletAddress: z.string().min(1, "Wallet address is required"),
});

// Treasury wallet address where staked funds are sent
const TREASURY_WALLET = "0xB361DfC10c55B6aB203D212dA155A4Cff2aA36E5";

const unstakeRequestSchema = z.object({
  token: z.enum(["BNB", "USDT"]),
  amount: z.string().refine((val) => parseFloat(val) > 0, "Amount must be greater than 0"),
  walletAddress: z.string().min(1, "Wallet address is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create or get user by wallet address
  app.post("/api/user", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      let user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        user = await storage.createUser({ walletAddress });
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user stats (balances, staked amounts, rewards)
  app.get("/api/user/stats/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userStats = await storage.getUserStats(user.id);
      res.json(userStats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user transactions
  app.get("/api/user/transactions/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const user = await storage.getUserByWalletAddress(walletAddress);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const transactions = await storage.getUserTransactions(user.id);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Stake tokens
  app.post("/api/stake", async (req, res) => {
    try {
      const validatedData = stakeRequestSchema.parse(req.body);
      const { token, amount, walletAddress } = validatedData;

      let user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        user = await storage.createUser({ walletAddress });
      }

      const apy = token === "USDT" ? "20.00" : "15.00";
      
      const stake = await storage.createStake({
        userId: user.id,
        token,
        amount,
        apy,
      });

      // Create transaction record with treasury wallet
      await storage.createTransaction({
        userId: user.id,
        stakeId: stake.id,
        type: "stake",
        token,
        amount,
        treasuryWallet: TREASURY_WALLET,
        status: "completed",
      });

      res.json({ message: "Staking successful", stake });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // Unstake tokens
  app.post("/api/unstake", async (req, res) => {
    try {
      const validatedData = unstakeRequestSchema.parse(req.body);
      const { token, amount, walletAddress } = validatedData;

      const user = await storage.getUserByWalletAddress(walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const stake = await storage.unstakeTokens(user.id, token, amount);

      // Create transaction record
      await storage.createTransaction({
        userId: user.id,
        stakeId: stake.id,
        type: "unstake",
        token,
        amount,
        treasuryWallet: TREASURY_WALLET,
        status: "completed",
      });

      res.json({ message: "Unstaking successful", stake });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
