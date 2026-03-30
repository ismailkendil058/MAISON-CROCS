import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
// femme image from external URL (CORS workaround via img src)
const catFemme = '';
import catHomme from '@/assets/cat-homme.jpg';
import catEnfant from '@/assets/cat-enfant.jpg';

const categoryImagesFallback: Record<string, string> = {
  femme: 'https://www.eram.fr/media/catalog/product/8/4/840674_0.jpg?optimize=medium&bg-color=255,255,255&fit=bounds&height=1560&width=1560&canvas=1560:1560',
  homme: catHomme,
  enfant: catEnfant,
};

export default function CategoriesPage() {
  const { categories, loading } = useStore();

  if (loading) {
    return (
      <div className="pb-8">
        <div className="px-4 pt-4 pb-2 flex items-center gap-3">
          <div className="p-1 w-5 h-5 bg-muted rounded"></div>
          <div className="h-7 bg-muted w-32"></div>
        </div>
        <div className="px-4 space-y-4 pt-2">
          <div className="aspect-[2/1] bg-muted rounded-xl animate-pulse"></div>
          <div className="aspect-[2/1] bg-muted rounded-xl animate-pulse"></div>
          <div className="aspect-[2/1] bg-muted rounded-xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Catégories</h1>
      </div>
      <div className="px-4 space-y-4 pt-2">
        {categories.map((cat) => (
          <Link key={cat.id} to={`/categorie/${cat.id}`} className="block relative aspect-[2.2/1] rounded-xl overflow-hidden">
            <img 
              src={cat.image || categoryImagesFallback[cat.id as keyof typeof categoryImagesFallback] || ''} 
              alt={cat.label} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
              <span className="text-background text-2xl font-bold tracking-wide">{cat.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

