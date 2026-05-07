'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Loader2, Lock, Mail, CheckCircle2, AlertCircle, Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/orders` }
      })
      if (error) throw error
      setSent(true)
      setMessage({ type: 'success', text: 'Magic link sent! Check your inbox.' })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-[#14532d] flex flex-col relative overflow-hidden">

      {/* Decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(132,204,22,0.12) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.10) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #84cc16 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Back link */}
      <div className="relative z-10 p-8 md:p-12">
        <Link href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#9ca3af] hover:text-[#65a30d] transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ type: 'spring' as const, bounce: 0.25, duration: 1.0 }}
          className="w-full max-w-sm"
        >
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: 'spring' as const, stiffness: 300 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%)',
                border: '1.5px solid rgba(132,204,22,0.25)',
                boxShadow: '0 8px 32px rgba(132,204,22,0.15)',
              }}
            >
              <Shield size={28} style={{ color: '#65a30d' }} />
            </motion.div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] font-black mb-3" style={{ color: '#65a30d' }}>
              Secure Access
            </p>
            <h1 className="text-4xl font-black tracking-tight leading-none mb-3"
              style={{ color: '#1a2e05', letterSpacing: '-0.03em' }}>
              Sign In
            </h1>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              Enter your email to receive a magic link — no password needed.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8"
            style={{
              background: 'linear-gradient(145deg, #f0fdf4 0%, #f7fee7 100%)',
              border: '1.5px solid rgba(132,204,22,0.18)',
              boxShadow: '0 8px 40px rgba(132,204,22,0.10)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #84cc16, #facc15)', position: 'relative', borderRadius: '8px 8px 0 0', marginBottom: '0' }} />

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#84cc16' }} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium outline-none text-[#1a2e05] placeholder:text-[#9ca3af] transition-all"
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid rgba(132,204,22,0.25)',
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#84cc16'; e.target.style.boxShadow = '0 0 0 3px rgba(132,204,22,0.10)' }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(132,204,22,0.25)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>

                  <AnimatePresence>
                    {message.text && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-center gap-3 p-4 rounded-xl text-xs font-bold overflow-hidden ${
                          message.type === 'success'
                            ? 'text-[#65a30d]'
                            : 'text-red-600'
                        }`}
                        style={{
                          background: message.type === 'success' ? 'rgba(132,204,22,0.08)' : 'rgba(239,68,68,0.06)',
                          border: `1px solid ${message.type === 'success' ? 'rgba(132,204,22,0.20)' : 'rgba(239,68,68,0.15)'}`,
                        }}
                      >
                        {message.type === 'success'
                          ? <CheckCircle2 size={15} />
                          : <AlertCircle size={15} />}
                        {message.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
                      color: '#ffffff',
                      boxShadow: '0 4px 20px rgba(132,204,22,0.30)',
                    }}
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      : <><Lock size={15} /> Send Magic Link</>
                    }
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring' as const, bounce: 0.3, duration: 0.6 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' as const, bounce: 0.5, duration: 0.7, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(132,204,22,0.12)', border: '2px solid rgba(132,204,22,0.25)' }}
                  >
                    <CheckCircle2 size={32} style={{ color: '#65a30d' }} />
                  </motion.div>
                  <h3 className="font-black text-lg mb-2" style={{ color: '#1a2e05' }}>Check your inbox</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed mb-6">
                    We sent a magic link to <span className="font-bold text-[#1a2e05]">{email}</span>. Click it to sign in instantly.
                  </p>
                  <button
                    onClick={() => { setSent(false); setMessage({ type: '', text: '' }) }}
                    className="text-[10px] font-black uppercase tracking-widest transition-colors"
                    style={{ color: '#65a30d' }}
                  >
                    Use a different email →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(132,204,22,0.15)' }} />
            <span className="text-[10px] text-[#9ca3af] uppercase tracking-widest font-bold">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(132,204,22,0.15)' }} />
          </div>

          <Link href="/products"
            className="block w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-center transition-all lg-btn"
          >
            Browse Without Account
          </Link>

          {/* Trust note */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Shield size={12} style={{ color: '#9ca3af' }} />
            <p className="text-[10px] text-[#9ca3af] font-medium">
              Retatrutide Research Center · Secure Sign-In
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
