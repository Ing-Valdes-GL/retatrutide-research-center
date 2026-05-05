'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
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
      setMessage({ type: 'success', text: 'Access link transmitted. Check your inbox.' })
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Transmission failed.'
      setMessage({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white font-mono relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0ea5e9]/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Back link */}
      <div className="relative z-10 p-8 md:p-12">
        <Link href="/"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white/80 transition-colors">
          <ArrowLeft size={14} /> Exit Terminal
        </Link>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-sm">

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 lg-badge rounded-2xl flex items-center justify-center">
              <Lock size={28} className="text-[#0ea5e9]" />
            </div>
          </div>

          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#0ea5e9] font-black mb-3">Secure Access</p>
            <h1 className="text-3xl font-black tracking-tighter leading-none">SIGN IN</h1>
            <p className="text-white/30 text-xs mt-3 leading-relaxed">Enter your email to receive a magic link.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl lg-surface text-sm text-white placeholder:text-white/25 outline-none focus:border-[#0ea5e9]/50 transition-all"
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-black uppercase text-sm tracking-widest text-white lg-btn-accent flex items-center justify-center gap-3 disabled:opacity-40">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={16} />}
              {loading ? 'Transmitting…' : 'Send Access Link'}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <Link href="/products"
            className="block w-full py-4 rounded-xl font-black uppercase text-[11px] tracking-widest text-center text-white/50 lg-btn hover:text-white">
            Browse Without Account
          </Link>
        </div>
      </div>

      <p className="relative z-10 text-center text-[9px] text-white/15 font-bold uppercase tracking-[0.2em] pb-8">
        Retatrutide Research Center · Secure Terminal v3.4
      </p>
    </div>
  )
}
