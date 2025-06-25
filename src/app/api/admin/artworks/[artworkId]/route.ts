import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { artworkId: string } }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "Admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { artworkId } = params;
    if (!artworkId) {
      return new NextResponse("Artwork ID is required", { status: 400 });
    }

    const body = await req.json();
    const { status, rejectionReason } = body;

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    const artwork = await prisma.product.update({
      where: { id: artworkId },
      data: {
        status,
        ...(rejectionReason && { rejectionReason }),
        isVerified: status === "approved",
      },
    });

    if (!artwork) {
      return new NextResponse("Artwork not found", { status: 404 });
    }

    return NextResponse.json(artwork);
  } catch (error) {
    console.error("[ADMIN_ARTWORKS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}