'use client'

import Link from 'next/link'
import { FlaskConical, Mail, Github, Twitter, ArrowRight } from 'lucide-react'

const LINKS = {
  Shop:    [{ label: 'All Products', href: '/products' }, { label: 'Categories', href: '/products' }, { label: 'Promotions', href: '/products' }],
  Company: [{ label: 'About RRC',   href: '/about' },    { label: 'Research',   href: '/about' },    { label: 'Contact',    href: '/chat' }],
  Account: [{ label: 'Sign In',     href: '/login' },    { label: 'My Orders',  href: '/orders' },   { label: 'Cart',       href: '/cart' }],
}

export default function Footer() {
  return (
    <footer style={{ background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Top strip */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 4px 20px rgba(217,119,6,0.35)' }}>
                <FlaskConical size={20} className="text-white" />
              </div>
              <div>
                <p className="font-black uppercase tracking-[0.15em] text-white text-sm">Retatrutide RC</p>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: '#52525b' }}>Research Center</p>
              </div>
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
