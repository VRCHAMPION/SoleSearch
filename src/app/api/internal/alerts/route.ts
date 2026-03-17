import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const alerts = await prisma.priceAlert.findMany({
            where: {
                // we can filter eventually to only check active ones
            },
        });
        return NextResponse.json(alerts);
    } catch (error) {
        console.error('[INTERNAL_ALERTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
