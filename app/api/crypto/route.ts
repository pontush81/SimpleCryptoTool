import { NextResponse } from 'next/server'

export interface CryptoData {
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (symbol) {
      console.log(`📡 Fetching data for specific symbol: ${symbol}`)
      
      const coinResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol}&order=market_cap_desc&sparkline=false&locale=en`,
        { next: { revalidate: 60 } }
      )

      if (!coinResponse.ok) {
        throw new Error(`CoinGecko API error for ${symbol}: ${coinResponse.status}`)
      }

      const coinData: CryptoData[] = await coinResponse.json()
      
      if (coinData.length > 0) {
        console.log(`✅ Got data for ${symbol}:`, coinData[0])
        return NextResponse.json({
          success: true,
          data: coinData[0],
          ...coinData[0],
          timestamp: new Date().toISOString()
        })
      } else {
        throw new Error(`No data found for symbol: ${symbol}`)
      }
    }

    const coinsResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en',
      { next: { revalidate: 60 } }
    )

    if (!coinsResponse.ok) {
      throw new Error(`CoinGecko API error: ${coinsResponse.status}`)
    }

    const coinsData: CryptoData[] = await coinsResponse.json()

    return NextResponse.json({
      success: true,
      data: coinsData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    
    if (symbol) {
      const symbolFallbacks: { [key: string]: CryptoData } = {
        'bitcoin': {
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
        'ethereum': {
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
      }
      
      const fallbackData = symbolFallbacks[symbol] || symbolFallbacks['bitcoin']
      
      return NextResponse.json({
        success: false,
        data: fallbackData,
        ...fallbackData,
        error: 'Using fallback data due to API error',
        timestamp: new Date().toISOString()
      }, { status: 200 })
    }
    
    const mockData: CryptoData[] = [
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
    ]

    return NextResponse.json({
      success: false,
      data: mockData,
      error: 'Using fallback data due to API error',
      timestamp: new Date().toISOString()
    }, { status: 200 })
  }
}
