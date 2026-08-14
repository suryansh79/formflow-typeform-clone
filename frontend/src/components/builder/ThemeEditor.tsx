"use client";

import React from "react";
import { ThemeConfig } from "@/lib/types";
import { Palette, Check } from "lucide-react";

interface ThemeEditorProps {
  theme: ThemeConfig;
  onChange: (updated: ThemeConfig) => void;
}

const PRESET_PALETTES: { name: string; primary: string; bg: string; text: string }[] = [
  { name: "Default Clean", primary: "#262626", bg: "#FFFFFF", text: "#191919" },
  { name: "Emerald Growth", primary: "#047857", bg: "#F0FDF4", text: "#064E3B" },
  { name: "Ocean Blue", primary: "#1D4ED8", bg: "#EFF6FF", text: "#1E3A8A" },
  { name: "Sunset Orange", primary: "#EA580C", bg: "#FFF7ED", text: "#7C2D12" },
  { name: "Purple Elegance", primary: "#7E22CE", bg: "#FAF5FF", text: "#581C87" },
  { name: "Midnight Dark", primary: "#3B82F6", bg: "#0F172A", text: "#F8FAFC" },
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange }) => {
  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <Palette className="w-5 h-5 text-blue-600" />
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">
          Custom Theme & Colors
        </h2>
      </div>

      {/* Preset Palettes */}
      <div>
        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-3 uppercase tracking-wider">
          Preset Palettes
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PRESET_PALETTES.map((preset) => {
            const isActive =
              theme.primary_color === preset.primary &&
              theme.background_color === preset.bg;

            return (
              <button
                key={preset.name}
                onClick={() =>
                  onChange({
                    ...theme,
                    primary_color: preset.primary,
                    background_color: preset.bg,
                    text_color: preset.text,
                  })
                }
                className={`p-3 rounded-xl border-2 text-left transition flex items-center justify-between ${
                  isActive
                    ? "border-blue-600 shadow-md bg-white dark:bg-zinc-800"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.bg }}
                  />
                  <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {preset.name}
                  </span>
                </div>
                {isActive && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-tuned Color Inputs */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Primary Accent Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.primary_color}
              onChange={(e) => onChange({ ...theme, primary_color: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-700 p-0.5"
            />
            <input
              type="text"
              value={theme.primary_color}
              onChange={(e) => onChange({ ...theme, primary_color: e.target.value })}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Background Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.background_color}
              onChange={(e) => onChange({ ...theme, background_color: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-700 p-0.5"
            />
            <input
              type="text"
              value={theme.background_color}
              onChange={(e) => onChange({ ...theme, background_color: e.target.value })}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 uppercase"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
            Text Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={theme.text_color}
              onChange={(e) => onChange({ ...theme, text_color: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border border-zinc-300 dark:border-zinc-700 p-0.5"
            />
            <input
              type="text"
              value={theme.text_color}
              onChange={(e) => onChange({ ...theme, text_color: e.target.value })}
              className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
