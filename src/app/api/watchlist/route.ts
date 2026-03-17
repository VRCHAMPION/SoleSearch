import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const watchlistItems = await prisma.watchlistItem.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(watchlistItems);
    } catch (error) {
        console.error('[WATCHLIST_GET]', error);
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
        const { sneakerId, sneakerName, sneakerImage, sneakerBrand, colorway } = body;

        if (!sneakerId || !sneakerName || !sneakerImage || !sneakerBrand) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Upsert User for safety (same as portfolio)
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: `${userId}@placeholder.com`,
            }
        });

        // Check if it already exists to prevent duplicates
        const existing = await prisma.watchlistItem.findFirst({
            where: {
                userId,
                sneakerId
            }
        });

        if (existing) {
            return NextResponse.json(existing);
        }

        const watchlistItem = await prisma.watchlistItem.create({
            data: {
                userId,
                sneakerId,
                sneakerName,
                sneakerImage,
                sneakerBrand,
                colorway,
            },
        });

        return NextResponse.json(watchlistItem);
    } catch (error) {
        console.error('[WATCHLIST_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
