import React, { useState, useEffect } from 'react'
import { apiClient } from '../apiClient'

const actions = [
  {
    label: 'Add Money',
    icon: '/add-money.png',
    color: 'primary',
    bgColor: 'bg-[#F54849]',
    hoverBg: 'hover:bg-[#d93f3f]',
    glowColor: 'hover:shadow-[#F54849]/30',
    action: 'add-balance',
  },
  {
    label: 'Transactions',
    icon: '/add-money1.png',
    color: 'secondary',
    bgColor: 'bg-white',
    hoverBg: 'hover:bg-gray-100',
    glowColor: 'hover:shadow-white/30',
    action: 'navigate',
    href: '/transactions',
  },
  {
    label: 'History',
    icon: '/add-money2.png',
    color: 'accent',
    bgColor: 'bg-[#F54849]',
    hoverBg: 'hover:bg-[#d93f3f]',
    glowColor: 'hover:shadow-[#F54849]/30',
    action: 'navigate',
    href: '/orders',
  },
  {
    label: 'Report',
    icon: '/file.svg',
    color: 'success',
    bgColor: 'bg-white',
    hoverBg: 'hover:bg-gray-100',
    glowColor: 'hover:shadow-white/30',
    action: 'navigate',
    href: '/report',
  },
]

const AddBalanceModal = ({ open, onClose }) => {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    setLoading(true)
    try {
      const auth = JSON.parse(localStorage.getItem('auth'))
      const token = auth?.token

      const response = await apiClient.post('/wallet/add', {
        amount: Number(amount),
        redirectUrl: `${window.location.origin}/payment/status`,
      })

      if (!response.success || !response.transaction?.paymentUrl) {
        throw new Error(response.message || 'Failed to create payment')
      }

      // Redirect to payment
      window.location.href = response.transaction.paymentUrl
    } catch (err) {
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 modal-overlay">
      <div className="bg-[#18181b] border border-[#334155] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative modal-container">

        <button 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#23272f] transition-all duration-200" 
          onClick={onClose}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <h2 className="text-xl font-semibold text-[#f1f5f9] mb-6 text-center">Add Balance</h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-xl px-4 py-3 bg-[#23272f] border border-[#334155] text-white placeholder:text-gray-400 focus:outline-none focus:border-[#F54849] focus:ring-1 focus:ring-[#F54849] transition-all duration-200"
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && (
              <div className="text-[#F54849] text-sm text-center bg-[#F54849]/10 border border-[#F54849]/20 rounded-lg py-2 px-3">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-[#F54849] hover:bg-[#d93f3f] text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#F54849]/20 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Add Balance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const Actions = () => {
  const [showAddBalance, setShowAddBalance] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleClick = (action, idx) => {
    if (action.action === 'add-balance') {
      setShowAddBalance(true)
    } else if (action.action === 'navigate' && action.href) {
      window.location.href = action.href
    }
  }

  return (
    <section className="w-full px-4 py-8 relative ">
      <AddBalanceModal open={showAddBalance} onClose={() => setShowAddBalance(false)} />

      <div className="max-w-5xl mx-auto flex justify-center bg-black p-4 rounded-2xl">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-4 md:gap-6 lg:w-4/5">
          {actions.map((action, idx) => (
            <button
              key={action.label}
              className={`
                group flex flex-col items-center justify-center aspect-square rounded-2xl pt-4 pb-4
                bg-gray-700 border border-[#334155] 
                hover:border-[#F54849]/50 hover:-translate-y-1 hover:shadow-xl
                ${action.glowColor}
                focus:outline-none focus:ring-2 focus:ring-[#F54849]/50 focus:border-[#F54849]
                transition-all duration-300 ease-out transform-gpu
                active:scale-95 active:translate-y-0 md:w-4/5 lg:w-4/5
              `}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleClick(action, idx)}
            >
              <div className={`
                flex items-center justify-center w-8 h-7 md:w-12 md:h-12 rounded-xl mb-3
                ${action.bgColor} ${action.hoverBg}
                transition-all duration-300 group-hover:scale-110
              `}>
                <img 
                  className={`w-5 h-4 md:w-6 md:h-6 object-contain ${action.bgColor === 'bg-white' ? 'filter brightness-0' : 'filter brightness-0 invert'}`}
                  style={{ filter: action.bgColor === 'bg-white' ? 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(340deg) brightness(104%) contrast(97%)' : 'brightness(0) invert(1)' }}
                  src={action.icon} 
                  alt={action.label} 
                />
              </div>

              <span className="text-[9px] md:text-base text-[#f1f5f9] font-medium text-center transition-colors duration-300 group-hover:text-white">
                {action.label}
              </span>

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#334155] rounded-full transition-all duration-300 group-hover:w-8 group-hover:bg-[#F54849]"></div>
            </button>
          ))}
        </div>
      </div>


    </section>
  )
}

export default Actions
