import { X, Home, Tag, Grid3X3, ShoppingBag, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  const links = [
    { to: '/', icon: Home, label: 'Accueil' },
    { to: '/promotions', icon: Tag, label: 'Promotions' },
    { to: '/categories', icon: Grid3X3, label: 'Catégories' },
    { to: '/panier', icon: ShoppingBag, label: 'Panier' },
    { to: '/admin', icon: Shield, label: 'Admin' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-foreground/50 z-50" onClick={onClose} />
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-background z-50 shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold tracking-wide text-sm">MENU</span>
          <button onClick={onClose} className="p-2 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <link.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
