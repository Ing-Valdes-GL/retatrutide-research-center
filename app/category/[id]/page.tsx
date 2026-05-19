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
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Amber stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      {/* Banner */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-4" style={{ color: '#d97706' }}>Catalogue</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 capitalize text-white" style={{ letterSpacing: '-0.04em' }}>
            {categoryName}
          </h1>
          <nav className="text-[10px] uppercase tracking-[0.25em] font-black flex items-center justify-center gap-2" style={{ color: '#52525b' }}>
            <Link href="/products" className="transition-colors hover:text-amber-400">Shop</Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>
        </div>
      </section>

      <main className="container mx-auto px-6 py-12 pb-24">
        {!products || products.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ds-surface">
              <ShoppingCart size={32} style={{ color: '#d97706' }} />
            </div>
            <h2 className="text-2xl font-black mb-3 text-white">Nothing found</h2>
            <p className="text-sm mb-8" style={{ color: '#71717a' }}>No products available in this category right now.</p>
            <Link href="/products"
              className="ds-btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
              Browse All Products <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-black uppercase tracking-widest mb-10" style={{ color: '#52525b' }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="group ds-card rounded-2xl overflow-hidden flex flex-col"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`}
                    className="relative aspect-square overflow-hidden flex items-center justify-center p-8"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <img
                      src={product.main_image_url || '/placeholder.png'}
                      className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      alt={product.name}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white ds-surface">
                        View Details
                      </span>
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1.5 mb-3 w-fit px-2.5 py-1 rounded-lg ds-badge">
                      <Shield size={10} />
                      <span className="text-[9px] font-black uppercase tracking-wider">Certified RRC</span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-black text-white text-sm mb-2 leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="mt-auto pt-4">
                      <p className="font-black text-2xl mb-4 ds-text-gradient ds-mono">${product.price}</p>
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full ds-btn-primary py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={13} /> View Product
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
