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
            return new NextResponse('Portfolio Item ID required', { status: 400 });
        }

        // Ensure the item belongs to the user before deleting
        const portfolioItem = await prisma.portfolioItem.findUnique({
            where: {
                id: resolvedParams.id,
            },
        });

        if (!portfolioItem) {
            return new NextResponse('Not Found', { status: 404 });
        }

        if (portfolioItem.userId !== userId) {
            return new NextResponse('Forbidden', { status: 403 });
        }

        await prisma.portfolioItem.delete({
            where: {
                id: resolvedParams.id,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('[PORTFOLIO_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
