import { Address } from "./address";
import { Category } from "./category";

export interface Hotel {
    _id: string;
    title: string;
    description: string;
    pricePerNight: number;
    images: string[];
    rating: number;
    status: string;
    rooms: number;
    bathrooms: number;
    categories: Category;
    address: Address;
    createdAt: string;
}
