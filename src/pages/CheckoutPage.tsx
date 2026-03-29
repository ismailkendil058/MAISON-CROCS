import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import { submitOrder } from '@/hooks/useSupabaseQueries';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { tariffs, setOrders } = useStore();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilayaId, setWilayaId] = useState<number | null>(null);
  const [deliveryType, setDeliveryType] = useState<'domicile' | 'bureau'>('domicile');
  const [address, setAddress] = useState('');

  const selectedWilaya = tariffs.find(w => w.id === wilayaId);
  const deliveryFee = selectedWilaya ? (deliveryType === 'domicile' ? selectedWilaya.domicile : selectedWilaya.bureau) : 0;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-muted-foreground mb-4">Votre panier est vide.</p>
        <Link to="/" className="inline-block bg-foreground text-background px-6 py-3 rounded-xl text-sm font-semibold">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !wilayaId) {
      toast.error('Veuillez remplir tous les champs.');
      return;
    }
    if (deliveryType === 'domicile' && !address) {
      toast.error('Veuillez saisir votre adresse.');
      return;
    }

    const orderData = {
      client_name: name,
      phone,
      wilaya: selectedWilaya?.name || '',
      delivery_type: deliveryType,
      address: deliveryType === 'domicile' ? address : undefined,
      total,
      delivery_fee,
      items: items.map(i => ({
        product_name: i.product.name,
        color: i.color,
        size: i.size,
        quantity: i.quantity,
        price: i.product.price,
      })),
    };

    try {
      await submitOrder(orderData);
      clearCart();
      toast.success('Commande validée !');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la commande. Veuillez réessayer.');
    }
  };

  const inputClass = "w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-shadow";

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <Link to="/panier" className="p-1"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="text-lg font-semibold">Commande</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-4 mt-2">
        <input placeholder="Nom complet" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
        <input placeholder="Numéro de téléphone" value={phone} onChange={e => setPhone(e.target.value)} type="tel" className={inputClass} />

        <select
          value={wilayaId ?? ''}
          onChange={e => setWilayaId(Number(e.target.value))}
          className={inputClass}
        >
          <option value="">Sélectionner la wilaya</option>
          {tariffs.map(w => (
            <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
          ))}
        </select>

        <div>
          <p className="text-sm font-medium mb-2">Méthode de livraison</p>
          <div className="flex gap-3">
            {(['domicile', 'bureau'] as const).map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setDeliveryType(type)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
                  deliveryType === type
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border'
                }`}
              >
                {type === 'domicile' ? 'Domicile' : 'Bureau'}
              </button>
            ))}
          </div>
        </div>

        {deliveryType === 'domicile' && (
          <input placeholder="Adresse complète" value={address} onChange={e => setAddress(e.target.value)} className={inputClass} />
        )}

        {selectedWilaya && (
          <div className="bg-secondary rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Livraison ({selectedWilaya.name})</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          Valider la commande
        </button>
      </form>
    </div>
  );
}
