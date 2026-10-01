import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);

      // Enforce mandatory password change if initial password is still active
      if (user.mustChangePassword) {
        navigate('/admin/change-password');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      console.error('Login error', err);
      const msg = err.response?.data?.error?.message || 'Identifiants de connexion invalides.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col justify-center items-center px-4 py-12 text-[#ECE7DF] relative overflow-hidden font-sans">
      {/* Background glow decoration */}
      <div className="absolute top-1/4 -start-32 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -end-32 w-96 h-96 rounded-full bg-[#C5A880]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-block font-serif text-3xl md:text-4xl tracking-widest text-[#C5A880] font-semibold hover:opacity-90">
            GAAMOUZE
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#8E8881]">
            Portail d'Administration Sécurisé
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-8 shadow-2xl relative">
          <div className="border-b border-[#2A2A2A] pb-4 mb-6">
            <h1 className="font-serif text-xl text-white">Connexion Administrateur</h1>
            <p className="text-xs text-[#8E8881] mt-1">
              Accès réservé au personnel et à la direction de la Maison.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Adresse Email / Identifiant
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abdelaligamouz@1448"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-medium text-[#C5A880] uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link
                  to="/admin/forgot-password"
                  className="text-[11px] text-[#8E8881] hover:text-[#C5A880] transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880] transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#d5ba94] transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              <span>{loading ? 'Vérification en cours...' : 'Se connecter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#222] text-center">
            <Link to="/" className="text-xs text-[#8E8881] hover:text-[#C5A880] transition-colors">
              ← Retour au site public GAMOUZE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
