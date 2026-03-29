import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Moved from src/data/products.ts
export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  category: 'femme' | 'homme' | 'enfant';
  colors: ProductColor[];
  sizes: number[];
  isPack: boolean;
  images: string[];
}

export interface WilayaTariff {
  id: number;
  name: string;
  domicile: number;
  bureau: number;
}

export function getDiscountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function formatPrice(price: number): string {
  return price.toLocaleString('fr-DZ') + ' DA';
}

