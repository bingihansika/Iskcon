import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const activeCampaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
    });

    if (!activeCampaign) {
      return NextResponse.json({ inventory: [] });
    }

    const inventory = await prisma.inventory.findMany({
      where: { campaignId: activeCampaign.id },
      include: {
        bookEdition: {
          include: { book: true, language: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ inventory, activeCampaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { inventoryId, newTotalStock, reservedStock, damagedStock, adjustmentReason } = await req.json();

    const targetInv = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { bookEdition: { include: { book: true, language: true } } },
    });

    if (!targetInv) {
      return NextResponse.json({ error: 'Inventory record not found' }, { status: 404 });
    }

    const nextTotal = parseInt(newTotalStock, 10);
    const nextReserved = parseInt(reservedStock, 10) || 0;
    const nextDamaged = parseInt(damagedStock, 10) || 0;

    if (isNaN(nextTotal) || nextTotal < 0) {
      return NextResponse.json({ error: 'Stock total cannot be negative.' }, { status: 400 });
    }

    const diff = nextTotal - targetInv.totalStock;
    const nextAvailable = Math.max(0, targetInv.availableStock + diff - nextReserved - nextDamaged);

    // Rule 16 Check: Inventory must never become negative
    if (nextAvailable < 0) {
      return NextResponse.json(
        { error: 'Cannot reduce available stock below zero after reserved and damaged adjustments.' },
        { status: 400 }
      );
    }

    // Update stock and write mandatory audit log
    const updated = await prisma.$transaction(async (tx: any) => {
      const inv = await tx.inventory.update({
        where: { id: inventoryId },
        data: {
          totalStock: nextTotal,
          availableStock: nextAvailable,
          reservedStock: nextReserved,
          damagedStock: nextDamaged,
        },
      });

      // MANDATORY AUDIT LOG (Rule #12)
      await tx.auditLog.create({
        data: {
          userId: user.userId,
          role: user.role,
          action: 'INVENTORY_MANUAL_ADJUSTMENT',
          entityType: 'INVENTORY',
          entityId: inventoryId,
          oldData: JSON.stringify({
            totalStock: targetInv.totalStock,
            availableStock: targetInv.availableStock,
            reservedStock: targetInv.reservedStock,
            damagedStock: targetInv.damagedStock,
          }),
          newData: JSON.stringify({
            totalStock: nextTotal,
            availableStock: nextAvailable,
            reservedStock: nextReserved,
            damagedStock: nextDamaged,
            reason: adjustmentReason || 'Manual stock reconciliation',
          }),
        },
      });

      return inv;
    });

    return NextResponse.json({ success: true, inventory: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
