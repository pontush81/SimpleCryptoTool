import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '../../app/api/crypto/route'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('/api/crypto', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when no symbol is provided', () => {
    it('should return list of crypto data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 43250,
            price_change_24h: 1250.3,
            price_change_percentage_24h: 2.98,
            market_cap: 847000000000,
            total_volume: 23400000000,
            image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
          }
        ])
      })

      const request = new Request('http://localhost:3000/api/crypto')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.timestamp).toBeDefined()
    })

    it('should handle API error and return fallback data', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const request = new Request('http://localhost:3000/api/crypto')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Using fallback data due to API error')
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe('when symbol is provided', () => {
    it('should return specific crypto data for valid symbol', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'btc',
            current_price: 43250,
            price_change_24h: 1250.3,
            price_change_percentage_24h: 2.98,
            market_cap: 847000000000,
            total_volume: 23400000000,
            image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png'
          }
        ])
      })

      const request = new Request('http://localhost:3000/api/crypto?symbol=bitcoin')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('bitcoin')
      expect(data.data.name).toBe('Bitcoin')
      expect(typeof data.data.current_price).toBe('number')
    })

    it('should return fallback data for invalid symbol', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ([])
      })

      const request = new Request('http://localhost:3000/api/crypto?symbol=invalid')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data).toBeDefined()
      expect(data.data.current_price).toBeTypeOf('number')
    })

    it('should handle API HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429
      })

      const request = new Request('http://localhost:3000/api/crypto?symbol=bitcoin')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Using fallback data due to API error')
    })
  })
})
