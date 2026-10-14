"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MaterialProduct, MaterialCategorySpec, MaterialShop, FlooringCategory } from "@/types";
import { MATERIAL_CATEGORIES_CATALOG, SAMPLE_PRODUCTS, SAMPLE_SHOPS } from "@/data/products";
import {
  ShoppingBag,
  Store,
  Layers,
  Calculator,
  Search,
  Info,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  X,
  Phone,
  Globe,
  Star,
  Sparkles,
  MapPin,
  Eye,
  Check,
  Plus,
  Minus,
  Trash2,
  Send,
  ListPlus,
  PackageCheck,
  SlidersHorizontal,
} from "lucide-react";

interface MarketplaceProps {
  onInquireProduct: (product: MaterialProduct) => void;
  onRequestSample: (product: MaterialProduct) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  onInquireProduct,
  onRequestSample,
}) => {
  const [activeTab, setActiveTab] = useState<"categories" | "slabs" | "demo-shops" | "supplier-onboarding">("categories");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All Categories");
  const [searchProductQuery, setSearchProductQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "min-area">("featured");

  // Material Details Modal state
  const [selectedProductDetails, setSelectedProductDetails] = useState<MaterialProduct | null>(null);
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState<MaterialCategorySpec | null>(null);
  const [selectedShopDetails, setSelectedShopDetails] = useState<MaterialShop | null>(null);

  // Enquiry Cart / Material Estimate List State
  const [enquiryCart, setEnquiryCart] = useState<Array<{ product: MaterialProduct; quantitySqFt: number }>>([
    { product: SAMPLE_PRODUCTS[0], quantitySqFt: 450 },
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [enquirySubmitted, setEnquirySubmitted] = useState<boolean>(false);

  // Quick Area & Wastage Calculator state
  const [calcArea, setCalcArea] = useState<number>(1000);
  const wastageBufferPct = 10;
  const totalAreaWithWastage = Math.round(calcArea * (1 + wastageBufferPct / 100));

  // Vendor Onboarding Modal State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState<boolean>(false);
  const [vendorSubmitted, setVendorSubmitted] = useState<boolean>(false);

  const categories: string[] = [
    "All Categories",
    "Italian Marble",
    "Indian Marble",
    "Black Galaxy Granite",
    "Vitrified Tiles",
    "Ceramic Tiles",
    "Terrazzo / Mosaic",
    "Adhesives & Grout",
    "Flooring Polish & Accessories",
  ];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = SAMPLE_PRODUCTS.filter((p) => {
      const matchesCategory =
        selectedCategoryFilter === "All Categories" || p.category === selectedCategoryFilter;
      const q = searchProductQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shopName.toLowerCase().includes(q) ||
        p.finish.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => (a.pricePerSqFt || 0) - (b.pricePerSqFt || 0));
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => (b.pricePerSqFt || 0) - (a.pricePerSqFt || 0));
    } else if (sortBy === "min-area") {
      list = [...list].sort((a, b) => a.minOrderSqFt - b.minOrderSqFt);
    }
    return list;
  }, [selectedCategoryFilter, searchProductQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: MaterialProduct) => {
    setEnquiryCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantitySqFt: item.quantitySqFt + 50 }
            : item
        );
      }
      return [...prev, { product, quantitySqFt: product.minOrderSqFt || 100 }];
    });
    setIsCartOpen(true);
    setEnquirySubmitted(false);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setEnquiryCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = Math.max(0, item.quantitySqFt + delta);
            return { ...item, quantitySqFt: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantitySqFt > 0)
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setEnquiryCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotalAmount = useMemo(() => {
    return enquiryCart.reduce(
      (sum, item) => sum + item.quantitySqFt * (item.product.pricePerSqFt || 50),
      0
    );
  }, [enquiryCart]);

  return (
    <section id="marketplace-section" className="py-12 bg-[#F6F2E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#172321] text-[#C5A66B] font-semibold text-xs mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-[#C5A66B]" />
              Material Exploration • Architectural Slabs & Tile Showrooms
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172321] tracking-tight font-serif">
              Marble, Granite & Tile Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6B65] mt-1 max-w-2xl leading-relaxed">
              Explore material categories, calibrated thickness benchmarks, and discover demo stone yards and tile showrooms across Telangana.
            </p>
          </div>

          {/* Quick Wastage Calculator Tool Trigger */}
          <div className="p-3.5 rounded-xl bg-white border border-[#E2DDD2] shadow-2xs flex items-center gap-3">
            <Calculator className="w-5 h-5 text-[#245B50] shrink-0" />
            <div>
              <span className="text-[10px] text-[#6E6B65] font-bold block uppercase tracking-wider">
                IS 1443 Wastage Allowance
              </span>
              <span className="text-xs font-bold text-[#172321]">
                {calcArea} sq.ft + 10% = <strong className="text-[#245B50]">{totalAreaWithWastage} sq.ft billable</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Prototype A Transparency Notice Banner */}
        <div className="mb-8 p-3.5 rounded-xl bg-white border border-[#E2DDD2] text-xs text-[#6E6B65] flex items-center gap-2.5 shadow-2xs">
          <Info className="w-4 h-4 text-[#C5A66B] shrink-0" />
          <span className="leading-relaxed">
            <strong className="text-[#172321]">Academic Prototype A Notice:</strong> Some profiles, prices, quotations, and interactions use illustrative demo data. All demo products and shops are labeled with the <strong>Demo Listing</strong> badge.
          </span>
        </div>

        {/* View Selection Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2DDD2] mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === "categories"
                  ? "border-[#245B50] text-[#245B50] bg-white rounded-t-lg"
                  : "border-transparent text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              <Layers className="w-4 h-4" />
              Architectural Categories ({MATERIAL_CATEGORIES_CATALOG.length})
            </button>

            <button
              onClick={() => setActiveTab("slabs")}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === "slabs"
                  ? "border-[#245B50] text-[#245B50] bg-white rounded-t-lg"
                  : "border-transparent text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#C5A66B]" />
              Example Slabs & Products ({filteredProducts.length})
            </button>

            <button
              onClick={() => setActiveTab("demo-shops")}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === "demo-shops"
                  ? "border-[#245B50] text-[#245B50] bg-white rounded-t-lg"
                  : "border-transparent text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              <Store className="w-4 h-4" />
              Demo Stone Depots ({SAMPLE_SHOPS.length})
            </button>

            <button
              onClick={() => setActiveTab("supplier-onboarding")}
              className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all ${
                activeTab === "supplier-onboarding"
                  ? "border-[#245B50] text-[#245B50] bg-white rounded-t-lg"
                  : "border-transparent text-[#6E6B65] hover:text-[#172321]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Supplier Verification Intake
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: ARCHITECTURAL MATERIAL CATEGORIES */}
        {/* ============================================================ */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MATERIAL_CATEGORIES_CATALOG.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl border border-[#E2DDD2] overflow-hidden shadow-2xs hover:shadow-sm hover:border-[#245B50] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Category Image */}
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={category.curatedImageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#172321]/85 backdrop-blur-sm text-white text-[11px] font-bold">
                        {category.name}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <p className="text-xs text-[#6E6B65] leading-relaxed line-clamp-2">
                        {category.description}
                      </p>

                      <div className="pt-2 border-t border-[#E2DDD2] space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] text-[#6E6B65] font-bold block uppercase tracking-wider">
                            Origin
                          </span>
                          <span className="text-[#172321] font-medium">{category.typicalOrigin}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#6E6B65] font-bold block uppercase tracking-wider">
                            Standard Thickness
                          </span>
                          <span className="text-[#172321] font-medium">{category.standardThickness}</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#6E6B65] font-bold block uppercase tracking-wider">
                            Pricing Guidance
                          </span>
                          <span className="text-[#245B50] font-bold block">{category.benchmarkPriceRange}</span>
                          <span className="text-[11px] text-[#172321] font-semibold mt-0.5 block">
                            {category.priceNote || "Contact supplier for current price and availability"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#6E6B65] font-bold block uppercase tracking-wider mb-1">
                            Available Finishes
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {category.recommendedFinishes.map((finish) => (
                              <span
                                key={finish}
                                className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F0] text-[#172321] border border-[#E2DDD2]"
                              >
                                {finish}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={() => setSelectedCategoryDetails(category)}
                      className="w-full py-2.5 px-3 rounded-lg bg-[#FAF7F0] hover:bg-[#245B50] hover:text-white text-[#172321] font-bold text-xs border border-[#E2DDD2] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Specifications</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CURATED SLABS & EXAMPLE PRODUCTS (DEMO LISTINGS) */}
        {/* ============================================================ */}
        {activeTab === "slabs" && (
          <div className="space-y-6">
            {/* Filter pills & Action controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2DDD2] shadow-2xs">
              {/* Search input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  placeholder="Search materials, slab types, or shops..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] text-xs text-[#172321] focus:outline-none focus:ring-1 focus:ring-[#245B50]"
                />
              </div>

              {/* Sorting and Cart launcher */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs text-[#6E6B65]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#245B50]" />
                  <span>Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-[#E2DDD2] bg-[#FAF7F0] text-xs font-semibold text-[#172321] focus:outline-none"
                  >
                    <option value="featured">Featured Benchmarks</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="min-area">Min Lot Size</option>
                  </select>
                </div>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="px-3.5 py-2 rounded-lg bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>Enquiry List ({enquiryCart.length})</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? "bg-[#245B50] text-[#F6F2E9] shadow-xs"
                      : "bg-white text-[#6E6B65] hover:text-[#172321] border border-[#E2DDD2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl border border-[#E2DDD2]">
                <PackageCheck className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#172321]">No matching materials found</p>
                <p className="text-xs text-stone-500 mt-1">Try resetting the category filter or search keywords.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryFilter("All Categories");
                    setSearchProductQuery("");
                  }}
                  className="mt-3 px-3 py-1.5 rounded bg-[#FAF7F0] border border-[#E2DDD2] text-xs font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-[#E2DDD2] overflow-hidden shadow-2xs hover:shadow-sm hover:border-[#245B50] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-stone-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-[#172321]/90 backdrop-blur-sm text-[#C5A66B] text-[10px] font-bold border border-[#C5A66B]/30">
                          Demo Listing
                        </div>
                        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">
                          {product.category}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-base font-bold text-[#172321] leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-xs text-[#6E6B65] leading-relaxed line-clamp-2">
                          {product.description}
                        </p>

                        <div className="pt-2 border-t border-[#E2DDD2] space-y-1.5 text-xs text-[#6E6B65]">
                          <div className="flex justify-between">
                            <span>Slab / Pack Size:</span>
                            <span className="font-semibold text-[#172321]">{product.slabSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Calibrated Spec:</span>
                            <span className="font-semibold text-[#172321]">{product.thickness}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Surface Finish:</span>
                            <span className="font-semibold text-[#172321]">{product.finish}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Stock Status:</span>
                            <span className="font-semibold text-emerald-700">{product.availabilityDisplay}</span>
                          </div>
                          <div className="pt-2 border-t border-[#E2DDD2] flex items-center justify-between">
                            <span className="text-[11px] font-bold text-[#245B50]">
                              {product.priceDisplay}
                            </span>
                            <span className="text-[10px] text-stone-400">Min {product.minOrderSqFt} sq.ft</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductDetails(product)}
                          className="flex-1 py-2 px-3 rounded-lg bg-[#FAF7F0] hover:bg-stone-200 text-[#172321] font-semibold text-xs border border-[#E2DDD2] transition-colors"
                        >
                          Specs
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-2 px-3 rounded-lg bg-[#245B50] hover:bg-[#1A443C] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <ListPlus className="w-3.5 h-3.5 text-[#C5A66B]" />
                          <span>Add to Enquiry</span>
                        </button>
                      </div>
                      <button
                        onClick={() => onRequestSample(product)}
                        className="w-full py-1.5 text-center text-[11px] font-medium text-stone-500 hover:text-[#245B50] transition-colors"
                      >
                        Request Sample Specimen →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: REGISTERED STONE DEPOTS & SHOWROOMS                   */}
        {/* ============================================================ */}
        {activeTab === "demo-shops" && (
          <div className="space-y-6">
            {SAMPLE_SHOPS.length === 0 ? (
              <div className="py-14 bg-white rounded-2xl border border-[#E2DDD2] text-center max-w-lg mx-auto p-8 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F0] text-[#245B50] flex items-center justify-center mx-auto mb-4 border border-[#E2DDD2]">
                  <Store className="w-7 h-7 text-[#245B50]" />
                </div>
                <h3 className="text-lg font-bold text-[#172321] font-serif">
                  No registered material shops yet. Be the first stone depot or tile showroom to join MESTHIRI.
                </h3>
                <p className="text-xs text-[#6E6B65] mt-2 leading-relaxed">
                  MESTHIRI does not display fabricated merchant profiles or scraped supplier listings. Trade-licensed stone depots, marble yards, and tile showrooms can register to list architectural slabs.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setActiveTab("supplier-onboarding")}
                    className="px-5 py-2.5 rounded-xl bg-[#245B50] text-[#F6F2E9] text-xs font-bold hover:bg-[#1A443C] transition-colors shadow-xs cursor-pointer"
                  >
                    Register as a Shop / Supplier Onboarding
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SAMPLE_SHOPS.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-xl border border-[#E2DDD2] p-5 shadow-2xs hover:border-[#245B50] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        <Store className="w-3 h-3" />
                        Demo Listing
                      </span>
                      <span className="text-[11px] text-[#6E6B65]">Telangana</span>
                    </div>

                    <h3 className="text-base font-bold text-[#172321] leading-snug">
                      {shop.name}
                    </h3>

                    <p className="text-xs text-[#6E6B65] mt-1.5 flex items-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#245B50] shrink-0 mt-0.5" />
                      <span>{shop.address}</span>
                    </p>

                    <p className="text-xs text-[#6E6B65] mt-3 leading-relaxed bg-[#FAF7F0] p-3 rounded-lg border border-[#E2DDD2]">
                      {shop.notes}
                    </p>

                    <div className="mt-4">
                      <span className="text-[10px] text-[#6E6B65] font-bold block uppercase tracking-wider mb-1.5">
                        Categories Stocked
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {shop.categoriesStocked.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-[#172321]"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#E2DDD2]">
                    <span className="text-[11px] text-[#6E6B65] italic block mb-2">
                      {shop.phone}
                    </span>
                    <button
                      onClick={() => setActiveTab("categories")}
                      className="w-full py-2 rounded-lg bg-[#FAF7F0] hover:bg-[#245B50] hover:text-white text-[#172321] font-semibold text-xs border border-[#E2DDD2] transition-colors"
                    >
                      Browse Stocked Categories
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        {/* ============================================================ */}
        {/* TAB 4: SUPPLIER INTAKE PORTAL */}
        {/* ============================================================ */}
        {activeTab === "supplier-onboarding" && (
          <div className="bg-white rounded-xl border border-[#E2DDD2] p-8 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#E2DDD2] flex items-center justify-center mx-auto mb-4 text-[#245B50]">
              <Store className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-[#172321] font-serif mb-2">
              Supplier Credential Verification Intake
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6B65] mb-6 leading-relaxed">
              Real stone yards, marble importers, and tile distributors in Telangana can submit their catalogs for verification. Verified suppliers gain direct exposure to residential flooring projects.
            </p>

            <div className="p-4 rounded-lg bg-[#FAF7F0] border border-[#E2DDD2] text-left text-xs text-[#6E6B65] mb-6 space-y-2">
              <strong className="text-[#172321] block">Supplier Listing Criteria:</strong>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
                <span>Valid GST registration and trade establishment license in Telangana.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#245B50] shrink-0" />
                <span>Physical stockyard address with verified gangsaw lot dimensions.</span>
              </div>
            </div>

            <button
              onClick={() => setIsVendorModalOpen(true)}
              className="px-6 py-2.5 rounded-lg bg-[#245B50] hover:bg-[#1A443C] text-[#F6F2E9] font-bold text-xs transition-colors shadow-xs"
            >
              Start Supplier Onboarding Application
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 1: MATERIAL DETAILS (SPECIFICATION MODAL) */}
        {/* ============================================================ */}
        {selectedProductDetails && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              <div className="relative h-56 bg-stone-100 overflow-hidden">
                <img
                  src={selectedProductDetails.imageUrl}
                  alt={selectedProductDetails.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#172321]/90 text-[#C5A66B] font-bold text-[10px] border border-[#C5A66B]/30">
                  Demo Listing • Architectural Specification
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-bold text-[#172321] font-serif">
                    {selectedProductDetails.name}
                  </h3>
                  <p className="text-[#6E6B65] mt-1">{selectedProductDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Geographical Origin
                    </span>
                    <span className="font-semibold text-[#172321]">{selectedProductDetails.origin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Calibrated Thickness
                    </span>
                    <span className="font-semibold text-[#172321]">{selectedProductDetails.thickness}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Slab Sizing Lot
                    </span>
                    <span className="font-semibold text-[#172321]">{selectedProductDetails.slabSize}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Surface Finish
                    </span>
                    <span className="font-semibold text-[#172321]">{selectedProductDetails.finish}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                  <span className="font-bold block mb-0.5">IS 1443 Laying Guidelines:</span>
                  <span>Polymer-modified mortar bed with 2mm leveling spacer clips. Joint lippage must test under 1.0mm prior to crystallization.</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD2]">
                  <span className="text-xs font-bold text-[#245B50]">
                    {selectedProductDetails.priceDisplay}
                  </span>
                  <button
                    onClick={() => {
                      onRequestSample(selectedProductDetails);
                      setSelectedProductDetails(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs transition-colors"
                  >
                    Request Sample Specimen (Demo)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2: CATEGORY SPECIFICATIONS MODAL */}
        {/* ============================================================ */}
        {selectedCategoryDetails && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              <div className="relative h-56 bg-stone-100 overflow-hidden">
                <img
                  src={selectedCategoryDetails.curatedImageUrl}
                  alt={selectedCategoryDetails.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedCategoryDetails(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-[#172321]/90 text-[#C5A66B] font-bold text-[10px] border border-[#C5A66B]/30">
                  Architectural Standard Specification
                </div>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div>
                  <h3 className="text-xl font-bold text-[#172321] font-serif">
                    {selectedCategoryDetails.name}
                  </h3>
                  <p className="text-[#6E6B65] mt-1">{selectedCategoryDetails.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Geographical Origin
                    </span>
                    <span className="font-semibold text-[#172321]">{selectedCategoryDetails.typicalOrigin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Standard Thickness
                    </span>
                    <span className="font-semibold text-[#172321]">{selectedCategoryDetails.standardThickness}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Benchmark Price
                    </span>
                    <span className="font-semibold text-[#245B50]">{selectedCategoryDetails.benchmarkPriceRange}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6B65] font-bold uppercase block">
                      Recommended Finishes
                    </span>
                    <span className="font-semibold text-[#172321]">
                      {selectedCategoryDetails.recommendedFinishes.join(", ")}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-[#172321] block mb-1">Typical Applications:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCategoryDetails.typicalApplication.map((app) => (
                      <span key={app} className="px-2.5 py-1 rounded-md bg-[#FAF7F0] border border-[#E2DDD2] text-[#172321] font-medium">
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E2DDD2]">
                  <span className="text-xs text-[#6E6B65]">
                    {selectedCategoryDetails.priceNote}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategoryDetails(null);
                      setActiveTab("slabs");
                    }}
                    className="px-4 py-2 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs transition-colors"
                  >
                    View Example Slabs →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 4: ENQUIRY LIST & MATERIAL ESTIMATE DRAWER */}
        {isCartOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/75 backdrop-blur-sm overflow-y-auto animate-in fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              {/* Header */}
              <div className="px-6 py-4 bg-[#172321] text-white flex items-center justify-between border-b border-[#245B50]/40">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#245B50]/50 rounded-xl text-[#C5A66B] border border-[#C5A66B]/30">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-serif">
                      Material Specification Enquiry List
                    </h3>
                    <p className="text-[11px] text-stone-300">
                      Assemble material scope and request preliminary batch quotations from local depots.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto bg-[#FAF7F0]/30">
                {enquirySubmitted ? (
                  <div className="p-8 text-center space-y-3 bg-white rounded-xl border border-emerald-200">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-[#172321] font-serif">
                      Enquiry Dispatched (Simulation)
                    </h4>
                    <p className="text-xs text-[#6E6B65] max-w-md mx-auto leading-relaxed">
                      Your technical material enquiry for {enquiryCart.length} specifications has been recorded for the college Innovation Engineering demonstration.
                    </p>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                      <strong>Academic Notice:</strong> Illustrative sample prices. No live payment was charged and no physical transport order was dispatched.
                    </div>
                    <button
                      onClick={() => {
                        setEnquirySubmitted(false);
                        setIsCartOpen(false);
                        setEnquiryCart([]);
                      }}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-[#245B50] text-white font-bold text-xs"
                    >
                      Done & Close
                    </button>
                  </div>
                ) : enquiryCart.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-[#E2DDD2]">
                    <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                    <p className="font-bold text-[#172321]">Your enquiry list is currently empty</p>
                    <p className="text-stone-500 mt-1">Browse example slabs and products to add materials.</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {enquiryCart.map(({ product, quantitySqFt }) => (
                        <div
                          key={product.id}
                          className="bg-white p-4 rounded-xl border border-[#E2DDD2] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-14 h-14 rounded-lg object-cover border border-[#E2DDD2] shrink-0"
                            />
                            <div>
                              <h5 className="font-bold text-[#172321] text-xs">{product.name}</h5>
                              <span className="text-[10px] text-[#6E6B65] block">{product.category} • {product.shopName}</span>
                              <span className="text-[11px] font-bold text-[#245B50] mt-0.5 block">{product.priceDisplay}</span>
                            </div>
                          </div>

                          {/* Stepper & Line Total */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0">
                            <div className="flex items-center gap-2 bg-[#FAF7F0] px-2 py-1 rounded-lg border border-[#E2DDD2]">
                              <button
                                onClick={() => handleUpdateCartQuantity(product.id, -50)}
                                className="p-1 rounded text-stone-600 hover:text-black cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-mono font-bold text-xs w-16 text-center text-[#172321]">
                                {quantitySqFt} sq.ft
                              </span>
                              <button
                                onClick={() => handleUpdateCartQuantity(product.id, 50)}
                                className="p-1 rounded text-stone-600 hover:text-black cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right w-24">
                              <span className="font-bold text-xs text-[#172321]">
                                ₹{(quantitySqFt * (product.pricePerSqFt || 50)).toLocaleString("en-IN")}
                              </span>
                              <span className="text-[10px] text-stone-400 block">Indicative</span>
                            </div>

                            <button
                              onClick={() => handleRemoveFromCart(product.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary Calculation */}
                    <div className="bg-white p-4 rounded-xl border border-[#E2DDD2] space-y-2">
                      <div className="flex justify-between text-[#6E6B65]">
                        <span>Total Selected Scope:</span>
                        <span className="font-semibold text-[#172321]">
                          {enquiryCart.reduce((sum, item) => sum + item.quantitySqFt, 0)} sq.ft
                        </span>
                      </div>
                      <div className="flex justify-between text-[#6E6B65]">
                        <span>IS 1443 Wastage Allowance (10%):</span>
                        <span className="font-semibold text-[#245B50]">+10% factored</span>
                      </div>
                      <div className="pt-2 border-t border-[#E2DDD2] flex justify-between items-center text-sm font-bold text-[#172321]">
                        <span>Estimated Material Benchmark:</span>
                        <span className="text-base text-[#245B50]">
                          ₹{cartTotalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Submission Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => setEnquirySubmitted(true)}
                        className="w-full py-3 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4 text-[#C5A66B]" />
                        <span>Dispatch Technical Specification Enquiry (Demo Mode)</span>
                      </button>
                      <p className="text-[10px] text-stone-400 text-center mt-2">
                        Demo Mode: Illustrative sample prices. No real commercial contract or payment executed.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 5: SHOP PROFILE DETAILS MODAL */}
        {selectedShopDetails && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/75 backdrop-blur-sm overflow-y-auto animate-in fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
              <div className="p-6 bg-[#172321] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#C5A66B] font-bold uppercase tracking-wider block">
                    Verified Regional Stone Yard
                  </span>
                  <h3 className="text-lg font-bold font-serif mt-0.5">{selectedShopDetails.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedShopDetails(null)}
                  className="p-1.5 text-white/70 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E2DDD2] space-y-1">
                  <span className="font-bold text-[#172321] block">Physical Yard Location</span>
                  <p className="text-[#6E6B65]">{selectedShopDetails.address}</p>
                </div>

                <div>
                  <span className="font-bold text-[#172321] block mb-2">Categories Stocked at Depot</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedShopDetails.categoriesStocked.map((cat) => (
                      <span key={cat} className="px-2.5 py-1 rounded bg-stone-100 border border-[#E2DDD2] text-[#172321] font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-[#6E6B65] leading-relaxed bg-white border border-[#E2DDD2] p-3 rounded-lg">
                  {selectedShopDetails.notes}
                </p>

                <div className="pt-2 border-t border-[#E2DDD2] flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedShopDetails(null)}
                    className="px-4 py-2 rounded-lg bg-stone-100 text-[#172321] font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedShopDetails(null);
                      setIsCartOpen(true);
                    }}
                    className="px-4 py-2 rounded-lg bg-[#245B50] text-white font-bold"
                  >
                    Inquire Depot Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
