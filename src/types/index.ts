export interface Sneaker {
    shoeName: string;
    brand: string;
    silhoutte?: string;
    styleID?: string;
    retailPrice?: number;
    releaseDate?: string;
    description?: string;
    imageLinks?: string[];
    thumbnail?: string;
    urlKey?: string;
    make?: string;
    colorway?: string;
    lowestResellPrice?: {
        stockX?: number;
        goat?: number;
        flightClub?: number;
        stadiumGoods?: number;
    };
    resellLinks?: {
        stockX?: string;
        goat?: string;
        flightClub?: string;
        stadiumGoods?: string;
    };
}
