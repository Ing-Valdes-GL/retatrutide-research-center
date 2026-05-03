'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ChatMessage, ChatConversation } from '@/lib/supabase'
import Header from '@/components/Header'
import {
  Send, Paperclip, Check, CheckCheck,
  Shield, Lock, Wifi, ChevronDown, X, ZoomIn
} from 'lucide-react'

function ChatContent() {
  const router = useRouter()
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [conversation, setConversation] = useState<ChatConversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [atBottom, setAtBottom] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { checkUser() }, [])

  useEffect(() => {
    if (user && conversation) {
      loadMessages()
      const channel = subscribeToRealtime()
      return () => { supabase.removeChannel(channel) }
    }
  }, [user, conversation])

  useEffect(() => {
    if (atBottom) scrollToBottom()
  }, [messages])

  const checkUser = async () => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) { router.push('/login'); return }
    setUser(u)
    await loadOrCreateConversation(u.id)
  }

  const loadOrCreateConversation = async (userId: string) => {
    try {
      const { data: existing } = await supabase
        .from('chat_conversations').select('*')
        .eq('user_id', userId).eq('status', 'active').maybeSingle()

      if (existing) {
        setConversation(existing)
      } else {
        const { data: newConv, error } = await supabase
          .from('chat_conversations')
          .insert({ user_id: userId, status: 'active' })
          .select().single()
        if (error) throw error
        setConversation(newConv)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    if (!conversation) return
    const { data } = await supabase
      .from('chat_messages').select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  const subscribeToRealtime = () => {
    const channel = supabase.channel(`chat:${conversation?.id}`)
    channel.on('postgres_changes', {
      event: 'INSERT', schema: 'public',
      table: 'chat_messages',
      filter: `conversation_id=eq.${conversation?.id}`
    }, (payload) => {
      const msg = payload.new as ChatMessage
      setMessages((cur) => cur.some(m => m.id === msg.id) ? cur : [...cur, msg])
    }).subscribe()
    return channel
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !conversation || sending) return
    const content = newMessage
    setNewMessage('')
    setSending(true)
    try {
      const { error } = await supabase.from('chat_messages').insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        message_type: 'text',
        content
      })
      if (error) throw error
      await supabase.from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversation.id)
    } catch (e) {
      console.error(e)
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !conversation) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('chat-images').upload(fileName, file)
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('chat-images').getPublicUrl(fileName)
      await supabase.from('chat_messages').insert({
        conversation_id: conversation.id, sender_id: user.id,
        message_type: 'image', file_url: publicUrl, content: 'Image attachment'
      })
    } catch {
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleScroll = () => {
    const el = scrollAreaRef.current
    if (!el) return
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 60)
  }

  const groupedMessages = messages.reduce<Array<{ date: string; msgs: ChatMessage[] }>>((acc, msg) => {
    const date = new Date(msg.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    const last = acc[acc.length - 1]
    if (last && last.date === date) { last.msgs.push(msg) }
    else { acc.push({ date, msgs: [msg] }) }
    return acc
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      <Header />

      {/* ── CHAT SHELL ── */}
      <div className="flex-1 min-h-0 flex flex-col">

        {/* Top status bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b border-white/5 lg-surface shrink-0">
          <div className="flex items-center gap-3">
            {/* Agent avatar */}
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#1e3a8a] flex items-center justify-center text-white font-black text-xs shrink-0">
                RRC
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#050505]" />
            </div>
            <div>
              <p className="font-black text-xs sm:text-sm uppercase tracking-tight leading-none">Support Team</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400/80">Online · Avg reply &lt; 2min</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 lg-badge px-3 py-1.5 rounded-full">
              <Lock size={10} className="text-[#0ea5e9]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#0ea5e9]">E2E Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 lg-surface px-3 py-1.5 rounded-full">
              <Wifi size={10} className="text-white/40" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Secure</span>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 lg:px-10 py-6 space-y-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(14,165,233,0.2) transparent' }}
        >
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Initializing secure channel…</p>
            </div>

          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0ea5e9]/20 to-[#1e3a8a]/20 border border-[#0ea5e9]/20 flex items-center justify-center">
                <Shield size={28} className="text-[#0ea5e9]" />
              </div>
              <div>
                <p className="font-black text-base uppercase tracking-tight text-white mb-2">Secure Channel Ready</p>
                <p className="text-xs text-white/40 max-w-xs leading-relaxed">
                  Send your order reference or any inquiry. Our team will respond within minutes.
                </p>
              </div>
              {/* Quick prompt chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {['Track my order', 'Shipping info', 'Product query', 'Payment issue'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewMessage(t)}
                    className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider lg-btn text-white/60 hover:text-[#0ea5e9]"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

          ) : (
            groupedMessages.map(({ date, msgs }) => (
              <div key={date}>
                {/* Date divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-white/5" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/20 px-2">{date}</span>
                  <div className="flex-1 h-px bg-white/5" />
                </div>

                <div className="space-y-3">
                  {msgs.map((msg, i) => {
                    const isOwn = msg.sender_id === user?.id
                    const prevSame = i > 0 && msgs[i - 1].sender_id === msg.sender_id
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${prevSame ? 'mt-1' : 'mt-3'}`}
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        {/* Avatar (only on first in run) */}
                        <div className="w-7 h-7 shrink-0 self-end">
                          {!prevSame && (
                            isOwn ? (
                              <div className="w-7 h-7 rounded-full bg-[#0ea5e9]/20 border border-[#0ea5e9]/30 flex items-center justify-center text-[8px] font-black text-[#0ea5e9] uppercase">
                                {user?.email?.[0] ?? 'U'}
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#1e3a8a] flex items-center justify-center text-[7px] font-black text-white">
                                RRC
                              </div>
                            )
                          )}
                        </div>

                        {/* Bubble */}
                        <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div className={`relative px-4 py-3 text-sm leading-relaxed break-words ${
                            isOwn
                              ? 'bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] text-white rounded-2xl rounded-tr-sm shadow-lg shadow-sky-500/10'
                              : 'bg-white/5 border border-white/8 text-white/90 rounded-2xl rounded-tl-sm'
                          }`}>
                            {msg.message_type === 'text' && (
                              <p>{msg.content}</p>
                            )}
                            {msg.message_type === 'image' && msg.file_url && (
                              <button
                                onClick={() => setLightboxUrl(msg.file_url ?? null)}
                                className="relative group block"
                              >
                                <img
                                  src={msg.file_url}
                                  alt="Attachment"
                                  className="rounded-xl max-h-56 object-cover w-full"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <ZoomIn size={20} className="text-white" />
                                </div>
                              </button>
                            )}
                          </div>
                          {/* Meta */}
                          <div className={`flex items-center gap-1.5 mt-1 px-1 ${isOwn ? 'flex-row' : 'flex-row-reverse'}`}>
                            <span className="text-[9px] text-white/25 font-bold tabular-nums">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isOwn && (
                              msg.is_read
                                ? <CheckCheck size={11} className="text-[#0ea5e9]" />
                                : <Check size={11} className="text-white/30" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll-to-bottom fab */}
        {!atBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 right-6 w-9 h-9 lg-btn-accent text-white rounded-full flex items-center justify-center hover:scale-110 z-20"
          >
            <ChevronDown size={16} />
          </button>
        )}

        {/* Input bar */}
        <div className="shrink-0 px-3 sm:px-6 lg:px-10 py-4 border-t border-white/5 lg-surface">
          <div className="flex items-end gap-2 lg-surface rounded-2xl p-2 focus-within:border-[#0ea5e9]/40 transition-all">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-[#0ea5e9] lg-btn shrink-0"
            >
              {uploading
                ? <div className="w-4 h-4 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
                : <Paperclip size={18} />}
            </button>

            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

            <textarea
              rows={1}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Type a message… (Enter to send)"
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none text-sm text-white placeholder:text-white/25 py-2 px-1 min-h-[40px] max-h-[120px] leading-relaxed"
            />

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="w-10 h-10 lg-btn-accent text-white flex items-center justify-center rounded-xl active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed shrink-0"
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={16} />}
            </button>
          </div>

          <p className="text-center text-[8px] font-bold uppercase tracking-[0.25em] text-white/15 mt-2">
            Transmission encrypted · Retatrutide Research Center v3.4
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X size={18} />
          </button>
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#0ea5e9] border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9]/60">
          Initializing Secure Channel…
        </p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
