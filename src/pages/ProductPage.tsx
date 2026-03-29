import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { getDiscountPercent, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products } = useStore();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  if (!product) {
    return <div className="p-8 text-center text-muted-foreground">Produit introuvable.</div>;
  }

  const discount = getDiscountPercent(product.price, product.oldPrice);
  const currentImage = product.colors[selectedColor]?.image || product.images[imageIndex];

  const handleBuy = () => {
    if (!selectedSize) {
      toast.error('Veuillez choisir une pointure.');
      return;
    }
    addItem({
      product,
      color: product.colors[selectedColor]?.name || '',
      size: selectedSize,
      quantity,
    });
    toast.success('Ajouté au panier !');
    navigate('/panier');
  };

  return (
    <div className="pb-8">
      <div className="px-4 pt-4 pb-2">
        <Link to="/" className="p-1 inline-block"><ArrowLeft className="w-5 h-5" /></Link>
      </div>

      {/* Image gallery */}
      <div className="relative aspect-square bg-secondary mx-4 rounded-xl overflow-hidden mb-4">
        <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
        {discount && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-md">
            -{discount}%
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex gap-2 px-4 mb-4">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setImageIndex(i); }}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                imageIndex === i ? 'border-foreground' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 space-y-5">
        <div>
          <h1 className="text-xl font-semibold mb-1">{product.name}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

        {/* Colors */}
        {product.colors.length > 1 && (
          <div>
            <p className="text-sm font-medium mb-2">Couleur : {product.colors[selectedColor]?.name}</p>
            <div className="flex gap-2">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(i)}
                  className={`w-9 h-9 rounded-full border-2 transition-colors ${
                    selectedColor === i ? 'border-foreground' : 'border-border'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div>
          <p className="text-sm font-medium mb-2">Pointure</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-12 h-10 rounded-lg border text-sm font-medium transition-colors ${
                  selectedSize === s
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border hover:border-foreground'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <p className="text-sm font-medium mb-2">Quantité</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Buy button */}
        <button
          onClick={handleBuy}
          className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          Acheter — {formatPrice(product.price * quantity)}
        </button>
      </div>
    </div>
  );
}
