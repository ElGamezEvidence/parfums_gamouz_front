const GENDER_TO_CATEGORY = {
  men: 'men',
  women: 'women',
  unisex: 'unisex',
  MEN: 'men',
  WOMEN: 'women',
  UNISEX: 'unisex',
};

function buildLocalizedName(apiProduct) {
  if (apiProduct.name && typeof apiProduct.name === 'object' && !Array.isArray(apiProduct.name)) {
    return {
      fr: apiProduct.name.fr || apiProduct.name.en || '',
      en: apiProduct.name.en || apiProduct.name.fr || '',
      ar: apiProduct.name.ar || apiProduct.name.fr || '',
    };
  }

  const fromTranslations = apiProduct.translations || {};
  const pick = (locale) =>
    fromTranslations[locale]?.name ||
    (typeof apiProduct.name === 'string' ? apiProduct.name : '') ||
    apiProduct.sku ||
    '';

  return {
    fr: pick('fr'),
    en: pick('en'),
    ar: pick('ar'),
  };
}

function buildNotes(apiProduct) {
  if (apiProduct.notes && typeof apiProduct.notes === 'object') {
    return apiProduct.notes;
  }

  const toList = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  return {
    top: toList(apiProduct.topNotes),
    heart: toList(apiProduct.heartNotes),
    base: toList(apiProduct.baseNotes),
  };
}

/**
 * Maps API catalog payloads to the shape expected by existing UI components (mock-compatible).
 */
export function normalizeProductFromApi(apiProduct) {
  if (!apiProduct) return null;

  const category =
    apiProduct.category ||
    GENDER_TO_CATEGORY[apiProduct.genderCategory] ||
    'unisex';

  const variants = (apiProduct.variants || []).map((v) => ({
    ...v,
    volume: v.volume,
    price: Number(v.price),
    oldPrice: v.oldPrice != null ? Number(v.oldPrice) : null,
  }));

  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
  const volumePrices = {};
  variants.forEach((v) => {
    if (v.volume) volumePrices[v.volume] = v.price;
  });

  return {
    ...apiProduct,
    category,
    name: buildLocalizedName(apiProduct),
    description: apiProduct.description || {
      fr: apiProduct.shortDescription || apiProduct.fullDescription || '',
      en: apiProduct.shortDescription || apiProduct.fullDescription || '',
      ar: apiProduct.shortDescription || apiProduct.fullDescription || '',
    },
    notes: buildNotes(apiProduct),
    defaultVolume: defaultVariant?.volume || '50ml',
    volumePrices: Object.keys(volumePrices).length ? volumePrices : apiProduct.volumePrices,
    price: Number(apiProduct.price ?? defaultVariant?.price ?? 0),
    oldPrice:
      apiProduct.oldPrice != null
        ? Number(apiProduct.oldPrice)
        : defaultVariant?.oldPrice != null
          ? Number(defaultVariant.oldPrice)
          : null,
    image: apiProduct.image || apiProduct.images?.[0] || '',
    images: apiProduct.images?.length ? apiProduct.images : apiProduct.image ? [apiProduct.image] : [],
    inStock: variants.some((v) => v.inStock !== false && (v.stockQuantity ?? 1) > 0),
  };
}

export function normalizeProductsFromApi(items) {
  return (items || []).map(normalizeProductFromApi).filter(Boolean);
}
