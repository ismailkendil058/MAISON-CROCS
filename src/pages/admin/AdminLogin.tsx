import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const { setIsAdmin } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAdmin(true);
      navigate('/admin/dashboard');
    } else {
      toast.error('Mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Admin</h1>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
        <button className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm">
          Connexion
        </button>
      </form>
    </div>
  );
}
