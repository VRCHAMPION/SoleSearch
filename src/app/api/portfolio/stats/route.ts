import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const portfolioItems = await prisma.portfolioItem.findMany({
            where: {
                userId: userId,
            },
            select: {
                purchasePrice: true,
                // Since we don't have real-time live prices stored in the DB continuously (only when checked),
                // A true portfolio stats route would fetch current live prices from the aggregator API for each pair.
                // For simplicity, we calculate based on the purchase price here. 
                // In reality, you'd calculate current value by looking up the live price.
                // Let's assume for this endpoint we just return the total items and total spent, 
                // and we will leave live profit calculation to the frontend (which can fetch current prices).
            },
        });

        const totalItems = portfolioItems.length;

        // Calculate total spent as an initial stat
        const totalSpent = portfolioItems.reduce((acc, item) => acc + item.purchasePrice, 0);

        // To do an accurate "Total Value", we actually need the *current* market price of each shoe.
        // The frontend should ideally calculate this by mapping over the portfolio items and matching them with live data.

        return NextResponse.json({
            totalItems,
            totalSpent,
        });
    } catch (error) {
        console.error('[PORTFOLIO_STATS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
