import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Jeton de réinitialisation manquant dans l\'URL.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 2500);
    } catch (err) {
      console.error('Reset error', err);
      const msg = err.response?.data?.error?.message || 'Ce lien est invalide ou a expiré.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col justify-center items-center px-4 py-12 text-[#ECE7DF] font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-block font-serif text-3xl tracking-widest text-[#C5A880] font-semibold">
            GAAMOUZE
          </Link>
          <p className="text-xs uppercase tracking-widest text-[#8E8881]">Nouveau Mot de Passe</p>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm text-white font-medium">Mot de passe réinitialisé avec succès !</p>
              <p className="text-xs text-[#8E8881]">Redirection vers la page de connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 caractères"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Confirmation
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Répétez le mot de passe"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#C5A880]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#d5ba94] transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
              >
                <span>{loading ? 'Validation en cours...' : 'Confirmer le mot de passe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
