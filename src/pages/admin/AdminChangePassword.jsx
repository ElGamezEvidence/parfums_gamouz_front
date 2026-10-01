import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validatePasswordRules, PASSWORD_HINT } from '../../utils/passwordRules';

export const AdminChangePassword = () => {
  const { user, changePassword, mustChangePassword } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('La confirmation ne correspond pas au nouveau mot de passe.');
      return;
    }

    const rules = validatePasswordRules(newPassword);
    if (!rules.valid) {
      setError(rules.message);
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err) {
      console.error('Password change failed', err);
      const details = err.response?.data?.error?.details;
      const msg =
        (Array.isArray(details) && details[0]?.message) ||
        err.response?.data?.error?.message ||
        'Erreur lors du changement de mot de passe.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto font-sans">
      {!mustChangePassword && (
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-xs text-[#8E8881] hover:text-[#C5A880] mb-6 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>
      )}

      <div className="bg-[#141414] border border-[#2A2A2A] p-6 sm:p-8 shadow-2xl relative">
        <div className="border-b border-[#2A2A2A] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#C5A880]/15 text-[#C5A880] rounded">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-white">Changer votre mot de passe</h1>
              <p className="text-xs text-[#8E8881]">
                Compte : <span className="text-[#C5A880]">{user?.email}</span>
              </p>
            </div>
          </div>
        </div>

        {mustChangePassword && (
          <div className="mb-6 p-4 bg-amber-950/60 border border-amber-500/50 text-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Changement initial obligatoire</strong>
              <span>
                Remplacez votre mot de passe temporaire par un mot de passe personnel fort avant
                d&apos;utiliser le back-office.
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Mot de passe modifié. Redirection vers le tableau de bord…</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
              Mot de passe actuel
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#333] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#333] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              required
            />
            <p className="text-[10px] text-[#8E8881] mt-2 leading-relaxed">{PASSWORD_HINT}</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#333] px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 min-h-[48px] bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#d5ba94] transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C5A880]"
          >
            <span>{loading ? 'Validation en cours…' : 'Enregistrer le nouveau mot de passe'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
