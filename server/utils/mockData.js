// Mock data for fallback when KicksDB API fails or rate limit is reached

const mockSneakers = [
    {
        shoeName: "Jordan 1 Retro High OG Chicago Lost and Found",
        brand: "Jordan",
        silhoutte: "Jordan 1",
        styleID: "DZ5485-612",
        make: "Jordan 1 Retro High OG",
        colorway: "Varsity Red/Black/Sail/Muslin",
        retailPrice: 180,
        thumbnail: "https://images.stockx.com/images/Air-Jordan-1-Retro-High-OG-Chicago-Reimagined-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1665691099",
        releaseDate: "2022-11-19",
        description: "The classic Chicago colorway updated with a vintage look.",
        urlKey: "air-jordan-1-retro-high-og-chicago-reimagined",
        resellLinks: {
            stockX: "https://stockx.com/air-jordan-1-retro-high-og-chicago-reimagined",
            stadiumGoods: "",
            flightClub: "https://www.flightclub.com/air-jordan-1-retro-high-og-dz5485-612",
            goat: "https://www.goat.com/sneakers/air-jordan-1-retro-high-og-dz5485-612"
        },
        lowestPrice: 385,
        sizes: [
            { size: "8", stockX: 385, goat: 400, flightClub: 405, stadiumGoods: 0 },
            { size: "9", stockX: 410, goat: 415, flightClub: 420, stadiumGoods: 0 },
            { size: "10", stockX: 450, goat: 440, flightClub: 450, stadiumGoods: 0 }
        ]
    },
    {
        shoeName: "Nike Dunk Low Retro White Black Panda (2021)",
        brand: "Nike",
        silhoutte: "Dunk",
        styleID: "DD1391-100",
        make: "Nike Dunk Low",
        colorway: "White/Black",
        retailPrice: 100,
        thumbnail: "https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1633027409",
        releaseDate: "2021-03-10",
        description: "The ubiquitous Nike Dunk Low 'Panda' in a versatile colorway.",
        urlKey: "nike-dunk-low-retro-white-black-2021",
        resellLinks: {
            stockX: "https://stockx.com/nike-dunk-low-retro-white-black-2021",
            stadiumGoods: "",
            flightClub: "https://www.flightclub.com/dunk-low-retro-dd1391-100",
            goat: "https://www.goat.com/sneakers/dunk-low-retro-dd1391-100"
        },
        lowestPrice: 130,
        sizes: [
            { size: "8", stockX: 130, goat: 135, flightClub: 140, stadiumGoods: 0 },
            { size: "9", stockX: 125, goat: 130, flightClub: 130, stadiumGoods: 0 },
            { size: "10", stockX: 140, goat: 145, flightClub: 150, stadiumGoods: 0 }
        ]
    },
    {
        shoeName: "Jordan 4 Retro SB Pine Green",
        brand: "Jordan",
        silhoutte: "Jordan 4",
        styleID: "DR5415-103",
        make: "Jordan 4 Retro SB",
        colorway: "Sail/Pine Green-Neutral Grey-White",
        retailPrice: 225,
        thumbnail: "https://images.stockx.com/images/Air-Jordan-4-Retro-SB-Pine-Green-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1678258525",
        releaseDate: "2023-03-21",
        description: "A collaboration between Jordan Brand and Nike SB on the iconic SB 4.",
        urlKey: "air-jordan-4-retro-sb-pine-green",
        resellLinks: {
            stockX: "https://stockx.com/air-jordan-4-retro-sb-pine-green",
            stadiumGoods: "",
            flightClub: "https://www.flightclub.com/air-jordan-4-retro-sb-dr5415-103",
            goat: "https://www.goat.com/sneakers/air-jordan-4-retro-sb-dr5415-103"
        },
        lowestPrice: 420,
        sizes: [
            { size: "8", stockX: 420, goat: 430, flightClub: 435, stadiumGoods: 0 },
            { size: "9", stockX: 440, goat: 445, flightClub: 450, stadiumGoods: 0 },
            { size: "10", stockX: 470, goat: 465, flightClub: 480, stadiumGoods: 0 }
        ]
    },
    {
        shoeName: "Adidas Yeezy Boost 350 V2 Onyx",
        brand: "adidas",
        silhoutte: "Yeezy Boost 350",
        styleID: "HQ4540",
        make: "adidas Yeezy Boost 350 V2",
        colorway: "Onyx/Onyx/Onyx",
        retailPrice: 230,
        thumbnail: "https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Onyx-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1655385627",
        releaseDate: "2022-06-20",
        description: "A sleek, all-black iteration of the popular Yeezy 350 silhouette.",
        urlKey: "adidas-yeezy-boost-350-v2-onyx",
        resellLinks: {
            stockX: "https://stockx.com/adidas-yeezy-boost-350-v2-onyx",
            stadiumGoods: "",
            flightClub: "https://www.flightclub.com/yeezy-boost-350-v2-onyx-hq4540",
            goat: "https://www.goat.com/sneakers/yeezy-boost-350-v2-onyx-hq4540"
        },
        lowestPrice: 280,
        sizes: [
            { size: "8", stockX: 280, goat: 290, flightClub: 295, stadiumGoods: 0 },
            { size: "9", stockX: 300, goat: 310, flightClub: 305, stadiumGoods: 0 },
            { size: "10", stockX: 320, goat: 325, flightClub: 330, stadiumGoods: 0 }
        ]
    },
    {
        shoeName: "Nike Travis Scott x Air Jordan 1 Low OG 'Reverse Mocha'",
        brand: "Jordan",
        silhoutte: "Jordan 1",
        styleID: "DM7866-162",
        make: "Jordan 1 Retro Low OG SP",
        colorway: "Sail/University Red-Ridgerock",
        retailPrice: 150,
        thumbnail: "https://images.stockx.com/images/Air-Jordan-1-Retro-Low-OG-SP-Travis-Scott-Reverse-Mocha-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1658406141",
        releaseDate: "2022-07-21",
        description: "Travis Scott continues his Jordan 1 Low streak with the Reverse Mocha.",
        urlKey: "air-jordan-1-retro-low-og-sp-travis-scott-reverse-mocha",
        resellLinks: {
            stockX: "https://stockx.com/air-jordan-1-retro-low-og-sp-travis-scott-reverse-mocha",
            stadiumGoods: "",
            flightClub: "https://www.flightclub.com/travis-scott-x-air-jordan-1-low-og-reverse-mocha-dm7866-162",
            goat: "https://www.goat.com/sneakers/travis-scott-x-air-jordan-1-low-og-reverse-mocha-dm7866-162"
        },
        lowestPrice: 1050,
        sizes: [
            { size: "8", stockX: 1050, goat: 1075, flightClub: 1100, stadiumGoods: 0 },
            { size: "9", stockX: 1100, goat: 1120, flightClub: 1150, stadiumGoods: 0 },
            { size: "10", stockX: 1250, goat: 1260, flightClub: 1280, stadiumGoods: 0 }
        ]
    }
];

const getMockProducts = (limit = 20) => {
    return mockSneakers.slice(0, limit);
};

const getMockProductByStyleID = (styleID) => {
    return mockSneakers.find(s => s.styleID === styleID) || mockSneakers[0];
};

module.exports = {
    mockSneakers,
    getMockProducts,
    getMockProductByStyleID
};
