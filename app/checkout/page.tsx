'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LegalModal from '@/components/legal/LegalModal'
import PrivacyContent from '@/components/legal/PrivacyContent'
import RefundContent from '@/components/legal/RefundContent'
import { User, CreditCard, Apple, Banknote, Bitcoin, X, Mail, CheckSquare, ArrowRight, Lock, ShieldCheck } from 'lucide-react'

const inputCls = (error?: boolean) =>
  `w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all text-[#1a2e05] placeholder:text-[#9ca3af] ${
    error
      ? 'bg-red-50 border-red-300'
      : 'bg-[#f7fee7] border-[rgba(132,204,22,0.22)] focus:border-[rgba(132,204,22,0.55)]'
  }`
const inputStyle = { border: '1.5px solid' }

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [agreedToPolicies, setAgreedToPolicies] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', companyName: '',
    country: 'United Kingdom (UK)', streetAddress: '',
    apartment: '', townCity: '', county: '',
    postcode: '', phone: '', email: '',
    paymentMethod: 'bank_transfer',
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]')
    setCartItems(saved)
    const savedForm = localStorage.getItem('checkout_form')
    if (savedForm) setFormData(JSON.parse(savedForm))
  }, [])

  const set = (field: string) => (v: string) => setFormData((f) => ({ ...f, [field]: v }))

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
  const discount = 30.90
  const shipping = 30.00
  const total    = Math.max(0, subtotal - discount + shipping)

  const validate = () => {
    const required = ['firstName', 'lastName', 'streetAddress', 'townCity', 'postcode', 'phone', 'email']
    const newErr: Record<string, boolean> = {}
    required.forEach((f) => { if (!formData[f as keyof typeof formData]) newErr[f] = true })
    setErrors(newErr)
    return Object.keys(newErr).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validate()) { alert('Please fill in all required fields.'); return }
    if (!agreedToPolicies) { alert('Please agree to the policies.'); return }
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        localStorage.setItem('checkout_form', JSON.stringify(formData))
        setShowAuthModal(true)
        setIsSubmitting(false)
        return
      }
      const { data: order, error: orderErr } = await supabase.from('orders').insert({
        user_id: user.id,
        first_name: formData.firstName, last_name: formData.lastName,
        company_name: formData.companyName, country: formData.country,
        street_address: formData.streetAddress, apartment_suite: formData.apartment,
        town_city: formData.townCity, county: formData.county,
        postcode: formData.postcode, phone: formData.phone,
        email_address: formData.email, payment_method: formData.paymentMethod,
        subtotal, discount_amount: discount, shipping_fee: shipping,
        total_amount: total, status: 'on_hold',
      }).select().single()
      if (orderErr) throw orderErr
      await supabase.from('order_items').insert(
        cartItems.map((item) => ({
          order_id: order.id, product_name: item.name,
          quantity: parseInt(item.quantity), unit_price: parseFloat(item.price),
        }))
      )
      fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email, firstName: formData.firstName, lastName: formData.lastName,
          orderRef: order.reference_code || order.id.slice(0, 8).toUpperCase(),
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          items: cartItems, subtotal, discount, shipping, total,
          paymentMethod: formData.paymentMethod, address: formData,
        }),
      }).catch(console.error)
      localStorage.removeItem('cart')
      localStorage.removeItem('checkout_form')
      router.push(`/checkout2?orderId=${order.id}`)
    } catch (err: any) {
      alert('Error processing order: ' + err.message)
      setIsSubmitting(false)
    }
  }

  const handleRequestMagicLink = async () => {
    setAuthLoading(true)
    setAuthMessage('')
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { emailRedirectTo: `${window.location.origin}/checkout` },
      })
      if (error) throw error
      setAuthMessage('A secure login link has been sent. Click it to continue.')
    } catch (err: any) {
      setAuthMessage('Error: ' + err.message)
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#14532d]">
      <Header />

      {/* Hero */}
      <section className="pt-16 pb-10 text-center" style={{ background: 'linear-gradient(135deg, #f7fee7 0%, #ffffff 60%)' }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="text-[11px] uppercase tracking-[0.35em] font-black mb-3" style={{ color: '#65a30d' }}>
          Secure Checkout
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="text-4xl font-black tracking-tight" style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
          Your Order
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-2 mt-4 text-[#4b7c59]">
          <Lock size={13} />
          <span className="text-[11px] font-bold uppercase tracking-widest">SSL Encrypted · Secure Payment</span>
        </motion.div>
      </section>

      <main className="container mx-auto px-6 py-12 pb-24 grid lg:grid-cols-3 gap-10">

        {/* ── LEFT: Billing ── */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-2xl" style={{ border: '1.5px solid rgba(132,204,22,0.15)', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            <h2 className="text-base font-black uppercase tracking-tight mb-8 pb-4" style={{ color: '#1a2e05', borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
              Billing Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First name *" error={errors.firstName}  value={formData.firstName}    onChange={set('firstName')} />
              <Field label="Last name *"  error={errors.lastName}   value={formData.lastName}     onChange={set('lastName')} />
              <Field label="Company (optional)"                      value={formData.companyName}  onChange={set('companyName')} />
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#4b7c59]">Country *</label>
                <select
                  className={inputCls()}
                  style={{ ...inputStyle, borderColor: 'rgba(132,204,22,0.22)' }}
                  value={formData.country}
                  onChange={(e) => setFormData((f) => ({ ...f, country: e.target.value }))}
                >
                  <option>United Kingdom (UK)</option>
                  <option>United States (US)</option>
                  <option>France</option>
                  <option>Germany</option>
                  <option>Australia</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Field label="Street address *" placeholder="House number and street name" error={errors.streetAddress} value={formData.streetAddress} onChange={set('streetAddress')} />
              </div>
              <div className="md:col-span-2">
                <Field label="Apartment / Suite (optional)" value={formData.apartment} onChange={set('apartment')} />
              </div>
              <Field label="Town / City *"   error={errors.townCity}  value={formData.townCity}  onChange={set('townCity')} />
              <Field label="County / Region"                           value={formData.county}    onChange={set('county')} />
              <Field label="Postcode *"       error={errors.postcode}  value={formData.postcode}  onChange={set('postcode')} />
              <div />
              <Field label="Phone *" error={errors.phone} value={formData.phone} onChange={set('phone')} />
              <Field label="Email address *" error={errors.email} value={formData.email} onChange={set('email')} />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Summary ── */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl p-8 sticky top-28 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #f0fdf4 0%, #f7fee7 100%)',
              border: '1.5px solid rgba(132,204,22,0.22)',
              boxShadow: '0 8px 40px rgba(132,204,22,0.12)',
            }}>
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />

            <h3 className="text-base font-black uppercase tracking-tight mb-6" style={{ color: '#1a2e05' }}>
              Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-4 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: '#fff', border: '1px solid rgba(132,204,22,0.15)' }}>
                    <img src={item.image_url || item.main_image_url} className="max-h-10 max-w-10 object-contain" alt={item.name} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-bold text-[#1a2e05] leading-tight truncate">{item.name}</p>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">× {item.quantity}</p>
                  </div>
                  <span className="font-black text-sm shrink-0" style={{ color: '#ca8a04' }}>
                    £{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
              {[
                { label: 'Subtotal', value: `£${subtotal.toFixed(2)}`, color: '#1a2e05' },
                { label: 'Discount', value: `-£${discount.toFixed(2)}`, color: '#65a30d' },
                { label: 'Shipping', value: `£${shipping.toFixed(2)}`, color: '#1a2e05' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#6b7280] font-medium">{label}</span>
                  <span className="font-black" style={{ color }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between items-end pt-2">
                <span className="font-black text-sm uppercase tracking-wide text-[#6b7280]">Total</span>
                <span className="text-3xl font-black" style={{ color: '#1a2e05' }}>£{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment methods */}
            <p className="text-[11px] font-black uppercase tracking-widest text-[#6b7280] mb-3">Payment Method</p>
            <div className="space-y-2 mb-6">
              {[
                { id: 'bank_transfer', label: 'Bank Transfer',  icon: <Banknote size={16} className="text-[#65a30d]" /> },
                { id: 'zelle',         label: 'Zelle',          icon: <CreditCard size={16} className="text-purple-500" /> },
                { id: 'apple_pay',     label: 'Apple Pay',      icon: <Apple size={16} className="text-[#1a2e05]" /> },
                { id: 'crypto',        label: 'Cryptocurrency', icon: <Bitcoin size={16} className="text-[#ca8a04]" /> },
              ].map(({ id, label, icon }) => (
                <label
                  key={id}
                  onClick={() => setFormData((f) => ({ ...f, paymentMethod: id }))}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: formData.paymentMethod === id ? 'rgba(132,204,22,0.10)' : 'rgba(255,255,255,0.60)',
                    border: formData.paymentMethod === id ? '1.5px solid rgba(132,204,22,0.40)' : '1.5px solid rgba(132,204,22,0.12)',
                  }}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === id ? 'border-[#84cc16]' : 'border-[#d1d5db]'}`}>
                    {formData.paymentMethod === id && <div className="w-2 h-2 bg-[#84cc16] rounded-full" />}
                  </div>
                  {icon}
                  <span className="text-xs font-black uppercase tracking-wider text-[#1a2e05]">{label}</span>
                </label>
              ))}
            </div>

            {/* Legal */}
            <div className="pb-6 mb-6" style={{ borderBottom: '1px solid rgba(132,204,22,0.12)' }}>
              <label className="flex items-start gap-3 cursor-pointer" onClick={() => setAgreedToPolicies(!agreedToPolicies)}>
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreedToPolicies ? 'bg-[#84cc16] border-[#84cc16]' : 'border-[#d1d5db]'}`}>
                  {agreedToPolicies && <CheckSquare size={12} className="text-white" />}
                </div>
                <p className="text-xs text-[#4b7c59] leading-relaxed">
                  I agree to the{' '}
                  <button type="button" onClick={(e) => { e.stopPropagation(); setShowPrivacyModal(true) }}
                    className="font-bold underline decoration-2 underline-offset-2 text-[#65a30d] hover:text-[#84cc16]">
                    Privacy Policy
                  </button>{' '}and{' '}
                  <button type="button" onClick={(e) => { e.stopPropagation(); setShowRefundModal(true) }}
                    className="font-bold underline decoration-2 underline-offset-2 text-[#65a30d] hover:text-[#84cc16]">
                    Refund Policy
                  </button>
                  . Research compounds are for lab use only.
                </p>
              </label>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !agreedToPolicies}
              className="w-full lg-btn-accent py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing…' : (
                <>
                  Place Order
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-4 text-[#9ca3af]">
              <ShieldCheck size={13} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure & encrypted</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/25 backdrop-blur-sm z-50"
              onClick={() => setShowAuthModal(false)}
            />
            <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ type: 'spring' as const, bounce: 0.3, duration: 0.5 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
                style={{ border: '1.5px solid rgba(132,204,22,0.22)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                  style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)' }} />
                <button onClick={() => setShowAuthModal(false)}
                  className="absolute top-6 right-6 text-[#9ca3af] hover:text-[#1a2e05] transition-colors">
                  <X size={20} />
                </button>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: '#f0fdf4', border: '1.5px solid rgba(132,204,22,0.22)' }}>
                  <Mail size={22} className="text-[#65a30d]" />
                </div>
                <h3 className="text-2xl font-black mb-2 tracking-tight" style={{ color: '#1a2e05' }}>Secure Your Order</h3>
                <p className="text-[#4b7c59] text-sm mb-6">Verify your identity via email to complete your purchase.</p>
                <div className="space-y-4">
                  <input type="email" readOnly value={formData.email}
                    className="w-full p-4 rounded-xl text-sm text-[#6b7280]"
                    style={{ background: '#f7fee7', border: '1.5px solid rgba(132,204,22,0.20)' }} />
                  {authMessage && (
                    <div className="p-4 rounded-xl text-sm" style={{ background: '#f0fdf4', border: '1px solid rgba(132,204,22,0.20)', color: '#14532d' }}>
                      {authMessage}
                    </div>
                  )}
                  <button onClick={handleRequestMagicLink} disabled={authLoading}
                    className="w-full lg-btn-accent py-4 rounded-xl font-black uppercase text-[11px] tracking-widest disabled:opacity-50">
                    {authLoading ? 'Sending…' : 'Send Login Link'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <LegalModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy">
        <PrivacyContent />
      </LegalModal>
      <LegalModal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)} title="Refund & Return Policy">
        <RefundContent />
      </LegalModal>
    </div>
  )
}

function Field({ label, placeholder, error, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black uppercase tracking-widest text-[#4b7c59]">{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls(error)}
        style={{ ...inputStyle, borderColor: error ? '#fca5a5' : 'rgba(132,204,22,0.22)' }}
      />
    </div>
  )
}
