import { resolveProductImageUrl } from './productImages.js';

function resolveImageList(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((item) => {
      if (typeof item === 'string') return resolveProductImageUrl(item);
      if (item?.url) return resolveProductImageUrl(item.url);
      return '';
    })
    .filter(Boolean);
}

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

function toNoteList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/** Notes olfactives : { top: { fr: [], en: [], ar: [] }, heart, base } */
function buildNotes(apiProduct) {
  if (
    apiProduct.notes?.top?.fr ||
    apiProduct.notes?.top?.en ||
    (apiProduct.notes?.top && !Array.isArray(apiProduct.notes.top))
  ) {
    return apiProduct.notes;
  }

  const fromTrans = (field) => ({
    fr: toNoteList(apiProduct.translations?.fr?.[field] ?? apiProduct[field]),
    en: toNoteList(apiProduct.translations?.en?.[field] ?? apiProduct[field]),
    ar: toNoteList(apiProduct.translations?.ar?.[field] ?? apiProduct[field]),
  });

  if (apiProduct.translations?.fr || apiProduct.translations?.en) {
    return {
      top: fromTrans('topNotes'),
      heart: fromTrans('heartNotes'),
      base: fromTrans('baseNotes'),
    };
  }

  const flat = toNoteList(apiProduct.topNotes);
  return {
    top: { fr: flat, en: flat, ar: flat },
    heart: {
      fr: toNoteList(apiProduct.heartNotes),
      en: toNoteList(apiProduct.heartNotes),
      ar: toNoteList(apiProduct.heartNotes),
    },
    base: {
      fr: toNoteList(apiProduct.baseNotes),
      en: toNoteList(apiProduct.baseNotes),
      ar: toNoteList(apiProduct.baseNotes),
    },
  };
}

function buildLocalizedDescription(apiProduct) {
  if (apiProduct.description && typeof apiProduct.description === 'object') {
    return apiProduct.description;
  }
  const pick = (locale) =>
    apiProduct.translations?.[locale]?.fullDescription ||
    apiProduct.translations?.[locale]?.shortDescription ||
    apiProduct.fullDescription ||
    apiProduct.shortDescription ||
    '';
  return {
    fr: pick('fr'),
    en: pick('en'),
    ar: pick('ar'),
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
  const volumes =
    apiProduct.volumes?.length > 0
      ? apiProduct.volumes
      : variants.map((v) => v.volume).filter(Boolean);

  const reviewList = Array.isArray(apiProduct.reviews) ? apiProduct.reviews : [];
  const ratingFromReviews =
    reviewList.length > 0
      ? reviewList.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviewList.length
      : null;

  const resolvedImages = resolveImageList(apiProduct.images);
  const primaryImage =
    resolveProductImageUrl(apiProduct.image) ||
    resolvedImages[0] ||
    '';

  return {
    ...apiProduct,
    category,
    name: buildLocalizedName(apiProduct),
    description: buildLocalizedDescription(apiProduct),
    notes: buildNotes(apiProduct),
    volumes: volumes.length ? volumes : ['50ml'],
    defaultVolume: defaultVariant?.volume || volumes[0] || '50ml',
    volumePrices: Object.keys(volumePrices).length ? volumePrices : apiProduct.volumePrices,
    rating: apiProduct.rating ?? ratingFromReviews ?? 5,
    reviews:
      typeof apiProduct.reviews === 'number'
        ? apiProduct.reviews
        : reviewList.length,
    price: Number(defaultVariant?.price ?? apiProduct.price ?? 0),
    oldPrice:
      defaultVariant?.oldPrice != null
        ? Number(defaultVariant.oldPrice)
        : apiProduct.oldPrice != null
          ? Number(apiProduct.oldPrice)
          : null,
    image: primaryImage,
    images: resolvedImages.length
      ? resolvedImages
      : primaryImage
        ? [primaryImage]
        : [],
    inStock: variants.some((v) => v.inStock !== false && (v.stockQuantity ?? 1) > 0),
  };
}

export function normalizeProductsFromApi(items) {
  return (items || []).map(normalizeProductFromApi).filter(Boolean);
}
