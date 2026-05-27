'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/safety', label: 'Safety' },
  { href: '/methodologies', label: 'Methodologies' },
  { href: '/about', label: 'About' },
  { href: '/attribution', label: 'Attribution' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="bg-teal-900 text-white border-b border-teal-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-bold text-lg tracking-tight hover:text-teal-200 transition-colors">
            1000 Springs
          </Link>
          <div className="flex items-center gap-1 sm:gap-4">
            {LINKS.map(link => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href || pathname?.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2 sm:px-3 py-1 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-700 text-white'
                      : 'text-teal-100 hover:bg-teal-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
