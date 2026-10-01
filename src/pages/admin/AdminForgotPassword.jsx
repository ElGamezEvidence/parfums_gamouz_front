import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService';

export const AdminForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Veuillez renseigner votre email.');
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error('Password reset request error', err);
      setError('Une erreur est survenue lors de la demande.');
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
          <p className="text-xs uppercase tracking-widest text-[#8E8881]">Récupération de Compte</p>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] p-8 shadow-2xl">
          <div className="border-b border-[#2A2A2A] pb-4 mb-6">
            <h1 className="font-serif text-xl text-white">Mot de passe oublié</h1>
            <p className="text-xs text-[#8E8881] mt-1">
              Entrez votre adresse email enregistrée pour recevoir un lien de réinitialisation sécurisé.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {submitted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#ECE7DF] leading-relaxed">
                Si cette adresse est rattachée à un compte, un jeton de réinitialisation unique a été généré.
                Veuillez vérifier vos e-mails ou contacter le support technique si votre passerelle SMTP n'est pas encore activée.
              </p>
              <div className="pt-4">
                <Link
                  to="/admin/login"
                  className="inline-block px-6 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94]"
                >
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8E8881] absolute start-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abdelaligamouz@1448"
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
                <span>{loading ? 'Traitement en cours...' : 'Envoyer les instructions'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 text-center">
                <Link to="/admin/login" className="text-xs text-[#8E8881] hover:text-[#C5A880]">
                  ← Annuler et revenir à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
