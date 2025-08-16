import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../../app/api/technical-analysis/route'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('/api/technical-analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return technical analysis for default symbol (bitcoin)', async () => {
    // Mock crypto API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        current_price: 43250
      })
    })

    const request = new Request('http://localhost:3000/api/technical-analysis')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.symbol).toBe('bitcoin')
    expect(data.current_price).toBeDefined()
    expect(data.indicators).toBeDefined()
    expect(data.indicators.rsi).toBeDefined()
    expect(data.indicators.macd).toBeDefined()
    expect(data.trading_signal).toBeDefined()
  })

  it('should return technical analysis for specific symbol', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        current_price: 2650
      })
    })

    const request = new Request('http://localhost:3000/api/technical-analysis?symbol=ethereum')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.symbol).toBe('ethereum')
    expect(data.current_price).toBeDefined()
  })

  it('should handle crypto API failure gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Crypto API failed'))

    const request = new Request('http://localhost:3000/api/technical-analysis?symbol=bitcoin')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Using fallback data due to API error')
    expect(data.trading_signal).toBeDefined()
    expect(data.trading_signal.type).toBeOneOf(['buy', 'sell', 'hold'])
  })

  it('should include valid trading signal structure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        current_price: 43250
      })
    })

    const request = new Request('http://localhost:3000/api/technical-analysis?symbol=bitcoin')
    const response = await GET(request)
    const data = await response.json()

    expect(data.trading_signal).toMatchObject({
      type: expect.stringMatching(/^(buy|sell|hold)$/),
      strength: expect.any(Number),
      confidence: expect.any(Number),
      reasons: expect.arrayContaining([expect.any(String)]),
      timestamp: expect.any(String)
    })

    expect(data.trading_signal.strength).toBeGreaterThanOrEqual(0)
    expect(data.trading_signal.strength).toBeLessThanOrEqual(100)
    expect(data.trading_signal.confidence).toBeGreaterThanOrEqual(0)
    expect(data.trading_signal.confidence).toBeLessThanOrEqual(100)
  })

  it('should include valid RSI and MACD indicators', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        current_price: 43250
      })
    })

    const request = new Request('http://localhost:3000/api/technical-analysis?symbol=bitcoin')
    const response = await GET(request)
    const data = await response.json()

    expect(data.indicators.rsi).toMatchObject({
      value: expect.any(Number),
      signal: expect.stringMatching(/^(bullish|bearish|neutral)$/)
    })

    expect(data.indicators.macd).toMatchObject({
      value: expect.any(Number),
      signal: expect.any(Number),
      histogram: expect.any(Number),
      crossover: expect.stringMatching(/^(bullish|bearish|none)$/)
    })
  })
})
