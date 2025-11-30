// src/services/usage-service.ts
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  limit,
} from "firebase/firestore";

// USD to KSH exchange rate (approximate)
export const USD_TO_KSH_RATE = 129;

export type UsageRecord = {
  inputTokens: number;
  outputTokens: number;
  inputCostUsd: number;
  outputCostUsd: number;
  totalCostUsd: number;
  totalCostKsh: number;
  createdAt: Date;
};

export type UserUsageStats = {
  email: string;
  totalGenerations: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCostUsd: number;
  totalCostKsh: number;
  lastGenerationDate: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Sanitize email to use as Firestore document ID
function sanitizeEmail(email: string): string {
  return email.replace(/[.]/g, "_").replace(/@/g, "_at_").toLowerCase();
}

// Get user usage stats by email
export async function getUserUsageStats(email: string): Promise<UserUsageStats | null> {
  const sanitizedEmail = sanitizeEmail(email);
  const userDocRef = doc(db, "userUsage", sanitizedEmail);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    return null;
  }

  const data = userDoc.data();
  return {
    email: data.email,
    totalGenerations: data.totalGenerations || 0,
    totalInputTokens: data.totalInputTokens || 0,
    totalOutputTokens: data.totalOutputTokens || 0,
    totalCostUsd: data.totalCostUsd || 0,
    totalCostKsh: data.totalCostKsh || 0,
    lastGenerationDate: data.lastGenerationDate || "",
    createdAt: data.createdAt?.toDate?.() || undefined,
    updatedAt: data.updatedAt?.toDate?.() || undefined,
  };
}

// Record a new generation usage
export async function recordUsage(
  email: string,
  usage: {
    inputTokens: number;
    outputTokens: number;
    inputCostUsd: number;
    outputCostUsd: number;
    totalCostUsd: number;
  }
): Promise<void> {
  const sanitizedEmail = sanitizeEmail(email);
  const userDocRef = doc(db, "userUsage", sanitizedEmail);
  const userDoc = await getDoc(userDocRef);
  const today = new Date().toISOString().split("T")[0];
  const totalCostKsh = usage.totalCostUsd * USD_TO_KSH_RATE;

  if (!userDoc.exists()) {
    // Create new user usage document
    await setDoc(userDocRef, {
      email: email.toLowerCase(),
      totalGenerations: 1,
      totalInputTokens: usage.inputTokens,
      totalOutputTokens: usage.outputTokens,
      totalCostUsd: usage.totalCostUsd,
      totalCostKsh: totalCostKsh,
      lastGenerationDate: today,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } else {
    // Update existing user usage
    await updateDoc(userDocRef, {
      totalGenerations: increment(1),
      totalInputTokens: increment(usage.inputTokens),
      totalOutputTokens: increment(usage.outputTokens),
      totalCostUsd: increment(usage.totalCostUsd),
      totalCostKsh: increment(totalCostKsh),
      lastGenerationDate: today,
      updatedAt: serverTimestamp(),
    });
  }

  // Also store individual usage records for history
  const usageHistoryRef = collection(db, "userUsage", sanitizedEmail, "history");
  await addDoc(usageHistoryRef, {
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    inputCostUsd: usage.inputCostUsd,
    outputCostUsd: usage.outputCostUsd,
    totalCostUsd: usage.totalCostUsd,
    totalCostKsh: totalCostKsh,
    createdAt: serverTimestamp(),
  });
}

// Get recent usage history for a user
export async function getUserUsageHistory(
  email: string,
  limitCount: number = 10
): Promise<UsageRecord[]> {
  const sanitizedEmail = sanitizeEmail(email);
  const usageHistoryRef = collection(db, "userUsage", sanitizedEmail, "history");
  const q = query(usageHistoryRef, orderBy("createdAt", "desc"), limit(limitCount));
  
  const querySnapshot = await getDocs(q);
  const records: UsageRecord[] = [];
  
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    records.push({
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      inputCostUsd: data.inputCostUsd,
      outputCostUsd: data.outputCostUsd,
      totalCostUsd: data.totalCostUsd,
      totalCostKsh: data.totalCostKsh,
      createdAt: data.createdAt?.toDate?.() || new Date(),
    });
  });

  return records;
}

// Convert USD to KSH
export function usdToKsh(usd: number): number {
  return usd * USD_TO_KSH_RATE;
}

// Format currency for display
export function formatKsh(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(amount);
}
