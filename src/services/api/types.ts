// ============================================================
// Sneaks-API TypeScript interfaces
// ============================================================

export interface ResellLinks {
    stockX: string;
    flightClub: string;
    goat: string;
    stadiumGoods: string;
}

export interface LowestResellPrice {
    stockX: number;
    flightClub: number;
    goat: number;
    stadiumGoods: number;
}

export interface ResellPrices {
    stockX: Record<string, number>;
    flightClub: Record<string, number>;
    goat: Record<string, number>;
    stadiumGoods: Record<string, number>;
}

export interface SneakerProduct {
    shoeName: string;
    brand: string;
    silhoutte: string;   // API typo preserved
    styleID: string;
    retailPrice: number;
    thumbnail: string;
    releaseDate: string;
    description: string;
    urlKey: string;
    colorway: string;
    make: string;
    resellLinks: ResellLinks;
    lowestResellPrice: LowestResellPrice;
    resellPrices: ResellPrices;
    imageLinks: string[];
}

export interface BestDeal {
    retailer: string;
    price: number;
    size: string;
    link: string;
}

// --- API Response Types ---

export interface SearchResponse {
    count: number;
    query?: string;
    results: SneakerProduct[];
    timestamp: string;
    _cached?: boolean;
}

export interface ProductDetailResponse {
    product: SneakerProduct;
    bestDeal: BestDeal | null;
    timestamp: string;
}

export interface TrendingResponse {
    count: number;
    results: SneakerProduct[];
    timestamp: string;
}

export interface AutocompleteSuggestion {
    shoeName: string;
    styleID: string;
    brand: string;
    thumbnail: string;
    colorway: string;
    lowestPrice: number;
}

export interface AutocompleteResponse {
    results: AutocompleteSuggestion[];
}

export interface BestDealResponse {
    shoeName: string;
    styleID: string;
    thumbnail: string;
    retailPrice: number;
    bestDeal: BestDeal | null;
    savings: number;
    timestamp: string;
}

export interface PriceComparison {
    name: string;
    key: string;
    logo: string;
    price: number;
    link: string;
    isBestPrice: boolean;
}

// Enriched product used internally on frontend
export interface EnrichedSneaker extends SneakerProduct {
    _lowestPrice: number;
    _bestRetailer: string;
    _belowRetail: boolean;
    _savingsPercent: number;
}

// Price point for chart (client-generated since API doesn't provide history)
export interface PricePoint {
    date: string;
    price: number;
}
