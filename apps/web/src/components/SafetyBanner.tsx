import Link from 'next/link'

export default function SafetyBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-start sm:items-center gap-2 text-sm text-amber-800">
        <span className="text-amber-600 flex-shrink-0 font-bold text-base leading-tight mt-0.5 sm:mt-0">⚠</span>
        <span>
          Hot springs can cause serious injury or death. Stay on marked paths, follow local signs,
          never cross barriers, and do not rely on this app for safe navigation.{' '}
          <Link href="/safety" className="font-semibold underline hover:text-amber-900">
            Safety information →
          </Link>
        </span>
      </div>
    </div>
  )
}
