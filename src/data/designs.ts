import { DesignStyle } from "@/types";

export interface VisualizerRoom {
  id: string;
  name: string;
  category: string;
  description: string;
  baseImage: string;
  floorPerspective: {
    polygon: string; // CSS clip-path or coordinate bounds
    defaultAngle: number;
  };
}

export interface FlooringTextureOption {
  id: string;
  name: string;
  category: string;
  materialCostPerSqFt: number;
  laborRatePerSqFt: number;
  texturePattern: string;
  previewColor: string;
  grainStyle: "veined" | "geometric" | "granite-speckle" | "wood-plank" | "terrazzo-chips";
  surfaceReflection: number; // 0 to 1
  referenceSource: string;
}

export const VISUALIZER_ROOMS: VisualizerRoom[] = [
  {
    id: "room-living",
    name: "Architectural Living Space",
    category: "Living / Lounge Area",
    description: "Contemporary open living hall with expansive glazing and ambient natural daylight.",
    baseImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
    floorPerspective: {
      polygon: "polygon(0% 48%, 100% 48%, 100% 100%, 0% 100%)",
      defaultAngle: 0,
    },
  },
  {
    id: "room-bedroom",
    name: "Master Suite Interior",
    category: "Private Bedroom",
    description: "Warm neutral suite with low-level architectural lighting and broad flooring expanse.",
    baseImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80",
    floorPerspective: {
      polygon: "polygon(0% 55%, 100% 55%, 100% 100%, 0% 100%)",
      defaultAngle: 45,
    },
  },
  {
    id: "room-kitchen",
    name: "Gourmet Kitchen & Dining",
    category: "Kitchen & Dining Space",
    description: "Modern kitchen featuring island cabinetry, warm pendants, and seamless floor plane.",
    baseImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80",
    floorPerspective: {
      polygon: "polygon(0% 62%, 100% 62%, 100% 100%, 0% 100%)",
      defaultAngle: 0,
    },
  },
  {
    id: "room-foyer",
    name: "Entrance Foyer & Gallery",
    category: "Foyer / Entryway",
    description: "High-ceiling entry foyer with classical lines and balanced perimeter lighting.",
    baseImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    floorPerspective: {
      polygon: "polygon(0% 52%, 100% 52%, 100% 100%, 0% 100%)",
      defaultAngle: 0,
    },
  },
];

export const FLOORING_TEXTURE_OPTIONS: FlooringTextureOption[] = [
  {
    id: "tex-statuario",
    name: "Statuario White Marble (Bookmatch Pattern)",
    category: "Italian Marble",
    materialCostPerSqFt: 680,
    laborRatePerSqFt: 75,
    texturePattern: "radial-gradient(ellipse at 40% 50%, rgba(255,255,255,0.95), rgba(240,242,245,0.85))",
    previewColor: "#F6F2E9",
    grainStyle: "veined",
    surfaceReflection: 0.92,
    referenceSource: "Carrara Calacatta/Statuario quarry reference",
  },
  {
    id: "tex-botticino",
    name: "Botticino Beige Classic",
    category: "Italian Marble",
    materialCostPerSqFt: 340,
    laborRatePerSqFt: 70,
    texturePattern: "radial-gradient(ellipse at 50% 50%, rgba(244,238,223,0.92), rgba(232,223,205,0.75))",
    previewColor: "#F4EEDF",
    grainStyle: "veined",
    surfaceReflection: 0.88,
    referenceSource: "Brescia calcitic stone reference",
  },
  {
    id: "tex-black-galaxy",
    name: "Black Galaxy Granite",
    category: "Black Galaxy Granite",
    materialCostPerSqFt: 185,
    laborRatePerSqFt: 50,
    texturePattern: "radial-gradient(circle at 30% 40%, rgba(30,41,59,0.98), rgba(23,35,33,1))",
    previewColor: "#172321",
    grainStyle: "granite-speckle",
    surfaceReflection: 0.95,
    referenceSource: "Chimakurthy bronzite granite reference",
  },
  {
    id: "tex-morbi-glazed",
    name: "1200x1800mm Glazed Porcelain Slab",
    category: "Vitrified Tiles",
    materialCostPerSqFt: 78,
    laborRatePerSqFt: 36,
    texturePattern: "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(226,232,240,0.9))",
    previewColor: "#E2DDD2",
    grainStyle: "veined",
    surfaceReflection: 0.82,
    referenceSource: "Morbi porcelain specification reference",
  },
  {
    id: "tex-moroccan",
    name: "Geometric Indigo Ceramic Tile",
    category: "Ceramic Tiles",
    materialCostPerSqFt: 92,
    laborRatePerSqFt: 40,
    texturePattern: "repeating-linear-gradient(45deg, #245B50 0px, #245B50 15px, #F6F2E9 15px, #F6F2E9 30px)",
    previewColor: "#245B50",
    grainStyle: "geometric",
    surfaceReflection: 0.45,
    referenceSource: "Mediterranean ceramic motif reference",
  },
  {
    id: "tex-terrazzo",
    name: "Venetian Green Jade & Brass Terrazzo",
    category: "Terrazzo / Mosaic",
    materialCostPerSqFt: 145,
    laborRatePerSqFt: 65,
    texturePattern: "radial-gradient(circle, #245B50 10%, #E8F0EE 30%, #F6F2E9 70%)",
    previewColor: "#245B50",
    grainStyle: "terrazzo-chips",
    surfaceReflection: 0.78,
    referenceSource: "Cast cementitious aggregate reference",
  },
  {
    id: "tex-oak-wood",
    name: "Nordic Smoked Oak Herringbone Planks",
    category: "Wooden / Laminate",
    materialCostPerSqFt: 165,
    laborRatePerSqFt: 42,
    texturePattern: "linear-gradient(90deg, #A8864C 0%, #7A5C2A 100%)",
    previewColor: "#C5A66B",
    grainStyle: "wood-plank",
    surfaceReflection: 0.55,
    referenceSource: "Engineered hardwood specification reference",
  },
];

