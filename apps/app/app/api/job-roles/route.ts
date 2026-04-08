import { database } from "@repo/database";
import { NextResponse } from "next/server";

export async function GET() {
  const jobRoles = await database.jobRole.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return NextResponse.json(jobRoles);
}
