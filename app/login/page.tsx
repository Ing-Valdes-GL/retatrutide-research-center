'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Loader2, Lock, Mail, CheckCircle2, AlertCircle, Shield, FlaskConical } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

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
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/orders` }
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
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#09090b', color: '#fafafa' }}>

      {/* Amber stripe */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706 30%, #f59e0b 50%, #d97706 70%, transparent)' }} />

      {/* Blobs */}
      <motion.div
        animate={{ scale: [1, 1.18, 1], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ scale: [1, 1.14, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }}
      />
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Back link */}
      <div className="relative z-10 p-8 md:p-12">
        <Link href="/"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
          style={{ color: '#52525b' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
          onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
          <ArrowLeft size={13} /> Back to Home
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: 'spring' as const, stiffness: 300 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                boxShadow: '0 8px 32px rgba(217,119,6,0.35)',
              }}
            >
              <FlaskConical size={28} className="text-white" />
            </motion.div>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-3" style={{ color: '#d97706' }}>
              Secure Access
            </p>
            <h1 className="text-4xl font-black tracking-tight leading-none mb-3 text-white" style={{ letterSpacing: '-0.03em' }}>
              Sign In
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>
              Enter your email to receive a magic link — no password needed.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-3xl p-8 ds-surface" style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
            <div className="h-0.5 w-full mb-8 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #d97706, #f59e0b, transparent)' }} />

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
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#d97706' }} />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-sm font-medium ds-input"
                    />
                  </div>

                  <AnimatePresence>
                    {message.text && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`flex items-center gap-3 p-4 rounded-xl text-xs font-bold overflow-hidden`}
                        style={{
                          background: message.type === 'success' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                          border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.20)' : 'rgba(239,68,68,0.20)'}`,
                          color: message.type === 'success' ? '#34d399' : '#f87171',
                        }}
                      >
                        {message.type === 'success'
                          ? <CheckCircle2 size={14} />
                          : <AlertCircle size={14} />}
                        {message.text}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 ds-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      : <><Lock size={14} /> Send Magic Link</>
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
                    style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.25)' }}
                  >
                    <CheckCircle2 size={30} style={{ color: '#34d399' }} />
                  </motion.div>
                  <h3 className="font-black text-lg mb-2 text-white">Check your inbox</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#71717a' }}>
                    We sent a magic link to <span className="font-bold text-white">{email}</span>. Click it to sign in instantly.
                  </p>
                  <button
                    onClick={() => { setSent(false); setMessage({ type: '', text: '' }) }}
                    className="text-[10px] font-black uppercase tracking-widest transition-colors ds-text-gradient"
                  >
                    Use a different email →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#3f3f46' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          </div>

          <Link href="/products"
            className="block w-full py-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-center ds-btn-secondary">
            Browse Without Account
          </Link>

          {/* Trust note */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <Shield size={11} style={{ color: '#3f3f46' }} />
            <p className="text-[10px] font-medium" style={{ color: '#3f3f46' }}>
              Retatrutide Research Center · Secure Sign-In
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
