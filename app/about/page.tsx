'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, FlaskConical, Globe, ShieldCheck, Microscope, Award, Users } from 'lucide-react'
import Link from 'next/link'

const springIn = (delay = 0) => ({
  initial: { opacity: 0, y: 32, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true as const },
  transition: { type: 'spring' as const, bounce: 0.25, duration: 1.2, delay },
})

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#14532d]">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #f7fee7 0%, #ffffff 50%, #fefce8 100%)' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.12) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.10) 0%, transparent 70%)' }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <motion.p {...springIn(0)} className="text-[11px] uppercase tracking-[0.35em] font-black mb-6" style={{ color: '#65a30d' }}>
            Our Story
          </motion.p>
          <motion.h1 {...springIn(0.08)}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[0.9]"
            style={{ color: '#1a2e05', letterSpacing: '-0.04em' }}>
            Science.<br />
            <span style={{ color: '#84cc16' }}>Precision.</span><br />
            <span style={{ color: '#ca8a04' }}>Trust.</span>
          </motion.h1>
          <motion.p {...springIn(0.16)} className="text-[#4b7c59] text-lg max-w-lg mx-auto leading-relaxed">
            Pioneering peptide science through precision research, rigorous testing, and global distribution since 2019.
          </motion.p>
          <motion.div {...springIn(0.24)} className="mt-10">
            <div className="w-16 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
          </motion.div>
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            {...springIn(0)}
            className="max-w-3xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)',
              border: '1.5px solid rgba(132,204,22,0.18)',
              boxShadow: '0 8px 48px rgba(132,204,22,0.10)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9ca3af] font-black mb-6 block">
              Message from the founder
            </span>
            <h2 className="text-xl md:text-2xl font-medium leading-relaxed italic mb-8" style={{ color: '#14532d' }}>
              "Our mission is to provide the highest purity compounds with absolute transparency. Innovation in healthcare starts with precision in the lab."
            </h2>
            <p className="font-black text-xs uppercase tracking-widest" style={{ color: '#65a30d' }}>
              Allen Bryant <span className="text-[#9ca3af] font-normal ml-2 normal-case tracking-normal">— Retatrutide Research Center</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section className="py-24" style={{ background: '#f7fee7', borderTop: '1px solid rgba(132,204,22,0.10)', borderBottom: '1px solid rgba(132,204,22,0.10)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.p {...springIn(0)} className="text-[11px] uppercase tracking-[0.35em] font-black mb-3" style={{ color: '#65a30d' }}>What we stand for</motion.p>
            <motion.h2 {...springIn(0.06)} className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>Built on three pillars</motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <FlaskConical size={28} />, title: 'Specialized Labs', desc: 'State-of-the-art synthesis and analytical facilities for high-purity compound production.', accent: '#84cc16', bg: '#f0fdf4' },
              { icon: <Microscope size={28} />, title: 'Research Focused', desc: 'Every batch is subjected to rigorous HPLC analysis ensuring ≥99% purity standards across all products.', accent: '#ca8a04', bg: '#fefce8' },
              { icon: <Globe size={28} />, title: 'Global Logistics', desc: 'Discreet, temperature-controlled shipping to research institutions worldwide in 50+ countries.', accent: '#84cc16', bg: '#f0fdf4' },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...springIn(i * 0.10)}
                whileHover={{ y: -6 }}
                className="group lg-card rounded-2xl p-10 text-center"
                style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 4 }}
                  transition={{ type: 'spring' as const, stiffness: 300 }}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: item.bg, border: `1.5px solid ${item.accent}35`, color: item.accent, boxShadow: `0 4px 20px ${item.accent}20` }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-base font-black mb-3 uppercase tracking-tight" style={{ color: '#1a2e05' }}>{item.title}</h3>
                <p className="text-[#4b7c59] text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-28 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.h2 {...springIn(0)}
            className="text-2xl md:text-4xl font-medium max-w-3xl mx-auto text-center mb-20 leading-snug"
            style={{ color: '#1a2e05' }}>
            Advanced logistics are not just about speed, but the <em style={{ color: '#84cc16', fontStyle: 'normal', fontWeight: 900 }}>integrity</em> of every compound we deliver.
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto pt-16"
            style={{ borderTop: '1px solid rgba(132,204,22,0.15)' }}>
            {[
              { val: '3M+',   label: 'Compounds Delivered',   color: '#65a30d' },
              { val: '15',    label: 'Verified Global Hubs',  color: '#ca8a04' },
              { val: '4.7k+', label: 'Professional Partners', color: '#65a30d' },
            ].map((s, i) => (
              <motion.div key={s.label} {...springIn(i * 0.08)} className="text-center">
                <p className="text-5xl md:text-6xl font-black tracking-tight mb-3" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[#6b7280] text-[10px] uppercase font-black tracking-[0.25em]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RUNNING TEXT MARQUEE ── */}
      <div className="py-6 overflow-hidden" style={{ background: 'linear-gradient(90deg, #f0fdf4, #f7fee7)' }}>
        <div className="flex whitespace-nowrap animate-marquee-slow">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-3xl md:text-4xl font-black uppercase tracking-tighter mx-12"
              style={{ color: 'rgba(132,204,22,0.25)' }}>
              Research Grade Compounds — 100% Lab Verified — Global Delivery ★
            </span>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="py-32" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 50%, #fefce8 100%)' }}>
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <motion.p {...springIn(0)} className="text-[11px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: '#65a30d' }}>
              Precision Research
            </motion.p>
            <motion.h3 {...springIn(0.06)}
              className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight"
              style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
              Precision.<br />
              <span style={{ color: '#84cc16' }}>Exceptional</span><br />
              Results.
            </motion.h3>
            <motion.p {...springIn(0.12)} className="text-[#4b7c59] mb-10 text-base leading-relaxed max-w-md">
              Our facilities meet the rigorous standards of modern science. Every batch is tested and verified for the highest consistency.
            </motion.p>
            <motion.div {...springIn(0.18)}>
              <Link href="/products"
                className="inline-flex items-center gap-3 lg-btn-accent px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest">
                Explore Products <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              whileHover={{ boxShadow: '0 20px 60px rgba(132,204,22,0.20)' }}
              transition={{ duration: 0.3 }}
              className="aspect-[4/5] rounded-3xl overflow-hidden"
              style={{ border: '1.5px solid rgba(132,204,22,0.18)', boxShadow: '0 8px 40px rgba(132,204,22,0.10)' }}
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

      <style jsx global>{`
        @keyframes marquee-slow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-slow { animation: marquee-slow 18s linear infinite; }
      `}</style>
    </div>
  )
}
