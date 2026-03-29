import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

export default function AdminCategories() {
  const { categories, setCategories } = useStore();
  const [newCat, setNewCat] = useState('');

  const addCategory = () => {
    if (!newCat.trim()) return;
    const id = newCat.toLowerCase().replace(/\s+/g, '-');
    if (categories.find(c => c.id === id)) {
      toast.error('Catégorie existante.');
      return;
    }
    setCategories(prev => [...prev, { id, label: newCat.trim() }]);
    setNewCat('');
    toast.success('Catégorie ajoutée.');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('Catégorie supprimée.');
  };

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/admin/dashboard" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Catégories</h1>
      </div>

      <div className="px-4 flex gap-2 mt-3">
        <input
          placeholder="Nouvelle catégorie"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          className="flex-1 border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
        <button onClick={addCategory} className="bg-foreground text-background p-3 rounded-xl">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 space-y-2 mt-4">
        {categories.map(c => (
          <div key={c.id} className="flex items-center justify-between border border-border rounded-xl px-4 py-3">
            <span className="font-medium text-sm">{c.label}</span>
            <button onClick={() => deleteCategory(c.id)} className="p-1">
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
