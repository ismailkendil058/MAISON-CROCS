import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, BarChart3, Truck, Grid3X3, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const { orders, products, setIsAdmin } = useStore();

  const totalRevenue = (orders || []).reduce((s, o) => s + (o?.total || 0), 0);
  const totalItems = (orders || []).reduce((s, o) => s + (o?.items || []).reduce((ss, i) => ss + (i?.quantity || 0), 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = (orders || []).filter(o => o?.date?.slice(0, 10) === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + (o?.total || 0), 0);

  const stats = [
    { label: 'Commandes', value: (orders || []).length, icon: ShoppingCart },
    { label: 'Revenu total', value: formatPrice(totalRevenue), icon: BarChart3 },
    { label: "Aujourd'hui", value: formatPrice(todayRevenue), icon: BarChart3 },
    { label: 'Produits vendus', value: totalItems, icon: Package },
  ];

  const links = [
    { to: '/admin/orders', label: 'Commandes', icon: ShoppingCart },
    { to: '/admin/products', label: 'Produits', icon: Package },
    { to: '/admin/tariffs', label: 'Tarifs livraison', icon: Truck },
  ];

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Tableau de bord</h1>
        <button onClick={() => setIsAdmin(false)} className="p-2"><LogOut className="w-5 h-5" /></button>
      </div>

      <div className="px-4 grid grid-cols-2 gap-3 mt-2">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border border-border rounded-xl p-4">
              <Icon className="w-5 h-5 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="px-4 space-y-2 mt-6">
        {links.map(l => {
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center gap-3 border border-border rounded-xl px-4 py-3.5 hover:bg-secondary transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{l.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
