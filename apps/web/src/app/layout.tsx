import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import SafetyBanner from '@/components/SafetyBanner'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: '1000 Springs Project | NZ Geothermal Spring Explorer',
    template: '%s | 1000 Springs Project',
  },
  description:
    'A free, non-commercial educational tool for exploring the microbiology, chemistry, and geothermal science of New Zealand hot springs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased bg-white text-slate-800 min-h-screen flex flex-col`}>
        <NavBar />
        <SafetyBanner />
        <main className="flex-1">{children}</main>
        <footer className="bg-slate-800 text-slate-300 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="font-semibold text-white mb-1">1000 Springs Project</p>
                <p className="text-sm">Free, non-commercial educational tool.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Data source</p>
                <p className="text-sm">
                  <a
                    href="https://1000springs.org.nz"
                    className="text-teal-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    1000 Springs Project
                  </a>{' '}
                  — GNS Science &amp; University of Waikato.
                </p>
                <p className="text-sm mt-1">
                  Licence:{' '}
                  <a
                    href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                    className="text-teal-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CC BY-NC-SA 4.0
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Safety</p>
                <p className="text-sm">
                  Hot springs can cause serious injury or death. Always follow posted safety
                  instructions and local rules.
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 border-t border-slate-700 pt-4">
              Data from the 1000 Springs Project. Used under CC BY-NC-SA 4.0.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
