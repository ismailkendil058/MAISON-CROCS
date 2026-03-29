import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, WilayaTariff } from '@/lib/utils';
import { fetchProducts, fetchCategories, fetchWilayas, fetchOrders } from '@/hooks/useSupabaseQueries';

export interface Order {
  id: string;
  clientName: string;
  phone: string;
  wilaya: string;
  deliveryType: 'domicile' | 'bureau';
  address?: string;
  items: { productId: string; productName: string; color: string; size: number; quantity: number; price: number }[];
  total: number;
  deliveryFee: number;
  status: 'nouvelle' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée';
  date: string;
}

interface StoreCategory {
  id: string;
  label: string;
  image?: string;
}

interface StoreContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  categories: StoreCategory[];
  setCategories: React.Dispatch<React.SetStateAction<StoreCategory[]>>;
  tariffs: WilayaTariff[];
  setTariffs: React.Dispatch<React.SetStateAction<WilayaTariff[]>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [tariffs, setTariffs] = useState<WilayaTariff[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [prods, cats, wilayas, ords] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchWilayas(),
          fetchOrders()
        ]);
        setProducts(prods);
        setCategories((cats || []) as StoreCategory[]);
        setTariffs(wilayas);
        setOrders(ords as Order[]);
      } catch (error) {
        console.error('Failed to load store data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={{ products, setProducts, orders, setOrders, categories, setCategories, tariffs, setTariffs, isAdmin, setIsAdmin, loading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}
