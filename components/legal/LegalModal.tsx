'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface LegalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function LegalModal({ isOpen, onClose, title, children }: LegalModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />

          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden pointer-events-auto"
              style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
                style={{ background: '#111113', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 className="text-base font-black text-white tracking-tight">{title}</h3>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl ds-btn-secondary transition-all"
                  aria-label="Close modal"
                >
                  <X size={15} style={{ color: '#a1a1aa' }} />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6 sm:p-8"
                style={{ color: '#a1a1aa', scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}>
                {children}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 px-6 py-4 flex justify-end"
                style={{ background: '#111113', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <button
                  onClick={onClose}
                  className="ds-btn-primary px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider"
                >
                  I Understand & Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
