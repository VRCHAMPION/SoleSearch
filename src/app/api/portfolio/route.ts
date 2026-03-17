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
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(portfolioItems);
    } catch (error) {
        console.error('[PORTFOLIO_GET]', error);
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
        const { sneakerId, sneakerName, sneakerImage, sneakerBrand, colorway, size, purchasePrice, purchaseDate } = body;

        // Validate required fields
        if (!sneakerId || !sneakerName || !sneakerImage || !sneakerBrand || !size || typeof purchasePrice !== 'number' || !purchaseDate) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        // Upsert User to ensure foreign key constraint passes
        // In a real app with Clerk webhooks, the user might already be in the DB.
        // For safety, we make sure they exist here.
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: `${userId}@placeholder.com`, // We don't have the real email here from auth(), just the ID. Webhooks are better for this, but this works for demo.
            }
        });

        const portfolioItem = await prisma.portfolioItem.create({
            data: {
                userId,
                sneakerId,
                sneakerName,
                sneakerImage,
                sneakerBrand,
                colorway,
                size,
                purchasePrice,
                purchaseDate: new Date(purchaseDate),
            },
        });

        return NextResponse.json(portfolioItem);
    } catch (error) {
        console.error('[PORTFOLIO_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
