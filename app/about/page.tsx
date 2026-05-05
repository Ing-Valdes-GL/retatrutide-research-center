'use client'

import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ArrowRight, ShoppingBag, Percent, Truck, FlaskConical, Globe, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-20 border-b border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#0ea5e9]/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#0ea5e9] mb-4">Discovery</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">About Our Labs</h1>
          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            Pioneering peptide science through precision research, rigorous testing, and global distribution.
          </p>
          <div className="w-24 h-[2px] bg-[#0ea5e9] mx-auto mt-8" />
        </div>
      </section>

      {/* OWNER MESSAGE + SERVICES */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto lg-card rounded-3xl p-10 md:p-16 text-center mb-24">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-6 block">
              Message from the store owner
            </span>
            <h2 className="text-xl md:text-2xl font-medium leading-relaxed italic text-white/80 mb-8">
              "Our mission is to provide the highest purity compounds with absolute transparency. Innovation in healthcare starts with precision in the lab."
            </h2>
            <p className="text-[#0ea5e9] font-bold text-xs uppercase tracking-widest">
              Allen Bryant <span className="text-white/30 font-normal ml-2">— Retatrutide Research Center</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Specialized Labs', icon: <FlaskConical size={28} />, desc: 'State-of-the-art synthesis and analytical facilities for high-purity compound production.' },
              { title: 'Research Focused', icon: <Percent size={28} />, desc: 'Every batch is subjected to rigorous HPLC analysis ensuring ≥99% purity standards.' },
              { title: 'Global Logistics', icon: <Globe size={28} />, desc: 'Discreet, temperature-controlled shipping to research institutions worldwide.' },
            ].map((item, i) => (
              <div key={i} className="group lg-card rounded-2xl p-10 text-center hover:border-[#0ea5e9]/20 transition-all duration-300">
                <div className="w-16 h-16 lg-badge text-[#0ea5e9] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-3 uppercase tracking-tight text-white">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-[#050A30] py-24 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-white text-xl md:text-3xl font-medium max-w-3xl mx-auto mb-20 leading-snug">
            Advanced Logistics Are Not Just About Speed, But About The Integrity Of Every Compound We Deliver.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto border-t border-white/10 pt-16">
            {[
              { val: '3M+', label: 'Compounds Delivered' },
              { val: '15', label: 'Verified Hubs' },
              { val: '4.7k+', label: 'Professional Partners' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-[#0ea5e9] text-4xl font-bold mb-2">{s.val}</p>
                <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#0a0a0f] py-8 overflow-hidden border-b border-white/5">
        <div className="flex whitespace-nowrap animate-marquee-fast">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-white/20 text-2xl md:text-3xl font-bold uppercase tracking-tighter mx-12">
              Research Grade Compounds — 100% Lab Verified — Global Delivery ★
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="py-28 bg-[#050505]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/2">
            <p className="text-[#0ea5e9] text-xs font-black uppercase tracking-widest mb-4">Precision Research</p>
            <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight tracking-tight text-white">
              Precision Research,<br />Exceptional Results.
            </h3>
            <p className="text-white/40 mb-10 text-base leading-relaxed">
              Our facilities meet the rigorous standards of modern science. Every batch is tested and verified for the highest consistency.
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-4 lg-btn-accent px-10 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest text-white">
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-[4/5] lg-card rounded-3xl overflow-hidden">
              <video autoPlay muted loop playsInline preload="metadata"
                poster="/assets/cells-poster.webp"
                className="w-full h-full object-cover opacity-80">
                <source src="/assets/cells.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee-fast { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee-fast { animation: marquee-fast 14s linear infinite; }
      `}</style>
    </div>
  )
}
