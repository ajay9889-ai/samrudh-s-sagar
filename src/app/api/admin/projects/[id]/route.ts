import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyCsrfOrigin } from "@/lib/auth";
import { projectSchema } from "@/lib/schemas";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error("Get project error:", err);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update project error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
