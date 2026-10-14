import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyCsrfOrigin } from "@/lib/auth";
import { projectSchema } from "@/lib/schemas";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error("Fetch projects error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const created = await prisma.project.create({
      data: parsed.data,
    });

    // Invalidate public site cache
    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Create project error:", err);
    return NextResponse.json(
      { error: "Failed to create project." },
      { status: 500 }
    );
  }
}
