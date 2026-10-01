import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Save, CheckCircle2, KeyRound, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminSettings = () => {
  const [shippingThreshold, setShippingThreshold] = useState('500');
  const [shippingFee, setShippingFee] = useState('40');
  const [whatsapp, setWhatsapp] = useState('+212671545193');
  const [phone, setPhone] = useState('+212 671-545193');
  const [email, setEmail] = useState('contact@gamouze.com');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await adminService.getSettings();
        if (data && data.length > 0) {
          const map = {};
          data.forEach((s) => (map[s.key] = s.value));
          if (map.shipping_free_threshold) setShippingThreshold(map.shipping_free_threshold);
          if (map.shipping_standard_fee) setShippingFee(map.shipping_standard_fee);
          if (map.contact_whatsapp) setWhatsapp(map.contact_whatsapp);
          if (map.contact_phone) setPhone(map.contact_phone);
          if (map.contact_email) setEmail(map.contact_email);
        }
      } catch (err) {
        console.warn('Failed to load settings from server', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Promise.all([
        adminService.updateSetting('shipping_free_threshold', shippingThreshold),
        adminService.updateSetting('shipping_standard_fee', shippingFee),
        adminService.updateSetting('contact_whatsapp', whatsapp),
        adminService.updateSetting('contact_phone', phone),
        adminService.updateSetting('contact_email', email),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save settings error', err);
      alert('Erreur lors de la sauvegarde des paramètres.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 font-sans">
      <div className="border-b border-[#2A2A2A] pb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-white">Paramètres Commerciaux</h1>
        <p className="text-xs text-[#8E8881] mt-1">
          Règles de livraison au Maroc, seuils de gratuité et coordonnées officielles de la Maison.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Paramètres mis à jour avec succès dans PostgreSQL.</span>
        </div>
      )}

      <Link
        to="/admin/change-password"
        className="flex items-center justify-between gap-4 bg-[#141414] border border-[#2A2A2A] p-4 sm:p-5 hover:border-[#C5A880]/40 transition-colors min-h-[44px]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#C5A880]/15 text-[#C5A880] rounded">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-white font-medium">Sécurité du compte administrateur</p>
            <p className="text-[11px] text-[#8E8881] mt-0.5">
              Modifier votre mot de passe (vérification de l&apos;ancien mot de passe requise).
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-[#8E8881] shrink-0" />
      </Link>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Shipping rules */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
          <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
            Livraison au Maroc
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Seuil de livraison gratuite (MAD)
              </label>
              <input
                type="number"
                value={shippingThreshold}
                onChange={(e) => setShippingThreshold(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                required
              />
              <span className="text-[10px] text-[#8E8881] mt-1 block">
                Offerte automatiquement dès ce montant de commande.
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Frais de livraison standard (MAD)
              </label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                required
              />
              <span className="text-[10px] text-[#8E8881] mt-1 block">
                Facturés si le sous-total est inférieur au seuil.
              </span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
          <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
            Contact & Service Client
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                WhatsApp Officiel
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Téléphone affiché
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Email Contact
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Enregistrement...' : 'Enregistrer les paramètres'}</span>
        </button>
      </form>
    </div>
  );
};
