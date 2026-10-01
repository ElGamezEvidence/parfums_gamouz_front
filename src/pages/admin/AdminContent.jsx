import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminContent = () => {
  const [heroTitleFr, setHeroTitleFr] = useState('Laissez votre empreinte.');
  const [heroSubtitleFr, setHeroSubtitleFr] = useState('Un parfum. Une signature. Votre empreinte.');
  const [heroDescFr, setHeroDescFr] = useState(
    'Découvrez une collection de parfums de prestige conçue pour révéler votre personnalité.'
  );
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [msgs, subs] = await Promise.all([
          adminService.getMessages(),
          adminService.getSubscribers(),
        ]);
        setMessages(msgs || []);
        setSubscribers(subs || []);
      } catch (err) {
        console.warn('CMS data fetch warning', err);
      }
    };
    fetchData();
  }, []);

  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateContent('home_hero', {
        fr: { title: heroTitleFr, subtitle: heroSubtitleFr, description: heroDescFr },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to update content', err);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-[#2A2A2A] pb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-white">Gestion des Contenus Éditables (CMS)</h1>
        <p className="text-xs text-[#8E8881] mt-1">
          Personnalisation des bannières, accroches de la page d'accueil et consultation des prises de contact.
        </p>
      </div>

      {/* Hero Section Editor */}
      <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <h2 className="font-serif text-lg text-white">Hero de la Page d'Accueil</h2>
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enregistré !
            </span>
          )}
        </div>

        <form onSubmit={handleSaveHero} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
              Titre Principal (Slogan officiel)
            </label>
            <input
              type="text"
              value={heroTitleFr}
              onChange={(e) => setHeroTitleFr(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
              Sous-titre / Signature
            </label>
            <input
              type="text"
              value={heroSubtitleFr}
              onChange={(e) => setHeroSubtitleFr(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
              Description de la Maison
            </label>
            <textarea
              rows={3}
              value={heroDescFr}
              onChange={(e) => setHeroDescFr(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#333] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Mettre à jour le Hero</span>
          </button>
        </form>
      </div>

      {/* Contact Messages Received */}
      <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
        <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
          Messages Reçus via le Formulaire de Contact ({messages.length})
        </h2>

        {messages.length === 0 ? (
          <p className="text-xs text-[#8E8881]">Aucun message de contact pour l'instant.</p>
        ) : (
          <div className="divide-y divide-[#222]">
            {messages.map((m) => (
              <div key={m.id} className="py-3 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{m.name} ({m.email})</span>
                  <span className="text-[#8E8881]">{new Date(m.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                {m.phone && <p className="text-[#C5A880]">Tél: {m.phone}</p>}
                <p className="text-[#ECE7DF]">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter subscribers list */}
      <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
        <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
          Abonnés Newsletter Cercle Privé ({subscribers.length})
        </h2>

        {subscribers.length === 0 ? (
          <p className="text-xs text-[#8E8881]">Aucun abonné pour le moment.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subscribers.map((s) => (
              <span
                key={s.id}
                className="px-3 py-1 bg-[#1C1C1C] border border-[#333] text-xs text-[#C5A880]"
              >
                {s.email}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
