import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';

const statusColors: Record<string, string> = {
  nouvelle: 'bg-secondary',
  confirmée: 'bg-foreground text-background',
  expédiée: 'bg-foreground/70 text-background',
  livrée: 'bg-foreground/40',
  annulée: 'bg-destructive text-destructive-foreground',
};

export default function AdminOrders() {
  const { orders, setOrders } = useStore();

  const updateStatus = (id: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: status as any } : o));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/admin/dashboard" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Commandes ({orders.length})</h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Aucune commande.</p>
      ) : (
        <div className="px-4 space-y-3 mt-2">
          {orders.map(o => (
            <div key={o.id} className="border border-border rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">{o.clientName}</p>
                  <p className="text-xs text-muted-foreground">{o.phone}</p>
                </div>
                <button onClick={() => deleteOrder(o.id)} className="p-1">
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">{o.wilaya} · {o.deliveryType}</p>
              <div className="text-xs space-y-1">
                {o.items.map((item, i) => (
                  <p key={i}>{item.quantity}x {item.productName} ({item.color}, {item.size})</p>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-sm">{formatPrice(o.total)}</span>
                <select
                  value={o.status}
                  onChange={e => updateStatus(o.id, e.target.value)}
                  className="text-xs border border-border rounded-lg px-2 py-1 bg-background"
                >
                  {['nouvelle', 'confirmée', 'expédiée', 'livrée', 'annulée'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
