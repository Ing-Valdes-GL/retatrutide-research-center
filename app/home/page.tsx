'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ShoppingCart, ArrowRight, Smartphone, Zap, ShieldCheck, ChevronDown } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

interface Product {
  id: string
  name: string
  price: number
  main_image_url: string
  category_name?: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addedProduct, setAddedProduct] = useState<Product | null>(null)

  const [sellersRef, sellersInView] = useInView<HTMLElement>()
  const [evalRef, evalInView] = useInView<HTMLElement>()
  const [promoRef, promoInView] = useInView<HTMLElement>()
  const [infoRef, infoInView] = useInView<HTMLElement>()
  const [ctaRef, ctaInView] = useInView<HTMLElement>()

  useEffect(() => {
    async function loadProducts() {
      const { data } = await supabase
        .from('products').select('*').eq('is_active', true).limit(3)
      setProducts((data as Product[]) || [])
      setLoading(false)
    }
    loadProducts()
  }, [])

  const addToCart = (product: Product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]') as Array<Product & { quantity: number }>
    const existingItem = currentCart.find((item) => item.id === product.id)
    if (existingItem) { existingItem.quantity += 1 }
    else { currentCart.push({ ...product, quantity: 1 }) }
    localStorage.setItem('cart', JSON.stringify(currentCart))
    setAddedProduct(product)
    window.dispatchEvent(new Event('storage'))
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0B]">
      <Header />

      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#050505]">

        {/* Video layer */}
        <div className="absolute inset-0 z-0">
          <style>{`
            @media (prefers-reduced-motion: reduce) {
              .hero-video { display: none; }
              .hero-poster { display: block !important; }
            }
          `}</style>
          <video className="hero-video absolute inset-0 w-full h-full object-cover scale-105"
            autoPlay muted loop playsInline preload="metadata" poster="/assets/hero-poster.webp">
            <source src="/assets/hero-bg.mp4" type="video/mp4" />
          </video>
          <Image src="/assets/hero-poster.webp" alt="" fill
            className="hero-poster object-cover hidden" priority />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 z-[1]"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)' }} />

        {/* Tech grid */}
        <div className="absolute inset-0 z-[2] opacity-[0.06]"
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #d7cec8 1px, transparent 1px)', backgroundSize: '6px 6px' }} />

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 flex items-center justify-between">

          {/* LEFT ARCH */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block relative w-[280px] h-[300px] rounded-t-full overflow-hidden bg-[#1e3a8a] flex-shrink-0">
            <img src="/hero-right-arch.png" className="w-full h-full object-contain p-1 scale-110 z-10 relative" alt="" />
          </motion.div>

          {/* CENTER */}
          <div className="flex flex-col items-center text-center flex-grow px-10">

            {/* Glass badge */}
            <div className="flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full lg-badge opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.1s forwards' }}>
              <span className="w-2 h-2 rounded-full bg-[#0ea5e9] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ea5e9]">
                Research Center
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.85] tracking-[-0.06em] uppercase mb-8 opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.25s forwards' }}>
              RETATRUTIDE <br /> RESEARCH CENTER
            </h1>

            <p className="text-xl md:text-3xl text-gray-400 font-medium tracking-tight mb-12 opacity-0"
              style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.4s forwards' }}>
              Advancing Peptide Science with{' '}
              <span className="text-[#0ea5e9] font-bold">RRC</span> Innovation!
            </p>

            {/* Liquid glass CTA button */}
            <div className="opacity-0" style={{ animation: 'rrc-fadeInUp 0.65s ease-out 0.55s forwards' }}>
              <Link href="/products"
                className="group lg-btn-accent inline-flex items-center gap-3 px-12 py-5 rounded-xl font-black uppercase text-sm tracking-[0.18em] text-white">
                <span className="flex items-center gap-3">
                  Browse All Products
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-200" />
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT ARCH */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block relative w-[280px] h-[300px] rounded-t-full overflow-hidden bg-[#00A699] flex-shrink-0">
            <img src="/hero-left-arch.png" className="w-full h-full object-contain p-1 scale-110 z-10 relative" alt="" />
          </motion.div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-50 animate-bounce">
          <ChevronDown size={28} className="text-white" />
        </div>

        {/* Marquee */}
        <div className="absolute bottom-0 w-full bg-[#1e3a8a] py-4 z-20 overflow-hidden border-t border-white/10">
          <div className="flex whitespace-nowrap animate-marquee">
            {[1, 2, 3].map((i) => (
              <span key={i} className="text-white font-black text-[12px] uppercase tracking-[0.3em] mx-10">
                ★ Fast Shipping on orders above £100 ★ 100% Lab Tested ★ Pure Compounds ★
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section ref={sellersRef as React.RefObject<HTMLElement>}
        className={`py-24 bg-white transition-all duration-700 ${sellersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Best Selling Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Feature card */}
            <div className={`bg-[#1e3a8a] rounded-xl p-10 flex flex-col justify-end min-h-[450px] relative overflow-hidden group transition-all duration-700 hover:shadow-[0_0_48px_rgba(14,165,233,0.18)] ${sellersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '0ms' }}>
              <div className="absolute top-10 left-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <img src="/leaf-bg.png" className="w-32" alt="" />
              </div>
              <div className="relative z-10">
                <img src="/leaf-white.png" className="w-8 mb-6" alt="" />
                <h3 className="text-3xl font-black text-white leading-tight">Retatrutide<br />Research<br />Center</h3>
              </div>
            </div>

            {products.map((product, i) => (
              <div key={product.id}
                className={`group border border-gray-100 rounded-xl p-6 flex flex-col hover:shadow-xl hover:border-[#0ea5e9]/20 transition-all duration-700 ${sellersInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${(i + 1) * 80}ms` }}>
                <div className="aspect-square mb-6 overflow-hidden bg-[#F7F7F7] rounded-lg">
                  <img src={product.main_image_url} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" alt={product.name} />
                </div>
                <p className="text-[#0ea5e9] text-[10px] font-bold uppercase mb-1">{product.category_name || 'Uncategorized'}</p>
                <h4 className="font-bold text-sm mb-4 h-10">{product.name}</h4>
                <p className="text-[#A13BB4] font-black text-lg mb-6">£{product.price}</p>
                <button onClick={() => addToCart(product)}
                  className="w-full border border-gray-200 py-3 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors">
                  <ShoppingCart size={14} /> Add To Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RETATRUTIDE EVALUATION ── */}
      <section ref={evalRef as React.RefObject<HTMLElement>}
        className={`py-24 bg-[#F9F9F9] overflow-hidden transition-all duration-700 ${evalInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="w-12 h-12 bg-[#8BC34A] rounded-lg flex items-center justify-center mb-8 shadow-lg shadow-green-200">
                <img src="/leaf-white.png" className="w-6 h-6" alt="" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">
                Retatrutide – Pre-Filled Pen<br />Evaluation
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6 max-w-lg">
                Part of <span className="text-[#0ea5e9] font-bold">Retatrutide Research Center&apos;s</span> ongoing research program into advanced GLP-1 multi-agonist compounds.
              </p>
              <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-10">
                Not for human or veterinary consumption.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg font-black uppercase text-[10px] tracking-widest text-white bg-[#0ea5e9] hover:bg-black transition-all shadow-xl shadow-sky-200">
                About Store <ArrowRight size={14} />
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-2xl overflow-hidden transition-all duration-400 hover:shadow-[0_0_48px_rgba(14,165,233,0.22)]"
                style={{ aspectRatio: '16/9' }}>
                <video autoPlay muted loop playsInline preload="metadata"
                  poster="/assets/molecule-poster.webp"
                  className="w-full h-full object-cover rounded-2xl">
                  <source src="/assets/molecule.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#0ea5e9]/5 -z-0 rounded-[40%_60%_70%_30%/40%_50%_60%_70%] animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROMO BANNER ── */}
      <section ref={promoRef as React.RefObject<HTMLElement>}
        className={`py-10 transition-all duration-700 ${promoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="container mx-auto px-6">
          <div className="bg-[#050A30] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center relative min-h-[380px]">
            <div className="flex-1 p-12 lg:p-20 z-10">
              <h3 className="text-white text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter">
                No Prep. No Hassle.<br />Just Precision Dosing.
              </h3>
              <p className="text-[#0ea5e9] text-2xl font-black mb-10">Upto 35% off today!</p>
              {/* Liquid glass outline button */}
              <Link href="/products"
                className="inline-flex items-center gap-3 lg-btn px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest text-white">
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex-1 bg-[#1e3a8a] w-full h-full min-h-[380px] flex items-center justify-center relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-[#050A30] hidden md:block" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 0)' }} />
              <div className="relative z-10 flex flex-col items-center">
                <h4 className="text-white text-7xl font-black opacity-40 absolute -left-20 top-1/2 -translate-y-1/2 rotate-[-90deg]">RRC</h4>
                <img src="/phone-app.png" className="w-48 lg:w-64 drop-shadow-2xl translate-y-8" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO BAR ── */}
      <section ref={infoRef as React.RefObject<HTMLElement>}
        className={`bg-[#E9DCC5] py-20 mt-10 transition-all duration-700 ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <Zap className="text-black" size={28} />, title: 'Fastest Delivery', desc: 'Donec eget vestibulum quam' },
              { icon: <ShieldCheck className="text-black" size={28} />, title: 'Quality Products', desc: '100% Lab Tested & Verified' },
              { icon: <Smartphone className="text-black" size={28} />, title: 'Secure Payments', desc: 'Encrypted Transaction Data' },
            ].map((item, i) => (
              <div key={i}
                className={`flex items-center gap-6 transition-all duration-700 ${infoInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-16 h-16 border-2 border-black/10 rounded-2xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h5 className="font-black text-sm uppercase tracking-wider mb-1">{item.title}</h5>
                  <p className="text-[11px] font-bold text-black/50 uppercase">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPUP ── */}
      <AnimatePresence>
        {addedProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[300] backdrop-blur-sm" onClick={() => setAddedProduct(null)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-[310] rounded-xl p-8 shadow-2xl text-center">
              <div className="bg-[#FFF5EB] p-4 rounded-lg mb-6">
                <p className="text-gray-600 text-xs font-bold italic">Product added to cart.</p>
              </div>
              <img src={addedProduct.main_image_url} className="w-20 h-20 mx-auto object-contain mb-4" alt={addedProduct.name} />
              <h6 className="font-bold text-sm mb-6">{addedProduct.name}</h6>
              <div className="flex gap-4">
                <button onClick={() => setAddedProduct(null)} className="flex-1 bg-[#0ea5e9] text-white py-3 rounded-md font-black uppercase text-[10px]">Continue</button>
                <Link href="/cart" className="flex-1 bg-black text-white py-3 rounded-md font-black uppercase text-[10px] flex items-center justify-center gap-2">
                  Cart <ShoppingCart size={14} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FINAL CTA ── */}
      <section ref={ctaRef as React.RefObject<HTMLElement>}
        className={`relative bg-[#050505] py-32 overflow-hidden border-t border-white/5 transition-all duration-700 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0ea5e9]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-[#0ea5e9] font-bold text-lg md:text-xl mb-8 tracking-tight">
            A Research Haven for Scientific Excellence
          </motion.p>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="flex items-center gap-4 mb-10">
            <h2 className="text-white text-5xl md:text-7xl font-black uppercase tracking-[-0.04em] flex items-center gap-3">
              RETATRUTIDE
              <img src="/leaf-white.png" className="w-12 h-12 md:w-16 md:h-16 object-contain" alt="" />
              RC
            </h2>
          </motion.div>

          <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-white text-3xl md:text-5xl font-semibold mb-12 tracking-tight leading-tight max-w-3xl">
            Engineered For Research Precision.
          </motion.h3>

          {/* Liquid glass CTA button */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <Link href="/products"
              className="group lg-btn inline-flex items-center gap-3 px-10 py-4 rounded-xl text-white font-bold uppercase text-[12px] tracking-[0.15em]">
              Shop RRC Products
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }

        @keyframes rrc-fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="rrc-fadeInUp"] { animation: none !important; opacity: 1 !important; }
          .animate-bounce, .animate-pulse { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
