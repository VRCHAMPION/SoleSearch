const express = require('express');
const router = express.Router();
const axios = require('axios');
const { adaptStockXProduct, enrichWithVariants, enrichWithUnifiedData } = require('../utils/kicksAdapter');
const { calculateBestDeal } = require('../utils/priceUtils');
const { getMockProducts, getMockProductByStyleID } = require('../utils/mockData');

const KICKSDB_BASE = 'https://api.kicks.dev/v3';
const API_KEY = process.env.KICKSDB_API_KEY || '';

/** Helper: make authenticated KicksDB request */
async function kicksGet(path, params = {}) {
    if (!API_KEY) {
        throw new Error("Missing API Key");
    }
    const res = await axios.get(`${KICKSDB_BASE}${path}`, {
        headers: { Authorization: `Bearer ${API_KEY}` },
        params,
        timeout: 10000,
    });
    return res.data;
}

// ──────────────────────────────────────────────
// GET /api/search?query=Yeezy&limit=20
// ──────────────────────────────────────────────
router.get('/search', async (req, res) => {
    const { query, limit = 20 } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });

    try {
        const kdb = await kicksGet('/stockx/products', {
            query,
            per_page: parseInt(limit),
        });

        const products = (kdb.data || []).map(adaptStockXProduct);

        res.json({
            count: products.length,
            query,
            results: products,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.warn('[/search] KicksDB Error, using mock data fallback:', err.response?.data || err.message);
        
        // Mock data fallback
        const mockProducts = getMockProducts(parseInt(limit)).filter(p => 
            p.shoeName.toLowerCase().includes(query.toLowerCase()) || 
            p.brand.toLowerCase().includes(query.toLowerCase())
        );
        
        res.json({
            count: mockProducts.length,
            query,
            results: mockProducts,
            timestamp: new Date().toISOString(),
            _mock: true // flag for frontend to know it's mock data
        });
    }
});

