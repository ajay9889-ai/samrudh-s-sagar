import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyCsrfOrigin } from "@/lib/auth";
import { z } from "zod";

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int(),
    })
  ),
});

export async function PUT(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!verifyCsrfOrigin(request)) {
      return NextResponse.json({ error: "Invalid CSRF origin" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reorder payload" }, { status: 400 });
    }

    // Update each project's order in a transaction
    await prisma.$transaction(
      parsed.data.items.map((item) =>
        prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reorder projects error:", err);
    return NextResponse.json({ error: "Failed to reorder projects" }, { status: 500 });
  }
}
