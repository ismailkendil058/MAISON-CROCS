import { Search, Menu, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  onMenuOpen: () => void;
  onSearchOpen?: () => void;
}

export default function Header({ onMenuOpen, onSearchOpen }: HeaderProps) {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between px-4 h-14">
        <button onClick={onMenuOpen} className="p-2 -ml-2" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-wider text-foreground">MAISON DE CROCS</span>
        </Link>

        <div className="flex items-center gap-1">
          {onSearchOpen && (
            <button onClick={onSearchOpen} className="p-2" aria-label="Rechercher">
              <Search className="w-5 h-5" />
            </button>
          )}
          <Link to="/panier" className="p-2 -mr-2 relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0 -right-0 bg-foreground text-background text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