// ──────────────────────────────────────────────
// GET /api/product/:styleID
// Returns full product with per-size prices + cross-platform comparison
// ──────────────────────────────────────────────
router.get('/product/:styleID', async (req, res) => {
    const { styleID } = req.params;

    try {
        // 1) Search for the product by SKU to get slug/id
        const search = await kicksGet('/stockx/products', { query: styleID, per_page: 5 });
        const match = (search.data || []).find(
            p => p.sku === styleID || p.slug === styleID || p.id === styleID
        ) || (search.data || [])[0];

        if (!match) return res.status(404).json({ error: 'Product not found' });

        // 2) Get full product with variants + prices
        const detail = await kicksGet(`/stockx/products/${match.slug || match.id}`, {
            'display[variants]': 'true',
            'display[prices]': 'true',
        });

        let product = adaptStockXProduct(detail.data || match);
        product = enrichWithVariants(product, detail.data?.variants);

        // 3) Try unified API for cross-platform prices (best-effort)
        try {
            const unified = await kicksGet(`/unified/products/${match.slug || styleID}`);
            product = enrichWithUnifiedData(product, unified.data);
        } catch (unifiedErr) {
            console.log('[/product] Unified API skipped:', unifiedErr.response?.status || unifiedErr.message);
        }

        const bestDeal = calculateBestDeal(product);

        res.json({
            product,
            bestDeal,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.warn(`[/product/${styleID}] KicksDB Error, using mock data fallback:`, err.response?.data || err.message);
        
        // Mock data fallback
        const product = getMockProductByStyleID(styleID);
        const bestDeal = calculateBestDeal(product);
        
        res.json({
            product,
            bestDeal,
            timestamp: new Date().toISOString(),
            _mock: true
        });
    }
});

// ──────────────────────────────────────────────
// GET /api/trending?limit=20
// Uses StockX sort by weekly_orders (most popular first)
// ──────────────────────────────────────────────
router.get('/trending', async (req, res) => {
    const { limit = 20 } = req.query;

    try {
        const kdb = await kicksGet('/stockx/products', {
            per_page: parseInt(limit),
            sort: 'rank',
            order: 'asc',
            'filter[product_type]': 'sneakers',
        });

        const products = (kdb.data || []).map(adaptStockXProduct);

        res.json({
            count: products.length,
            results: products,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.warn('[/trending] KicksDB Error, using mock data fallback:', err.response?.data || err.message);
        
        // Mock data fallback
        const mockProducts = getMockProducts(parseInt(limit));
        
        res.json({
            count: mockProducts.length,
            results: mockProducts,
            timestamp: new Date().toISOString(),
            _mock: true
        });
    }
});

// ──────────────────────────────────────────────
// GET /api/autocomplete?q=jordan
// Lightweight search for search bar suggestions
// ──────────────────────────────────────────────
router.get('/autocomplete', async (req, res) => {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ results: [] });

    try {
        const kdb = await kicksGet('/stockx/products', { query: q, per_page: 6 });

        const suggestions = (kdb.data || []).map(p => ({
            shoeName: p.title,
            styleID: p.sku || p.slug,
            brand: p.brand,
            thumbnail: p.image,
            colorway: p.secondary_title || p.model || '',
            lowestPrice: p.min_price || 0,
        }));

        res.json({ results: suggestions });
    } catch (err) {
        console.warn('[/autocomplete] KicksDB Error, using mock data fallback:', err.response?.data || err.message);
        
        // Mock data fallback
        const mockProducts = getMockProducts(6).filter(p => 
            p.shoeName.toLowerCase().includes(q.toLowerCase()) || 
            p.brand.toLowerCase().includes(q.toLowerCase())
        );
        
        res.json({ 
            results: mockProducts.map(p => ({
                shoeName: p.shoeName,
                styleID: p.styleID,
                brand: p.brand,
                thumbnail: p.thumbnail,
                colorway: p.colorway,
                lowestPrice: p.lowestPrice
            })),
            _mock: true
        });
    }
});

// ──────────────────────────────────────────────
// GET /api/product/:styleID/best-deal
// ──────────────────────────────────────────────
router.get('/product/:styleID/best-deal', async (req, res) => {
    const { styleID } = req.params;
    try {
        const search = await kicksGet('/stockx/products', { query: styleID, per_page: 1 });
        const match = (search.data || [])[0];
        if (!match) return res.status(404).json({ error: 'Product not found' });

        const product = adaptStockXProduct(match);
        const best = calculateBestDeal(product);

        res.json({
            shoeName: product.shoeName,
            styleID: product.styleID,
            thumbnail: product.thumbnail,
            retailPrice: product.retailPrice,
            bestDeal: best,
            savings: best ? product.retailPrice - best.price : 0,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.warn('[/best-deal] KicksDB Error, using mock data fallback:', err.response?.data || err.message);
        
        // Mock data fallback
        const product = getMockProductByStyleID(styleID);
        const best = calculateBestDeal(product);
        
        res.json({
            shoeName: product.shoeName,
            styleID: product.styleID,
            thumbnail: product.thumbnail,
            retailPrice: product.retailPrice,
            bestDeal: best,
            savings: best ? product.retailPrice - best.price : 0,
            timestamp: new Date().toISOString(),
            _mock: true
        });
    }
});

// ──────────────────────────────────────────────
// GET /api/deals?limit=20&maxPrice=500
// ──────────────────────────────────────────────
router.get('/deals', async (req, res) => {
    const { limit = 20, maxPrice = 500 } = req.query;
    try {
        const kdb = await kicksGet('/stockx/products', {
            per_page: parseInt(limit) * 2,
            sort: 'rank',
            order: 'asc',
            'filter[product_type]': 'sneakers',
        });

        const deals = (kdb.data || [])
            .filter(p => p.min_price && p.min_price > 0 && p.min_price <= parseInt(maxPrice))
            .slice(0, parseInt(limit))
            .map(p => {
                const product = adaptStockXProduct(p);
                return {
                    ...product,
                    _lowestPrice: p.min_price,
                    _belowRetail: false,
                };
            })
            .sort((a, b) => a._lowestPrice - b._lowestPrice);

        res.json({ count: deals.length, results: deals });
    } catch (err) {
        console.warn('[/deals] KicksDB Error, using mock data fallback:', err.response?.data || err.message);
        
        // Mock data fallback
        const deals = getMockProducts(parseInt(limit))
            .filter(p => p.lowestPrice <= parseInt(maxPrice))
            .map(p => ({
                ...p,
                _lowestPrice: p.lowestPrice,
                _belowRetail: p.lowestPrice < p.retailPrice
            }))
            .sort((a, b) => a._lowestPrice - b._lowestPrice);
            
        res.json({ count: deals.length, results: deals, _mock: true });
    }
});

module.exports = router;
