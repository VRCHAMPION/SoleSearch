import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        const resolvedParams = await params;

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!resolvedParams.id) {
            return new NextResponse('Watchlist Item ID required', { status: 400 });
        }

        // Ensure the item belongs to the user before deleting
        // We will support deleting by either the internal database ID OR the sneaker ID
        // So if the frontend passes the sneakerId (styleID) it can remove it easily
        const watchlistItem = await prisma.watchlistItem.findFirst({
            where: {
                OR: [
                    { id: resolvedParams.id },
                    { sneakerId: resolvedParams.id }
                ],
                userId: userId
            },
        });

        if (!watchlistItem) {
            return new NextResponse('Not Found', { status: 404 });
        }

        await prisma.watchlistItem.delete({
            where: {
                id: watchlistItem.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[WATCHLIST_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
