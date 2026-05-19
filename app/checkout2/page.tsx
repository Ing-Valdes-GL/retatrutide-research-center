'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle2, Package, FlaskConical } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

function CheckoutDetails() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId) return
      const { data: orderData } = await supabase.from('orders').select('*').eq('id', orderId).single()
      const { data: itemsData } = await supabase.from('order_items').select('*').eq('order_id', orderId)
      setOrder(orderData)
      setItems(itemsData || [])
      setLoading(false)
    }
    fetchOrderDetails()
  }, [orderId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090b' }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!order) return (
    <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest" style={{ background: '#09090b', color: '#52525b' }}>
      Order not found.
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Amber stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      <main className="container mx-auto px-6 py-16 pb-24 max-w-4xl">

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' as const, bounce: 0.5, duration: 0.8, delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.30)' }}
          >
            <CheckCircle2 size={36} style={{ color: '#34d399' }} />
          </motion.div>
          <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-3" style={{ color: '#d97706' }}>Order confirmed</p>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white" style={{ letterSpacing: '-0.03em' }}>
            Thank you for your order.
          </h1>
          <p className="text-base leading-relaxed max-w-md mx-auto" style={{ color: '#71717a' }}>
            Your research compounds are being prepared. A confirmation email has been sent to your inbox.
          </p>
        </motion.div>

        {/* Order meta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 rounded-2xl ds-surface"
        >
          {[
            { label: 'Order number', value: order.reference_code || order.id.slice(0, 8).toUpperCase() },
            { label: 'Date', value: new Date(order.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { label: 'Total', value: `$${Number(order.total_amount).toFixed(2)}` },
            { label: 'Payment', value: order.payment_method?.replace('_', ' ') || '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] uppercase font-black tracking-widest mb-1" style={{ color: '#52525b' }}>{label}</p>
              <p className="font-black text-sm capitalize text-white">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.4 }}
          className="rounded-2xl overflow-hidden ds-surface"
        >
          <div className="flex items-center gap-3 px-8 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Package size={18} style={{ color: '#d97706' }} />
            <h2 className="text-base font-black uppercase tracking-tight text-white">Order Details</h2>
          </div>

          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th className="text-left px-8 py-4 text-[10px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Product</th>
                <th className="text-right px-8 py-4 text-[10px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-8 py-5 flex items-center gap-3">
                    <span className="font-bold text-white">{item.product_name}</span>
                    <span className="text-sm font-black" style={{ color: '#d97706' }}>× {item.quantity}</span>
                  </td>
                  <td className="px-8 py-5 text-right font-black ds-text-gradient ds-mono">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <tr>
                <td className="px-8 pt-6 text-right font-bold" style={{ color: '#71717a' }}>Subtotal:</td>
                <td className="px-8 pt-6 text-right font-medium text-white">${Number(order.subtotal).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-8 py-3 text-right font-bold" style={{ color: '#71717a' }}>Discount:</td>
                <td className="px-8 py-3 text-right font-medium" style={{ color: '#34d399' }}>-${Number(order.discount_amount).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-8 py-3 text-right font-bold" style={{ color: '#71717a' }}>Shipping:</td>
                <td className="px-8 py-3 text-right font-medium" style={{ color: '#71717a' }}>
                  ${Number(order.shipping_fee).toFixed(2)} <span className="italic text-xs">via Express Delivery</span>
                </td>
              </tr>
              <tr style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <td className="px-8 pt-5 pb-6 text-right font-black text-lg text-white">Total:</td>
                <td className="px-8 pt-5 pb-6 text-right font-black text-2xl ds-text-gradient ds-mono">${Number(order.total_amount).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
        >
          <Link href="/orders" className="ds-btn-primary px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Package size={14} /> View All Orders
          </Link>
          <Link href="/products" className="ds-btn-secondary px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest">
            Continue Shopping
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default function Checkout2() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090b' }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
      </div>
    }>
      <CheckoutDetails />
    </Suspense>
  )
}
