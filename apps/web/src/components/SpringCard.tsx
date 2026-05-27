import Link from 'next/link'
import Image from 'next/image'
import type { SpringSummary } from '@/lib/types'

function TempBadge({ temp }: { temp: number | null }) {
  if (temp === null) return null
  let bg = 'bg-slate-100 text-slate-600'
  if (temp >= 80) bg = 'bg-red-100 text-red-700'
  else if (temp >= 60) bg = 'bg-orange-100 text-orange-700'
  else if (temp >= 40) bg = 'bg-yellow-100 text-yellow-700'
  else bg = 'bg-green-100 text-green-700'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${bg}`}>
      {temp}°C
    </span>
  )
}

interface Props {
  spring: SpringSummary
}

export default function SpringCard({ spring }: Props) {
  return (
    <Link
      href={`/springs/${spring.id}`}
      className="group block bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md hover:border-teal-300 transition-all"
    >
      <div className="relative h-36 bg-slate-100">
        {spring.image_url ? (
          <Image
            src={spring.image_url}
            alt={spring.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 text-4xl">
            ♨
          </div>
        )}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          <span className="bg-teal-700/90 text-white text-xs px-2 py-0.5 rounded font-medium">
            {spring.geothermal_system}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
          {spring.name}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{spring.location_text}</p>
        <div className="flex items-center gap-2 mt-2">
          <TempBadge temp={spring.temperature_c} />
          {spring.ph !== null && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
              pH {spring.ph}
            </span>
          )}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 ml-auto">
            {spring.feature_type}
          </span>
        </div>
      </div>
    </Link>
  )
}
