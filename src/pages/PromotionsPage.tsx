import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function PromotionsPage() {
  const { products } = useStore();
  const promos = products.filter(p => p.oldPrice || p.isPack);

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Promotions</h1>
      </div>
      <div className="px-4 grid grid-cols-2 gap-4 pt-2">
        {promos.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