export const SAMPLE_DESIGN_STYLES: DesignStyle[] = [
  {
    id: "ds-1",
    name: "Statuario Bookmatched Symmetrical Layout",
    category: "Italian Marble",
    patternType: "Bookmatched Slab",
    suitableRooms: ["Formal Living Foyer", "Executive Suite", "Grand Villa Entry"],
    estimatedCostRange: "₹720 - ₹850 / sq.ft (Material + Labor Reference)",
    description: "Mirror-image consecutive slabs aligned across a central datum line to create balanced geological butterfly veining.",
    colorTone: "Alabaster White & Charcoal Veining",
    patternCss: "bg-stone-100",
  },
  {
    id: "ds-2",
    name: "Architectural Herringbone Chevron Layout",
    category: "Wooden / Laminate",
    patternType: "Herringbone",
    suitableRooms: ["Master Suite", "Library / Study", "Private Lounge"],
    estimatedCostRange: "₹190 - ₹240 / sq.ft (Material + Labor Reference)",
    description: "45-degree interlocking zigzag layout that elongates spatial perspective and adds warm architectural rhythm.",
    colorTone: "Muted Gold & Chestnut Oak",
    patternCss: "bg-amber-50",
  },
  {
    id: "ds-3",
    name: "Seamless Large-Format 1200x1800mm Zero-Joint",
    category: "Vitrified Tiles",
    patternType: "Grid Lay",
    suitableRooms: ["Open Concept Living", "Contemporary Dining", "Commercial Gallery"],
    estimatedCostRange: "₹110 - ₹140 / sq.ft (Material + Labor Reference)",
    description: "Ultra-slim 1.5mm epoxy joint installation creating an uninterrupted monolithic plane across large square footages.",
    colorTone: "Pale Oyster & Subtle Travertine Grey",
    patternCss: "bg-stone-50",
  },
  {
    id: "ds-4",
    name: "Cast Venetian Terrazzo with Brass Dividing Ribbons",
    category: "Terrazzo / Mosaic",
    patternType: "Seamless Terrazzo",
    suitableRooms: ["Dining Pavilion", "Boutique Gallery", "Courtyard Transition"],
    estimatedCostRange: "₹210 - ₹260 / sq.ft (Material + Labor Reference)",
    description: "Recycled marble fragments set in tinted matrix with solid brass transition dividing strips ground flush and sealed.",
    colorTone: "Deep Teal, Pale Cream & Muted Gold",
    patternCss: "bg-emerald-50",
  },
  {
    id: "ds-5",
    name: "Dual-Finish Flamed & Polished Granite Staircases",
    category: "Black Galaxy Granite",
    patternType: "Diamond Inlay",
    suitableRooms: ["Internal Duplex Staircase", "Entrance Portico", "Verandah Steps"],
    estimatedCostRange: "₹230 - ₹280 / sq.ft (Material + Labor Reference)",
    description: "Contrasting thermal flamed anti-skid step treads with diamond-polished copper speckle granite risers.",
    colorTone: "Deep Charcoal & Bronze Copper Spec",
    patternCss: "bg-stone-900",
  },
];
