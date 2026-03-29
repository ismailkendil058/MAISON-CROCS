import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import catFemme from '@/assets/cat-femme.jpg';
import catHomme from '@/assets/cat-homme.jpg';
import catEnfant from '@/assets/cat-enfant.jpg';

const categoryImagesFallback: Record<string, string> = {
  femme: catFemme,
  homme: catHomme,
  enfant: catEnfant,
};

export default function Index() {
  const { products, categories, loading } = useStore();

  const promos = products.filter(p => p.oldPrice || p.isPack);
  const featured = products.slice(0, 6);

  if (loading) {
    return (
      <div className="pb-8 space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-muted w-48 mb-4"></div>
          <div className="flex gap-4 h-32 bg-muted rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-muted w-40 mb-4"></div>
          <div className="flex gap-3 h-32 bg-muted rounded-lg"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-muted w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Promos Section */}
      <section className="px-4 pt-6 pb-4">
        <h2 className="text-lg font-semibold mb-4 tracking-tight">Packs & Promotions</h2>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {promos.map(p => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-4 tracking-tight">Catégories</h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categorie/${cat.id}`}
              className="min-w-[140px] w-[140px] flex-shrink-0"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-2">
                <img
                  src={cat.image || categoryImagesFallback[cat.id as keyof typeof categoryImagesFallback] || ''}
                  alt={cat.label}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-center text-sm font-medium capitalize">{cat.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-4 tracking-tight">Nos Produits</h2>
        <div className="grid grid-cols-2 gap-4">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

