import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const alerts = await prisma.priceAlert.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(alerts);
    } catch (error) {
        console.error('[ALERTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { sneakerId, sneakerName, sneakerImage, targetPrice, currentPrice } = body;

        if (!sneakerId || !targetPrice) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Upsert User for safety (same as portfolio & watchlist)
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: `${userId}@placeholder.com`,
            }
        });

        const alert = await prisma.priceAlert.create({
            data: {
                userId,
                sneakerId,
                sneakerName,
                sneakerImage: sneakerImage || '',
                targetPrice: parseFloat(targetPrice),
                currentPrice: currentPrice ? parseFloat(currentPrice) : null,
            },
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error('[ALERTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
