'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import CryptoSelector from '../components/CryptoSelector'
import CryptoCycleSignals from '../components/CryptoCycleSignals'

interface CryptoData {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  image: string
}

export default function HomePage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCryptoData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/crypto')
      const result = await response.json()
      
      if (result.success || result.data) {
        setCryptoData(result.data || [])
      } else {
        throw new Error('Failed to fetch crypto data')
      }
    } catch (err) {
      console.error('Error fetching crypto data:', err)
      setError('Kunde inte hämta kryptodata')
      
      setCryptoData([
        {
          id: 'bitcoin',
          name: 'Bitcoin',
          symbol: 'btc',
          current_price: 43250.00,
          price_change_24h: 1250.30,
          price_change_percentage_24h: 2.98,
          market_cap: 847000000000,
          total_volume: 23400000000,
          image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
        },
        {
          id: 'ethereum',
          name: 'Ethereum',
          symbol: 'eth',
          current_price: 2650.75,
          price_change_24h: -45.20,
          price_change_percentage_24h: -1.68,
          market_cap: 318000000000,
          total_volume: 12100000000,
          image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptoData()
  }, [])

  const handleCryptoChange = (cryptoId: string) => {
    setSelectedCrypto(cryptoId)
  }

  const handleManualRefresh = () => {
    fetchCryptoData()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                📈 Simple Crypto Tool
              </h1>
              <span className="ml-3 text-sm text-gray-500 bg-green-100 px-2 py-1 rounded">
                Enkla Kryptosignaler
              </span>
            </div>
            <button
              onClick={handleManualRefresh}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Uppdatera</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  För vanliga människor - Inte professionella traders
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Detta verktyg ger dig enkla signaler för kryptomarknaden utan komplicerade diagram eller teknisk analys. 
                    <strong className="ml-1">Detta är INTE finansiell rådgivning</strong> - använd det som stöd för dina egna beslut.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-sm text-yellow-800">{error} - Visar exempeldata</span>
              </div>
            </div>
          )}

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Välj Kryptovaluta</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Laddar kryptovalutor...</span>
              </div>
            ) : (
              <CryptoSelector 
                selectedCrypto={selectedCrypto}
                onCryptoChange={handleCryptoChange}
                cryptoData={cryptoData}
              />
            )}
          </div>

          <CryptoCycleSignals 
            symbol={selectedCrypto}
            className="w-full"
          />

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Hur fungerar det?</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• <strong>KÖPLÄGE:</strong> Marknaden visar positiva signaler</p>
              <p>• <strong>SÄLJLÄGE:</strong> Marknaden visar negativa signaler</p>
              <p>• <strong>VÄNTA:</strong> Marknaden är neutral - vänta på tydligare signaler</p>
              <p>• <strong>Marknadstemperatur:</strong> KALLT (låg aktivitet), VARMT (normal), HETT (hög aktivitet)</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  VIKTIGT - Läs detta innan du använder signalerna
                </h4>
                <div className="text-sm text-red-700 space-y-1">
                  <p>• Detta är <strong>INTE finansiell rådgivning</strong></p>
                  <p>• Kryptohandel innebär <strong>hög risk</strong> - du kan förlora allt</p>
                  <p>• Investera <strong>aldrig mer än du har råd att förlora</strong></p>
                  <p>• Gör alltid din egen research innan du investerar</p>
                  <p>• Konsultera en finansiell rådgivare för personlig vägledning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Simple Crypto Tool - Enkla kryptosignaler för vanliga människor</p>
            <p className="mt-1">Inte finansiell rådgivning • Använd på egen risk • © 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
