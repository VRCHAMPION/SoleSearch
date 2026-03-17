import sneaksClient from './sneaksClient';
import type {
    SearchResponse,
    ProductDetailResponse,
    TrendingResponse,
    AutocompleteResponse,
    BestDealResponse,
} from './types';

export const SneakerAPI = {
    /** Search sneakers by keyword */
    search: (query: string, limit: number = 20): Promise<SearchResponse> =>
        sneaksClient.get('/search', { params: { query, limit } }),

    /** Get full product detail + prices by styleID */
    getProduct: (styleID: string): Promise<ProductDetailResponse> =>
        sneaksClient.get(`/product/${styleID}`),

    /** Get best deal for a product */
    getBestDeal: (styleID: string): Promise<BestDealResponse> =>
        sneaksClient.get(`/product/${styleID}/best-deal`),

    /** Get trending / most popular */
    getTrending: (limit: number = 20): Promise<TrendingResponse> =>
        sneaksClient.get('/trending', { params: { limit } }),

    /** Get deals (below retail / lowest priced) */
    getDeals: (limit: number = 20, maxPrice: number = 500): Promise<SearchResponse> =>
        sneaksClient.get('/deals', { params: { limit, maxPrice } }),

    /** Autocomplete for search bar */
    autocomplete: (q: string): Promise<AutocompleteResponse> =>
        sneaksClient.get('/autocomplete', { params: { q } }),
};
