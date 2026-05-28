'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LINKS = [
  { href: '/explore', label: 'Explore' },
  { href: '/safety', label: 'Safety' },
  { href: '/methodologies', label: 'Methodologies' },
  { href: '/about', label: 'About' },
  { href: '/attribution', label: 'Attribution' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname?.startsWith(href + '/')

  return (
    <nav className="bg-teal-900 text-white border-b border-teal-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex-shrink-0 hover:opacity-75 transition-opacity">
            <Image
              src="/logo.png"
              alt="One Thousand Springs"
              width={186}
              height={32}
              className="h-8 w-auto brightness-0 invert"
              priority
            />
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-1 sm:gap-4">
            {LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 sm:px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-teal-700 text-white'
                    : 'text-teal-100 hover:bg-teal-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger — hidden on sm+ */}
          <button
            className="sm:hidden p-2 rounded hover:bg-teal-800 transition-colors"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-teal-800 bg-teal-900 pb-3">
          <div className="max-w-7xl mx-auto px-4 pt-2 space-y-0.5">
            {LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-teal-700 text-white'
                    : 'text-teal-100 hover:bg-teal-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
