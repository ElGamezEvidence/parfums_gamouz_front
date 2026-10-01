import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxUsage, setMaxUsage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCoupons();
      setCoupons(data || []);
    } catch (err) {
      console.error('Failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    setIsSubmitting(true);
    try {
      await adminService.createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
        maxUsage: maxUsage ? Number(maxUsage) : undefined,
      });
      setModalOpen(false);
      setCode('');
      setDiscountValue('');
      setMinOrderAmount('');
      setMaxUsage('');
      loadCoupons();
    } catch (err) {
      console.error('Create coupon error', err);
      alert('Erreur lors de la création du code promo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Codes Promotionnels & Remises</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Création de codes avantages en pourcentage (%) ou montant fixe (MAD).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Code Promo</span>
        </button>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#181818] text-[#8E8881]">
              <th className="py-3 px-4 text-start font-normal">Code</th>
              <th className="py-3 px-4 text-start font-normal">Type & Réduction</th>
              <th className="py-3 px-4 text-start font-normal">Min. Commande</th>
              <th className="py-3 px-4 text-center font-normal">Utilisations</th>
              <th className="py-3 px-4 text-center font-normal">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-[#1A1A1A]">
                <td className="py-3 px-4 font-mono font-bold text-[#C5A880] text-sm">
                  {c.code}
                </td>
                <td className="py-3 px-4 text-white">
                  {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `${c.discountValue} MAD`}
                </td>
                <td className="py-3 px-4 text-[#ECE7DF]">
                  {c.minOrderAmount ? `${c.minOrderAmount} MAD` : 'Aucun'}
                </td>
                <td className="py-3 px-4 text-center text-[#8E8881]">
                  {c.usedCount} {c.maxUsage ? `/ ${c.maxUsage}` : ''}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Actif
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
              Nouveau Code Promotionnel
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Code Promo *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ex: MAISON15"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white uppercase font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#C5A880] mb-1">Type de remise</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  >
                    <option value="PERCENTAGE">Pourcentage (%)</option>
                    <option value="FIXED">Montant Fixe (MAD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#C5A880] mb-1">Valeur de la remise *</label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="ex: 15"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#C5A880] mb-1">Panier minimum (MAD)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="ex: 500"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#C5A880] mb-1">Limite d'utilisations</label>
                  <input
                    type="number"
                    value={maxUsage}
                    onChange={(e) => setMaxUsage(e.target.value)}
                    placeholder="ex: 100"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-[#1C1C1C] text-[#8E8881] text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider"
                >
                  {isSubmitting ? 'Création...' : 'Créer le code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
