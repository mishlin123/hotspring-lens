'use client'

export type ChartType = 'bar' | 'pie'

interface ChartToggleProps {
  value: ChartType
  onChange: (type: ChartType) => void
  /** Optional accessible label describing what is being toggled */
  label?: string
}

// Tiny inline glyphs so the toggle reads at a glance
function BarGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1" y="6" width="2.5" height="5" rx="0.5" fill="currentColor" />
      <rect x="4.75" y="3" width="2.5" height="8" rx="0.5" fill="currentColor" />
      <rect x="8.5" y="1" width="2.5" height="10" rx="0.5" fill="currentColor" />
    </svg>
  )
}

function PieGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 6 L6 1 A5 5 0 0 1 10.3 8.5 Z" fill="currentColor" />
    </svg>
  )
}

/** Compact Bar / Pie switch — matches the dataset scatter colour-by toggle style */
export default function ChartToggle({ value, onChange, label }: ChartToggleProps) {
  const options: { key: ChartType; label: string; glyph: React.ReactNode }[] = [
    { key: 'bar', label: 'Bar', glyph: <BarGlyph /> },
    { key: 'pie', label: 'Pie', glyph: <PieGlyph /> },
  ]
  return (
    <div
      className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5"
      role="group"
      aria-label={label ?? 'Chart type'}
    >
      {options.map(({ key, label: optLabel, glyph }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          title={`${optLabel} chart`}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors font-medium ${
            value === key
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {glyph}
          {optLabel}
        </button>
      ))}
    </div>
  )
}
