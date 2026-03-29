import { Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Panier</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 px-4">
          <p className="text-muted-foreground mb-4">Votre panier est vide.</p>
          <Link to="/" className="inline-block bg-foreground text-background px-6 py-3 rounded-xl text-sm font-semibold">
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-4 mt-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 border-b pb-4">
              <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-secondary" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground">{item.color} · {item.size}</p>
                <p className="font-semibold text-sm mt-1">{formatPrice(item.product.price * item.quantity)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(i, item.quantity - 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(i, item.quantity + 1)} className="w-7 h-7 rounded border border-border flex items-center justify-center">
                    <Plus className="w-3 h-3" />
                  </button>
                  <button onClick={() => removeItem(i)} className="ml-auto p-1">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{formatPrice(total)}</span>
          </div>

          <Link
            to="/checkout"
            className="block text-center w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm tracking-wide"
          >
            Passer la commande
          </Link>
        </div>
      )}
    </div>
  );
}
