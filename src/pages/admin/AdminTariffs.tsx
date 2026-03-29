import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

export default function AdminTariffs() {
  const { tariffs, setTariffs } = useStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [domicile, setDomicile] = useState('');
  const [bureau, setBureau] = useState('');

  const startEdit = (id: number) => {
    const w = tariffs.find(t => t.id === id);
    if (w) {
      setEditingId(id);
      setDomicile(w.domicile.toString());
      setBureau(w.bureau.toString());
    }
  };

  const saveEdit = () => {
    if (editingId === null) return;
    setTariffs(prev => prev.map(t =>
      t.id === editingId ? { ...t, domicile: Number(domicile), bureau: Number(bureau) } : t
    ));
    setEditingId(null);
    toast.success('Tarif mis à jour.');
  };

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/admin/dashboard" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Tarifs livraison</h1>
      </div>

      <div className="px-4 mt-3">
        <div className="grid grid-cols-[1fr_70px_70px_36px] gap-2 text-xs font-medium text-muted-foreground pb-2 border-b">
          <span>Wilaya</span>
          <span>Dom.</span>
          <span>Bur.</span>
          <span></span>
        </div>
        {tariffs.map(t => (
          <div key={t.id} className="grid grid-cols-[1fr_70px_70px_36px] gap-2 items-center py-2 border-b border-border/50 text-sm">
            <span className="truncate">{t.id}. {t.name}</span>
            {editingId === t.id ? (
              <>
                <input value={domicile} onChange={e => setDomicile(e.target.value)} type="number" className="border border-border rounded px-2 py-1 text-xs w-full" />
                <input value={bureau} onChange={e => setBureau(e.target.value)} type="number" className="border border-border rounded px-2 py-1 text-xs w-full" />
                <button onClick={saveEdit} className="p-1"><Check className="w-4 h-4" /></button>
              </>
            ) : (
              <>
                <span className="text-xs">{t.domicile}</span>
                <span className="text-xs">{t.bureau}</span>
                <button onClick={() => startEdit(t.id)} className="text-xs text-muted-foreground underline">Édit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
