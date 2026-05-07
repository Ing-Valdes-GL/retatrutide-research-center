'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, ChatMessage, ChatConversation } from '@/lib/supabase'
import Header from '@/components/Header'
import {
  Send, Paperclip, Check, CheckCheck,
  Shield, Lock, Wifi, ChevronDown, X, ZoomIn, FlaskConical
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
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: '#09090b', color: '#fafafa' }}>
      <Header />

      <div className="flex-1 min-h-0 flex flex-col" style={{ paddingTop: '64px' }}>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 shrink-0"
          style={{ background: '#111113', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-black text-[10px] shrink-0"
                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', boxShadow: '0 4px 16px rgba(217,119,6,0.35)' }}>
                <FlaskConical size={16} />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#10b981', borderColor: '#111113' }} />
            </div>
            <div>
              <p className="font-black text-xs sm:text-sm uppercase tracking-tight leading-none text-white">Support Team</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10b981' }} />
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#10b981' }}>
                  Online · Avg reply &lt; 2min
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full ds-badge-emerald">
              <Lock size={9} />
              <span className="text-[9px] font-black uppercase tracking-widest">E2E Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full ds-badge">
              <Wifi size={9} />
              <span className="text-[9px] font-black uppercase tracking-widest">Secure</span>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div
          ref={scrollAreaRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 lg:px-10 py-6 space-y-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(217,119,6,0.3) transparent', background: '#09090b' }}
        >
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
              <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#52525b' }}>
                Connecting to support…
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center ds-surface"
                style={{ border: '1px solid rgba(217,119,6,0.20)', boxShadow: '0 4px 20px rgba(217,119,6,0.12)' }}>
                <Shield size={26} style={{ color: '#d97706' }} />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight mb-2 text-white">Secure Channel Ready</p>
                <p className="text-xs max-w-xs leading-relaxed" style={{ color: '#71717a' }}>
                  Send your order reference or any inquiry. Our team will respond within minutes.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-sm">
                {['Track my order', 'Shipping info', 'Product query', 'Payment issue'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setNewMessage(t)}
                    className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ds-btn-secondary"
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
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <span className="text-[9px] font-black uppercase tracking-widest px-2" style={{ color: '#3f3f46' }}>{date}</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>

                <div className="space-y-3">
                  {msgs.map((msg, i) => {
                    const isOwn = msg.sender_id === user?.id
                    const prevSame = i > 0 && msgs[i - 1].sender_id === msg.sender_id
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'} ${prevSame ? 'mt-1' : 'mt-3'}`}
                      >
                        {/* Avatar */}
                        <div className="w-7 h-7 shrink-0 self-end">
                          {!prevSame && (
                            isOwn ? (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-black uppercase"
                                style={{ background: 'rgba(217,119,6,0.15)', border: '1px solid rgba(217,119,6,0.25)', color: '#fbbf24' }}>
                                {user?.email?.[0] ?? 'U'}
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)' }}>
                                <FlaskConical size={12} className="text-white" />
                              </div>
                            )
                          )}
                        </div>

                        {/* Bubble */}
                        <div className={`flex flex-col max-w-[75%] sm:max-w-[65%] ${isOwn ? 'items-end' : 'items-start'}`}>
                          <div className={`px-4 py-3 text-sm leading-relaxed break-words ${isOwn ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}
                            style={isOwn
                              ? { background: 'linear-gradient(135deg, #d97706, #b45309)', color: '#ffffff', boxShadow: '0 4px 16px rgba(217,119,6,0.25)' }
                              : { background: '#18181b', color: '#fafafa', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.20)' }
                            }
                          >
                            {msg.message_type === 'text' && <p>{msg.content}</p>}
                            {msg.message_type === 'image' && msg.file_url && (
                              <button onClick={() => setLightboxUrl(msg.file_url ?? null)} className="relative group block">
                                <img src={msg.file_url} alt="Attachment" className="rounded-xl max-h-56 object-cover w-full" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                  <ZoomIn size={20} className="text-white" />
                                </div>
                              </button>
                            )}
                          </div>
                          {/* Meta */}
                          <div className={`flex items-center gap-1.5 mt-1 px-1 ${isOwn ? 'flex-row' : 'flex-row-reverse'}`}>
                            <span className="text-[9px] font-bold tabular-nums" style={{ color: '#3f3f46' }}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isOwn && (
                              msg.is_read
                                ? <CheckCheck size={11} style={{ color: '#d97706' }} />
                                : <Check size={11} style={{ color: '#52525b' }} />
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
            className="absolute bottom-24 right-6 w-9 h-9 text-white rounded-full flex items-center justify-center hover:scale-110 z-20 transition-transform ds-btn-primary"
          >
            <ChevronDown size={16} />
          </button>
        )}

        {/* Input bar */}
        <div className="shrink-0 px-3 sm:px-6 lg:px-10 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: '#111113' }}>
          <div className="flex items-end gap-2 rounded-2xl p-2 ds-surface">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors shrink-0"
              style={{ color: '#52525b' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#d97706')}
              onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}
            >
              {uploading
                ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
                : <Paperclip size={17} />}
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
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none text-sm py-2 px-1 min-h-[40px] max-h-[120px] leading-relaxed"
              style={{ color: '#fafafa' }}
            />

            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="w-10 h-10 text-white flex items-center justify-center rounded-xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-all ds-btn-primary"
            >
              {sending
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={15} />}
            </button>
          </div>

          <p className="text-center text-[8px] font-bold uppercase tracking-[0.25em] mt-2" style={{ color: '#3f3f46' }}>
            Transmission encrypted · Retatrutide Research Center
          </p>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white ds-btn-secondary"
            onClick={() => setLightboxUrl(null)}
          >
            <X size={17} />
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
      <div className="h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#09090b' }}>
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#d97706', borderTopColor: 'transparent' }} />
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#52525b' }}>
          Connecting to support…
        </p>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}
