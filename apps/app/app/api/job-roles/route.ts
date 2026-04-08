import { database } from "@repo/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobRoles = await database.jobRole.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });

    return NextResponse.json(jobRoles);
  } catch (error) {
    console.error("Failed to fetch job roles:", error);
    return NextResponse.json(
      { error: "Failed to fetch job roles" },
      { status: 500 }
    );
  }
}