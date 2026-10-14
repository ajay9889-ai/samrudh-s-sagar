import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyCsrfOrigin } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
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
    const read = Boolean(body.read);

    const updated = await prisma.message.update({
      where: { id },
      data: { read },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update message error:", err);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
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
    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete message error:", err);
    return NextResponse.json(
      { error: "Failed to delete message" },
      { status: 500 }
    );
  }
}
