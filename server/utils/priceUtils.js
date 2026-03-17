/**
 * Price enrichment utilities for SoleSearch API
 */

const RETAILERS = ['stockX', 'flightClub', 'goat', 'stadiumGoods'];

const RETAILER_META = {
  stockX:       { name: 'StockX',        logo: '/logos/stockx.svg' },
  flightClub:   { name: 'Flight Club',   logo: '/logos/flightclub.svg' },
  goat:         { name: 'GOAT',          logo: '/logos/goat.svg' },
  stadiumGoods: { name: 'Stadium Goods', logo: '/logos/stadiumgoods.svg' },
};

/**
 * Find the absolute best deal across all retailers and sizes
 */
function calculateBestDeal(product) {
  let best = { retailer: null, price: Infinity, size: null, link: null };

  RETAILERS.forEach(retailer => {
    const priceMap = product.resellPrices?.[retailer];
    if (!priceMap) return;

    Object.entries(priceMap).forEach(([size, price]) => {
      if (price > 0 && price < best.price) {
        best = {
          retailer,
          price,
          size,
          link: product.resellLinks?.[retailer] || null,
        };
      }
    });
  });

  return best.retailer ? best : null;
}

/**
 * Get the lowest price per size across all retailers
 */
function getLowestPricePerSize(product) {
  const sizeMap = {};

  RETAILERS.forEach(retailer => {
    const priceMap = product.resellPrices?.[retailer];
    if (!priceMap) return;

    Object.entries(priceMap).forEach(([size, price]) => {
      if (price <= 0) return;
      if (!sizeMap[size] || price < sizeMap[size].price) {
        sizeMap[size] = {
          price,
          retailer,
          link: product.resellLinks?.[retailer],
        };
      }
    });
  });

  return sizeMap;
}

/**
 * Get price comparison array for a specific size
 */
function getPriceComparisonForSize(product, size) {
  return RETAILERS
    .map(key => ({
      ...RETAILER_META[key],
      key,
      price: product.resellPrices?.[key]?.[size] || null,
      link: product.resellLinks?.[key] || null,
    }))
    .filter(r => r.price !== null && r.price > 0)
    .sort((a, b) => a.price - b.price)
    .map((r, i) => ({ ...r, isBestPrice: i === 0 }));
}

module.exports = { calculateBestDeal, getLowestPricePerSize, getPriceComparisonForSize };
