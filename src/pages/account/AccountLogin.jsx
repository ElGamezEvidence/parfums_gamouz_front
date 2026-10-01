import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';

export const AccountLogin = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Veuillez saisir votre email et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/account/orders');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Identifiants de connexion invalides.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">Espace Client</h1>
        <p className="text-xs uppercase tracking-widest text-brand-muted">
          Accédez à vos commandes et à votre cercle privé
        </p>
      </div>

      <div className="bg-white border border-brand-black/10 p-8 shadow-luxury">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-2">
              Adresse Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full bg-brand-cream border border-brand-black/10 px-10 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-brand-cream border border-brand-black/10 px-10 py-2.5 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-black text-brand-cream font-semibold text-xs uppercase tracking-widest hover:bg-brand-surface transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand-black/10 text-center space-y-3">
          <p className="text-xs text-brand-muted">
            Pas encore de compte ?{' '}
            <Link to="/account/register" className="text-brand-gold font-semibold hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
