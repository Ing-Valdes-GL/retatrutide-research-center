'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Package, ChevronDown, Hash, CheckCircle2, XCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ease = [0.16, 1, 0.3, 1] as const

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  const fetchOrders = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      else fetchOrders(user.id)
    }
    checkUser()
  }, [fetchOrders, router])

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase()
    if (s === 'confirmed' || s === 'approved')
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ds-badge-emerald">
          <CheckCircle2 size={10} /> Confirmed
        </span>
      )
    if (s === 'rejected' || s === 'cancelled')
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
          style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.20)' }}>
          <XCircle size={10} /> Cancelled
        </span>
      )
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ds-badge">
        <Clock size={10} /> Pending
      </span>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      {/* Amber stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      {/* Page header */}
      <section className="pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="container mx-auto px-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[10px] uppercase tracking-[0.4em] font-black mb-3" style={{ color: '#d97706' }}>
            My Account
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: 0.06 }}
            className="text-4xl md:text-6xl font-black tracking-tight text-white" style={{ letterSpacing: '-0.04em' }}>
            Order History
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-sm mt-3" style={{ color: '#71717a' }}>
            Review and track your research compound orders.
          </motion.p>
        </div>
      </section>

      <main className="container mx-auto px-6 py-8 pb-24 max-w-5xl">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#52525b' }}>Loading orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 ds-surface">
              <ShoppingBag size={32} style={{ color: '#d97706' }} />
            </div>
            <h2 className="text-2xl font-black mb-3 text-white">No orders yet</h2>
            <p className="text-sm mb-8" style={{ color: '#71717a' }}>Your research compound orders will appear here.</p>
            <Link href="/products"
              className="ds-btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest">
              Browse Products <ArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring' as const, bounce: 0.2, duration: 0.5, delay: i * 0.05 }}
                  className="rounded-2xl overflow-hidden ds-card"
                  style={{
                    borderColor: expandedOrderId === order.id ? 'rgba(217,119,6,0.30)' : 'rgba(255,255,255,0.09)',
                    boxShadow: expandedOrderId === order.id ? '0 8px 32px rgba(217,119,6,0.12)' : 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  {/* Summary row */}
                  <div
                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  >
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg ds-surface">
                          <Hash size={15} style={{ color: '#d97706' }} />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-black tracking-widest mb-0.5" style={{ color: '#52525b' }}>Reference</p>
                          <p className="text-sm font-black uppercase tracking-tight text-white">
                            {order.order_reference || order.reference_code || order.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:block w-px h-8" style={{ background: 'rgba(255,255,255,0.07)' }} />

                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest mb-0.5" style={{ color: '#52525b' }}>Ordered On</p>
                        <p className="text-sm font-medium" style={{ color: '#a1a1aa' }}>
                          {new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black tracking-widest mb-0.5" style={{ color: '#52525b' }}>Total</p>
                        <p className="text-lg font-black ds-text-gradient ds-mono">${Number(order.total_amount).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ds-surface ${expandedOrderId === order.id ? 'rotate-180' : ''}`}>
                          <ChevronDown size={16} style={{ color: '#d97706' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded items */}
                  <AnimatePresence>
                    {expandedOrderId === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                          <table className="w-full text-sm mt-4">
                            <thead>
                              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                <th className="text-left pb-3 text-[10px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Item</th>
                                <th className="text-center pb-3 text-[10px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Qty</th>
                                <th className="text-right pb-3 text-[10px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Unit Price</th>
                                <th className="text-right pb-3 text-[10px] uppercase font-black tracking-widest" style={{ color: '#52525b' }}>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.order_items?.map((item: any) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                  <td className="py-4 font-black text-sm text-white">{item.product_name}</td>
                                  <td className="py-4 text-center font-bold text-sm" style={{ color: '#71717a' }}>× {item.quantity}</td>
                                  <td className="py-4 text-right font-medium text-sm" style={{ color: '#71717a' }}>${Number(item.unit_price).toFixed(2)}</td>
                                  <td className="py-4 text-right font-black text-sm ds-text-gradient ds-mono">
                                    ${(Number(item.quantity) * Number(item.unit_price)).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
