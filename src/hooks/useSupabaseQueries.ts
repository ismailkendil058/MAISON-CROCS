import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';

declare module '@/integrations/supabase/types' {
  interface Database {
    public: {
      Tables: {
        products: {
          Row: {
            id: string;
            name: string;
            price: number;
            old_price?: number | null;
            description: string;
            category: string;
            sizes: number[];
            is_pack: boolean;
            created_at: string;
          };
          Insert: {
            id?: string;
            name: string;
            price: number;
            old_price?: number | null;
            description?: string;
            category: string;
            sizes?: number[];
            is_pack?: boolean;
            created_at?: string;
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
            image?: string;
            sort_order?: number;
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
            sort_order?: number;
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
      };
    };
  }
}
import type { Product, ProductColor, WilayaTariff, Order } from '@/lib/utils';

type ProductWithRelations = Database['public']['Tables']['products']['Row'] & {
  product_colors: Database['public']['Tables']['product_colors']['Row'][];
  product_images: Database['public']['Tables']['product_images']['Row'][];
};

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_colors (
        name,
        hex,
        image,
        sort_order
      ),
      product_images (
        url,
        sort_order
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as ProductWithRelations[]).map(p => ({
    id: p.id as string, // UUID to string
    name: p.name,
    price: p.price,
    oldPrice: p.old_price ?? undefined,
    description: p.description,
    category: p.category,
    sizes: p.sizes as number[],
    isPack: p.is_pack,
    colors: p.product_colors
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(c => ({
        name: c.name,
        hex: c.hex,
        image: c.image || ''
      })) as ProductColor[],
    images: p.product_images
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(img => img.url)
  }));
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('label');

  if (error) throw error;
  return data;
}

export async function fetchWilayas(): Promise<WilayaTariff[]> {
  const { data, error } = await supabase
    .from('wilayas_tariffs')
    .select('*')
    .order('id');

  if (error) throw error;
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((order: any) => ({
    id: order.id,
    clientName: order.client_name,
    phone: order.phone,
    wilaya: order.wilaya,
    deliveryType: order.delivery_type as 'domicile' | 'bureau',
    address: order.address || undefined,
    items: (order.order_items || []).map((item: any) => ({
      productId: item.product_id || '',
      productName: item.product_name,
      color: item.color || '',
      size: item.size,
      quantity: item.quantity,
      price: item.price
    })),
    total: order.total,
    deliveryFee: order.delivery_fee,
    status: order.status as 'nouvelle' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée',
    date: order.created_at
  }));
}

// Admin CRUD - Products
export async function createProduct(productData: Omit<Product, 'id' | 'colors' | 'images'> & { colors: Omit<ProductColor, 'sort_order'>[], images: string[] }) {
  const { data: newProduct, error: insertError } = await supabase
    .from('products')
    .insert({
      name: productData.name,
      price: productData.price,
      old_price: productData.oldPrice,
      description: productData.description,
      category: productData.category,
      sizes: productData.sizes,
      is_pack: productData.isPack
    })
    .select()
    .single();

  if (insertError) throw insertError;

  // Insert colors
  const colorInserts = productData.colors.map((c, idx) => ({
    product_id: newProduct.id,
    name: c.name,
    hex: c.hex,
    image: c.image,
    sort_order: idx
  }));
  await supabase.from('product_colors').insert(colorInserts);

  // Insert images
  const imageInserts = productData.images.map((url, idx) => ({
    product_id: newProduct.id,
    url,
    sort_order: idx
  }));
  await supabase.from('product_images').insert(imageInserts);

  return newProduct;
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id' | 'colors' | 'images'>> & { colors?: Omit<ProductColor, 'sort_order'>[], images?: string[] }) {
  // Update product
  const { error: updateError } = await supabase
    .from('products')
    .update({
      name: productData.name,
      price: productData.price,
      old_price: productData.oldPrice,
      description: productData.description,
      category: productData.category,
      sizes: productData.sizes,
      is_pack: productData.isPack
    })
    .eq('id', id);

  if (updateError) throw updateError;

  // Upsert colors/images if provided (simplified; delete+insert for full sync)
  if (productData.colors) {
    await supabase.from('product_colors').delete().eq('product_id', id);
    const colorInserts = productData.colors?.map((c, idx) => ({ product_id: id, ...c, sort_order: idx })) || [];
    await supabase.from('product_colors').insert(colorInserts);
  }
  if (productData.images) {
    await supabase.from('product_images').delete().eq('product_id', id);
    const imageInserts = productData.images?.map((url, idx) => ({ product_id: id, url, sort_order: idx })) || [];
    await supabase.from('product_images').insert(imageInserts);
  }
}

export async function deleteProduct(id: string) {
  console.log('deleteProduct called with ID:', id, 'type:', typeof id);
  const { data, error } = await supabase.from('products').delete().eq('id', id).select();
  console.log('Supabase delete response:', { data, error });
  if (error) throw error;
  return { data, error: null };
}

// Simplified CRUD for categories, wilayas, orders (expand as needed)
export async function createCategory(label: string) {
  const { data, error } = await supabase.from('categories').insert({ label }).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, label: string) {
  const { error } = await supabase.from('categories').update({ label }).eq('id', id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function updateWilayaTariff(id: number, updates: Partial<{name: string, domicile: number, bureau: number}>) {
  const { error } = await supabase.from('wilayas_tariffs').update(updates).eq('id', id);
  if (error) throw error;
}

export async function submitOrder(orderData: {
  client_name: string;
  phone: string;
  wilaya: string;
  delivery_type: 'domicile' | 'bureau';
  address?: string;
  total: number;
  delivery_fee: number;
  items: Array<{
    product_name: string;
    color: string;
    size: number;
    quantity: number;
    price: number;
  }>;
}) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      client_name: orderData.client_name,
      phone: orderData.phone,
      wilaya: orderData.wilaya,
      delivery_type: orderData.delivery_type,
      address: orderData.address,
      total: orderData.total,
      delivery_fee: orderData.delivery_fee
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const itemsInserts = orderData.items.map(item => ({
    order_id: order.id,
    product_name: item.product_name,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    price: item.price
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(itemsInserts);
  if (itemsError) throw itemsError;

  return order;
}

export async function updateOrderStatus(id: string, status: 'nouvelle' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée') {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}

