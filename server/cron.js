const cron = require('node-cron');
const axios = require('axios');
require('dotenv').config();

const FRONTEND_API = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET;

// Helper to interact with the Next.js internal API
async function getAlerts() {
    try {
        const res = await axios.get(`${FRONTEND_API}/api/internal/alerts`, {
            headers: { Authorization: `Bearer ${CRON_SECRET}` }
        });
        return res.data;
    } catch (err) {
        console.error('[CRON] Failed to fetch alerts:', err.message);
        return [];
    }
}

async function triggerAlert(alertId, currentPrice) {
    try {
        await axios.post(`${FRONTEND_API}/api/internal/trigger`, {
            alertId, currentPrice
        }, {
            headers: { Authorization: `Bearer ${CRON_SECRET}` }
        });
        console.log(`[CRON] Triggered alert ${alertId} at $${currentPrice}`);
    } catch (err) {
        console.error('[CRON] Failed to trigger alert:', err.message);
    }
}

// Function that performs the actual check using our internal Kicks API logic
async function checkPrices() {
    console.log('[CRON] Starting price check for alerts...');
    const alerts = await getAlerts();
    if (!alerts || alerts.length === 0) {
        console.log('[CRON] No active alerts found.');
        return;
    }

    console.log(`[CRON] Processing ${alerts.length} alerts.`);

    // Import the existing functions from routes/sneakers or rewrite here
    const { calculateBestDeal } = require('./utils/priceUtils');
    const { adaptStockXProduct, enrichWithVariants } = require('./utils/kicksAdapter');
    const KICKSDB_BASE = 'https://api.kicks.dev/v3';
    const API_KEY = process.env.KICKSDB_API_KEY || '';

    for (const alert of alerts) {
        try {
            // Find current price
            // 1. fetch product detail from API
            const searchRes = await axios.get(`${KICKSDB_BASE}/stockx/products`, {
                headers: { Authorization: `Bearer ${API_KEY}` },
                params: { query: alert.sneakerId, per_page: 1 },
                timeout: 10000,
            });

            const kdbData = searchRes.data.data || [];
            if (kdbData.length > 0) {
                const match = kdbData[0];
                const detailRes = await axios.get(`${KICKSDB_BASE}/stockx/products/${match.slug || match.id}`, {
                    headers: { Authorization: `Bearer ${API_KEY}` },
                    params: { 'display[variants]': 'true', 'display[prices]': 'true' },
                    timeout: 10000,
                });

                const detailData = detailRes.data.data;
                let product = adaptStockXProduct(detailData || match);
                product = enrichWithVariants(product, detailData?.variants);
                const bestDeal = calculateBestDeal(product);

                let currentPrice = bestDeal ? bestDeal.price : product.lowestPrice;
                if (!currentPrice || currentPrice === 0) currentPrice = alert.currentPrice;

                // If price dropped to or below the target, trigger it
                // Make sure we haven't already triggered it (e.g. if it was already below target)
                if (currentPrice > 0 && currentPrice <= alert.targetPrice) {
                    if (alert.currentPrice === null || alert.currentPrice > alert.targetPrice) {
                        await triggerAlert(alert.id, currentPrice);
                    }
                }
            }

            // Wait slightly to respect rate limits
            await new Promise(r => setTimeout(r, 1000));
        } catch (err) {
            console.error(`[CRON] Error checking ${alert.sneakerId}:`, err.message);
        }
    }
    console.log('[CRON] Price check finished.');
}

// Schedule tasks to be run on the server.
// Runs every 4 hours: '0 */4 * * *'
// For testing, let's also expose a way to run immediately or run more frequently:
// cron.schedule('*/5 * * * *', checkPrices); // Every 5 minutes for dev

cron.schedule('0 */4 * * *', () => {
    checkPrices();
});

console.log('[CRON] Background jobs scheduled.');

module.exports = { checkPrices };
