// src/app/api/user/limit/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getGenerationCount, incrementGenerationCount } from "@/services/user-service";

export async function GET(request: Request) {
  const session = await auth();
  // Use email as identifier since user id is not persisted correctly
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await getGenerationCount(userEmail);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting generation count:", error);
    return NextResponse.json({ error: "Failed to get generation count" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  // Use email as identifier since user id is not persisted correctly
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await incrementGenerationCount(userEmail);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error incrementing generation count:", error);
    return NextResponse.json({ error: "Failed to increment generation count" }, { status: 500 });
  }
}
