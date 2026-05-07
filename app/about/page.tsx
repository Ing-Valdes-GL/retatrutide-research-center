'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, FlaskConical, Globe, ShieldCheck, Microscope } from 'lucide-react'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 32, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0,  filter: 'blur(0px)' },
  viewport:    { once: true as const },
  transition:  { duration: 0.75, ease, delay },
})

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Amber top stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      {/* Hero */}
      <section className="pt-40 pb-28 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-[0.4em] font-black mb-6" style={{ color: '#d97706' }}>
            Our Story
          </motion.p>
          <motion.h1 {...fadeUp(0.08)}
            className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]" style={{ letterSpacing: '-0.04em' }}>
            <span className="text-white">Science.</span><br />
            <span className="ds-text-gradient">Precision.</span><br />
            <span className="ds-text-gradient-emerald">Trust.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.16)} className="text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#71717a' }}>
            Pioneering peptide science through precision research, rigorous testing, and global distribution since 2019.
          </motion.p>
          <motion.div {...fadeUp(0.24)} className="mt-10">
            <div className="w-16 h-0.5 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b)' }} />
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24" style={{ background: '#111113' }}>
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp(0)}
            className="max-w-3xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden ds-card"
            style={{ borderColor: 'rgba(217,119,6,0.20)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, #d97706, #f59e0b, #d97706, transparent)' }} />
            <span className="text-[10px] uppercase tracking-[0.25em] font-black mb-6 block" style={{ color: '#52525b' }}>
              Message from the founder
            </span>
            <h2 className="text-xl md:text-2xl font-medium leading-relaxed italic mb-8" style={{ color: '#a1a1aa' }}>
              "Our mission is to provide the highest purity compounds with absolute transparency. Innovation in healthcare starts with precision in the lab."
            </h2>
            <p className="font-black text-xs uppercase tracking-widest ds-text-gradient">
              Allen Bryant <span className="text-[#52525b] font-normal normal-case tracking-normal ml-2">— Retatrutide Research Center</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-[0.4em] font-black mb-3" style={{ color: '#d97706' }}>What we stand for</motion.p>
            <motion.h2 {...fadeUp(0.06)} className="text-4xl font-black tracking-tight text-white" style={{ letterSpacing: '-0.03em' }}>Built on three pillars</motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FlaskConical size={28} />, title: 'Specialized Labs', desc: 'State-of-the-art synthesis and analytical facilities for high-purity compound production.', color: '#d97706' },
              { icon: <Microscope size={28} />, title: 'Research Focused', desc: 'Every batch is subjected to rigorous HPLC analysis ensuring ≥99% purity standards across all products.', color: '#10b981' },
              { icon: <Globe size={28} />, title: 'Global Logistics', desc: 'Discreet, temperature-controlled shipping to research institutions worldwide in 50+ countries.', color: '#d97706' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.10)}
                whileHover={{ y: -6 }}
                className="group ds-card rounded-2xl p-10 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  transition={{ type: 'spring' as const, stiffness: 300 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: `rgba(${item.color === '#d97706' ? '217,119,6' : '16,185,129'},0.12)`, border: `1px solid ${item.color}30`, color: item.color, boxShadow: `0 4px 20px ${item.color}20` }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-sm font-black mb-3 uppercase tracking-tight text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-28 relative overflow-hidden" style={{ background: '#111113' }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 {...fadeUp(0)}
            className="text-2xl md:text-4xl font-medium max-w-3xl mx-auto text-center mb-20 leading-snug"
            style={{ color: '#a1a1aa' }}>
            Advanced logistics are not just about speed, but the{' '}
            <em className="not-italic font-black ds-text-gradient">integrity</em>{' '}
            of every compound we deliver.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto pt-16"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[
              { val: '3M+',   label: 'Compounds Delivered',   color: '#d97706' },
              { val: '15',    label: 'Verified Global Hubs',  color: '#10b981' },
              { val: '4.7k+', label: 'Professional Partners', color: '#d97706' },
            ].map((s, i) => (
              <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
                <p className="text-5xl md:text-6xl font-black tracking-tight mb-3 ds-mono" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] uppercase font-black tracking-[0.25em]" style={{ color: '#52525b' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-6 overflow-hidden" style={{ background: 'rgba(217,119,6,0.05)', borderTop: '1px solid rgba(217,119,6,0.10)', borderBottom: '1px solid rgba(217,119,6,0.10)' }}>
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-3xl md:text-4xl font-black uppercase tracking-tighter mx-12"
              style={{ color: 'rgba(217,119,6,0.18)' }}>
              Research Grade Compounds — 100% Lab Verified — Global Delivery ★
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <motion.p {...fadeUp(0)} className="text-[10px] font-black uppercase tracking-[0.35em] mb-4" style={{ color: '#d97706' }}>
              Precision Research
            </motion.p>
            <motion.h3 {...fadeUp(0.06)}
              className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight text-white" style={{ letterSpacing: '-0.03em' }}>
              Precision.<br />
              <span className="ds-text-gradient">Exceptional</span><br />
              Results.
            </motion.h3>
            <motion.p {...fadeUp(0.12)} className="mb-10 text-base leading-relaxed max-w-md" style={{ color: '#71717a' }}>
              Our facilities meet the rigorous standards of modern science. Every batch is tested and verified for the highest consistency.
            </motion.p>
            <motion.div {...fadeUp(0.18)}>
              <Link href="/products"
                className="inline-flex items-center gap-3 ds-btn-primary px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest">
                Explore Products <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              whileHover={{ boxShadow: '0 20px 80px rgba(217,119,6,0.20)' }}
              transition={{ duration: 0.3 }}
              className="aspect-[4/5] rounded-3xl overflow-hidden ds-surface"
            >
              <video autoPlay muted loop playsInline preload="metadata"
                poster="/assets/cells-poster.webp"
                className="w-full h-full object-cover">
                <source src="/assets/cells.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
