import Link from 'next/link'
import Image from 'next/image'
import type { SpringSummary } from '@/lib/types'

function TempBadge({ temp }: { temp: number | null }) {
  if (temp === null) return null
  let colour = 'bg-slate-100 text-slate-600'
  if (temp >= 80)      colour = 'bg-red-50 text-red-700 border border-red-200'
  else if (temp >= 60) colour = 'bg-orange-50 text-orange-700 border border-orange-200'
  else if (temp >= 40) colour = 'bg-amber-50 text-amber-700 border border-amber-200'
  else                 colour = 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${colour}`}>
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
      className="group block bg-white border border-slate-200 rounded overflow-hidden hover:border-teal-400 hover:shadow-sm transition-all"
    >
      <div className="relative h-36 bg-slate-100">
        {spring.image_url ? (
          <Image
            src={spring.image_url}
            alt={spring.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
            <span className="text-xs text-slate-400 font-medium tracking-wide uppercase">No photo</span>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="bg-teal-800/85 text-white text-xs px-2 py-0.5 rounded font-medium">
            {spring.geothermal_system}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-teal-700 transition-colors line-clamp-2">
          {spring.name}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{spring.location_text}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <TempBadge temp={spring.temperature_c} />
          {spring.ph !== null && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
              pH {spring.ph}
            </span>
          )}
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs text-slate-400 ml-auto">
            {spring.feature_type}
          </span>
        </div>
      </div>
    </Link>
  )
}
