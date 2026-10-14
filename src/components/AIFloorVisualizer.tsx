"use client";

import React, { useState } from "react";
import {
  VISUALIZER_ROOMS,
  FLOORING_TEXTURE_OPTIONS,
  VisualizerRoom,
  FlooringTextureOption,
} from "@/data/designs";
import {
  Sparkles,
  Sliders,
  DollarSign,
  AlertCircle,
  ArrowRight,
  SplitSquareVertical,
  Check,
  Compass,
  Info,
  Upload,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Eye,
} from "lucide-react";

interface AIFloorVisualizerProps {
  onBookWorkersForStyle: (styleName: string, category: string, area?: number) => void;
  onOrderMaterial: (materialName: string) => void;
}

export const AIFloorVisualizer: React.FC<AIFloorVisualizerProps> = ({
  onBookWorkersForStyle,
  onOrderMaterial,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<VisualizerRoom>(VISUALIZER_ROOMS[0]);
  const [customRoomImage, setCustomRoomImage] = useState<string | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<FlooringTextureOption>(
    FLOORING_TEXTURE_OPTIONS[0]
  );
  const [orientationAngle, setOrientationAngle] = useState<number>(0); // 0 or 45
  const [finishMode, setFinishMode] = useState<"gloss" | "matte" | "leather">("gloss");
  const [ambientLighting, setAmbientLighting] = useState<"daylight" | "warm" | "dramatic">("daylight");
  const [splitPosition, setSplitPosition] = useState<number>(50); // 0 to 100%
  const [roomAreaSqFt, setRoomAreaSqFt] = useState<number>(750);
  const [showBeforeAfter, setShowBeforeAfter] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Handle custom room photograph upload
  const handleRoomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCustomRoomImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate generating preview
  const handleGeneratePreview = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 650);
  };

  // Save to Favorites
  const handleSaveFavorite = () => {
    try {
      const favoriteItem = {
        id: `fav-${Date.now()}`,
        room: selectedRoom.name,
        texture: selectedTexture.name,
        category: selectedTexture.category,
        finishMode,
        orientationAngle,
        areaSqFt: roomAreaSqFt,
        date: new Date().toLocaleDateString("en-IN"),
      };
      if (typeof window !== "undefined") {
        const existing = JSON.parse(localStorage.getItem("mesthiri_saved_designs") || "[]");
        localStorage.setItem("mesthiri_saved_designs", JSON.stringify([favoriteItem, ...existing]));
      }
      setIsSaved(true);
      setSaveMessage("Design saved to your favorites!");
      setTimeout(() => setSaveMessage(null), 3500);
    } catch {
      setIsSaved(true);
    }
  };

  // Financial calculations based on architectural reference benchmarks
  const materialCost = roomAreaSqFt * selectedTexture.materialCostPerSqFt;
  const laborCost = roomAreaSqFt * selectedTexture.laborRatePerSqFt;
  const polishingCost = selectedTexture.category.includes("Marble") || selectedTexture.category.includes("Terrazzo")
    ? roomAreaSqFt * 20
    : 0;
  const totalProjectEst = materialCost + laborCost + polishingCost;

  // Reflection opacity styling
  const reflectionOpacity =
    finishMode === "gloss"
      ? selectedTexture.surfaceReflection
      : finishMode === "matte"
      ? selectedTexture.surfaceReflection * 0.4
      : 0.15;

  // Lighting overlay styling
  const lightingFilter =
    ambientLighting === "daylight"
      ? "brightness(1.02) contrast(1.05)"
      : ambientLighting === "warm"
      ? "sepia(0.2) saturate(1.2) brightness(0.98)"
      : "contrast(1.2) brightness(0.92)";

  return (
    <section id="visualizer-section" className="py-12 bg-[#172321] text-white min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Presentation Disclaimer Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#245B50]/40 text-[#C5A66B] border border-[#C5A66B]/30 font-semibold text-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" />
            Simulated Preview — AI integration not yet connected.
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#FAF7F0]">
            Flooring Visualizer & Pattern Studio
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-3xl leading-relaxed">
            Preview luxury Italian marble, large-format vitrified slabs, and granite finishes mapped onto room environments with perspective projection, adjustable surface sheen, and benchmark cost estimations.
          </p>

          {/* Academic Prototype Transparency Banner */}
          <div className="mt-4 p-4 rounded-xl bg-[#245B50]/20 border border-[#245B50]/40 text-stone-300 text-xs flex items-start gap-3">
            <Info className="w-4 h-4 text-[#C5A66B] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-[#C5A66B]">Simulated Preview — AI integration not yet connected:</strong> This prototype demonstrates the front-end user experience and perspective projection of the envisioned flooring visualization pipeline for the college Innovation Engineering project. It utilizes CSS perspective polygon composition, SVG joint matrices, and dynamic blend shaders. Real generative neural rendering is not active in this demo. Visual previews do not guarantee natural stone veining or installed site results.
            </div>
          </div>
        </div>

        {/* Main Visualizer Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Canvas & Interactive Viewport (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-stone-800 shadow-2xl aspect-[4/3] sm:aspect-[16/10]">
              {/* Room Base Image (Custom or Sample Preset) */}
              <img
                src={customRoomImage || selectedRoom.baseImage}
                alt={selectedRoom.name}
                className="w-full h-full object-cover transition-all duration-500"
                style={{ filter: lightingFilter }}
              />

              {/* Generating Animation Overlay */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                  <RefreshCw className="w-8 h-8 text-[#C5A66B] animate-spin mb-3" />
                  <span className="text-xs font-bold text-white tracking-wider">
                    Rendering Perspective Matrix...
                  </span>
                  <span className="text-[10px] text-stone-400 mt-1">
                    Simulating {selectedTexture.name} at {orientationAngle}° alignment
                  </span>
                </div>
              )}

              {/* Simulated Floor Overlay with perspective mapping */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  clipPath: customRoomImage ? "polygon(0% 45%, 100% 45%, 100% 100%, 0% 100%)" : selectedRoom.floorPerspective.polygon,
                  width: showBeforeAfter ? `${splitPosition}%` : "100%",
                  borderRight: showBeforeAfter ? "2px solid #C5A66B" : "none",
                }}
              >
                {/* Texture Base Layer */}
                <div
                  className="w-full h-full relative"
                  style={{
                    backgroundColor: selectedTexture.previewColor,
                    backgroundImage: selectedTexture.texturePattern,
                    transform: `rotate(${orientationAngle}deg)`,
                    transformOrigin: "center center",
                    opacity: 0.88,
                    mixBlendMode: "multiply",
                  }}
                >
                  {/* Grid Lines to represent tile joints or marble slabs */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(0, 0, 0, 0.22) 1.5px, transparent 1.5px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.22) 1.5px, transparent 1.5px)
                      `,
                      backgroundSize:
                        orientationAngle === 45
                          ? "45px 45px"
                          : selectedTexture.category.includes("Marble")
                          ? "120px 80px"
                          : "60px 60px",
                    }}
                  />
                </div>

                {/* Surface Reflection Gloss Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 50%, rgba(0,0,0,0.15) 100%)",
                    opacity: reflectionOpacity,
                    mixBlendMode: "overlay",
                  }}
                />
              </div>

              {/* Before/After Split Line Handle & Indicator */}
              {showBeforeAfter && (
                <div
                  className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center"
                  style={{ left: `${splitPosition}%` }}
                >
                  <div className="w-8 h-8 -ml-4 rounded-full bg-[#C5A66B] text-[#172321] font-black text-xs flex items-center justify-center shadow-lg border-2 border-white pointer-events-auto cursor-ew-resize">
                    ⇔
                  </div>
                </div>
              )}

              {/* Room & Texture Watermark */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-[#172321]/80 backdrop-blur-md border border-stone-700 text-xs font-semibold text-stone-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A66B] animate-pulse" />
                <span>{customRoomImage ? "Custom Uploaded Room" : selectedRoom.name}</span>
                <span className="text-[#C5A66B] font-bold">• {selectedTexture.name}</span>
              </div>

              {/* Split view indicator */}
              {showBeforeAfter && (
                <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[11px] font-bold px-3 py-1.5 rounded-lg bg-[#172321]/80 backdrop-blur-md border border-stone-800 text-stone-300">
                  <span className="text-[#C5A66B]">◄ Projected Pattern Preview ({splitPosition}%)</span>
                  <span className="text-stone-400">Original Unfinished Bed ►</span>
                </div>
              )}
            </div>

            {/* Quick Interactive Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-stone-900/90 border border-stone-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGeneratePreview}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg bg-[#245B50] hover:bg-[#1b433b] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>{isGenerating ? "Rendering..." : "Generate Preview"}</span>
                </button>

                <label className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#C5A66B]" />
                  <span>Upload Room Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleRoomPhotoUpload}
                    className="hidden"
                  />
                </label>

                {customRoomImage && (
                  <button
                    onClick={() => setCustomRoomImage(null)}
                    className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
                  >
                    Reset Room
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveFavorite}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSaved
                      ? "bg-[#C5A66B] text-[#172321] border-[#C5A66B]"
                      : "bg-white/5 hover:bg-white/10 text-stone-200 border-white/15"
                  }`}
                >
                  {isSaved ? (
                    <BookmarkCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-[#C5A66B]" />
                  )}
                  <span>{isSaved ? "Saved to Favorites" : "Save Design"}</span>
                </button>
              </div>
            </div>

            {saveMessage && (
              <div className="p-3 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Split Slider Control */}
            {showBeforeAfter && (
              <div className="bg-stone-900/90 p-3.5 rounded-xl border border-stone-800 flex items-center gap-3">
                <SplitSquareVertical className="w-4 h-4 text-[#C5A66B] shrink-0" />
                <span className="text-xs font-semibold text-stone-300 shrink-0">
                  Before / After Slider:
                </span>
                <input
                  type="range"
                  min={10}
                  max={90}
                  value={splitPosition}
                  onChange={(e) => setSplitPosition(Number(e.target.value))}
                  className="w-full accent-[#C5A66B] cursor-pointer"
                />
                <span className="text-xs font-mono text-[#C5A66B] font-bold w-12 text-right">
                  {splitPosition}%
                </span>
              </div>
            )}

            {/* Room Selector Thumbnails */}
            <div>
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                1. Select Room Environment (Sample Photos)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {VISUALIZER_ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoom(room);
                      setCustomRoomImage(null);
                    }}
                    className={`relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                      selectedRoom.id === room.id && !customRoomImage
                        ? "border-[#C5A66B] bg-[#C5A66B]/10 ring-2 ring-[#C5A66B]/40"
                        : "border-stone-800 bg-stone-900/50 hover:border-stone-700"
                    }`}
                  >
                    <img
                      src={room.baseImage}
                      alt={room.name}
                      className="w-full h-14 object-cover rounded-lg mb-1.5"
                    />
                    <p className="text-[11px] font-bold text-stone-200 truncate">{room.name}</p>
                    <p className="text-[10px] text-stone-400">{room.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Flooring Controls & Estimation (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Texture / Material Selector */}
            <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>2. Select Flooring Pattern</span>
                <span className="text-[11px] font-normal text-[#C5A66B]">
                  {FLOORING_TEXTURE_OPTIONS.length} Presets Available
                </span>
              </label>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {FLOORING_TEXTURE_OPTIONS.map((tex) => (
                  <button
                    key={tex.id}
                    onClick={() => setSelectedTexture(tex)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      selectedTexture.id === tex.id
                        ? "border-[#C5A66B] bg-[#C5A66B]/15 text-white font-bold"
                        : "border-stone-800 bg-black/40 text-stone-300 hover:bg-stone-800/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-7 h-7 rounded-lg border border-stone-700 shadow-xs shrink-0"
                        style={{ backgroundColor: tex.previewColor }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-stone-100">{tex.name}</p>
                        <p className="text-[10px] text-stone-400">{tex.category}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#C5A66B]">
                        ₹{tex.materialCostPerSqFt}
                      </span>
                      <span className="text-[10px] text-stone-400 block">/ sq.ft ref</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Adjustments & Shaders */}
            <div className="bg-stone-900/90 rounded-2xl p-5 border border-stone-800 space-y-4">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
                3. Tile Orientation & Surface Sheen
              </label>

              {/* Angle / Layout */}
              <div>
                <span className="text-xs text-stone-400 block mb-1.5 font-medium">Layout Angle</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOrientationAngle(0)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      orientationAngle === 0
                        ? "bg-[#245B50] text-white border-[#245B50]"
                        : "bg-black/50 text-stone-400 border-stone-800 hover:text-white"
                    }`}
                  >
                    Straight Grid (0°)
                  </button>
                  <button
                    onClick={() => setOrientationAngle(45)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      orientationAngle === 45
                        ? "bg-[#245B50] text-white border-[#245B50]"
                        : "bg-black/50 text-stone-400 border-stone-800 hover:text-white"
                    }`}
                  >
                    Diamond 45° Angle
                  </button>
                </div>
              </div>

              {/* Surface Reflection */}
              <div>
                <span className="text-xs text-stone-400 block mb-1.5 font-medium">Surface Polish Sheen</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setFinishMode("gloss")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      finishMode === "gloss"
                        ? "bg-[#245B50] text-white border-[#245B50] font-bold"
                        : "bg-black/50 text-stone-400 border-stone-800 hover:text-white"
                    }`}
                  >
                    Mirror Gloss
                  </button>
                  <button
                    onClick={() => setFinishMode("matte")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      finishMode === "matte"
                        ? "bg-[#245B50] text-white border-[#245B50] font-bold"
                        : "bg-black/50 text-stone-400 border-stone-800 hover:text-white"
                    }`}
                  >
                    Satin Matte
                  </button>
                  <button
                    onClick={() => setFinishMode("leather")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      finishMode === "leather"
                        ? "bg-[#245B50] text-white border-[#245B50] font-bold"
                        : "bg-black/50 text-stone-400 border-stone-800 hover:text-white"
                    }`}
                  >
                    Rustic Texture
                  </button>
                </div>
              </div>

              {/* Ambient Room Lighting */}
              <div>
                <span className="text-xs text-stone-400 block mb-1.5 font-medium">Ambient Room Lighting</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAmbientLighting("daylight")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      ambientLighting === "daylight"
                        ? "bg-[#C5A66B] text-[#172321] border-[#C5A66B] font-bold"
                        : "bg-black/50 text-stone-400 border-stone-800"
                    }`}
                  >
                    Daylight
                  </button>
                  <button
                    onClick={() => setAmbientLighting("warm")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      ambientLighting === "warm"
                        ? "bg-[#C5A66B] text-[#172321] border-[#C5A66B] font-bold"
                        : "bg-black/50 text-stone-400 border-stone-800"
                    }`}
                  >
                    Warm White
                  </button>
                  <button
                    onClick={() => setAmbientLighting("dramatic")}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      ambientLighting === "dramatic"
                        ? "bg-[#C5A66B] text-[#172321] border-[#C5A66B] font-bold"
                        : "bg-black/50 text-stone-400 border-stone-800"
                    }`}
                  >
                    Directional
                  </button>
                </div>
              </div>
            </div>

            {/* Benchmark Project Cost Estimator */}
            <div className="bg-gradient-to-br from-[#172321] to-[#121c1a] rounded-2xl p-5 border border-[#C5A66B]/30 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#C5A66B] uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#C5A66B]" />
                  Benchmark Cost Estimation
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  Material + Skilled Labor
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-stone-300 mb-1">
                  <span>Room Floor Area:</span>
                  <span className="font-bold text-white">{roomAreaSqFt} sq.ft</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={3000}
                  step={50}
                  value={roomAreaSqFt}
                  onChange={(e) => setRoomAreaSqFt(Number(e.target.value))}
                  className="w-full accent-[#C5A66B] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 text-xs text-stone-400 border-t border-stone-800 pt-3">
                <div className="flex justify-between">
                  <span>Material Benchmark ({selectedTexture.name.slice(0, 18)}...):</span>
                  <span className="text-stone-200 font-mono">₹{materialCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Skilled Craftsman Labor (₹{selectedTexture.laborRatePerSqFt}/sq.ft):</span>
                  <span className="text-stone-200 font-mono">₹{laborCost.toLocaleString("en-IN")}</span>
                </div>
                {polishingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Diamond Polishing & Crystallization:</span>
                    <span className="text-stone-200 font-mono">₹{polishingCost.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-stone-800 text-sm font-extrabold text-white">
                  <span className="text-[#C5A66B]">Total Estimated Turnkey Budget:</span>
                  <span className="text-[#C5A66B] font-mono text-base">
                    ₹{totalProjectEst.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  id="visualizer-post-job-btn"
                  onClick={() =>
                    onBookWorkersForStyle(selectedTexture.name, selectedTexture.category, roomAreaSqFt)
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-[#245B50] hover:bg-[#1b433b] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  title="Carry this material and room area into the job-posting form"
                >
                  <span>Post Job ({selectedTexture.name.split(" ")[0]} • {roomAreaSqFt} sq.ft)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A66B]" />
                </button>

                <button
                  onClick={() => onOrderMaterial(selectedTexture.name)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 transition-colors"
                >
                  View Material Specifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
