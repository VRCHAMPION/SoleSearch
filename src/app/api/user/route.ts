import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            // If user doesn't exist in DB yet, return 404 or a default object
            return NextResponse.json({ shoeSize: '10.5' });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('[USER_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { shoeSize } = body;

        if (!shoeSize) {
            return new NextResponse('Shoe size is required', { status: 400 });
        }

        // Upsert user if they don't exist yet, update if they do
        const user = await prisma.user.upsert({
            where: { id: userId },
            update: { shoeSize },
            create: {
                id: userId,
                email: `${userId}@placeholder.com`, // We'll fix this in the Clerk Webhook step
                shoeSize,
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[USER_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
