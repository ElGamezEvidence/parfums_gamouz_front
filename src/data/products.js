// Luxury Perfume Collection - GAMOUZE
// Real high-resolution luxury perfume photos from curated Unsplash collections with fallback support

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80';

export const products = [
  {
    id: 1,
    slug: "gamouze-elegance",
    name: {
      fr: "GAMOUZE Élégance",
      en: "GAMOUZE Elegance",
      ar: "GAMOUZE أناقة"
    },
    category: "men",
    price: 520,
    oldPrice: 620,
    volumePrices: {
      "30ml": 380,
      "50ml": 520,
      "100ml": 790
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.9,
    reviews: 142,
    badge: "bestSeller",
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "Un sillage boisé et épicé d'une rare noblesse. GAMOUZE Élégance incarne l'homme charismatique avec ses notes vives de cardamome et son cœur de cèdre de l'Atlas.",
      en: "A woody and spicy trail of rare distinction. GAMOUZE Elegance embodies charismatic masculinity with lively cardamom top notes and a heart of Atlas cedar.",
      ar: "نفحات خشبية حارة ذات نبل استثنائي. يجسد عطر GAMOUZE أناقة الرجل الجذاب بنفحات الهيل المنعشة وقلب من خشب أرز الأطلس العريق."
    },
    notes: {
      top: {
        fr: ["Cardamome noire", "Bergamote de Calabre", "Poivre rose"],
        en: ["Black Cardamom", "Calabrian Bergamot", "Pink Pepper"],
        ar: ["الهيل الأسود", "برغموت كالابريا", "الفلفل الوردي"]
      },
      heart: {
        fr: ["Cèdre de l'Atlas", "Iris florentin", "Muscade"],
        en: ["Atlas Cedar", "Florentine Iris", "Nutmeg"],
        ar: ["خشب أرز الأطلس", "سوسن فلورنسا", "جوزة الطيب"]
      },
      base: {
        fr: ["Vétiver d'Haïti", "Fève tonka", "Cuir fumé"],
        en: ["Haitian Vetiver", "Tonka Bean", "Smoky Leather"],
        ar: ["نجيل الهند الهايتي", "حبوب التونكا", "الجلد المدخن"]
      }
    }
  },
  {
    id: 2,
    slug: "gamouze-noir",
    name: {
      fr: "GAMOUZE Noir",
      en: "GAMOUZE Noir",
      ar: "GAMOUZE نوار"
    },
    category: "men",
    price: 580,
    oldPrice: 690,
    volumePrices: {
      "30ml": 420,
      "50ml": 580,
      "100ml": 860
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.8,
    reviews: 98,
    badge: "bestSeller",
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "Mystérieux, sombre et captivant. GAMOUZE Noir dévoile des accents fumés d'encens et de cuir sombre, magnifiés par la profondeur du patchouli indonésien.",
      en: "Mysterious, profound, and captivating. GAMOUZE Noir reveals smoky whispers of incense and dark leather, elevated by rich Indonesian patchouli.",
      ar: "غامض، داكن وآسر إلى أبعد الحدود. يكشف GAMOUZE نوار عن لمسات دخانية من البخور والجلد الفاخر، يعززها عمق الباتشولي الإندونيسي."
    },
    notes: {
      top: {
        fr: ["Encens noir", "Baies de genièvre", "Pamplemousse amer"],
        en: ["Black Incense", "Juniper Berries", "Bitter Grapefruit"],
        ar: ["البخور الأسود", "حبوب العرعر", "الجريب فروت المر"]
      },
      heart: {
        fr: ["Cuir de Russie", "Tabac blond", "Cannelle de Ceylan"],
        en: ["Russian Leather", "Blonde Tobacco", "Ceylon Cinnamon"],
        ar: ["الجلد الروسي", "التبغ الأشقر", "قرفة سيلان"]
      },
      base: {
        fr: ["Patchouli sombre", "Bois de gaïac", "Ambre noir"],
        en: ["Dark Patchouli", "Guaiac Wood", "Black Amber"],
        ar: ["الباتشولي الداكن", "خشب الغاياك", "العنبر الأسود"]
      }
    }
  },
  {
    id: 3,
    slug: "gamouze-signature",
    name: {
      fr: "GAMOUZE Signature",
      en: "GAMOUZE Signature",
      ar: "GAMOUZE سيغنتشر"
    },
    category: "unisex",
    price: 650,
    oldPrice: 750,
    volumePrices: {
      "30ml": 470,
      "50ml": 650,
      "100ml": 950
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 5.0,
    reviews: 215,
    badge: "bestSeller",
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "L'essence même de la maison GAMOUZE. Une alchimie parfaite entre la fraîcheur vive des agrumes orientaux et la chaleur opulente de l'ambre ambré.",
      en: "The quintessential embodiment of Maison GAMOUZE. A harmonious alchemy blending oriental citrus vitality with opulent amber warmth.",
      ar: "الجوهر الحقيقي لدار GAMOUZE. كيمياء متناغمة تجمع بين نضارة الحمضيات الشرقية والدفء الملكي الفاخر للعنبر الذهبي."
    },
    notes: {
      top: {
        fr: ["Mandarine royale", "Safran d'Iran", "Bergamote"],
        en: ["Royal Mandarin", "Persian Saffron", "Bergamot"],
        ar: ["اليوسفي الملكي", "زعفران إيراني خالص", "البرغموت"]
      },
      heart: {
        fr: ["Rose centifolia", "Bois d'ambre", "Jasmin sambac"],
        en: ["Centifolia Rose", "Amberwood", "Jasmine Sambac"],
        ar: ["وردة سينتيفوليا", "خشب العنبر", "ياسمين سامباك"]
      },
      base: {
        fr: ["Ambre gris", "Musc soyeux", "Santal de Mysore"],
        en: ["Ambergris", "Silky Musk", "Mysore Sandalwood"],
        ar: ["عنبر الحوت النقي", "المسك الحريري", "صندل ميسور"]
      }
    }
  },
  {
    id: 4,
    slug: "gamouze-oud",
    name: {
      fr: "GAMOUZE Oud",
      en: "GAMOUZE Oud",
      ar: "GAMOUZE عود"
    },
    category: "unisex",
    price: 720,
    oldPrice: 850,
    volumePrices: {
      "30ml": 520,
      "50ml": 720,
      "100ml": 1050
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.9,
    reviews: 180,
    badge: "bestSeller",
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "L'or noir de la parfumerie orientale. Un extrait pur de bois d'oud naturel marié au safran et adouci par une touche veloutée de vanille de Madagascar.",
      en: "The black liquid gold of oriental perfumery. Pure natural agarwood entwined with precious saffron and softened by creamy Madagascar vanilla.",
      ar: "الذهب الأسود للعطور الشرقية الراقية. مستخلص دهن العود الطبيعي الصافي ممتزج بالزعفران ولمسة مخملية من فانيليا مدغشقر الفاخرة."
    },
    notes: {
      top: {
        fr: ["Safran impérial", "Clou de girofle", "Zeste d'orange"],
        en: ["Imperial Saffron", "Clove Bud", "Orange Zest"],
        ar: ["الزعفران الإمبراطوري", "براعم القرنفل", "قشور البرتقال"]
      },
      heart: {
        fr: ["Oud du Cambodge", "Praliné", "Rose de Taïf"],
        en: ["Cambodian Oud", "Praline", "Taif Rose"],
        ar: ["عود كمبودي معتق", "حلوى البرالين", "ورد الطائف"]
      },
      base: {
        fr: ["Oud du Laos", "Vanille bourbon", "Benjoin de Siam"],
        en: ["Laotian Oud", "Bourbon Vanilla", "Siam Benzoin"],
        ar: ["عود لاوسي فاخر", "فانيليا البوربون", "جاوي سيام"]
      }
    }
  },
  {
    id: 5,
    slug: "gamouze-ambre",
    name: {
      fr: "GAMOUZE Ambre",
      en: "GAMOUZE Amber",
      ar: "GAMOUZE عنبر"
    },
    category: "unisex",
    price: 550,
    oldPrice: null,
    volumePrices: {
      "30ml": 390,
      "50ml": 550,
      "100ml": 820
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.8,
    reviews: 76,
    badge: null,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "Une caresse solaire et enveloppante. Un accord ambré chaud et résineux qui fond sur la peau pour laisser un souvenir d'une douceur magnétique.",
      en: "A radiant, enveloping caress. A warm and resinous amber accord melting seamlessly on skin to leave a lingering, magnetic memory.",
      ar: "لمسة دافئة وساحرة تلف حواسك. توليفة عنبرية راتنجية غنية تمتزج برقة مع حرارة البشرة لتترك أثراً جذاباً لا يُقاوم."
    },
    notes: {
      top: {
        fr: ["Coriandre dorée", "Amande amère", "Mandarine"],
        en: ["Golden Coriander", "Bitter Almond", "Mandarin"],
        ar: ["الكزبرة الذهبية", "اللوز المر", "المندرين"]
      },
      heart: {
        fr: ["Ambre chaud", "Labdanum", "Miel blanc"],
        en: ["Warm Amber", "Labdanum", "White Honey"],
        ar: ["العنبر الدافئ", "اللابدانوم", "العسل الأبيض"]
      },
      base: {
        fr: ["Patchouli", "Musc précieux", "Fève tonka"],
        en: ["Patchouli", "Precious Musk", "Tonka Bean"],
        ar: ["الباتشولي", "المسك الثمين", "حبوب التونكا"]
      }
    }
  },
  {
    id: 6,
    slug: "gamouze-rose",
    name: {
      fr: "GAMOUZE Rose",
      en: "GAMOUZE Rose",
      ar: "GAMOUZE روز"
    },
    category: "women",
    price: 490,
    oldPrice: 580,
    volumePrices: {
      "30ml": 360,
      "50ml": 490,
      "100ml": 750
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.9,
    reviews: 130,
    badge: "isNew",
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "La reine des fleurs réinventée avec audace. Une rose de Damas fraîchement cueillie à l'aube, rehaussée de litchi juteux et posée sur un lit de muscs blancs cotonneux.",
      en: "The queen of flowers boldly reinvented. A Damascena rose picked at dawn, elevated by sparkling lychee and nestled on a cloud of white musks.",
      ar: "ملكة الأزهار بلمسة عصرية جريئة. وردة دمشقية قطفت في الصباح الباكر، تتناغم مع نفحات الليتشي المنعشة على قاعدة من المسك الأبيض الحريري."
    },
    notes: {
      top: {
        fr: ["Litchi rose", "Poire d'Anjou", "Bergamote"],
        en: ["Pink Lychee", "Anjou Pear", "Bergamot"],
        ar: ["الليتشي الوردي", "كمثرى أنجو", "البرغموت"]
      },
      heart: {
        fr: ["Rose de Damas", "Pivoine délicate", "Magnolia"],
        en: ["Damascena Rose", "Delicate Peony", "Magnolia"],
        ar: ["الورد الدمشقي", "الفاوانيا الرقيقة", "المغنوليا"]
      },
      base: {
        fr: ["Muscs blancs", "Cèdre blanc", "Ambre cristallin"],
        en: ["White Musks", "White Cedar", "Crystalline Amber"],
        ar: ["المسك الأبيض النقي", "خشب الأرز الأبيض", "العنبر الكريستالي"]
      }
    }
  },
  {
    id: 7,
    slug: "gamouze-intense",
    name: {
      fr: "GAMOUZE Intense",
      en: "GAMOUZE Intense",
      ar: "GAMOUZE إنتنس"
    },
    category: "men",
    price: 590,
    oldPrice: 700,
    volumePrices: {
      "30ml": 430,
      "50ml": 590,
      "100ml": 880
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.9,
    reviews: 112,
    badge: "isNew",
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "Une concentration extrême pour une intensité magnétique. Des épices vibrantes se heurtent à la puissance du bois d'ébène et du tabac chaud.",
      en: "High-voltage concentration delivering hypnotic projection. Vibrant spices collide with the sovereign power of ebony wood and rich tobacco leaf.",
      ar: "تركيز فائق الفخامة لفوحان لا يُقاوم. توابل متوهجة تمتزج بقوة خشب الأبنوس الداكن مع نفحات التبغ المعتق."
    },
    notes: {
      top: {
        fr: ["Poivre de Sichuan", "Gingembre bleu", "Lavande fine"],
        en: ["Sichuan Pepper", "Blue Ginger", "Fine Lavender"],
        ar: ["فلفل سيتشوان", "الزنجبيل الأزرق", "اللافندر الفرنسي"]
      },
      heart: {
        fr: ["Tabac noir", "Noix de muscade", "Iris"],
        en: ["Black Tobacco", "Nutmeg", "Iris"],
        ar: ["التبغ الأسود", "جوزة الطيب", "السوسن"]
      },
      base: {
        fr: ["Bois d'ébène", "Patchouli corsé", "Ambroxan"],
        en: ["Ebony Wood", "Bold Patchouli", "Ambroxan"],
        ar: ["خشب الأبنوس", "الباتشولي المكثف", "الأمبروكسان"]
      }
    }
  },
  {
    id: 8,
    slug: "gamouze-pure",
    name: {
      fr: "GAMOUZE Pure",
      en: "GAMOUZE Pure",
      ar: "GAMOUZE بيور"
    },
    category: "women",
    price: 480,
    oldPrice: null,
    volumePrices: {
      "30ml": 350,
      "50ml": 480,
      "100ml": 730
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.7,
    reviews: 64,
    badge: null,
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "L'élégance du minimalisme absolu. Un parfum d'une pureté cristalline, alliant fleurs blanches aériennes et muscs transparents comme une seconde peau.",
      en: "The epitome of pure minimalist grace. A crystalline fragrance fusing airy white florals and transparent musk like radiant second skin.",
      ar: "قمة النقاء والبساطة المترفة. عطر كريستالي ناصع يمزج بين الزهور البيضاء الرقيقة والمسك الشفاف كطبقة ثانية تعانق بشرتك."
    },
    notes: {
      top: {
        fr: ["Néroli de Tunisie", "Fleur d'oranger", "Mandarine verte"],
        en: ["Tunisian Neroli", "Orange Blossom", "Green Mandarin"],
        ar: ["نيرولي تونسي", "زهر البرتقال", "المندرين الأخضر"]
      },
      heart: {
        fr: ["Jasmin blanc", "Muguet des bois", "Gardénia"],
        en: ["White Jasmine", "Lily of the Valley", "Gardenia"],
        ar: ["الياسمين الأبيض", "زنبق الوادي", "الغاردينيا"]
      },
      base: {
        fr: ["Muscs soyeux", "Bois de santal blanc", "Ambre blanc"],
        en: ["Silky Musks", "White Sandalwood", "White Amber"],
        ar: ["المسك الحريري", "صندل أبيض", "العنبر الأبيض"]
      }
    }
  },
  {
    id: 9,
    slug: "gamouze-mystic",
    name: {
      fr: "GAMOUZE Mystic",
      en: "GAMOUZE Mystic",
      ar: "GAMOUZE ميستيك"
    },
    category: "unisex",
    price: 610,
    oldPrice: 720,
    volumePrices: {
      "30ml": 440,
      "50ml": 610,
      "100ml": 910
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.8,
    reviews: 89,
    badge: "isNew",
    isFeatured: false,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "Une invitation au mystère et au voyage intérieur. L'encens d'Oman rencontre la myrrhe et la vanille noire pour un rituel olfactif envoûtant.",
      en: "A voyage of spiritual mystery. Sacred Omani frankincense meets mystical myrrh and black vanilla for an intoxicating ritual trail.",
      ar: "دعوة لرحلة روحية ساحرة. يلتقي لبان عمان الملكي مع المر الفاخر والفانيليا السوداء لصياغة هالة عطرية ساحرة."
    },
    notes: {
      top: {
        fr: ["Encens d'Oman", "Cardamome verte", "Sauge sclarée"],
        en: ["Omani Frankincense", "Green Cardamom", "Clary Sage"],
        ar: ["لبان عمان", "الهيل الأخضر", "الميرمية"]
      },
      heart: {
        fr: ["Myrrhe précieuse", "Iris noir", "Feuille de violette"],
        en: ["Precious Myrrh", "Black Iris", "Violet Leaf"],
        ar: ["المر الثمين", "السوسن الأسود", "أوراق البنفسج"]
      },
      base: {
        fr: ["Vanille noire", "Ambre gris", "Cèdre rouge"],
        en: ["Black Vanilla", "Ambergris", "Red Cedar"],
        ar: ["الفانيليا السوداء", "عنبر الحوت", "الأرز الأحمر"]
      }
    }
  },
  {
    id: 10,
    slug: "gamouze-velvet",
    name: {
      fr: "GAMOUZE Velvet",
      en: "GAMOUZE Velvet",
      ar: "GAMOUZE فلفيت"
    },
    category: "women",
    price: 540,
    oldPrice: 640,
    volumePrices: {
      "30ml": 390,
      "50ml": 540,
      "100ml": 810
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.9,
    reviews: 107,
    badge: null,
    isFeatured: true,
    isBestSeller: false,
    isNew: false,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "La douceur infinie du velours caressant la peau. Un parfum floral-oriental crémeux où la tubéreuse majestueuse enlace la vanille et le santal chaud.",
      en: "The endless tactile sensuality of velvet. A creamy floral-oriental where stately tuberose embraces warm sandalwood and rich vanilla.",
      ar: "نعومة مخملية ساحرة تغمر إحساسك. عطر شرقي زهري ناعم تتألق فيه زهرة مسك الروم الآسرة مع الفانيليا الدافئة وخشب الصندل."
    },
    notes: {
      top: {
        fr: ["Poire dorée", "Amande douce", "Pêche blanche"],
        en: ["Golden Pear", "Sweet Almond", "White Peach"],
        ar: ["الكمثرى الذهبية", "اللوز الحلو", "الخوخ الأبيض"]
      },
      heart: {
        fr: ["Tubéreuse des Indes", "Fleur d'oranger", "Jasmin sambac"],
        en: ["Indian Tuberose", "Orange Blossom", "Jasmine Sambac"],
        ar: ["مسك الروم الهندي", "زهر البرتقال", "ياسمين سامباك"]
      },
      base: {
        fr: ["Vanille de Madagascar", "Santal crémeux", "Musc doux"],
        en: ["Madagascar Vanilla", "Creamy Sandalwood", "Soft Musk"],
        ar: ["فانيليا مدغشقر", "خشب الصندل الكريمي", "المسك الرقيق"]
      }
    }
  },
  {
    id: 11,
    slug: "gamouze-elixir",
    name: {
      fr: "GAMOUZE Élixir",
      en: "GAMOUZE Elixir",
      ar: "GAMOUZE إكسير"
    },
    category: "women",
    price: 670,
    oldPrice: 790,
    volumePrices: {
      "30ml": 490,
      "50ml": 670,
      "100ml": 980
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 5.0,
    reviews: 154,
    badge: "isNew",
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "Un philtre précieux d'une envoûtante intensité. Un nectar opulent de rose noire, d'épices dorées et de patchouli sombre à la signature royale.",
      en: "A precious elixir of hypnotic depth. An opulent nectar of midnight black rose, gilded spices, and deep patchouli conferring royal allure.",
      ar: "إكسير نادر بتركيز ملكي ساحر. رحيق فاخر يجمع الوردة السوداء النادرة مع التوابل الذهبية والباتشولي المعتق لهيبة استثنائية."
    },
    notes: {
      top: {
        fr: ["Framboise sauvage", "Safran", "Cannelle royale"],
        en: ["Wild Raspberry", "Saffron", "Royal Cinnamon"],
        ar: ["توت العليق البري", "الزعفران", "القرفة الملكية"]
      },
      heart: {
        fr: ["Rose noire", "Encens", "Cuir velours"],
        en: ["Black Rose", "Incense", "Velvet Suede"],
        ar: ["الوردة السوداء", "البخور الفاخر", "الجلد المخملي"]
      },
      base: {
        fr: ["Oud précieux", "Ambre noir", "Caramel brûlé"],
        en: ["Precious Oud", "Dark Amber", "Burnt Caramel"],
        ar: ["العود الثمين", "العنبر الداكن", "الكراميل المحلى"]
      }
    }
  },
  {
    id: 12,
    slug: "gamouze-royal",
    name: {
      fr: "GAMOUZE Royal",
      en: "GAMOUZE Royal",
      ar: "GAMOUZE رويال"
    },
    category: "men",
    price: 690,
    oldPrice: 820,
    volumePrices: {
      "30ml": 500,
      "50ml": 690,
      "100ml": 1020
    },
    volumes: ["30ml", "50ml", "100ml"],
    defaultVolume: "50ml",
    rating: 4.9,
    reviews: 167,
    badge: "bestSeller",
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    description: {
      fr: "L'allure souveraine dans toute sa splendeur. Un équilibre magistral de bois de santal d'Orient, d'ambre gris et de cuir impérial qui impose le respect.",
      en: "Sovereign nobility in full glory. A masterful harmony of Mysore sandalwood, ambergris, and imperial leather commanding unyielding respect.",
      ar: "فخامة الملوك وحضورهم المهيب. توازن متقن بين خشب الصندل الشرقي، عنبر الحوت، والجلد الإمبراطوري يمنحك هيبة لا مثيل لها."
    },
    notes: {
      top: {
        fr: ["Bergamote royale", "Poivre noir", "Citron de Sicile"],
        en: ["Royal Bergamot", "Black Pepper", "Sicilian Lemon"],
        ar: ["البرغموت الملكي", "الفلفل الأسود", "ليمون صقلية"]
      },
      heart: {
        fr: ["Cuir impérial", "Santal de Mysore", "Patchouli"],
        en: ["Imperial Leather", "Mysore Sandalwood", "Patchouli"],
        ar: ["الجلد الإمبراطوري", "صندل ميسور", "الباتشولي"]
      },
      base: {
        fr: ["Oud blanc", "Ambre gris", "Musc royal"],
        en: ["White Oud", "Ambergris", "Royal Musk"],
        ar: ["العود الأبيض", "عنبر الحوت", "المسك الملكي"]
      }
    }
  }
];

export const categories = [
  {
    id: "men",
    key: "men",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    titleKey: "collections.menTitle",
    descKey: "collections.menDesc"
  },
  {
    id: "women",
    key: "women",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    titleKey: "collections.womenTitle",
    descKey: "collections.womenDesc"
  },
  {
    id: "unisex",
    key: "unisex",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    titleKey: "collections.unisexTitle",
    descKey: "collections.unisexDesc"
  }
];

