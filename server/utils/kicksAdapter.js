/**
 * KicksDB → SneakerProduct adapter
 *
 * Transforms KicksDB API responses into the shape the frontend already expects
 * (matching the original sneaks-api SneakerProduct interface) so that
 * zero frontend changes are needed.
 */

/**
 * Convert a KicksDB StockX product to the sneaks-api SneakerProduct shape.
 */
function adaptStockXProduct(kdb) {
    return {
        shoeName: kdb.title || '',
        brand: kdb.brand || '',
        styleID: kdb.sku || kdb.slug || '',
        colorway: kdb.secondary_title || kdb.model || '',
        retailPrice: 0, // KicksDB doesn't provide MSRP in Standard API
        releaseDate: kdb.release_date || kdb.created_at || '',
        description: kdb.description || '',
        thumbnail: kdb.image || '',
        silpihoutte: kdb.model || '', // preserving the original sneaks-api typo
        make: kdb.brand || '',
        urlKey: kdb.slug || '',
        // Links
        resellLinks: {
            stockX: kdb.link || '',
            goat: '',
            flightClub: '',
            stadiumGoods: '',
        },
        // Prices — use KicksDB min/max/avg
        lowestResellPrice: {
            stockX: kdb.min_price || 0,
            goat: 0,
            flightClub: 0,
            stadiumGoods: 0,
        },
        // Per-size prices (populated from variants or unified data)
        resellPrices: {
            stockX: {},
            goat: {},
            flightClub: {},
            stadiumGoods: {},
        },
        // Extra metadata
        _kdb: {
            id: kdb.id,
            slug: kdb.slug,
            rank: kdb.rank,
            weeklyOrders: kdb.weekly_orders,
            avgPrice: kdb.avg_price,
            maxPrice: kdb.max_price,
            gallery: kdb.gallery || [],
        },
    };
}

/**
 * Enrich a product with variant-level pricing from KicksDB variants.
 * Variants come from: GET /v3/stockx/products/{id}?display[variants]=true&display[prices]=true
 */
function enrichWithVariants(product, variants) {
    if (!variants || !Array.isArray(variants)) return product;

    const stockXPrices = {};
    variants.forEach(v => {
        if (v.lowest_ask && v.lowest_ask > 0) {
            stockXPrices[v.size] = v.lowest_ask;
        }
    });

    product.resellPrices = {
        ...product.resellPrices,
        stockX: stockXPrices,
    };

    return product;
}

/**
 * Enrich a product with cross-platform data from the Unified API.
 * Unified data comes from: GET /v3/unified/products/{identifier}
 */
function enrichWithUnifiedData(product, unifiedResults) {
    if (!unifiedResults || !Array.isArray(unifiedResults)) return product;

    const shopMap = {
        stockx: 'stockX',
        goat: 'goat',
        flightclub: 'flightClub',
        stadiumgoods: 'stadiumGoods',
    };

    for (const entry of unifiedResults) {
        const retailerKey = shopMap[entry.shop_name] || null;
        if (!retailerKey) continue;

        // Set link
        if (entry.link) {
            product.resellLinks[retailerKey] = entry.link;
        }

        // Set per-size prices
        if (entry.prices && typeof entry.prices === 'object') {
            product.resellPrices[retailerKey] = entry.prices;

            // Also compute lowest for this retailer
            const priceValues = Object.values(entry.prices).filter(v => typeof v === 'number' && v > 0);
            if (priceValues.length > 0) {
                product.lowestResellPrice[retailerKey] = Math.min(...priceValues);
            }
        }

        // Get colorway from metadata if available
        if (entry.metadata?.colorway && !product.colorway) {
            product.colorway = entry.metadata.colorway;
        }
    }

    return product;
}

module.exports = {
    adaptStockXProduct,
    enrichWithVariants,
    enrichWithUnifiedData,
};
