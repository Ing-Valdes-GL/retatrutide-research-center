'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Phone, MapPin, ShieldCheck, ArrowRight, MessageCircle, Send } from 'lucide-react'
import LegalModal from '@/components/legal/LegalModal'
import PrivacyContent from '@/components/legal/PrivacyContent'
import RefundContent from '@/components/legal/RefundContent'
import BrandLogo from '@/components/BrandLogo'
import { useInView } from '@/hooks/useInView'

export default function Footer() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)

  const [col1Ref, col1In] = useInView<HTMLDivElement>()
  const [col2Ref, col2In] = useInView<HTMLDivElement>()
  const [col3Ref, col3In] = useInView<HTMLDivElement>()
  const [col4Ref, col4In] = useInView<HTMLDivElement>()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/home')
    }, 1000)
  }

  const colStyle = (inView: boolean, delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.65s cubic-bezier(.22,1,.36,1) ${delay}ms`,
  })

  return (
    <footer
      className="border-t"
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 50%, #fefce8 100%)',
        borderColor: 'rgba(132,204,22,0.15)',
        borderTopWidth: '1px',
        color: '#14532d',
      }}
    >
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Col 1 — Brand & Newsletter */}
          <div ref={col1Ref} className="col-span-1 md:col-span-5 space-y-8" style={colStyle(col1In, 0)}>
            <Link href="/" className="inline-block">
              <BrandLogo size="lg" showFullName />
            </Link>

            <p className="max-w-sm text-sm font-bold uppercase tracking-widest text-[#4b7c59] leading-relaxed">
              Advancing Peptide Science for Human Health
            </p>

            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-[0.3em]" style={{ color: '#65a30d' }}>Newsletter</h4>
              <form onSubmit={handleSubscribe} className="relative max-w-sm group">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-6 pr-16 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest outline-none transition-all bg-white text-[#1a2e05] placeholder:text-[#9ca3af]"
                  style={{
                    border: '1.5px solid rgba(132,204,22,0.22)',
                    boxShadow: '0 2px 12px rgba(132,204,22,0.06)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(132,204,22,0.55)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(132,204,22,0.22)')}
                />
                <button
                  disabled={loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #84cc16, #65a30d)', boxShadow: '0 4px 16px rgba(132,204,22,0.35)' }}
                >
                  {loading
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    : <Send size={18} />}
                </button>
              </form>
            </div>

            <div className="flex items-center gap-3 font-black text-xs uppercase tracking-widest lg-badge w-fit px-6 py-3 rounded-2xl" style={{ color: '#65a30d' }}>
              <ShieldCheck size={18} />
              <span>Certified Medical Supplier</span>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div ref={col2Ref} className="col-span-1 md:col-span-2" style={colStyle(col2In, 100)}>
            <h3 className="font-black text-sm uppercase tracking-[0.4em] mb-10" style={{ color: '#65a30d' }}>Explore</h3>
            <ul className="space-y-6">
              {[
                { name: 'All Products', href: '/products' },
                { name: 'My Cart',      href: '/cart' },
                { name: 'Support Chat', href: '/chat' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[#4b7c59] hover:text-[#65a30d] transition-colors"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#84cc16]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Global Network */}
          <div ref={col3Ref} className="col-span-1 md:col-span-3" style={colStyle(col3In, 200)}>
            <h3 className="font-black text-sm uppercase tracking-[0.4em] mb-10" style={{ color: '#65a30d' }}>Our Global Network</h3>
            <ul className="space-y-4">
              {[
                { flag: '🇺🇸', label: 'USA (Boston – HQ)', href: 'https://maps.app.goo.gl/ojt7ysNJj8QEqsAQA' },
                { flag: '🇨🇦', label: 'Canada (Toronto)',  href: 'https://maps.app.goo.gl/Z2vKN9d6wnnX1BfA7' },
                { flag: '🇬🇧', label: 'UK (London)',       href: 'https://maps.app.goo.gl/6d53TgwzGihrafSF7' },
                { flag: '🇩🇪', label: 'Germany (Munich)', href: 'https://maps.app.goo.gl/EKz9EbtBHh7jRKKp9' },
                { flag: '🇦🇺', label: 'Australia (Sydney)', href: 'https://maps.app.goo.gl/paHStiGfzqgjaZz89' },
              ].map((loc) => (
                <li key={loc.label}>
                  <a
                    href={loc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#4b7c59] hover:text-[#65a30d] transition-colors"
                  >
                    <span className="text-base">{loc.flag}</span> {loc.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div ref={col4Ref} className="col-span-1 md:col-span-4" style={colStyle(col4In, 300)}>
            <h3 className="font-black text-sm uppercase tracking-[0.4em] mb-10" style={{ color: '#65a30d' }}>Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-5 group">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className="p-4 rounded-2xl transition-all"
                  style={{ background: '#f0fdf4', border: '1px solid rgba(132,204,22,0.18)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#84cc16'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; (e.currentTarget as HTMLElement).style.color = '' }}
                >
                  <Mail size={20} className="text-[#65a30d]" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">Email Support</span>
                  <a href="/chat" className="text-xs font-black uppercase tracking-widest text-[#1a2e05] hover:text-[#65a30d] transition-colors">
                    support@retatrutiderc.com
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-5 group">
                <a href="https://wa.me/+15674168350" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="p-4 rounded-2xl transition-all"
                    style={{ background: '#f0fdf4', border: '1px solid rgba(132,204,22,0.18)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#22c55e'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; }}
                  >
                    <Phone size={20} className="text-[#65a30d]" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">Direct Line</span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#1a2e05]">WhatsApp Support</span>
                  </div>
                </a>
              </li>

              <li className="flex items-center gap-5 group">
                <a href="https://t.me/+15674168350" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    className="p-4 rounded-2xl transition-all"
                    style={{ background: '#f0fdf4', border: '1px solid rgba(132,204,22,0.18)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#38bdf8'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; }}
                  >
                    <MessageCircle size={20} className="text-[#65a30d]" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">Community</span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#1a2e05]">Telegram Channel</span>
                  </div>
                </a>
              </li>

              <li className="flex items-center gap-5 group pt-4">
                <div className="p-4 rounded-2xl" style={{ background: '#f0fdf4', border: '1px solid rgba(132,204,22,0.18)' }}>
                  <MapPin size={20} className="text-[#65a30d]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">Headquarters</span>
                  <span className="text-xs font-black uppercase tracking-widest text-[#1a2e05]">USA, Boston</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment logos */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center items-center gap-6 px-6 py-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(132,204,22,0.12)', boxShadow: '0 2px 12px rgba(132,204,22,0.06)' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo_2014.svg" alt="Visa" className="h-4 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-6 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Maestro_logo.svg" alt="Maestro" className="h-6 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg" alt="Diners Club" className="h-6 w-auto" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/40/JCB_logo.svg" alt="JCB" className="h-6 w-auto" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9ca3af]">
            Advancing discovery through Retatrutide Research Center
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8"
          style={{ borderTop: '1px solid rgba(132,204,22,0.12)' }}>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9ca3af]">
            © 2025 Retatrutide Research Center. All rights reserved.
          </p>
          <div className="flex gap-10">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] hover:text-[#65a30d] transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowRefundModal(true)}
              className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] hover:text-[#65a30d] transition-colors"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>

      <LegalModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy">
        <PrivacyContent />
      </LegalModal>
      <LegalModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} title="Refund & Return Policy">
        <RefundContent />
      </LegalModal>
    </footer>
  )
}
