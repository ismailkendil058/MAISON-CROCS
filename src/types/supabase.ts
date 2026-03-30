import type { Database } from '@/integrations/supabase/types';

declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        products: {
          Row: {
            id: string;
            name: string;
            price: number;
            old_price: number | null;
            description: string;
            category: string;
            sizes: number[];
            is_pack: boolean;
            created_at: string;
          };
          Insert: {
            name: string;
            price: number;
            old_price?: number | null;
            description?: string;
            category: string;
            sizes?: number[];
            is_pack?: boolean;
          };
          Update: {
            name?: string;
            price?: number;
            old_price?: number | null;
            description?: string;
            category?: string;
            sizes?: number[];
            is_pack?: boolean;
          };
        };
        product_colors: {
          Row: {
            id: string;
            product_id: string;
            name: string;
            hex: string;
            image: string;
            sort_order: number;
          };
          Insert: {
            product_id: string;
            name: string;
            hex: string;
            image: string;
            sort_order: number;
          };
        };
        product_images: {
          Row: {
            id: string;
            product_id: string;
            url: string;
            sort_order: number;
          };
          Insert: {
            product_id: string;
            url: string;
            sort_order: number;
          };
        };
        categories: {
          Row: {
            id: string;
            label: string;
            image?: string;
            created_at: string;
          };
          Insert: {
            id: string;
            label: string;
            image?: string;
          };
        };
        wilayas_tariffs: {
          Row: {
            id: number;
            name: string;
            domicile: number;
            bureau: number;
          };
          Update: {
            name?: string;
            domicile?: number;
            bureau?: number;
          };
        };
        orders: {
          Row: {
            id: string;
            client_name: string;
            phone: string;
            wilaya: string;
            delivery_type: string;
            address?: string;
            total: number;
            delivery_fee: number;
            status: string;
            created_at: string;
          };
          Insert: {
            client_name: string;
            phone: string;
            wilaya: string;
            delivery_type: string;
            address?: string;
            total: number;
            delivery_fee?: number;
          };
          Update: {
            status?: string;
          };
        };
        order_items: {
          Row: {
            id: string;
            order_id: string;
            product_id?: string;
            product_name: string;
            color: string;
            size: number;
            quantity: number;
            price: number;
          };
          Insert: {
            order_id: string;
            product_id?: string;
            product_name: string;
            color?: string;
            size: number;
            quantity?: number;
            price: number;
          };
        };
        admin_auth: {
          Row: {
            id: number;
            password_hash: string;
            created_at: string;
            last_login: string | null;
          };
          Insert: {
            password_hash: string;
          };
          Update: {
            password_hash?: string;
            last_login?: string;
          };
        };
      };
    };
  }
}

export type DbResult = Database['public']['Tables']['products']['Row']

// Helper types
export interface AdminAuth {
  id: number;
  password_hash: string;
  created_at: string;
  last_login: string | null;
}
