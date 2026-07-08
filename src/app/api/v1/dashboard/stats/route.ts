import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/get-user-id";

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalCustomers,
      totalProducts,
      paidStats,
      unpaidStats,
      overdueStats,
    ] = await Promise.all([
      prisma.customer.count({ where: { userId } }),
      prisma.product.count({ where: { userId } }),
      prisma.invoice.aggregate({
        where: { userId, status: "PAID" },
        _sum: { total: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { userId, status: "UNPAID" },
        _sum: { total: true },
        _count: true,
      }),
      prisma.invoice.aggregate({
        where: { userId, status: "OVERDUE" },
        _sum: { total: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      totalCustomers,
      totalProducts,
      totalRevenue: paidStats._sum.total || 0,
      totalUnpaid: unpaidStats._sum.total || 0,
      totalOverdue: overdueStats._sum.total || 0,
      paidCount: paidStats._count,
      unpaidCount: unpaidStats._count,
      overdueCount: overdueStats._count,
      totalInvoices: paidStats._count + unpaidStats._count + overdueStats._count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
