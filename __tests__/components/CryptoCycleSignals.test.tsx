import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CryptoCycleSignals from '../../components/CryptoCycleSignals'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('CryptoCycleSignals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state initially', () => {
    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    expect(screen.getByText('Laddar signaler...')).toBeInTheDocument()
  })

  it('should display buy signal correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        symbol: 'bitcoin',
        current_price: 43250,
        trading_signal: {
          type: 'buy',
          strength: 75,
          confidence: 80,
          reasons: ['RSI indicates oversold conditions', 'MACD bullish crossover'],
          timestamp: new Date().toISOString()
        },
        indicators: {
          rsi: { value: 65, signal: 'bullish' },
          macd: { value: 150, signal: 120, histogram: 30, crossover: 'bullish' }
        }
      })
    })

    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText('KÖPLÄGE')).toBeInTheDocument()
    })

    expect(screen.getByText('75% Styrka')).toBeInTheDocument()
    expect(screen.getByText('80% Säkerhet')).toBeInTheDocument()
    expect(screen.getByText('RSI indicates oversold conditions')).toBeInTheDocument()
  })

  it('should display sell signal correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        symbol: 'bitcoin',
        current_price: 43250,
        trading_signal: {
          type: 'sell',
          strength: 85,
          confidence: 90,
          reasons: ['RSI indicates overbought conditions'],
          timestamp: new Date().toISOString()
        },
        indicators: {
          rsi: { value: 80, signal: 'bearish' },
          macd: { value: -50, signal: -30, histogram: -20, crossover: 'bearish' }
        }
      })
    })

    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText('SÄLJLÄGE')).toBeInTheDocument()
    })

    expect(screen.getByText('85% Styrka')).toBeInTheDocument()
    expect(screen.getByText('90% Säkerhet')).toBeInTheDocument()
  })

  it('should display hold signal correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        symbol: 'bitcoin',
        current_price: 43250,
        trading_signal: {
          type: 'hold',
          strength: 50,
          confidence: 60,
          reasons: ['Neutral market conditions'],
          timestamp: new Date().toISOString()
        },
        indicators: {
          rsi: { value: 50, signal: 'neutral' },
          macd: { value: 0, signal: 0, histogram: 0, crossover: 'none' }
        }
      })
    })

    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText('VÄNTA')).toBeInTheDocument()
    })

    expect(screen.getByText('50% Styrka')).toBeInTheDocument()
    expect(screen.getByText('60% Säkerhet')).toBeInTheDocument()
  })

  it('should display market temperature indicators', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        symbol: 'bitcoin',
        current_price: 43250,
        trading_signal: {
          type: 'buy',
          strength: 75,
          confidence: 80,
          reasons: ['Test reason'],
          timestamp: new Date().toISOString()
        },
        indicators: {
          rsi: { value: 65, signal: 'bullish' },
          macd: { value: 150, signal: 120, histogram: 30, crossover: 'bullish' }
        }
      })
    })

    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText('Marknadstemperatur')).toBeInTheDocument()
    })

    // Should show temperature based on RSI value (65 = VARMT)
    expect(screen.getByText('🌡️ VARMT')).toBeInTheDocument()
  })

  it('should handle API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'))

    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText('Fel vid laddning av signaler')).toBeInTheDocument()
    })
  })

  it('should update when symbol changes', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          symbol: 'bitcoin',
          trading_signal: { type: 'buy', strength: 75, confidence: 80, reasons: ['Bitcoin reason'], timestamp: new Date().toISOString() },
          indicators: { rsi: { value: 65, signal: 'bullish' }, macd: { value: 150, signal: 120, histogram: 30, crossover: 'bullish' } }
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          symbol: 'ethereum',
          trading_signal: { type: 'sell', strength: 85, confidence: 90, reasons: ['Ethereum reason'], timestamp: new Date().toISOString() },
          indicators: { rsi: { value: 80, signal: 'bearish' }, macd: { value: -50, signal: -30, histogram: -20, crossover: 'bearish' } }
        })
      })

    const { rerender } = render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText('KÖPLÄGE')).toBeInTheDocument()
    })

    rerender(<CryptoCycleSignals symbol="ethereum" />)
    
    await waitFor(() => {
      expect(screen.getByText('SÄLJLÄGE')).toBeInTheDocument()
    })
  })

  it('should display current price', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        symbol: 'bitcoin',
        current_price: 43250.50,
        trading_signal: { type: 'buy', strength: 75, confidence: 80, reasons: ['Test'], timestamp: new Date().toISOString() },
        indicators: { rsi: { value: 65, signal: 'bullish' }, macd: { value: 150, signal: 120, histogram: 30, crossover: 'bullish' } }
      })
    })

    render(<CryptoCycleSignals symbol="bitcoin" />)
    
    await waitFor(() => {
      expect(screen.getByText(/\$43,250\.50/)).toBeInTheDocument()
    })
  })
})
