'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Trash2, Plus, Minus, ArrowRight, X } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // État pour les informations de livraison
  const [shippingInfo, setShippingInfo] = useState({
    country: 'United Kingdom (UK)',
    county: '',
    townCity: '',
    postcode: ''
  })

  // Chargement du panier local au montage du composant
  useEffect(() => {
    const loadLocalCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(savedCart)
      setLoading(false)
    }
    loadLocalCart()
  }, [])

  // Mise à jour de la quantité
  const updateQuantity = (productId: string, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    })
    saveCart(updatedCart)
  }

  // Suppression d'un article
  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.id !== productId)
    saveCart(updatedCart)
  }

  // Sauvegarde globale du panier
  const saveCart = (newCart: any[]) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    // Notifier les autres composants (comme le badge du Header)
    window.dispatchEvent(new Event('cart-updated'))
  }

  // Calculs financiers
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shippingCost = 30.00
  const total = subtotal + shippingCost

  // Fonction de redirection vers le checkout
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.")
      return
    }
    // On peut aussi passer les infos de shipping via le state ou le localStorage si besoin
    router.push('/checkout')
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans">
      <Header />

      {/* Hero Header */}
      <div className="py-16 text-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <h1 className="text-4xl font-bold tracking-tight text-white relative z-10">Your Cart</h1>
        <p className="text-white/40 text-sm mt-2 font-medium relative z-10">Review your items before secure checkout</p>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* LEFT: Products + Shipping */}
          <div className="lg:col-span-2 space-y-12">

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-white/30">Product</th>
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-white/30">Price</th>
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-white/30 text-center">Quantity</th>
                    <th className="pb-4 font-semibold uppercase text-[10px] tracking-widest text-white/30">Subtotal</th>
                    <th className="pb-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-6 flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-lg p-1 flex items-center justify-center border border-white/8">
                          <img
                            src={item.image_url || item.main_image_url}
                            className="max-h-full max-w-full object-contain"
                            alt={item.name}
                          />
                        </div>
                        <span className="font-medium text-white text-sm">{item.name}</span>
                      </td>
                      <td className="py-6 text-sm text-white/50 font-medium">£{item.price.toFixed(2)}</td>
                      <td className="py-6">
                        <div className="flex items-center justify-between lg-surface rounded-md px-2 py-1.5 w-24 mx-auto">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-white/40 hover:text-[#0ea5e9] transition-colors">
                            <Minus size={14}/>
                          </button>
                          <span className="text-sm font-semibold text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-white/40 hover:text-[#0ea5e9] transition-colors">
                            <Plus size={14}/>
                          </button>
                        </div>
                      </td>
                      <td className="py-6 font-bold text-sm text-white">£{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-6 text-right">
                        <button onClick={() => removeItem(item.id)} className="text-white/20 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {cartItems.length === 0 && (
                <div className="py-12 text-center text-white/30 text-sm italic">
                  Your cart is currently empty.
                </div>
              )}
            </div>

            {/* SHIPPING */}
            <div className="pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold mb-6 text-white">Shipping Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <select
                    className="w-full lg-surface text-white rounded-lg px-4 py-3 text-sm outline-none focus:border-[#0ea5e9]/50 transition-all appearance-none"
                    value={shippingInfo.country}
                    onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                   >
                     <option className="bg-[#0a0a0f]">United Kingdom (UK)</option>
                     <option className="bg-[#0a0a0f]">United States (US)</option>
                     <option className="bg-[#0a0a0f]">France</option>
                   </select>
                </div>
                <input type="text" placeholder="County"
                  className="lg-surface text-white rounded-lg px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#0ea5e9]/50"
                  value={shippingInfo.county}
                  onChange={(e) => setShippingInfo({...shippingInfo, county: e.target.value})} />
                <input type="text" placeholder="Town / City"
                  className="lg-surface text-white rounded-lg px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#0ea5e9]/50"
                  value={shippingInfo.townCity}
                  onChange={(e) => setShippingInfo({...shippingInfo, townCity: e.target.value})} />
                <input type="text" placeholder="Postcode"
                  className="lg-surface text-white rounded-lg px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-[#0ea5e9]/50"
                  value={shippingInfo.postcode}
                  onChange={(e) => setShippingInfo({...shippingInfo, postcode: e.target.value})} />
                <div className="flex items-center">
                  <button className="lg-btn-accent px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest text-white">
                    Update Shipping
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : RÉSUMÉ (VIOLET) */}
          <div className="lg:col-span-1">
            <div className="bg-[#3D002E] rounded-3xl p-8 text-white sticky top-28 shadow-xl border border-white/5">
              <h2 className="text-lg font-bold mb-8 opacity-90">{cartItems.length} Items In Cart</h2>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Subtotal</span>
                  <span className="font-semibold text-base">£{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium opacity-60 uppercase tracking-wider">Shipping</span>
                    <span className="font-semibold text-base">£{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <p className="text-orange-300 font-bold text-[9px] uppercase tracking-widest mb-1">Express Delivery</p>
                    <p className="text-[10px] opacity-40 leading-relaxed">Fast tracked delivery to your address.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-sm uppercase opacity-60">Total</span>
                    <span className="text-3xl font-bold tracking-tight">£{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-[#EF6C00] text-white py-4 rounded-xl font-bold text-xs uppercase tracking-[0.15em] shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                  >
                    Proceed To Checkout 
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <button 
                    onClick={() => saveCart([...cartItems])}
                    className="w-full border border-white/20 text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/5 transition-all"
                  >
                    Update Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}