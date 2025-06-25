import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requirements,
      reference,
      size,
      medium,
      style,
    } = body;

    if (!title || !description || !category || budget === undefined || !deadline || !requirements) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const commission = await prisma.commission.create({
      data: {
        title,
        description,
        category,
        budget,
        deadline,
        requirements,
        reference,
        size,
        medium,
        style,
        clientId: session.user.id,
      },
    });

    return NextResponse.json(commission);
  } catch (error) {
    console.error("[COMMISSIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    // Import your enums at the top if not already imported:
    // import { CommissionCategory, CommissionStatus } from "@prisma/client";

    const commissions = await prisma.commission.findMany({
      where: {
        ...(category ? { category: category as any } : {}),
        ...(status ? { status: status as any } : {}),
        OR: [
          { clientId: session.user.id },
          { artistId: session.user.id },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        artist: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        proposals: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(commissions);
  } catch (error) {
    console.error("[COMMISSIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 