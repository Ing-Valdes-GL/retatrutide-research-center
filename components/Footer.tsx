'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Github, Twitter, ArrowRight, MapPin, Clock } from 'lucide-react'

const LINKS = {
  Shop:    [{ label: 'All Products', href: '/products' }, { label: 'Categories', href: '/products' }, { label: 'Promotions', href: '/products' }],
  Company: [{ label: 'About RRC',   href: '/about' },    { label: 'Research',   href: '/about' },    { label: 'Contact',    href: '/chat' }],
  Account: [{ label: 'Sign In',     href: '/login' },    { label: 'My Orders',  href: '/orders' },   { label: 'Cart',       href: '/cart' }],
}

const LOCATIONS = [
  { city: 'London, UK', address: 'Headquarters & Distribution', flag: '🇬🇧' },
  { city: 'Amsterdam, NL', address: 'EU Research Facility', flag: '🇳🇱' },
  { city: 'Worldwide', address: 'Shipping to 50+ countries', flag: '🌍' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Top strip */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <Image
                src="/logo-share.png"
                alt="Retatrutide Research Center"
                width={200}
                height={65}
                className="h-12 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs" style={{ color: '#71717a' }}>
              Advancing GLP-1 peptide science through precision synthesis and HPLC-verified, research-grade compounds for laboratories worldwide.
            </p>

            {/* Newsletter mini */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#52525b' }}>Research Updates</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="ds-input flex-1 px-4 py-2.5 rounded-xl text-sm"
                />
                <button className="ds-btn-primary px-4 py-2.5 rounded-xl flex items-center justify-center shrink-0">
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-6" style={{ color: '#52525b' }}>{title}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: '#71717a' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Locations column */}
          <div className="lg:col-span-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-6" style={{ color: '#52525b' }}>Locations</p>
            <ul className="space-y-5">
              {LOCATIONS.map((loc) => (
                <li key={loc.city} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(217,119,6,0.10)', border: '1px solid rgba(217,119,6,0.20)' }}>
                    <MapPin size={12} style={{ color: '#d97706' }} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white leading-tight">{loc.flag} {loc.city}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: '#52525b' }}>{loc.address}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={11} style={{ color: '#52525b' }} />
                <span className="text-[11px]" style={{ color: '#52525b' }}>Mon–Fri · 9am–6pm GMT</span>
              </div>
              <Link href="/chat"
                className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest transition-colors"
                style={{ color: '#d97706' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
                onMouseLeave={e => (e.currentTarget.style.color = '#d97706')}>
                <Mail size={11} /> Contact Support →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[11px]" style={{ color: '#3f3f46' }}>
            © {new Date().getFullYear()} Retatrutide Research Center. For laboratory use only. Not for human consumption.
          </p>
          <div className="flex items-center gap-2">
            {[
              { icon: <Mail size={14} />, href: '/chat' },
              { icon: <Twitter size={14} />, href: '/' },
              { icon: <Github size={14} />, href: '/' },
            ].map((s, i) => (
              <Link key={i} href={s.href}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ds-btn-secondary"
                style={{ color: '#52525b' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fbbf24' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#52525b' }}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
