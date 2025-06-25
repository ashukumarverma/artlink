import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "Artist") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (product.artistId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.product.delete({
      where: { id: params.productId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "Artist") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, price, stock, images } = body;

    const product = await prisma.product.findUnique({
      where: { id: params.productId },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    if (product.artistId !== user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.productId },
      data: {
        name,
        description,
        price,
        stock,
        images,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 