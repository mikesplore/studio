// src/app/api/user/limit/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGenerationCount, incrementGenerationCount } from "@/services/user-service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await getGenerationCount(session.user.id);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting generation count:", error);
    return NextResponse.json({ error: "Failed to get generation count" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await incrementGenerationCount(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing generation count:", error);
    return NextResponse.json({ error: "Failed to increment generation count" }, { status: 500 });
  }
}
