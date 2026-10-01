import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [slug, setSlug] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!slug.trim() || !nameFr.trim()) return;

    setIsSubmitting(true);
    try {
      await adminService.createCategory({
        slug: slug.trim().toLowerCase(),
        image: image || undefined,
        translations: {
          fr: { name: nameFr.trim() },
          en: { name: (nameEn || nameFr).trim() },
          ar: { name: (nameAr || nameFr).trim() },
        },
      });
      setModalOpen(false);
      setSlug('');
      setNameFr('');
      setNameEn('');
      setNameAr('');
      loadCategories();
    } catch (err) {
      console.error('Category creation failed', err);
      alert('Erreur lors de la création de la catégorie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-white">Catégories & Univers</h1>
          <p className="text-xs text-[#8E8881] mt-1">
            Organisation des parfums par univers (Homme, Femme, Unisexe) et collections.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((c) => {
          const frName = c.translations?.find((t) => t.locale === 'fr')?.name || c.slug;
          const enName = c.translations?.find((t) => t.locale === 'en')?.name;
          const arName = c.translations?.find((t) => t.locale === 'ar')?.name;

          return (
            <div key={c.id} className="bg-[#141414] border border-[#2A2A2A] overflow-hidden">
              <div className="h-32 bg-[#222] relative">
                {c.image && (
                  <img src={c.image} alt={frName} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                  <h3 className="font-serif text-lg text-white font-medium">{frName}</h3>
                  <p className="text-[11px] text-[#C5A880]">
                    {enName} • {arName}
                  </p>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between text-xs text-[#8E8881]">
                <span>Slug: /{c.slug}</span>
                <span>{c._count?.products || 0} produit(s)</span>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
              Nouvelle Catégorie
            </h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Slug URL *</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: oud-collection"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Nom (Français) *</label>
                <input
                  type="text"
                  value={nameFr}
                  onChange={(e) => setNameFr(e.target.value)}
                  placeholder="ex: Collection Oud"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Nom (Anglais)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="ex: Oud Collection"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#C5A880] mb-1">Nom (Arabe)</label>
                <input
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مجموعة العود"
                  dir="rtl"
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-[#C5A880] mb-1">URL Image de couverture</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white"
                />
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
                  {isSubmitting ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
