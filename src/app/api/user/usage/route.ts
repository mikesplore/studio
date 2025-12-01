import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserUsageStats, getUserUsageHistory } from "@/services/usage-service";

export async function GET() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [stats, history] = await Promise.all([
      getUserUsageStats(userEmail),
      getUserUsageHistory(userEmail, 10),
    ]);

    return NextResponse.json({
      stats: stats || {
        email: userEmail,
        totalGenerations: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        totalCostUsd: 0,
        totalCostKsh: 0,
        lastGenerationDate: null,
      },
      history,
    });
  } catch (error) {
    console.error("Failed to get user usage:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get usage stats";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
