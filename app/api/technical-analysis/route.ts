import { NextResponse } from 'next/server'
import { calculateRSI, calculateMACD, generateTradingSignals, getLatestSignal } from '../../../lib/indicators'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'bitcoin'
    
    console.log(`🔍 Generating technical analysis for ${symbol}`)
    
    // Create clean URL for crypto API call
    const baseUrl = request.url.split('?')[0].replace('/api/technical-analysis', '/api/crypto')
    const cryptoResponse = await fetch(`${baseUrl}?symbol=${symbol}`)
    
    if (!cryptoResponse.ok) {
      throw new Error('Failed to fetch current crypto prices')
    }
    
    const cryptoData = await cryptoResponse.json()
    
    const mockPrices = [
      42000, 42500, 41800, 43200, 44100, 43800, 42900, 43500, 44200, 43700,
      44800, 45200, 44600, 43900, 44700, 45100, 44300, 43600, 44900, 45400,
      44800, 43200, 44600, 45800, 46200, 45600, 44900, 45700, 46100, 45300
    ]
    
    const rsiResults = calculateRSI(mockPrices, 14)
    const macdResults = calculateMACD(mockPrices, 12, 26, 9)
    const tradingSignals = generateTradingSignals(rsiResults, macdResults)
    const latestSignal = getLatestSignal(tradingSignals)
    
    const latestRSI = rsiResults[rsiResults.length - 1]
    const latestMACD = macdResults[macdResults.length - 1]
    
    return NextResponse.json({
      success: true,
      symbol,
      current_price: cryptoData.current_price || 43250,
      indicators: {
        rsi: {
          value: latestRSI?.value || 50,
          signal: latestRSI?.signal || 'neutral'
        },
        macd: {
          value: latestMACD?.macd || 0,
          signal: latestMACD?.signal || 0,
          histogram: latestMACD?.histogram || 0,
          crossover: latestMACD?.crossover || 'none'
        }
      },
      trading_signal: latestSignal || {
        type: 'hold',
        strength: 50,
        confidence: 50,
        reasons: ['Neutral market conditions'],
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in technical analysis:', error)
    
    return NextResponse.json({
      success: false,
      symbol: 'bitcoin',
      current_price: 43250,
      indicators: {
        rsi: {
          value: 50,
          signal: 'neutral'
        },
        macd: {
          value: 0,
          signal: 0,
          histogram: 0,
          crossover: 'none'
        }
      },
      trading_signal: {
        type: 'hold',
        strength: 50,
        confidence: 50,
        reasons: ['Using fallback data'],
        timestamp: new Date().toISOString()
      },
      error: 'Using fallback data due to API error',
      timestamp: new Date().toISOString()
    }, { status: 200 })
  }
}
