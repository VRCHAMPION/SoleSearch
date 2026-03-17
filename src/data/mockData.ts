export interface Sneaker {
    id: string;
    name: string;
    brand: string;
    colorway: string;
    styleCode: string;
    releaseDate: string;
    retailPrice: number;
    gender: 'Men' | 'Women' | 'Unisex';
    image: string;
    images: string[];
    sizes: number[];
    description: string;
    tags: string[];
    listings: RetailerListing[];
    priceHistory: PricePoint[];
}

export interface RetailerListing {
    retailer: string;
    retailerLogo: string;
    condition: 'New' | 'Used' | 'Deadstock';
    price: number;
    shipping: number | 'Free';
    lastUpdated: string;
    url: string;
    verified: boolean;
}

export interface PricePoint {
    date: string;
    price: number;
}

const generatePriceHistory = (basePrice: number, days: number = 30): PricePoint[] => {
    const points: PricePoint[] = [];
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * basePrice * 0.15;
        points.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(basePrice + variance),
        });
    }
    return points;
};

export const sneakers: Sneaker[] = [
    {
        id: '1',
        name: 'Air Jordan 1 Retro High OG',
        brand: 'Nike',
        colorway: 'Chicago / Lost & Found',
        styleCode: 'DZ5485-612',
        releaseDate: '2022-11-19',
        retailPrice: 180,
        gender: 'Men',
        image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600&h=600&fit=crop',
            'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=600&h=600&fit=crop',
        ],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13],
        description: 'The Air Jordan 1 Retro High OG "Lost & Found" pays tribute to the thrill of the hunt, featuring a vintage-inspired design with aged details.',
        tags: ['Jordan', 'Retro', 'High Top', 'OG'],
        listings: [
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 245, shipping: 'Free', lastUpdated: '2 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 252, shipping: 15, lastUpdated: '5 min ago', url: '#', verified: true },
            { retailer: 'eBay', retailerLogo: '/logos/ebay.svg', condition: 'New', price: 238, shipping: 12, lastUpdated: '12 min ago', url: '#', verified: false },
            { retailer: 'Flight Club', retailerLogo: '/logos/flightclub.svg', condition: 'Deadstock', price: 260, shipping: 'Free', lastUpdated: '8 min ago', url: '#', verified: true },
            { retailer: 'Stadium Goods', retailerLogo: '/logos/stadiumgoods.svg', condition: 'New', price: 255, shipping: 'Free', lastUpdated: '15 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(250),
    },
    {
        id: '2',
        name: 'Yeezy Boost 350 V2',
        brand: 'Adidas',
        colorway: 'Zebra',
        styleCode: 'CP9654',
        releaseDate: '2022-08-22',
        retailPrice: 230,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&h=600&fit=crop',
        ],
        sizes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        description: 'The adidas Yeezy Boost 350 V2 "Zebra" features a white and black Primeknit upper with signature SPLY-350 branding.',
        tags: ['Yeezy', 'Boost', 'Kanye', 'Primeknit'],
        listings: [
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 278, shipping: 'Free', lastUpdated: '3 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 285, shipping: 15, lastUpdated: '7 min ago', url: '#', verified: true },
            { retailer: 'eBay', retailerLogo: '/logos/ebay.svg', condition: 'New', price: 265, shipping: 'Free', lastUpdated: '20 min ago', url: '#', verified: false },
            { retailer: 'Flight Club', retailerLogo: '/logos/flightclub.svg', condition: 'Deadstock', price: 290, shipping: 'Free', lastUpdated: '10 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(280),
    },
    {
        id: '3',
        name: 'Nike Dunk Low',
        brand: 'Nike',
        colorway: 'Panda / Black White',
        styleCode: 'DD1391-100',
        releaseDate: '2023-01-12',
        retailPrice: 110,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop',
        ],
        sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
        description: 'The Nike Dunk Low "Panda" is a versatile black and white colorway that has become one of the most popular sneakers globally.',
        tags: ['Dunk', 'Low', 'Classic', 'Panda'],
        listings: [
            { retailer: 'Nike', retailerLogo: '/logos/nike.svg', condition: 'New', price: 110, shipping: 'Free', lastUpdated: '1 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 105, shipping: 'Free', lastUpdated: '4 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 112, shipping: 15, lastUpdated: '6 min ago', url: '#', verified: true },
            { retailer: 'Foot Locker', retailerLogo: '/logos/footlocker.svg', condition: 'New', price: 110, shipping: 8, lastUpdated: '30 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(108),
    },
    {
        id: '4',
        name: 'New Balance 550',
        brand: 'New Balance',
        colorway: 'White Green',
        styleCode: 'BB550WT1',
        releaseDate: '2023-03-15',
        retailPrice: 110,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&h=600&fit=crop',
        ],
        sizes: [7, 8, 9, 9.5, 10, 10.5, 11, 12, 13],
        description: 'The New Balance 550 "White Green" features a clean white leather upper with green accents, bringing back classic basketball style.',
        tags: ['New Balance', '550', 'Retro', 'Basketball'],
        listings: [
            { retailer: 'New Balance', retailerLogo: '/logos/newbalance.svg', condition: 'New', price: 110, shipping: 'Free', lastUpdated: '10 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 125, shipping: 'Free', lastUpdated: '5 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 130, shipping: 15, lastUpdated: '8 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(120),
    },
    {
        id: '5',
        name: 'Air Force 1 Low',
        brand: 'Nike',
        colorway: 'Triple White',
        styleCode: '315122-111',
        releaseDate: '2023-06-01',
        retailPrice: 110,
        gender: 'Men',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
        ],
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14],
        description: 'The Nike Air Force 1 Low "Triple White" is the quintessential classic sneaker, featuring an all-white leather upper.',
        tags: ['Air Force', 'Classic', 'White', 'Low'],
        listings: [
            { retailer: 'Nike', retailerLogo: '/logos/nike.svg', condition: 'New', price: 110, shipping: 'Free', lastUpdated: '1 min ago', url: '#', verified: true },
            { retailer: 'Foot Locker', retailerLogo: '/logos/footlocker.svg', condition: 'New', price: 110, shipping: 'Free', lastUpdated: '15 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 98, shipping: 'Free', lastUpdated: '3 min ago', url: '#', verified: true },
            { retailer: 'eBay', retailerLogo: '/logos/ebay.svg', condition: 'New', price: 95, shipping: 8, lastUpdated: '25 min ago', url: '#', verified: false },
        ],
        priceHistory: generatePriceHistory(105),
    },
    {
        id: '6',
        name: 'Nike SB Dunk Low Pro',
        brand: 'Nike',
        colorway: 'Travis Scott / Cactus Jack',
        styleCode: 'CT5053-001',
        releaseDate: '2020-02-29',
        retailPrice: 150,
        gender: 'Men',
        image: 'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=600&h=600&fit=crop',
        ],
        sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
        description: 'The Travis Scott x Nike SB Dunk Low features a multi-layered paisley pattern, plaid, and corduroy upper.',
        tags: ['Travis Scott', 'SB', 'Dunk', 'Collab'],
        listings: [
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 1850, shipping: 'Free', lastUpdated: '2 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 1920, shipping: 'Free', lastUpdated: '4 min ago', url: '#', verified: true },
            { retailer: 'Flight Club', retailerLogo: '/logos/flightclub.svg', condition: 'Deadstock', price: 1800, shipping: 'Free', lastUpdated: '6 min ago', url: '#', verified: true },
            { retailer: 'eBay', retailerLogo: '/logos/ebay.svg', condition: 'Used', price: 1450, shipping: 20, lastUpdated: '30 min ago', url: '#', verified: false },
        ],
        priceHistory: generatePriceHistory(1850),
    },
    {
        id: '7',
        name: 'Air Jordan 4 Retro',
        brand: 'Nike',
        colorway: 'Military Black',
        styleCode: 'DH6927-111',
        releaseDate: '2022-05-21',
        retailPrice: 190,
        gender: 'Men',
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=600&fit=crop',
        ],
        sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
        description: 'The Air Jordan 4 Retro "Military Black" features a white leather upper with black and grey accents for a clean, versatile look.',
        tags: ['Jordan', 'Retro', 'Military', 'AJ4'],
        listings: [
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 215, shipping: 'Free', lastUpdated: '3 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 220, shipping: 15, lastUpdated: '9 min ago', url: '#', verified: true },
            { retailer: 'Stadium Goods', retailerLogo: '/logos/stadiumgoods.svg', condition: 'Deadstock', price: 228, shipping: 'Free', lastUpdated: '12 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(220),
    },
    {
        id: '8',
        name: 'ASICS Gel-Kayano 14',
        brand: 'ASICS',
        colorway: 'Silver / Cream',
        styleCode: '1201A019-108',
        releaseDate: '2023-09-01',
        retailPrice: 150,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
        ],
        sizes: [6, 7, 8, 9, 10, 11, 12],
        description: 'The ASICS Gel-Kayano 14 makes a comeback with its iconic Y2K design, featuring metallic silver accents and GEL cushioning.',
        tags: ['ASICS', 'Gel', 'Y2K', 'Running'],
        listings: [
            { retailer: 'ASICS', retailerLogo: '/logos/asics.svg', condition: 'New', price: 150, shipping: 'Free', lastUpdated: '5 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 165, shipping: 'Free', lastUpdated: '7 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 170, shipping: 15, lastUpdated: '10 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(160),
    },
    {
        id: '9',
        name: 'Converse Chuck Taylor 70 Hi',
        brand: 'Converse',
        colorway: 'Black / Egret',
        styleCode: '162050C',
        releaseDate: '2023-01-01',
        retailPrice: 90,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600&h=600&fit=crop',
        ],
        sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13],
        description: 'The Converse Chuck 70 Hi upgrades the classic Chuck Taylor with premium canvas, better cushioning, and vintage details.',
        tags: ['Converse', 'Chuck', 'Classic', 'High Top'],
        listings: [
            { retailer: 'Converse', retailerLogo: '/logos/converse.svg', condition: 'New', price: 90, shipping: 'Free', lastUpdated: '2 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 85, shipping: 'Free', lastUpdated: '8 min ago', url: '#', verified: true },
            { retailer: 'Foot Locker', retailerLogo: '/logos/footlocker.svg', condition: 'New', price: 90, shipping: 8, lastUpdated: '20 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(88),
    },
    {
        id: '10',
        name: 'Adidas Samba OG',
        brand: 'Adidas',
        colorway: 'White / Black / Gum',
        styleCode: 'B75806',
        releaseDate: '2023-04-20',
        retailPrice: 100,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
        ],
        sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
        description: 'The Adidas Samba OG brings iconic indoor soccer style to the street with a leather upper, suede T-toe overlay, and gum sole.',
        tags: ['Adidas', 'Samba', 'Classic', 'Soccer'],
        listings: [
            { retailer: 'Adidas', retailerLogo: '/logos/adidas.svg', condition: 'New', price: 100, shipping: 'Free', lastUpdated: '3 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 115, shipping: 'Free', lastUpdated: '6 min ago', url: '#', verified: true },
            { retailer: 'GOAT', retailerLogo: '/logos/goat.svg', condition: 'New', price: 118, shipping: 15, lastUpdated: '9 min ago', url: '#', verified: true },
            { retailer: 'Foot Locker', retailerLogo: '/logos/footlocker.svg', condition: 'New', price: 100, shipping: 8, lastUpdated: '22 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(108),
    },
    {
        id: '11',
        name: 'Nike Air Max 90',
        brand: 'Nike',
        colorway: 'Infrared',
        styleCode: 'CT1685-100',
        releaseDate: '2023-07-15',
        retailPrice: 130,
        gender: 'Men',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
        ],
        sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
        description: 'The Nike Air Max 90 "Infrared" brings back the iconic colorway with visible Air Max cushioning and classic design.',
        tags: ['Air Max', 'Infrared', 'Classic', 'Running'],
        listings: [
            { retailer: 'Nike', retailerLogo: '/logos/nike.svg', condition: 'New', price: 130, shipping: 'Free', lastUpdated: '4 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 142, shipping: 'Free', lastUpdated: '7 min ago', url: '#', verified: true },
            { retailer: 'Foot Locker', retailerLogo: '/logos/footlocker.svg', condition: 'New', price: 130, shipping: 'Free', lastUpdated: '18 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(135),
    },
    {
        id: '12',
        name: 'PUMA Suede Classic XXI',
        brand: 'Puma',
        colorway: 'Black / White',
        styleCode: '374915-01',
        releaseDate: '2023-02-10',
        retailPrice: 70,
        gender: 'Unisex',
        image: 'https://images.unsplash.com/photo-1608379743498-91dbeda0a789?w=600&h=600&fit=crop',
        images: [
            'https://images.unsplash.com/photo-1608379743498-91dbeda0a789?w=600&h=600&fit=crop',
        ],
        sizes: [6, 7, 8, 9, 10, 11, 12, 13],
        description: 'The PUMA Suede Classic XXI refreshes the iconic silhouette with a soft suede upper and the trademark formstrip.',
        tags: ['Puma', 'Suede', 'Classic', 'Retro'],
        listings: [
            { retailer: 'Puma', retailerLogo: '/logos/puma.svg', condition: 'New', price: 70, shipping: 'Free', lastUpdated: '5 min ago', url: '#', verified: true },
            { retailer: 'StockX', retailerLogo: '/logos/stockx.svg', condition: 'Deadstock', price: 65, shipping: 'Free', lastUpdated: '10 min ago', url: '#', verified: true },
            { retailer: 'Foot Locker', retailerLogo: '/logos/footlocker.svg', condition: 'New', price: 70, shipping: 8, lastUpdated: '25 min ago', url: '#', verified: true },
        ],
        priceHistory: generatePriceHistory(68),
    },
];

export const brands = ['Nike', 'Adidas', 'New Balance', 'Puma', 'ASICS', 'Converse', 'Reebok', 'Vans'];

export const getBestPrice = (listings: RetailerListing[]): RetailerListing => {
    return listings.reduce((best, current) => {
        const bestTotal = best.price + (best.shipping === 'Free' ? 0 : best.shipping);
        const currentTotal = current.price + (current.shipping === 'Free' ? 0 : current.shipping);
        return currentTotal < bestTotal ? current : best;
    });
};

export const getTotalPrice = (listing: RetailerListing): number => {
    return listing.price + (listing.shipping === 'Free' ? 0 : listing.shipping);
};
