import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAdmin } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check password against database
      const { data, error } = await supabase
        .from('admin_auth')
        .select('password_hash')
        .single();

      if (error) {
        toast.error('Erreur de connexion');
        return;
      }

      if (password === data.password_hash) {
        // Update last login
        await supabase
          .from('admin_auth')
          .update({ last_login: new Date().toISOString() })
          .eq('id', 1);

        setIsAdmin(true);
        navigate('/admin/dashboard');
      } else {
        toast.error('Mot de passe incorrect.');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
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
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-foreground text-background py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50"
        >
          {loading ? 'Connexion...' : 'Connexion'}
        </button>
      </form>
    </div>
  );
}
