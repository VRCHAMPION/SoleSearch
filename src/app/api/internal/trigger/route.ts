import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { createClerkClient } from '@clerk/nextjs/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY, publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY });

export async function POST(req: NextRequest) {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const body = await req.json();
        const { alertId, currentPrice } = body;

        if (!alertId || currentPrice == null) {
            return new NextResponse('Missing fields', { status: 400 });
        }

        const alert = await prisma.priceAlert.findUnique({
            where: { id: alertId }
        });

        if (!alert) return new NextResponse('Alert not found', { status: 404 });

        // Update the alert's currentPrice
        const updated = await prisma.priceAlert.update({
            where: { id: alertId },
            data: { currentPrice: parseFloat(currentPrice) }
        });

        // Fetch User's Real Email from Clerk
        try {
            const user = await clerkClient.users.getUser(alert.userId);
            const userEmail = user.emailAddresses[0]?.emailAddress;

            if (userEmail) {
                await resend.emails.send({
                    from: 'SoleSearch Alerts <onboarding@resend.dev>',
                    to: userEmail,
                    subject: `🚨 Price Drop Alert: ${alert.sneakerName} is now $${currentPrice}!`,
                    html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                        <h2 style="color: #000;">Great news, Sneakerhead!</h2>
                        <p>The price for <strong>${alert.sneakerName}</strong> has dropped to <strong>$${currentPrice}</strong>.</p>
                        <p>This is at or below your target price of $${alert.targetPrice}. Time to cop!</p>
                        ${alert.sneakerImage ?\`<img src="\${alert.sneakerImage}" style="max-width: 100%; border-radius: 8px; margin: 20px 0;" />\` : ''}
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/product/${alert.sneakerId}" style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Check it out</a>
                        </div>
                    </div>
                    `
                });
            console.log(`[RESEND] Email sent to ${userEmail} for ${alert.sneakerName}`);
        }
        } catch (emailErr: any) {
        console.error('[RESEND] Failed to send email:', emailErr.message);
    }

    return NextResponse.json(updated);
} catch (error) {
    console.error('[INTERNAL_ALERTS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
}
}
