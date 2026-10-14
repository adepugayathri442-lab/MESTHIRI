"use client";

import React, { useState } from "react";
import { FlooringCategory } from "@/types";
import {
  X,
  Calculator,
  Shield,
  ArrowRight,
  Info,
  Ruler,
} from "lucide-react";

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPostJob: (initialArea: number, material: FlooringCategory) => void;
  initialArea?: number;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  isOpen,
  onClose,
  onProceedToPostJob,
  initialArea,
}) => {
  const [material, setMaterial] = useState<FlooringCategory>("Italian Marble");
  const [inputMode, setInputMode] = useState<"dimensions" | "sqft">(initialArea ? "sqft" : "dimensions");
  const [roomLength, setRoomLength] = useState<number>(25);
  const [roomWidth, setRoomWidth] = useState<number>(20);
  const [areaSqFt, setAreaSqFt] = useState<number>(initialArea || 500);
  const [contractorTier, setContractorTier] = useState<"master" | "standard">("master");
  const [includeDiamondPolish, setIncludeDiamondPolish] = useState<boolean>(true);
  const [includeWastageBuffer, setIncludeWastageBuffer] = useState<boolean>(true);

  React.useEffect(() => {
    if (initialArea && initialArea > 0) {
      setAreaSqFt(initialArea);
      setInputMode("sqft");
    }
  }, [initialArea]);

  if (!isOpen) return null;

  // Base pricing matrix (Illustrative reference benchmark rates for Prototype A)
  const materialBaseRate: Record<FlooringCategory, number> = {
    "Italian Marble": 550,
    "Indian Marble": 140,
    "Black Galaxy Granite": 180,
    "Granite": 180,
    "Vitrified Tiles": 75,
    "Ceramic Tiles": 50,
    "Terrazzo / Mosaic": 140,
    "Wooden / Laminate": 160,
    "Adhesives & Grout": 28,
    "Flooring Polish & Accessories": 35,
  };

  const laborRate: Record<FlooringCategory, { master: number; standard: number }> = {
    "Italian Marble": { master: 75, standard: 55 },
    "Indian Marble": { master: 55, standard: 40 },
    "Black Galaxy Granite": { master: 50, standard: 38 },
    "Granite": { master: 50, standard: 38 },
    "Vitrified Tiles": { master: 38, standard: 28 },
    "Ceramic Tiles": { master: 32, standard: 24 },
    "Terrazzo / Mosaic": { master: 68, standard: 50 },
    "Wooden / Laminate": { master: 45, standard: 35 },
    "Adhesives & Grout": { master: 25, standard: 18 },
    "Flooring Polish & Accessories": { master: 30, standard: 22 },
  };

  const activeArea = inputMode === "dimensions" ? roomLength * roomWidth : areaSqFt;
  const billableMaterialArea = includeWastageBuffer ? Math.round(activeArea * 1.1) : activeArea;

  const totalMaterialCost = billableMaterialArea * materialBaseRate[material];
  const totalLaborCost = activeArea * laborRate[material][contractorTier];
  const totalPolishingCost =
    includeDiamondPolish && (material.includes("Marble") || material.includes("Terrazzo"))
      ? activeArea * 20
      : 0;
  const grandTotal = totalMaterialCost + totalLaborCost + totalPolishingCost;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172321]/70 backdrop-blur-sm overflow-y-auto animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calculator-title"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2DDD2] overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#172321] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg text-[#C5A66B]">
              <Calculator className="w-5 h-5 text-[#C5A66B]" />
            </div>
            <div>
              <h3 id="calculator-title" className="text-base sm:text-lg font-bold">
                Flooring Budget Calculator
              </h3>
              <p className="text-xs text-stone-300">
                Academic Prototype A • Illustrative Rate Benchmark Estimator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prototype A Transparency Notice */}
        <div className="p-3 bg-[#FAF7F0] border-b border-[#E2DDD2] text-xs text-[#6E6B65] flex items-start gap-2">
          <Info className="w-4 h-4 text-[#245B50] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-[#172321]">Academic Prototype A:</strong> Calculates an estimated flooring budget using clearly stated illustrative rates for demonstration purposes.
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Material Select */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Select Flooring Material Category
            </label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value as FlooringCategory)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 bg-[#FAF7F0] font-semibold text-stone-800 focus:outline-none focus:border-[#245B50]"
            >
              <option value="Italian Marble">Italian Marble (Statuario / Botticino / Dyna)</option>
              <option value="Indian Marble">Indian Marble (Makrana White / Morwad)</option>
              <option value="Granite">Granite (Black Galaxy / River White / Tan Brown)</option>
              <option value="Vitrified Tiles">Vitrified Tiles (1200x1800mm / 800x1600mm GVT)</option>
              <option value="Ceramic Tiles">Ceramic Tiles (Anti-Skid Earthenware)</option>
              <option value="Terrazzo / Mosaic">Artisanal Terrazzo with Brass Dividers</option>
              <option value="Wooden / Laminate">Wooden Planks / Engineered Wood</option>
            </select>
          </div>

          {/* Dimension Mode Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                Floor Sizing Method
              </label>
              <div className="inline-flex p-0.5 rounded-lg bg-stone-100 border border-stone-200 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode("dimensions")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    inputMode === "dimensions"
                      ? "bg-white text-[#245B50] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Room Dimensions (L × W)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("sqft")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    inputMode === "sqft"
                      ? "bg-white text-[#245B50] shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Direct Sq.Ft Area
                </button>
              </div>
            </div>

            {inputMode === "dimensions" ? (
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Room Length (Feet)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={150}
                    value={roomLength}
                    onChange={(e) => setRoomLength(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Room Width (Feet)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={150}
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-bold"
                  />
                </div>
                <div className="col-span-2 text-right text-xs font-bold text-[#245B50]">
                  Calculated Surface Area: {activeArea} sq.ft
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-[#FAF7F0] border border-[#E2DDD2]">
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                  <span>Total Floor Surface Area</span>
                  <span className="text-[#245B50] font-extrabold text-sm">{areaSqFt} sq.ft</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full accent-[#245B50] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Contractor Tier */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Craftsman Experience Benchmark
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setContractorTier("master")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  contractorTier === "master"
                    ? "border-[#245B50] bg-[#FAF7F0] text-[#172321] font-bold ring-1 ring-[#245B50]"
                    : "border-stone-200 bg-white text-stone-600"
                }`}
              >
                <div className="text-xs font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#245B50]" />
                  Master Craftsman
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  ₹{laborRate[material].master}/sq.ft • Optical laser datum
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContractorTier("standard")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  contractorTier === "standard"
                    ? "border-[#245B50] bg-[#FAF7F0] text-[#172321] font-bold ring-1 ring-[#245B50]"
                    : "border-stone-200 bg-white text-stone-600"
                }`}
              >
                <div className="text-xs font-bold">Standard Contractor</div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  ₹{laborRate[material].standard}/sq.ft • Spirit level
                </div>
              </button>
            </div>
          </div>

          {/* Polish & Wastage Toggles */}
          <div className="space-y-2 pt-1">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDiamondPolish}
                onChange={(e) => setIncludeDiamondPolish(e.target.checked)}
                className="rounded text-[#245B50] accent-[#245B50]"
              />
              <span>
                Include 7-grade rotary diamond crystallization mirror polish (₹20/sq.ft)
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeWastageBuffer}
                onChange={(e) => setIncludeWastageBuffer(e.target.checked)}
                className="rounded text-[#245B50] accent-[#245B50]"
              />
              <span>
                Add IS 1443 recommended 10% cutting, skirtings, and corner wastage allowance
              </span>
            </label>
          </div>

          {/* Cost Summary Breakdown Card */}
          <div className="p-4 rounded-xl bg-stone-900 text-white space-y-2.5">
            <div className="flex justify-between text-xs text-stone-300">
              <span>Billable Material Scope ({billableMaterialArea} sq.ft @ ₹{materialBaseRate[material]}/sq.ft):</span>
              <span className="font-semibold text-white">₹{totalMaterialCost.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-stone-300">
              <span>Labor Laying ({activeArea} sq.ft @ ₹{laborRate[material][contractorTier]}/sq.ft):</span>
              <span className="font-semibold text-white">₹{totalLaborCost.toLocaleString("en-IN")}</span>
            </div>
            {totalPolishingCost > 0 && (
              <div className="flex justify-between text-xs text-stone-300">
                <span>Diamond Crystallization Polish ({activeArea} sq.ft @ ₹20/sq.ft):</span>
                <span className="font-semibold text-white">₹{totalPolishingCost.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-700 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A66B]">
                Total Estimated Budget
              </span>
              <span className="text-xl font-black text-white">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 hidden sm:inline">
            Illustrative rate benchmarks for planning.
          </span>
          <button
            onClick={() => {
              onProceedToPostJob(activeArea, material);
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#245B50] hover:bg-[#1A443C] text-xs font-bold text-white shadow-xs flex items-center gap-1.5 transition-colors ml-auto sm:ml-0"
          >
            <span>Proceed to Post Job Requirement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
