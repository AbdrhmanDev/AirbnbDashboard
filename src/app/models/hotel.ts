import { Address } from './address';
import { Category } from './category';
import { Host } from './host';

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
  categoryId: Category;
  address: Address;
  path: string;
  
  hostId?: Host; // Optional field in case host details are populated
  createdAt: string;
  updatedAt: string;
}
