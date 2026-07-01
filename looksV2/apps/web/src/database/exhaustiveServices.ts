export interface ServiceItem {
  id: string;
  category: string;
  title_en: string;
  title_hi: string;
  price_inr: number;
  duration_mins: number;
  rating: number;
  reviews_count: number;
  locality: string;
  provider_id: string;
  description_en: string;
  description_hi: string;
}

export const EXHAUSTIVE_SERVICES: ServiceItem[] = [
  // 1. Beauty & Grooming
  {
    id: "beauty_1",
    category: "Beauty & Grooming",
    title_en: "Salon at Home (Men/Women)",
    title_hi: "सैलून एट होम (पुरुष/महिला)",
    price_inr: 499,
    duration_mins: 120,
    rating: 4.8,
    reviews_count: 56,
    locality: "Hazratganj, Lucknow",
    provider_id: "prov_lko_01",
    description_en: "Professional home haircut, beard grooming, facial, and relaxing massage therapy.",
    description_hi: "पेशेवर होम हेयरकट, दाढ़ी ग्रूमिंग, फेशियल और आरामदायक मालिश चिकित्सा।"
  },
  {
    id: "beauty_2",
    category: "Beauty & Grooming",
    title_en: "Bridal Makeup & Festive Styling",
    title_hi: "दुल्हन का मेकअप और उत्सव स्टाइलिंग",
    price_inr: 4999,
    duration_mins: 480,
    rating: 5.0,
    reviews_count: 14,
    locality: "Gomti Nagar, Lucknow",
    provider_id: "prov_lko_01",
    description_en: "Premium HD bridal makeup packages, mehndi application, and elegant hair styling for festivals.",
    description_hi: "प्रीमियम एचडी ब्राइडल मेकअप पैकेज, मेहंदी और त्योहारों के लिए सुरुचिपूर्ण हेयर स्टाइलिंग।"
  },
  {
    id: "beauty_3",
    category: "Beauty & Grooming",
    title_en: "Facial Conditioning & Skin Cleanup",
    title_hi: "फेशियल कंडीशनिंग और स्किन क्लीनअप",
    price_inr: 799,
    duration_mins: 60,
    rating: 4.6,
    reviews_count: 32,
    locality: "Aliganj, Lucknow",
    provider_id: "prov_lko_01",
    description_en: "Deep skin cleaning, tan removal, exfoliation, and charcoal hydration treatment.",
    description_hi: "गहरी त्वचा की सफाई, टैन हटाना, एक्सफोलिएशन और चारकोल हाइड्रेशन उपचार।"
  },
  {
    id: "beauty_4",
    category: "Beauty & Grooming",
    title_en: "Hair Coloring & Spa Nourishment",
    title_hi: "हेयर कलरिंग और स्पा पोषण",
    price_inr: 1200,
    duration_mins: 90,
    rating: 4.7,
    reviews_count: 23,
    locality: "Indiranagar, Lucknow",
    provider_id: "prov_lko_01",
    description_en: "Ammonia-free root touchup, full length hair coloring, and keratin spa nourishment.",
    description_hi: "अमोनिया मुक्त रूट टचअप, पूरे बालों में रंग लगाना, और केराटिन स्पा पोषण।"
  },
  {
    id: "beauty_5",
    category: "Beauty & Grooming",
    title_en: "Kids Haircut at Doorstep",
    title_hi: "बच्चों के बाल काटने की सेवा",
    price_inr: 299,
    duration_mins: 45,
    rating: 4.9,
    reviews_count: 19,
    locality: "Chowk, Lucknow",
    provider_id: "prov_lko_01",
    description_en: "Child-friendly haircut and styling at the comfort of your home.",
    description_hi: "अपने घर के आराम में बच्चों के अनुकूल बाल कटवाने और स्टाइलिंग सेवा।"
  },

  // 2. Home Repairs & Maintenance
  {
    id: "repairs_1",
    category: "Home Repairs & Maintenance",
    title_en: "Electrician Fault Repair",
    title_hi: "इलेक्ट्रीशियन फॉल्ट मरम्मत",
    price_inr: 250,
    duration_mins: 45,
    rating: 4.7,
    reviews_count: 89,
    locality: "Hazratganj, Lucknow",
    provider_id: "prov_lko_02",
    description_en: "Diagnosis of short circuits, MCB replacement, socket repairs, and fan/switch installations.",
    description_hi: "शॉर्ट सर्किट का निदान, एमसीबी प्रतिस्थापन, सॉकेट मरम्मत, और पंखे/स्विच की स्थापना।"
  },
  {
    id: "repairs_2",
    category: "Home Repairs & Maintenance",
    title_en: "Plumbing Leakage Fixing",
    title_hi: "प्लंबिंग लीकेज फिक्सिंग",
    price_inr: 300,
    duration_mins: 60,
    rating: 4.8,
    reviews_count: 72,
    locality: "Gomti Nagar, Lucknow",
    provider_id: "prov_lko_02",
    description_en: "Repairing leaking taps, pipe blockages, washbasin installations, and toilet flush repairs.",
    description_hi: "लीक हो रहे नलों की मरम्मत, पाइप ब्लॉकेज, वॉशबेसिन स्थापना, और टॉयलेट फ्लश की मरम्मत।"
  },
  {
    id: "repairs_3",
    category: "Home Repairs & Maintenance",
    title_en: "Carpenter Door/Lock Fitting",
    title_hi: "बढ़ई दरवाजा/ताला फिटिंग",
    price_inr: 400,
    duration_mins: 60,
    rating: 4.5,
    reviews_count: 41,
    locality: "Aliganj, Lucknow",
    provider_id: "prov_lko_02",
    description_en: "Installation of door handles, locks, hinge adjustments, and minor furniture alignments.",
    description_hi: "दरवाजे के हैंडल, ताले की स्थापना, काज समायोजन, और मामूली फर्नीचर संरेखण।"
  },
  {
    id: "repairs_4",
    category: "Home Repairs & Maintenance",
    title_en: "AC Jet Deep Cleaning Service",
    title_hi: "एसी जेट गहरी सफाई सेवा",
    price_inr: 599,
    duration_mins: 90,
    rating: 4.9,
    reviews_count: 104,
    locality: "Indiranagar, Lucknow",
    provider_id: "prov_lko_02",
    description_en: "High-pressure water jet cleaning of AC filters, cooling coils, drain trays, and outdoor units.",
    description_hi: "एसी फिल्टर, कूलिंग कॉइल, ड्रेन ट्रे और आउटडोर यूनिट की उच्च दबाव वाले पानी के जेट से सफाई।"
  },
  {
    id: "repairs_5",
    category: "Home Repairs & Maintenance",
    title_en: "Washing Machine Diagnostics",
    title_hi: "वाशिंग मशीन निदान",
    price_inr: 450,
    duration_mins: 60,
    rating: 4.6,
    reviews_count: 38,
    locality: "Chowk, Lucknow",
    provider_id: "prov_lko_02",
    description_en: "Diagnosing drum rotation faults, water inlet/outlet leakages, and panel board defects.",
    description_hi: "ड्रम रोटेशन दोषों, पानी के इनलेट/आउटलेट लीकेज और पैनल बोर्ड दोषों का निदान।"
  },

  // 3. Cleaning & Pest Control
  {
    id: "cleaning_1",
    category: "Cleaning & Pest Control",
    title_en: "Deep Home Cleaning (Per Room)",
    title_hi: "कमरे की गहरी सफाई",
    price_inr: 1199,
    duration_mins: 120,
    rating: 4.8,
    reviews_count: 67,
    locality: "Gomti Nagar, Lucknow",
    provider_id: "prov_lko_03",
    description_en: "Intense dusting, vacuuming, window cleaning, wall cleaning, and floor scrubbing.",
    description_hi: "कमरे की तीव्र धूल झाड़ना, वैक्यूमिंग, खिड़कियों की सफाई, दीवारों की सफाई और फर्श की घिसाई।"
  },
  {
    id: "cleaning_2",
    category: "Cleaning & Pest Control",
    title_en: "Kitchen Deep Degreasing",
    title_hi: "रसोई की गहरी डीग्रीज़िंग सफाई",
    price_inr: 1499,
    duration_mins: 180,
    rating: 4.7,
    reviews_count: 49,
    locality: "Hazratganj, Lucknow",
    provider_id: "prov_lko_03",
    description_en: "Removal of oil and grease stains from kitchen tiles, cabinets, exhaust fans, and slabs.",
    description_hi: "रसोई की टाइल्स, अलमारियाँ, एग्जॉस्ट फैन और स्लैब से तेल और ग्रीस के दाग हटाना।"
  },
  {
    id: "cleaning_3",
    category: "Cleaning & Pest Control",
    title_en: "Sofa & Carpet Shampooing",
    title_hi: "सोफा और कालीन शैंपू से सफाई",
    price_inr: 899,
    duration_mins: 90,
    rating: 4.8,
    reviews_count: 36,
    locality: "Aliganj, Lucknow",
    provider_id: "prov_lko_03",
    description_en: "Eco-friendly shampooing, vacuuming, stain removal, and sanitization of fabric seats.",
    description_hi: "पर्यावरण के अनुकूल शैम्पू से धोना, वैक्यूमिंग, दाग हटाना और सोफे व कालीन का सैनिटाइजेशन।"
  },
  {
    id: "cleaning_4",
    category: "Cleaning & Pest Control",
    title_en: "Bathroom Disinfection Sanitization",
    title_hi: "बाथरूम की कीटाणुशोधन सफाई",
    price_inr: 399,
    duration_mins: 45,
    rating: 4.6,
    reviews_count: 82,
    locality: "Indiranagar, Lucknow",
    provider_id: "prov_lko_03",
    description_en: "Acid-free tile scrubbing, tap descaling, basin cleaning, and bathroom sanitization.",
    description_hi: "टाइल स्क्रबिंग, नल की सफाई, बेसिन सफाई और टॉयलेट सीट सैनिटाइजेशन।"
  },
  {
    id: "cleaning_5",
    category: "Cleaning & Pest Control",
    title_en: "Water Tank Anti-Algae Flush",
    title_hi: "पानी की टंकी एंटी-एल्गी सफाई",
    price_inr: 999,
    duration_mins: 120,
    rating: 4.9,
    reviews_count: 25,
    locality: "Chowk, Lucknow",
    provider_id: "prov_lko_03",
    description_en: "Mechanized dewatering, scrubbing, high-pressure washing, and anti-bacterial spray.",
    description_hi: "टंकी से पानी निकालना, स्क्रबिंग, उच्च दाब से धुलाई, और जीवाणुरोधी छिड़काव।"
  },

  // 4. Native Smart Products
  {
    id: "smart_1",
    category: "Native Smart Products",
    title_en: "CCTV Camera Network Setup",
    title_hi: "सीसीटीवी कैमरा नेटवर्क सेटअप",
    price_inr: 1500,
    duration_mins: 180,
    rating: 4.9,
    reviews_count: 51,
    locality: "Indiranagar, Lucknow",
    provider_id: "prov_lko_04",
    description_en: "Installation and DVR network linking of high-definition Wi-Fi IP security cameras.",
    description_hi: "हाई-डेफिनिशन वाई-फाई आईपी सुरक्षा कैमरों की स्थापना और डीवीआर नेटवर्क लिंकिंग।"
  },
  {
    id: "smart_2",
    category: "Native Smart Products",
    title_en: "Smart Video Doorbell Link",
    title_hi: "स्मार्ट वीडियो डोरबेल स्थापना",
    price_inr: 899,
    duration_mins: 60,
    rating: 4.8,
    reviews_count: 27,
    locality: "Hazratganj, Lucknow",
    provider_id: "prov_lko_04",
    description_en: "Mounting smart video doorbells, connecting to home Wi-Fi networks, and linking mobile apps.",
    description_hi: "स्मार्ट वीडियो डोरबेल लगाना, वाई-फाई नेटवर्क से जोड़ना और मोबाइल ऐप से लिंक करना।"
  },
  {
    id: "smart_3",
    category: "Native Smart Products",
    title_en: "Alexa/Google Home Voice Integration",
    title_hi: "आवाज सहायक एकीकरण (Alexa/Google Home)",
    price_inr: 1200,
    duration_mins: 120,
    rating: 4.7,
    reviews_count: 18,
    locality: "Gomti Nagar, Lucknow",
    provider_id: "prov_lko_04",
    description_en: "Smart bulb/switch pairing, voice command setups, and automation routine creations.",
    description_hi: "स्मार्ट बल्ब/स्विच पेयरिंग, वॉयस कमांड सेटअप और ऑटोमेशन रूटीन बनाना।"
  },
  {
    id: "smart_4",
    category: "Native Smart Products",
    title_en: "Wi-Fi Mesh Router Configuration",
    title_hi: "वाई-फाई मेश राउटर कॉन्फ़िगरेशन",
    price_inr: 600,
    duration_mins: 60,
    rating: 4.8,
    reviews_count: 34,
    locality: "Aliganj, Lucknow",
    provider_id: "prov_lko_04",
    description_en: "Setting up dual-band mesh routers to eliminate home dead-zones and optimize load.",
    description_hi: "घर के डेड-जोन को खत्म करने और लोड को अनुकूलित करने के लिए मेश राउटर सेटअप।"
  },
  {
    id: "smart_5",
    category: "Native Smart Products",
    title_en: "Smart Lock Architectural Mounting",
    title_hi: "स्मार्ट लॉक स्थापना और माउंटिंग",
    price_inr: 1999,
    duration_mins: 90,
    rating: 5.0,
    reviews_count: 12,
    locality: "Chowk, Lucknow",
    provider_id: "prov_lko_04",
    description_en: "Precision door cutting, smart lock mounting, fingerprint and PIN linking.",
    description_hi: "सटीक दरवाजा काटना, स्मार्ट लॉक माउंटिंग, फिंगरप्रिंट और पिन लिंकिंग।"
  },

  // 5. Indian Labours Pool
  {
    id: "labour_1",
    category: "Indian Labours",
    title_en: "Daily Wage Mason / राजमिस्त्री",
    title_hi: "दैनिक मजदूरी राजमिस्त्री",
    price_inr: 700,
    duration_mins: 480,
    rating: 4.6,
    reviews_count: 76,
    locality: "Chowk, Lucknow",
    provider_id: "prov_lko_05",
    description_en: "Expert bricklaying, concrete structures laying, plastering, and floor tiling jobs.",
    description_hi: "ईंट बिछाने, कंक्रीट बिछाने, प्लास्टर और फर्श टाइलिंग के अनुभवी कारीगर।"
  },
  {
    id: "labour_2",
    category: "Indian Labours",
    title_en: "Structural Helper / मजदूर हेल्पर",
    title_hi: "मजदूर हेल्पर",
    price_inr: 450,
    duration_mins: 480,
    rating: 4.5,
    reviews_count: 94,
    locality: "Aminabad, Lucknow",
    provider_id: "prov_lko_05",
    description_en: "Manual labor helper for loading, concrete mixing, and cleanups at construction sites.",
    description_hi: "कंक्रीट मिलाने, लोड उठाने और निर्माण स्थलों की सफाई के लिए मजदूर सहायक।"
  },
  {
    id: "labour_3",
    category: "Indian Labours",
    title_en: "Wall Painter / पेंटर",
    title_hi: "दीवार पेंटर",
    price_inr: 600,
    duration_mins: 480,
    rating: 4.7,
    reviews_count: 53,
    locality: "Hazratganj, Lucknow",
    provider_id: "prov_lko_05",
    description_en: "Sanding, wall putty filling, primer application, and high-quality paint finishing.",
    description_hi: "सैंडिंग, पुट्टी भरना, प्राइमर लगाना और दीवार पर रंग-रोगन का पेंट काम।"
  },
  {
    id: "labour_4",
    category: "Indian Labours",
    title_en: "Tile Cutter & Layer Worker",
    title_hi: "टाइल कटर और लेयर मजदूर",
    price_inr: 650,
    duration_mins: 480,
    rating: 4.8,
    reviews_count: 31,
    locality: "Gomti Nagar, Lucknow",
    provider_id: "prov_lko_05",
    description_en: "Tile sizing cutting, granite slicing, and precise bathroom/kitchen tile fixing.",
    description_hi: "टाइल काटना, ग्रेनाइट स्लाइसिंग और सटीक बाथरूम/रसोई टाइल फिक्सिंग।"
  },
  {
    id: "labour_5",
    category: "Indian Labours",
    title_en: "Debris Removal Handling Fleet",
    title_hi: "मलबा हटाने का काम",
    price_inr: 500,
    duration_mins: 480,
    rating: 4.4,
    reviews_count: 22,
    locality: "Aliganj, Lucknow",
    provider_id: "prov_lko_05",
    description_en: "Removing building waste materials, dust packages, and brick leftovers.",
    description_hi: "इमारती कचरा, सीमेंट धूल पैक और ईंटों के मलबे को हटाने की सेवा।"
  },

  // 6. Contractors & Builders
  {
    id: "contractor_1",
    category: "Contractors & Builders",
    title_en: "Full House Renovation Oversight",
    title_hi: "घर का पूर्ण नवीनीकरण और देखरेख",
    price_inr: 25000,
    duration_mins: 1440,
    rating: 5.0,
    reviews_count: 15,
    locality: "Hazratganj, Lucknow",
    provider_id: "prov_lko_06",
    description_en: "On-site assessment, material supervision, architect plans mapping, and budget oversight.",
    description_hi: "साइट मूल्यांकन, सामग्री पर्यवेक्षण, वास्तुकार योजनाओं और बजट की देखरेख।"
  },
  {
    id: "contractor_2",
    category: "Contractors & Builders",
    title_en: "Modular Kitchen Layout Planning",
    title_hi: "मॉड्यूलर किचन लेआउट योजना",
    price_inr: 15000,
    duration_mins: 720,
    rating: 4.9,
    reviews_count: 9,
    locality: "Gomti Nagar, Lucknow",
    provider_id: "prov_lko_06",
    description_en: "Chiminey plumbing links, modular rack calculations, cabinet design drawings.",
    description_hi: "चिमनी पाइप लिंकिंग, कैबिनेट डिजाइन और दराज लेआउट ड्राइंग।"
  },
  {
    id: "contractor_3",
    category: "Contractors & Builders",
    title_en: "Waterproofing Structure Specialist",
    title_hi: "जलरोधक (Waterproofing) संरचना विशेषज्ञ",
    price_inr: 8500,
    duration_mins: 480,
    rating: 4.8,
    reviews_count: 19,
    locality: "Aliganj, Lucknow",
    provider_id: "prov_lko_06",
    description_en: "Roof cracks leak coating, bathroom sub-floor chemical waterproofing injections.",
    description_hi: "छत की दरारों का रिसाव कोटिंग, रासायनिक जलरोधक इंजेक्शन।"
  },
  {
    id: "contractor_4",
    category: "Contractors & Builders",
    title_en: "Electrical Pipeline Blueprinting",
    title_hi: "विद्युत पाइपलाइन ब्लूप्रिंटिंग",
    price_inr: 12000,
    duration_mins: 600,
    rating: 4.7,
    reviews_count: 8,
    locality: "Indiranagar, Lucknow",
    provider_id: "prov_lko_06",
    description_en: "Wall conduit conduit markings, wiring routing mapping, distribution board locations planning.",
    description_hi: "कंड्यूट पाइप अंकन, वायरिंग रूटिंग मैपिंग और वितरण बोर्ड योजना।"
  },
  {
    id: "contractor_5",
    category: "Contractors & Builders",
    title_en: "Iron Grill Welding Contractor",
    title_hi: "लोहे की ग्रिल वेल्डिंग ठेकेदार",
    price_inr: 5500,
    duration_mins: 360,
    rating: 4.6,
    reviews_count: 21,
    locality: "Chowk, Lucknow",
    provider_id: "prov_lko_06",
    description_en: "Window security grill welding, balcony gate fabrication and lock installation.",
    description_hi: "खिड़की सुरक्षा ग्रिल वेल्डिंग, बालकनी गेट निर्माण और ताला स्थापना।"
  }
];
