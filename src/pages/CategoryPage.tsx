import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useStore();

  const filtered = products.filter(p => p.category === id);
  const label = id ? id.charAt(0).toUpperCase() + id.slice(1) : '';

  if (loading) {
    return (
      <div className="pb-8">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <div className="p-1 w-5 h-5 bg-muted rounded"></div>
          <div className="h-7 bg-muted w-24"></div>
        </div>
        <div className="px-4 grid grid-cols-2 gap-4 pt-2">
          <div className="aspect-square bg-muted rounded-xl animate-pulse"></div>
          <div className="aspect-square bg-muted rounded-xl animate-pulse"></div>
          <div className="aspect-square bg-muted rounded-xl animate-pulse"></div>
          <div className="aspect-square bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">{label}</h1>
      </div>
      <div className="px-4 grid grid-cols-2 gap-4 pt-2">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center text-muted-foreground py-12">Aucun produit dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
}

