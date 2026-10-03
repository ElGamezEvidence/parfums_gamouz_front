import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Loader2,
  Star,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

function slugifyFromName(name) {
  return (
    String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 72) || ''
  );
}

function resolveProductCatalogFields({ sku, slug, basePrice, translations, variants }) {
  const nameFr = translations.fr.name.trim();
  const finalSlug = slug.trim().toLowerCase() || slugifyFromName(nameFr);
  const slugKey = finalSlug || `produit-${Date.now()}`;
  const finalSku =
    sku.trim().toUpperCase() || slugKey.replace(/-/g, '_').toUpperCase().slice(0, 48);
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
  const parsedBase = basePrice !== '' && basePrice != null ? Number(basePrice) : NaN;
  const finalBasePrice = !Number.isNaN(parsedBase)
    ? parsedBase
    : defaultVariant?.price
      ? Number(defaultVariant.price)
      : 0;
  return { finalSku, finalSlug: slugKey, finalBasePrice };
}

export const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('fr'); // 'fr', 'en', 'ar'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [sku, setSku] = useState('');
  const [slug, setSlug] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [genderCategory, setGenderCategory] = useState('UNISEX');
  const [status, setStatus] = useState('PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Multilingual translations
  const [translations, setTranslations] = useState({
    fr: {
      name: '',
      shortDescription: '',
      fullDescription: '',
      olfactoryFamily: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      usageAdvice: '',
    },
    en: {
      name: '',
      shortDescription: '',
      fullDescription: '',
      olfactoryFamily: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      usageAdvice: '',
    },
    ar: {
      name: '',
      shortDescription: '',
      fullDescription: '',
      olfactoryFamily: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      usageAdvice: '',
    },
  });

  // Variants (30ml, 50ml, 100ml)
  const [variants, setVariants] = useState([
    { volume: '30ml', price: '380', salePrice: '', sku: '', stockQuantity: 20, isDefault: false },
    { volume: '50ml', price: '520', salePrice: '', sku: '', stockQuantity: 40, isDefault: true },
    { volume: '100ml', price: '790', salePrice: '', sku: '', stockQuantity: 15, isDefault: false },
  ]);

  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit || !id) return undefined;

    let cancelled = false;
    (async () => {
      setInitialLoading(true);
      setError('');
      try {
        const p = await adminService.getProduct(id);
        if (cancelled) return;

        setSku(p.sku || '');
        setSlug(p.slug || '');
        setBasePrice(p.basePrice != null ? String(p.basePrice) : '');
        setSalePrice(p.salePrice != null ? String(p.salePrice) : '');
        setGenderCategory(p.genderCategory || 'UNISEX');
        setStatus(p.status || 'PUBLISHED');
        setIsFeatured(Boolean(p.isFeatured));
        setIsBestSeller(Boolean(p.isBestSeller));
        setIsNew(Boolean(p.isNew));

        if (p.translations) {
          setTranslations((prev) => ({
            fr: { ...prev.fr, ...(p.translations.fr || {}) },
            en: { ...prev.en, ...(p.translations.en || {}) },
            ar: { ...prev.ar, ...(p.translations.ar || {}) },
          }));
        }

        if (p.variants?.length) {
          setVariants(
            p.variants.map((v) => ({
              id: v.id,
              volume: v.volume,
              price: String(v.price ?? ''),
              salePrice: v.salePrice != null ? String(v.salePrice) : '',
              sku: v.sku || '',
              stockQuantity: v.stockQuantity ?? 0,
              isDefault: Boolean(v.isDefault),
            }))
          );
        }

        if (p.images?.length) {
          setImages(
            p.images.map((img) => ({
              url: img.url,
              isPrimary: Boolean(img.isPrimary),
            }))
          );
        } else {
          setImages([]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.error?.message ||
              'Impossible de charger le produit pour modification.'
          );
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleTranslationChange = (locale, field, value) => {
    setTranslations((prev) => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value,
      },
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { volume: '50ml', price: '', salePrice: '', sku: '', stockQuantity: 10, isDefault: false },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const addImage = () => {
    setImages((prev) => [
      ...prev,
      { url: '', isPrimary: prev.length === 0 },
    ]);
  };

  const handleImageChange = (index, value) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index].url = value;
      return copy;
    });
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length && !next.some((img) => img.isPrimary)) {
        next[0].isPrimary = true;
      }
      return next;
    });
  };

  const setPrimaryImage = (index) => {
    setImages((prev) => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFilesFromDisk = async (event) => {
    const fileList = event.target.files;
    if (!fileList?.length) return;

    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) {
      setError('Sélectionnez des fichiers image (JPEG, PNG, WebP, GIF).');
      return;
    }

    setUploadingImages(true);
    setError('');
    try {
      const uploaded =
        files.length === 1
          ? [await adminService.uploadProductImage(files[0])]
          : await adminService.uploadProductImages(files);

      setImages((prev) => {
        const hasPrimary = prev.some((img) => img.isPrimary);
        const added = uploaded.map((item, idx) => ({
          url: item.url,
          filename: item.filename,
          isPrimary: !hasPrimary && idx === 0 && prev.length === 0,
        }));
        return [...prev, ...added];
      });
      setSuccess(
        'Images importées. Cliquez sur « Enregistrer le parfum » pour les publier sur la boutique.'
      );
    } catch (err) {
      const msg =
        err.response?.data?.error?.message ||
        'Échec du téléversement. Vérifiez la taille (max 5 Mo) et le format.';
      setError(msg);
    } finally {
      setUploadingImages(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!translations.fr.name.trim()) {
      setError('Le nom du parfum en français est requis.');
      return;
    }

    setLoading(true);
    try {
      const { finalSku, finalSlug, finalBasePrice } = resolveProductCatalogFields({
        sku,
        slug,
        basePrice,
        translations,
        variants,
      });

      const payload = {
        sku: finalSku,
        slug: finalSlug,
        basePrice: finalBasePrice,
        salePrice: salePrice ? Number(salePrice) : null,
        genderCategory,
        status,
        isFeatured,
        isBestSeller,
        isNew,
        translations,
        variants: variants.map((v) => ({
          ...(v.id ? { id: v.id } : {}),
          volume: v.volume,
          price: Number(v.price),
          salePrice: v.salePrice ? Number(v.salePrice) : null,
          sku: v.sku.trim() ? v.sku.trim().toUpperCase() : `${finalSku}-${v.volume}`,
          stockQuantity: Number(v.stockQuantity) || 0,
          isDefault: v.isDefault,
        })),
        images: (() => {
          const list = images.filter((img) => img.url.trim());
          const hasPrimary = list.some((img) => img.isPrimary);
          return list.map((img, idx) => ({
            url: img.url.trim(),
            displayOrder: idx,
            isPrimary: hasPrimary ? Boolean(img.isPrimary) : idx === 0,
          }));
        })(),
      };

      if (isEdit) {
        await adminService.updateProduct(id, payload);
        setSuccess('Produit mis à jour avec succès.');
      } else {
        await adminService.createProduct(payload);
        setSuccess('Produit créé avec succès.');
        setTimeout(() => navigate('/admin/products'), 1500);
      }
    } catch (err) {
      console.error('Save product error', err);
      const msg = err.response?.data?.error?.message || 'Erreur lors de l\'enregistrement du produit.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-[#8E8881] text-sm">
        Chargement du produit…
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 text-[#8E8881] hover:text-white bg-[#141414] border border-[#2A2A2A] rounded transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl text-white">
              {isEdit ? 'Modifier le Parfum' : 'Créer un Nouveau Parfum'}
            </h1>
            <p className="text-xs text-[#8E8881]">
              Informations olfactives, déclinaisons de volume et contenu multilingue.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Enregistrement...' : 'Enregistrer le parfum'}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Identification & Pricing */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-6">
          <h2 className="font-serif text-lg text-white border-b border-[#2A2A2A] pb-3">
            1. Caractéristiques Principales & Tarifs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Référence SKU <span className="text-[#666]">(auto si vide)</span>
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="GZ-MAJESTIC"
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Slug URL <span className="text-[#666]">(auto depuis le nom FR)</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="gamouze-majestic"
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Univers Olfactif
              </label>
              <select
                value={genderCategory}
                onChange={(e) => setGenderCategory(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              >
                <option value="UNISEX">Unisexe</option>
                <option value="MEN">Homme</option>
                <option value="WOMEN">Femme</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Prix de base (MAD) <span className="text-[#666]">(auto = variante par défaut)</span>
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="520"
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Prix Promotionnel (Optionnel, MAD)
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="620"
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Statut de publication
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              >
                <option value="PUBLISHED">Publié (Actif en boutique)</option>
                <option value="DRAFT">Brouillon</option>
                <option value="ARCHIVED">Archivé</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#ECE7DF]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="accent-[#C5A880]"
              />
              <span>Produit Vedette (Accueil)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#ECE7DF]">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="accent-[#C5A880]"
              />
              <span>Sélection Best-Seller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#ECE7DF]">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="accent-[#C5A880]"
              />
              <span>Nouveauté (Badge New)</span>
            </label>
          </div>
        </div>

        {/* Section 2: Multilingual Content FR / EN / AR */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h2 className="font-serif text-lg text-white">2. Pyramide Olfactive & Traductions</h2>
            <div className="flex gap-2">
              {['fr', 'en', 'ar'].map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setActiveTab(loc)}
                  className={`px-3 py-1 text-xs uppercase font-semibold transition-colors ${
                    activeTab === loc
                      ? 'bg-[#C5A880] text-black'
                      : 'bg-[#1C1C1C] text-[#8E8881] hover:text-white'
                  }`}
                >
                  {loc === 'ar' ? 'العربية' : loc.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4" dir={activeTab === 'ar' ? 'rtl' : 'ltr'}>
            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Nom du Parfum ({activeTab.toUpperCase()}) *
              </label>
              <input
                type="text"
                value={translations[activeTab].name}
                onChange={(e) => handleTranslationChange(activeTab, 'name', e.target.value)}
                placeholder={activeTab === 'ar' ? 'عطر GAMOUZE ...' : 'GAMOUZE Signature'}
                className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                required={activeTab === 'fr'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Famille Olfactive
                </label>
                <input
                  type="text"
                  value={translations[activeTab].olfactoryFamily}
                  onChange={(e) => handleTranslationChange(activeTab, 'olfactoryFamily', e.target.value)}
                  placeholder="Boisé Épicé, Ambré Floral..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Description Courte
                </label>
                <input
                  type="text"
                  value={translations[activeTab].shortDescription}
                  onChange={(e) => handleTranslationChange(activeTab, 'shortDescription', e.target.value)}
                  placeholder="Un sillage intense d'une rare noblesse..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Notes de Tête
                </label>
                <input
                  type="text"
                  value={translations[activeTab].topNotes}
                  onChange={(e) => handleTranslationChange(activeTab, 'topNotes', e.target.value)}
                  placeholder="Bergamote, Safran..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Notes de Cœur
                </label>
                <input
                  type="text"
                  value={translations[activeTab].heartNotes}
                  onChange={(e) => handleTranslationChange(activeTab, 'heartNotes', e.target.value)}
                  placeholder="Cèdre, Rose..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                  Notes de Fond
                </label>
                <input
                  type="text"
                  value={translations[activeTab].baseNotes}
                  onChange={(e) => handleTranslationChange(activeTab, 'baseNotes', e.target.value)}
                  placeholder="Ambre, Vétiver..."
                  className="w-full bg-[#1C1C1C] border border-[#333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A880]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#C5A880] mb-2 uppercase tracking-wider">
                Description Complète & Histoire Olfactive
              </label>
              <textarea
                rows={3}
                value={translations[activeTab].fullDescription}
                onChange={(e) => handleTranslationChange(activeTab, 'fullDescription', e.target.value)}
                placeholder="Racontez la signature du parfum..."
                className="w-full bg-[#1C1C1C] border border-[#333] p-3 text-xs text-white focus:outline-none focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Volumes & Stock */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
            <h2 className="font-serif text-lg text-white">3. Déclinaisons de Volume & Stocks</h2>
            <button
              type="button"
              onClick={addVariant}
              className="text-xs text-[#C5A880] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un volume</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-center bg-[#181818] p-3 border border-[#2A2A2A]"
              >
                <div>
                  <label className="block text-[10px] text-[#8E8881] mb-1">Contenance</label>
                  <input
                    type="text"
                    value={v.volume}
                    onChange={(e) => handleVariantChange(idx, 'volume', e.target.value)}
                    placeholder="50ml"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#8E8881] mb-1">Prix (MAD)</label>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    placeholder="520"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#8E8881] mb-1">Stock Initial</label>
                  <input
                    type="number"
                    value={v.stockQuantity}
                    onChange={(e) => handleVariantChange(idx, 'stockQuantity', e.target.value)}
                    placeholder="25"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-2 py-1 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#8E8881] mb-1">SKU Déclinaison</label>
                  <input
                    type="text"
                    value={v.sku}
                    onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                    placeholder="Auto si vide"
                    className="w-full bg-[#1C1C1C] border border-[#333] px-2 py-1 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <label className="flex items-center gap-1.5 text-xs text-[#ECE7DF] cursor-pointer">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={v.isDefault}
                      onChange={() => {
                        setVariants((prev) =>
                          prev.map((item, i) => ({ ...item, isDefault: i === idx }))
                        );
                      }}
                      className="accent-[#C5A880]"
                    />
                    <span className="text-[11px]">Par défaut</span>
                  </label>
                </div>

                <div className="text-end pt-4">
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    disabled={variants.length <= 1}
                    className="p-1 text-[#888] hover:text-red-400 disabled:opacity-30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Images & Media */}
        <div className="bg-[#141414] border border-[#2A2A2A] p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#2A2A2A] pb-3">
            <div>
              <h2 className="font-serif text-lg text-white">4. Galerie Visuelle & Photos</h2>
              <p className="text-[11px] text-[#8E8881] mt-1">
                Importez depuis votre ordinateur (max 5 Mo) ou collez une URL distante. Puis
                enregistrez le produit. En production Railway, configurez Cloudinary pour des
                images permanentes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={handleFilesFromDisk}
              />
              <button
                type="button"
                onClick={handlePickFiles}
                disabled={uploadingImages}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#C5A880] text-black text-xs font-semibold uppercase tracking-wider hover:bg-[#d5ba94] disabled:opacity-50"
              >
                {uploadingImages ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploadingImages ? 'Import…' : 'Importer des fichiers'}</span>
              </button>
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center gap-1 px-3 py-2.5 min-h-[44px] border border-[#333] text-xs text-[#C5A880] hover:bg-[#1C1C1C]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>URL externe</span>
              </button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={`${img.url}-${idx}`}
                  className={`relative group border rounded overflow-hidden bg-[#1C1C1C] ${
                    img.isPrimary ? 'border-[#C5A880] ring-1 ring-[#C5A880]/50' : 'border-[#333]'
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full aspect-[3/4] object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23333" width="200" height="200"/%3E%3Ctext fill="%23888" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="12"%3EImage%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 p-2 bg-gradient-to-t from-black/90 to-transparent">
                    <button
                      type="button"
                      title="Image principale"
                      onClick={() => setPrimaryImage(idx)}
                      className={`p-1.5 rounded ${img.isPrimary ? 'text-[#C5A880]' : 'text-white/70 hover:text-white'}`}
                    >
                      <Star className={`w-4 h-4 ${img.isPrimary ? 'fill-[#C5A880]' : ''}`} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1.5 text-white/80 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {img.isPrimary && (
                    <span className="absolute top-2 start-2 text-[9px] uppercase tracking-wider bg-[#C5A880] text-black px-2 py-0.5 font-semibold">
                      Principale
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div key={`url-${idx}`} className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <input
                  type="url"
                  value={img.url}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  placeholder="https://… ou URL après import"
                  className="flex-1 bg-[#1C1C1C] border border-[#333] px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A880] min-h-[44px]"
                />
                <label className="flex items-center gap-2 text-[11px] text-[#A0988E] shrink-0 cursor-pointer">
                  <input
                    type="radio"
                    name="primaryImage"
                    checked={img.isPrimary}
                    onChange={() => setPrimaryImage(idx)}
                    className="accent-[#C5A880]"
                  />
                  Principale
                </label>
              </div>
            ))}
          </div>

          {images.length === 0 && !uploadingImages && (
            <button
              type="button"
              onClick={handlePickFiles}
              className="w-full border border-dashed border-[#444] rounded py-12 px-4 text-center hover:border-[#C5A880]/50 transition-colors"
            >
              <Upload className="w-8 h-8 text-[#8E8881] mx-auto mb-3" />
              <p className="text-sm text-[#ECE7DF]">Glissez ou cliquez pour importer des photos</p>
              <p className="text-[11px] text-[#8E8881] mt-1">JPEG, PNG, WebP, GIF — 5 Mo max par fichier</p>
            </button>
          )}
        </div>

        {/* Submit bottom button */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#2A2A2A]">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 bg-[#1C1C1C] border border-[#333] text-[#8E8881] hover:text-white text-xs uppercase tracking-wider"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#C5A880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#d5ba94] transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Enregistrement en cours...' : 'Enregistrer le parfum'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
