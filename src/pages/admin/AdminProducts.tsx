import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit, Upload } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import type { Product } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { createProduct, updateProduct, deleteProduct, fetchProducts } from '@/hooks/useSupabaseQueries';

export default function AdminProducts() {
  const { products, setProducts } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [colors, setColors] = useState<Array<{name: string, hex: string, file?: File}>>([]);
  const [currentColor, setCurrentColor] = useState({ name: '', hex: '#000000', file: undefined as File | undefined });

  const [form, setForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: 'homme' as 'homme' | 'femme' | 'enfant',
    sizes: '',
    isPack: false,
  });

  const addColor = () => {
    if (currentColor.name.trim()) {
      setColors(prev => [...prev, { ...currentColor }]);
      setCurrentColor({ name: '', hex: '#000000', file: undefined });
    }
  };

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setForm({ name: '', price: '', oldPrice: '', description: '', category: 'homme', sizes: '', isPack: false });
    setSelectedFiles([]);
    setColors([]);
    setCurrentColor({ name: '', hex: '#000000', file: undefined });
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (p: Product) => {
    setForm({
      name: p.name,
      price: p.price.toString(),
      oldPrice: p.oldPrice?.toString() || '',
      description: p.description,
      category: p.category,
      sizes: p.sizes.join(', '),
      isPack: p.isPack,
    });
    setColors(p.colors.map(c => ({ name: c.name, hex: c.hex, file: undefined })));
    setEditing(p);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error('Nom et prix requis.');
      return;
    }

    setUploading(true);
    try {
      // Upload product images
      const uploadedUrls: string[] = [];
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('products')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      // Upload color images and create colors array
      const finalColors = [];
      for (const color of colors) {
        let imageUrl = color.file ? '' : (editing?.colors.find(c => c.name === color.name)?.image || '');
        if (color.file) {
          const fileExt = color.file.name.split('.').pop();
          const fileName = `color-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('products')
            .upload(fileName, color.file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);

          imageUrl = publicUrl;
        }
        finalColors.push({ name: color.name, hex: color.hex, image: imageUrl });
      }

      const sizes = form.sizes.split(',').map(s => parseInt(s.trim())).filter(Boolean);

      if (editing) {
        await updateProduct(editing.id, {
          name: form.name,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
          description: form.description,
          category: form.category,
          sizes,
          isPack: form.isPack,
          images: uploadedUrls.length > 0 ? uploadedUrls : editing.images,
          colors: finalColors
        });
        toast.success('Produit modifié.');
      } else {
        await createProduct({
          name: form.name,
          price: Number(form.price),
          oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
          description: form.description,
          category: form.category,
          sizes,
          isPack: form.isPack,
          images: uploadedUrls,
          colors: finalColors
        });
        toast.success('Produit ajouté.');
      }

      // Reload products
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erreur lors de la sauvegarde.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Produit supprimé.');
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression.');
    }
  };

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20";

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/admin/dashboard" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-lg font-semibold">Produits</h1>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="p-2 bg-foreground text-background rounded-lg">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showForm && (
        <div className="px-4 py-4 space-y-3 border-b">
          <input placeholder="Nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Prix (DA)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} type="number" className={inputClass} />
            <input placeholder="Ancien prix" value={form.oldPrice} onChange={e => setForm({ ...form, oldPrice: e.target.value })} type="number" className={inputClass} />
          </div>
          <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inputClass} />
          <div>
            <label className="block text-sm font-medium mb-2">Images du produit</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
              className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
            {selectedFiles.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{selectedFiles.length} fichier(s) sélectionné(s)</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Couleurs disponibles</label>
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Nom de la couleur" value={currentColor.name} onChange={e => setCurrentColor({ ...currentColor, name: e.target.value })} className={inputClass} />
                <input type="color" value={currentColor.hex} onChange={e => setCurrentColor({ ...currentColor, hex: e.target.value })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20" />
                <input type="file" accept="image/*" onChange={e => setCurrentColor({ ...currentColor, file: e.target.files?.[0] })} className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20" />
              </div>
              <button type="button" onClick={addColor} className="w-full bg-secondary text-secondary-foreground py-2 rounded-xl text-sm font-medium">Ajouter couleur</button>
            </div>
            {colors.length > 0 && (
              <div className="mt-3 space-y-2">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border border-border rounded-xl">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }}></div>
                    <span className="text-sm">{color.name}</span>
                    {color.file && <span className="text-xs text-muted-foreground">Image: {color.file.name}</span>}
                    <button type="button" onClick={() => removeColor(index)} className="ml-auto p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })} className={inputClass}>
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="enfant">Enfant</option>
          </select>
          <input placeholder="Pointures (ex: 39, 40, 41)" value={form.sizes} onChange={e => setForm({ ...form, sizes: e.target.value })} className={inputClass} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isPack} onChange={e => setForm({ ...form, isPack: e.target.checked })} />
            Pack
          </label>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={uploading} className="flex-1 bg-foreground text-background py-3 rounded-xl text-sm font-semibold disabled:opacity-50">
              {uploading ? 'Téléchargement...' : editing ? 'Modifier' : 'Ajouter'}
            </button>
            <button onClick={resetForm} disabled={uploading} className="flex-1 border border-border py-3 rounded-xl text-sm font-medium disabled:opacity-50">Annuler</button>
          </div>
        </div>
      )}

      <div className="px-4 space-y-3 mt-3">
        {products.map(p => (
          <div key={p.id} className="flex items-center gap-3 border border-border rounded-xl p-3">
            <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-lg object-cover bg-secondary" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{formatPrice(p.price)} {p.oldPrice ? `· ${getDiscountPercent(p.price, p.oldPrice)}% off` : ''}</p>
            </div>
            <button onClick={() => startEdit(p)} className="p-2"><Edit className="w-4 h-4" /></button>
            <button onClick={() => handleDelete(p.id)} className="p-2"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
