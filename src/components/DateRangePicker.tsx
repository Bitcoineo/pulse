"use client";

import { useState, useRef, useEffect } from "react";
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";

type Preset = {
  label: string;
  getRange: () => { start: Date; end: Date };
};

const presets: Preset[] = [
  { label: "Today", getRange: () => ({ start: new Date(), end: new Date() }) },
  { label: "7 days", getRange: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: "30 days", getRange: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: "90 days", getRange: () => ({ start: subDays(new Date(), 90), end: new Date() }) },
  { label: "This month", getRange: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
  { label: "Last month", getRange: () => ({ start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: "This year", getRange: () => ({ start: startOfYear(new Date()), end: new Date() }) },
];

type Props = {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
};

export default function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("30 days");
  const [customStart, setCustomStart] = useState(startDate);
  const [customEnd, setCustomEnd] = useState(endDate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectPreset(preset: Preset) {
    const { start, end } = preset.getRange();
    const s = start.toISOString();
    const e = end.toISOString();
    setActivePreset(preset.label);
    setCustomStart(s);
    setCustomEnd(e);
    onChange(s, e);
    setOpen(false);
  }

  function applyCustom() {
    setActivePreset("");
    onChange(customStart, customEnd);
    setOpen(false);
  }

  const displayText = activePreset || `${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d")}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
      >
        <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {displayText}
        <svg className="h-4 w-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-72 rounded-xl border border-stone-200 bg-white p-3 shadow-lg sm:w-72">
          <div className="space-y-1">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => selectPreset(p)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activePreset === p.label
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-3 border-t border-stone-100 pt-3">
            <p className="mb-2 text-xs font-medium text-stone-500 uppercase">Custom</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={customStart.slice(0, 10)}
                onChange={(e) => setCustomStart(new Date(e.target.value).toISOString())}
                className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm"
              />
              <input
                type="date"
                value={customEnd.slice(0, 10)}
                onChange={(e) => setCustomEnd(new Date(e.target.value).toISOString())}
                className="w-full rounded-md border border-stone-200 px-2 py-1.5 text-sm"
              />
            </div>
            <button
              onClick={applyCustom}
              className="mt-2 w-full rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
