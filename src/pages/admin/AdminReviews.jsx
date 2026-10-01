import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await adminService.getReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleModerate = async (reviewId, status) => {
    try {
      await adminService.moderateReview(reviewId, status);
      loadReviews();
    } catch (err) {
      console.error('Moderation error', err);
      alert('Erreur lors de la modération.');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedReview) return;

    setIsSubmitting(true);
    try {
      await adminService.moderateReview(selectedReview.id, 'APPROVED', replyText);
      setReplyModalOpen(false);
      loadReviews();
    } catch (err) {
      console.error('Reply failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="border-b border-[#2A2A2A] pb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-white">Modération des Avis Clients</h1>
        <p className="text-xs text-[#8E8881] mt-1">
          Validation des témoignages, vérification des achats et réponses officielles de la Maison.
        </p>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-[#8E8881] text-xs">
            Chargement des avis...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-[#8E8881] text-xs space-y-2">
            <Star className="w-8 h-8 mx-auto text-[#444]" />
            <p className="text-white text-sm">Aucun avis client pour le moment.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#222]">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-white text-sm">{r.authorName}</span>
                    {r.isVerifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#C5A880] bg-[#C5A880]/10 px-2 py-0.5 border border-[#C5A880]/30 rounded">
                        <ShieldCheck className="w-3 h-3" />
                        Achat vérifié
                      </span>
                    )}
                    <span className="text-[11px] text-[#8E8881]">sur « {r.productName} »</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#C5A880]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < r.rating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-[#444]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#ECE7DF] leading-relaxed italic">« {r.comment} »</p>

                  {r.brandReply && (
                    <div className="mt-2 p-2.5 bg-[#1C1C1C] border-s-2 border-[#C5A880] text-xs">
                      <span className="font-semibold text-[#C5A880] block text-[10px] uppercase">
                        Réponse de Maison GAMOUZE :
                      </span>
                      <span className="text-[#A0988E]">{r.brandReply}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      r.status === 'APPROVED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : r.status === 'REJECTED'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {r.status === 'APPROVED' ? 'Approuvé' : r.status === 'REJECTED' ? 'Rejeté' : 'En attente'}
                  </span>

                  {r.status !== 'APPROVED' && (
                    <button
                      onClick={() => handleModerate(r.id, 'APPROVED')}
                      className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 text-xs"
                    >
                      Approuver
                    </button>
                  )}

                  {r.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleModerate(r.id, 'REJECTED')}
                      className="px-2.5 py-1 bg-red-950/60 text-red-300 border border-red-700/50 hover:bg-red-900 text-xs"
                    >
                      Masquer
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedReview(r);
                      setReplyText(r.brandReply || '');
                      setReplyModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-[#1C1C1C] text-[#C5A880] border border-[#333] hover:border-[#C5A880] text-xs"
                  >
                    Répondre
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {replyModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
              Répondre à l'avis de {selectedReview.authorName}
            </h2>
            <form onSubmit={handleReplySubmit} className="space-y-4">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Message officiel de la Maison GAMOUZE..."
                className="w-full bg-[#1C1C1C] border border-[#333] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 bg-[#1C1C1C] text-[#8E8881] text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Envoi...' : 'Publier la réponse'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
