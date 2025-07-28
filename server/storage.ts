import { 
  type User, 
  type InsertUser, 
  type Stake, 
  type InsertStake, 
  type Transaction, 
  type InsertTransaction,
  type Reward,
  type InsertReward
} from "@shared/schema";
import { randomUUID } from "crypto";

interface UserStats {
  usdtBalance: string;
  bnbBalance: string;
  usdtStaked: string;
  bnbStaked: string;
  usdtRewards: string;
  bnbRewards: string;
  totalStakedValue: string;
  totalRewards: string;
  stakingDays: number;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserStats(userId: string): Promise<UserStats>;
  
  // Stake methods
  getStake(id: string): Promise<Stake | undefined>;
  getUserStakes(userId: string): Promise<Stake[]>;
  createStake(stake: InsertStake): Promise<Stake>;
  unstakeTokens(userId: string, token: string, amount: string): Promise<Stake>;
  
  // Transaction methods
  getTransaction(id: string): Promise<Transaction | undefined>;
  getUserTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Reward methods
  getReward(id: string): Promise<Reward | undefined>;
  getUserRewards(userId: string): Promise<Reward[]>;
  createReward(reward: InsertReward): Promise<Reward>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private stakes: Map<string, Stake>;
  private transactions: Map<string, Transaction>;
  private rewards: Map<string, Reward>;

  constructor() {
    this.users = new Map();
    this.stakes = new Map();
    this.transactions = new Map();
    this.rewards = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const userStakes = await this.getUserStakes(userId);
    const userRewards = await this.getUserRewards(userId);
    
    // Calculate balances (mock data for demonstration)
    const usdtStaked = userStakes
      .filter(s => s.token === "USDT" && s.isActive)
      .reduce((sum, s) => sum + parseFloat(s.amount), 0);
    
    const bnbStaked = userStakes
      .filter(s => s.token === "BNB" && s.isActive)
      .reduce((sum, s) => sum + parseFloat(s.amount), 0);
    
    const usdtRewards = userRewards
      .filter(r => r.token === "USDT")
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);
    
    const bnbRewards = userRewards
      .filter(r => r.token === "BNB")
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    // Real balances will be fetched from blockchain on frontend
    // Backend only tracks staked amounts and rewards
    const usdtBalance = 0; // Will be fetched in real-time on frontend
    const bnbBalance = 0; // Will be fetched in real-time on frontend

    // Calculate total values (using mock prices)
    const usdtPrice = 1; // USDT is $1
    const bnbPrice = 312; // Mock BNB price
    
    const totalStakedValue = (usdtStaked * usdtPrice) + (bnbStaked * bnbPrice);
    const totalRewards = (usdtRewards * usdtPrice) + (bnbRewards * bnbPrice);

    // Calculate staking days (using first stake date)
    const firstStake = userStakes.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )[0];
    
    const stakingDays = firstStake ? 
      Math.floor((Date.now() - new Date(firstStake.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return {
      usdtBalance: usdtBalance.toFixed(2),
      bnbBalance: bnbBalance.toFixed(4),
      usdtStaked: usdtStaked.toFixed(2),
      bnbStaked: bnbStaked.toFixed(4),
      usdtRewards: usdtRewards.toFixed(2),
      bnbRewards: bnbRewards.toFixed(6),
      totalStakedValue: totalStakedValue.toFixed(2),
      totalRewards: totalRewards.toFixed(2),
      stakingDays,
    };
  }

  // Stake methods
  async getStake(id: string): Promise<Stake | undefined> {
    return this.stakes.get(id);
  }

  async getUserStakes(userId: string): Promise<Stake[]> {
    return Array.from(this.stakes.values()).filter(
      (stake) => stake.userId === userId
    );
  }

  async createStake(insertStake: InsertStake): Promise<Stake> {
    const id = randomUUID();
    const stake: Stake = { 
      ...insertStake, 
      id, 
      startDate: new Date(),
      endDate: null,
      isActive: true,
      createdAt: new Date()
    };
    this.stakes.set(id, stake);

    // Create initial reward calculation
    await this.createReward({
      userId: insertStake.userId,
      stakeId: id,
      token: insertStake.token,
      amount: "0.00", // Initial reward is 0
    });

    return stake;
  }

  async unstakeTokens(userId: string, token: string, amount: string): Promise<Stake> {
    const userStakes = await this.getUserStakes(userId);
    const activeStakes = userStakes.filter(s => s.token === token && s.isActive);
    
    if (activeStakes.length === 0) {
      throw new Error(`No active ${token} stakes found`);
    }

    // For simplicity, unstake from the first active stake
    const stake = activeStakes[0];
    const stakeAmount = parseFloat(stake.amount);
    const unstakeAmount = parseFloat(amount);

    if (unstakeAmount > stakeAmount) {
      throw new Error("Insufficient staked amount");
    }

    // Update stake
    if (unstakeAmount === stakeAmount) {
      // Complete unstake
      stake.isActive = false;
      stake.endDate = new Date();
    } else {
      // Partial unstake - reduce amount
      stake.amount = (stakeAmount - unstakeAmount).toString();
    }

    this.stakes.set(stake.id, stake);
    return stake;
  }

  // Transaction methods
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10); // Return last 10 transactions
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      txHash: insertTransaction.txHash || `0x${randomUUID().replace(/-/g, '')}`,
      treasuryWallet: insertTransaction.treasuryWallet || null,
      status: insertTransaction.status || "completed",
      stakeId: insertTransaction.stakeId || null,
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  // Reward methods
  async getReward(id: string): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async getUserRewards(userId: string): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(
      (reward) => reward.userId === userId
    );
  }

  async createReward(insertReward: InsertReward): Promise<Reward> {
    const id = randomUUID();
    const reward: Reward = { 
      ...insertReward, 
      id, 
      calculatedAt: new Date(),
      distributedAt: null,
      isDistributed: false,
    };
    this.rewards.set(id, reward);
    return reward;
  }
}

export const storage = new MemStorage();
