'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown, Bitcoin, TrendingUp, TrendingDown } from 'lucide-react'

interface CryptoOption {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

interface CryptoSelectorProps {
  cryptoData: CryptoOption[]
  selectedCrypto: string
  onCryptoChange: (cryptoId: string) => void
  className?: string
}

export default function CryptoSelector({ 
  cryptoData, 
  selectedCrypto, 
  onCryptoChange, 
  className = '' 
}: CryptoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCoin = cryptoData.find(crypto => crypto.id === selectedCrypto) || cryptoData[0]

  const handleSelect = (cryptoId: string) => {
    onCryptoChange(cryptoId)
    setIsOpen(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.crypto-selector')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!selectedCoin) return null

  return (
    <div className={`relative crypto-selector ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors min-h-[60px]"
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <img
            src={selectedCoin.image}
            alt={selectedCoin.name}
            className="w-6 h-6 rounded-full flex-shrink-0"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden p-1 bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
            <Bitcoin className="h-3 w-3 text-orange-600" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="font-medium text-gray-900 text-sm truncate">
              {selectedCoin.name.length > 10 ? selectedCoin.name.substring(0, 10) + '...' : selectedCoin.name}
            </p>
            <p className="text-xs text-gray-500">{selectedCoin.symbol.toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-sm">
              {formatPrice(selectedCoin.current_price)}
            </p>
            <div className={`flex items-center justify-end text-xs ${
              selectedCoin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedCoin.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5 mr-0.5" />
              )}
              <span className="whitespace-nowrap">
                {selectedCoin.price_change_percentage_24h >= 0 ? '+' : ''}
                {selectedCoin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </div>
          </div>
          <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {cryptoData.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => handleSelect(crypto.id)}
                className={`w-full flex items-center justify-between p-2.5 hover:bg-gray-50 transition-colors ${
                  crypto.id === selectedCrypto ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-5 h-5 rounded-full flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className="hidden p-1 bg-orange-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Bitcoin className="h-2.5 w-2.5 text-orange-600" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {crypto.name.length > 12 ? crypto.name.substring(0, 12) + '...' : crypto.name}
                    </p>
                    <p className="text-xs text-gray-500">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatPrice(crypto.current_price)}
                  </p>
                  <div className={`flex items-center justify-end text-xs ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-2 w-2 mr-0.5" />
                    ) : (
                      <TrendingDown className="h-2 w-2 mr-0.5" />
                    )}
                    <span className="whitespace-nowrap">
                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                      {crypto.price_change_percentage_24h.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
