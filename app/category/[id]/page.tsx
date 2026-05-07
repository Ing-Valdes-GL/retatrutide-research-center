import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Shield, ShoppingCart, ArrowRight } from 'lucide-react'

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', id)
    .gt('stock', 0)

  const categoryName = category?.name || id?.replace(/-/g, ' ')

  return (
    <div className="min-h-screen bg-white text-[#14532d]">
      <Header />

      {/* Banner */}
      <section className="pt-20 pb-14 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #f7fee7 0%, #ffffff 60%, #fefce8 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-[11px] uppercase tracking-[0.35em] font-black mb-4" style={{ color: '#65a30d' }}>Catalogue</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 capitalize"
            style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
            {categoryName}
          </h1>
          <nav className="text-[10px] uppercase tracking-[0.25em] font-black flex items-center justify-center gap-2" style={{ color: '#9ca3af' }}>
            <Link href="/products" className="hover:text-[#65a30d] transition-colors">Shop</Link>
            <span>/</span>
            <span style={{ color: '#1a2e05' }}>{categoryName}</span>
          </nav>
        </div>
      </section>

      <main className="container mx-auto px-6 py-16 pb-24">
        {!products || products.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.20)' }}>
              <ShoppingCart size={32} className="text-[#84cc16]" />
            </div>
            <h2 className="text-2xl font-black mb-3" style={{ color: '#1a2e05' }}>Nothing found</h2>
            <p className="text-[#6b7280] text-sm mb-8">No products available in this category right now.</p>
            <Link href="/products"
              className="lg-btn-accent inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
              Browse All Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[#9ca3af] text-[11px] font-black uppercase tracking-widest mb-10">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="group lg-card rounded-2xl overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`}
                    className="relative aspect-square overflow-hidden flex items-center justify-center p-8"
                    style={{ background: '#f7fee7' }}>
                    <img
                      src={product.main_image_url || '/placeholder.png'}
                      className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      alt={product.name}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-[#1a2e05]"
                        style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(132,204,22,0.25)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                        View Details
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-1.5 mb-3 w-fit px-2.5 py-1 rounded-lg lg-badge">
                      <Shield size={11} className="text-[#65a30d]" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#65a30d]">Certified RRC</span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-black text-[#1a2e05] text-base mb-2 leading-tight group-hover:text-[#65a30d] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4">
                      <p className="font-black text-2xl mb-4" style={{ color: '#ca8a04' }}>£{product.price}</p>
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full lg-btn-accent py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} /> View Product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
