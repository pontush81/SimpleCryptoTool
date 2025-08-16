'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, AlertTriangle } from 'lucide-react'

interface TechnicalData {
  success: boolean
  symbol: string
  current_price: number
  indicators: {
    rsi: {
      value: number
      signal: 'oversold' | 'overbought' | 'neutral'
    }
    macd: {
      value: number
      signal: number
      histogram: number
      crossover: 'bullish' | 'bearish' | 'none'
    }
  }
  trading_signal: {
    type: 'buy' | 'sell' | 'hold'
    strength: number
    confidence: number
    reasons: string[]
  }
  timestamp: string
}

interface CryptoCycleSignalsProps {
  symbol: string
  className?: string
}

export default function CryptoCycleSignals({ symbol, className = '' }: CryptoCycleSignalsProps) {
  const [data, setData] = useState<TechnicalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/technical-analysis?symbol=${symbol}`)
      const result = await response.json()
      
      if (result.success || result.error) {
        setData(result)
      } else {
        throw new Error('Failed to fetch technical analysis data')
      }
    } catch (err) {
      console.error('Error fetching technical analysis:', err)
      setError('Kunde inte hämta data')
      
      setData({
        success: false,
        symbol,
        current_price: 43250,
        indicators: {
          rsi: { value: 50, signal: 'neutral' },
          macd: { value: 0, signal: 0, histogram: 0, crossover: 'none' }
        },
        trading_signal: {
          type: 'hold',
          strength: 50,
          confidence: 50,
          reasons: ['Neutral market conditions']
        },
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [symbol])

  const getSimpleSignal = () => {
    if (!data) return { signal: 'VÄNTA', confidence: 50, color: 'yellow', emoji: '🟡' }
    
    const { rsi, macd } = data.indicators
    const tradingSignal = data.trading_signal
    
    if (tradingSignal.type === 'buy' && tradingSignal.confidence > 60) {
      return { signal: 'KÖPLÄGE', confidence: tradingSignal.confidence, color: 'green', emoji: '🟢' }
    } else if (tradingSignal.type === 'sell' && tradingSignal.confidence > 60) {
      return { signal: 'SÄLJLÄGE', confidence: tradingSignal.confidence, color: 'red', emoji: '🔴' }
    } else {
      return { signal: 'VÄNTA', confidence: tradingSignal.confidence, color: 'yellow', emoji: '🟡' }
    }
  }

  const getMarketTemperature = () => {
    if (!data) return { temp: 'VARMT', emoji: '🌡️', color: 'orange' }
    
    const rsiValue = data.indicators.rsi.value
    
    if (rsiValue <= 30) {
      return { temp: 'KALLT', emoji: '🧊', color: 'blue' }
    } else if (rsiValue >= 70) {
      return { temp: 'HETT', emoji: '🔥', color: 'red' }
    } else {
      return { temp: 'VARMT', emoji: '🌡️', color: 'orange' }
    }
  }

  const getSignalExplanation = () => {
    const simpleSignal = getSimpleSignal()
    
    switch (simpleSignal.signal) {
      case 'KÖPLÄGE':
        return 'Marknaden visar positiva signaler - kan vara ett bra tillfälle att köpa'
      case 'SÄLJLÄGE':
        return 'Marknaden visar negativa signaler - överväg att sälja eller vänta'
      case 'VÄNTA':
      default:
        return 'Marknaden är i en neutral fas - vänta på tydligare signaler'
    }
  }

  const getTemperatureExplanation = () => {
    const temp = getMarketTemperature()
    
    switch (temp.temp) {
      case 'KALLT':
        return 'Neutral fas - Avvaktande'
      case 'HETT':
        return 'Hög aktivitet - Försiktighet'
      case 'VARMT':
      default:
        return 'Neutral fas - Avvaktande'
    }
  }

  const simpleSignal = getSimpleSignal()
  const marketTemp = getMarketTemperature()

  if (loading) {
    return (
      <div className={`bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Laddar signaler...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Crypto Cykelsignaler</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded">
            Enkla signaler för {data?.symbol?.toUpperCase() || symbol.toUpperCase()} - Ingen komplex analys behövs
          </span>
          <button 
            onClick={fetchData}
            className="text-xs text-blue-600 hover:text-blue-800 p-1"
            title="Uppdatera data"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        📊 Enkla signaler för {data?.symbol?.toUpperCase() || symbol.toUpperCase()} - Ingen komplex analys behövs
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">{error} - Visar exempeldata</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border-2 ${
          simpleSignal.color === 'green' ? 'bg-green-50 border-green-200' :
          simpleSignal.color === 'red' ? 'bg-red-50 border-red-200' :
          'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl mr-2">{simpleSignal.emoji}</span>
            <span className="text-xl font-bold text-gray-900">{simpleSignal.signal}</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-700 mb-1">
              {simpleSignal.confidence}% säkerhet
            </div>
            <div className="text-sm text-gray-600">
              {getSignalExplanation()}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Vänta på tydligare signaler
            </div>
          </div>
        </div>

        <div className={`p-3 rounded-lg ${
          marketTemp.color === 'blue' ? 'bg-blue-50' :
          marketTemp.color === 'red' ? 'bg-red-50' :
          'bg-orange-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg mr-2">{marketTemp.emoji}</span>
              <span className="font-medium text-gray-900">
                Marknaden är {marketTemp.temp}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {getTemperatureExplanation()}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => setShowDisclaimer(!showDisclaimer)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Viktigt att läsa - Disclaimer
        </button>

        {showDisclaimer && (
          <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-sm text-yellow-800">
              <div className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                VIKTIGT - LÄSA DETTA NOGGRANT
              </div>
              <ul className="space-y-1 text-xs">
                <li>• <strong>INTE FINANSIELL RÅDGIVNING:</strong> Detta är endast teknisk analys och stöd för dina egna beslut</li>
                <li>• <strong>EGEN RISK:</strong> All kryptohandel innebär hög risk - du kan förlora hela din investering</li>
                <li>• <strong>GÖR DIN RESEARCH:</strong> Använd detta som EN av många faktorer i ditt beslut</li>
                <li>• <strong>INVESTERA ANSVARSFULLT:</strong> Investera aldrig mer än du har råd att förlora</li>
                <li>• <strong>INGEN GARANTI:</strong> Tidigare resultat garanterar inte framtida prestanda</li>
                <li>• <strong>SÖK PROFESSIONELL RÅDGIVNING:</strong> Konsultera en finansiell rådgivare för personlig vägledning</li>
              </ul>
              <div className="mt-3 text-center font-medium">
                Du är helt ansvarig för dina egna investeringsbeslut
              </div>
            </div>
          </div>
        )}
      </div>

      {data && (
        <div className="mt-4 text-xs text-gray-400 text-center">
          Uppdaterad: {new Date(data.timestamp).toLocaleString('sv-SE')}
        </div>
      )}
    </div>
  )
}
