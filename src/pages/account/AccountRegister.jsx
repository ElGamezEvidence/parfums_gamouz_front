import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AccountRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/account/orders');
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Erreur lors de la création du compte.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-8 space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-brand-black">Créer un Compte</h1>
        <p className="text-xs uppercase tracking-widest text-brand-muted">
          Rejoignez le cercle d'initiés de la Maison GAMOUZE
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-brand-cream border border-brand-black/10 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-brand-cream border border-brand-black/10 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-1">
              Adresse Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className="w-full bg-brand-cream border border-brand-black/10 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-1">
              Numéro de téléphone (Maroc)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+212 6..."
              className="w-full bg-brand-cream border border-brand-black/10 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-black mb-1">
              Mot de passe (Min. 8 caractères) *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full bg-brand-cream border border-brand-black/10 px-3 py-2 text-xs text-brand-black focus:outline-none focus:border-brand-gold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-black text-brand-cream font-semibold text-xs uppercase tracking-widest hover:bg-brand-surface transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
          >
            <span>{loading ? 'Création en cours...' : 'Créer mon compte'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-brand-black/10 text-center">
          <p className="text-xs text-brand-muted">
            Vous avez déjà un compte ?{' '}
            <Link to="/account/login" className="text-brand-gold font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
