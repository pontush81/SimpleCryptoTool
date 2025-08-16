import { describe, it, expect } from 'vitest'
import { 
  calculateRSI, 
  calculateMACD, 
  generateTradingSignals, 
  getLatestSignal 
} from '../../lib/indicators'

describe('Technical Indicators', () => {
  const mockPrices = [
    42000, 42500, 41800, 43200, 44100, 43800, 42900, 43500, 44200, 43700,
    44800, 45200, 44600, 43900, 44700, 45100, 44300, 43600, 44900, 45400,
    44800, 43200, 44600, 45800, 46200, 45600, 44900, 45700, 46100, 45300
  ]

  describe('calculateRSI', () => {
    it('should calculate RSI values correctly', () => {
      const rsiResults = calculateRSI(mockPrices, 14)
      
      expect(rsiResults).toHaveLength(mockPrices.length)
      expect(rsiResults[0]).toBeNull() // First value should be null
      
      // Check that RSI values are within valid range (0-100)
      rsiResults.forEach((result, index) => {
        if (result !== null) {
          expect(result.value).toBeGreaterThanOrEqual(0)
          expect(result.value).toBeLessThanOrEqual(100)
          expect(result.signal).toBeOneOf(['bullish', 'bearish', 'neutral'])
        }
      })
    })

    it('should generate correct RSI signals', () => {
      const rsiResults = calculateRSI(mockPrices, 14)
      const validResults = rsiResults.filter(r => r !== null)
      
      validResults.forEach(result => {
        if (result.value > 70) {
          expect(result.signal).toBe('bearish') // Overbought
        } else if (result.value < 30) {
          expect(result.signal).toBe('bullish') // Oversold
        } else {
          expect(result.signal).toBe('neutral')
        }
      })
    })

    it('should handle edge cases', () => {
      // Test with minimal data
      const shortPrices = [100, 105, 102]
      const rsiResults = calculateRSI(shortPrices, 14)
      
      expect(rsiResults).toHaveLength(3)
      expect(rsiResults[0]).toBeNull()
    })
  })

  describe('calculateMACD', () => {
    it('should calculate MACD values correctly', () => {
      const macdResults = calculateMACD(mockPrices, 12, 26, 9)
      
      expect(macdResults).toHaveLength(mockPrices.length)
      
      // Check that MACD values are numbers
      macdResults.forEach((result, index) => {
        if (result !== null) {
          expect(typeof result.macd).toBe('number')
          expect(typeof result.signal).toBe('number')
          expect(typeof result.histogram).toBe('number')
          expect(result.crossover).toBeOneOf(['bullish', 'bearish', 'none'])
        }
      })
    })

    it('should detect MACD crossovers correctly', () => {
      const macdResults = calculateMACD(mockPrices, 12, 26, 9)
      const validResults = macdResults.filter(r => r !== null)
      
      validResults.forEach(result => {
        if (result.crossover === 'bullish') {
          expect(result.histogram).toBeGreaterThan(0)
        } else if (result.crossover === 'bearish') {
          expect(result.histogram).toBeLessThan(0)
        }
      })
    })

    it('should calculate histogram correctly', () => {
      const macdResults = calculateMACD(mockPrices, 12, 26, 9)
      const validResults = macdResults.filter(r => r !== null)
      
      validResults.forEach(result => {
        // Histogram should be MACD - Signal
        const expectedHistogram = result.macd - result.signal
        expect(Math.abs(result.histogram - expectedHistogram)).toBeLessThan(0.001)
      })
    })
  })

  describe('generateTradingSignals', () => {
    it('should generate trading signals based on RSI and MACD', () => {
      const rsiResults = calculateRSI(mockPrices, 14)
      const macdResults = calculateMACD(mockPrices, 12, 26, 9)
      const tradingSignals = generateTradingSignals(rsiResults, macdResults)
      
      expect(tradingSignals).toHaveLength(mockPrices.length)
      
      tradingSignals.forEach(signal => {
        if (signal !== null) {
          expect(signal.type).toBeOneOf(['buy', 'sell', 'hold'])
          expect(signal.strength).toBeGreaterThanOrEqual(0)
          expect(signal.strength).toBeLessThanOrEqual(100)
          expect(signal.confidence).toBeGreaterThanOrEqual(0)
          expect(signal.confidence).toBeLessThanOrEqual(100)
          expect(Array.isArray(signal.reasons)).toBe(true)
          expect(signal.timestamp).toBeDefined()
        }
      })
    })

    it('should generate buy signals for oversold conditions', () => {
      // Create mock data that should generate buy signals
      const oversoldRSI = Array(30).fill(null).map((_, i) => 
        i < 15 ? null : { value: 25, signal: 'bullish' as const }
      )
      const bullishMACD = Array(30).fill(null).map((_, i) => 
        i < 26 ? null : { macd: 100, signal: 50, histogram: 50, crossover: 'bullish' as const }
      )
      
      const signals = generateTradingSignals(oversoldRSI, bullishMACD)
      const validSignals = signals.filter(s => s !== null)
      
      // Should have some buy signals
      expect(validSignals.some(s => s.type === 'buy')).toBe(true)
    })

    it('should generate sell signals for overbought conditions', () => {
      // Create mock data that should generate sell signals
      const overboughtRSI = Array(30).fill(null).map((_, i) => 
        i < 15 ? null : { value: 80, signal: 'bearish' as const }
      )
      const bearishMACD = Array(30).fill(null).map((_, i) => 
        i < 26 ? null : { macd: -100, signal: -50, histogram: -50, crossover: 'bearish' as const }
      )
      
      const signals = generateTradingSignals(overboughtRSI, bearishMACD)
      const validSignals = signals.filter(s => s !== null)
      
      // Should have some sell signals
      expect(validSignals.some(s => s.type === 'sell')).toBe(true)
    })
  })

  describe('getLatestSignal', () => {
    it('should return the latest non-null signal', () => {
      const rsiResults = calculateRSI(mockPrices, 14)
      const macdResults = calculateMACD(mockPrices, 12, 26, 9)
      const tradingSignals = generateTradingSignals(rsiResults, macdResults)
      
      const latestSignal = getLatestSignal(tradingSignals)
      
      expect(latestSignal).not.toBeNull()
      expect(latestSignal?.type).toBeOneOf(['buy', 'sell', 'hold'])
      expect(latestSignal?.strength).toBeGreaterThanOrEqual(0)
      expect(latestSignal?.strength).toBeLessThanOrEqual(100)
    })

    it('should return null for empty signals array', () => {
      const latestSignal = getLatestSignal([])
      expect(latestSignal).toBeNull()
    })

    it('should return null for array with only null values', () => {
      const nullSignals = [null, null, null]
      const latestSignal = getLatestSignal(nullSignals)
      expect(latestSignal).toBeNull()
    })

    it('should return the last valid signal even if followed by nulls', () => {
      const mixedSignals = [
        null,
        { type: 'buy' as const, strength: 75, confidence: 80, reasons: ['test'], timestamp: '2023-01-01' },
        null,
        null
      ]
      
      const latestSignal = getLatestSignal(mixedSignals)
      expect(latestSignal).not.toBeNull()
      expect(latestSignal?.type).toBe('buy')
      expect(latestSignal?.strength).toBe(75)
    })
  })

  describe('Edge Cases', () => {
    it('should handle insufficient data gracefully', () => {
      const shortPrices = [100, 105]
      
      const rsiResults = calculateRSI(shortPrices, 14)
      const macdResults = calculateMACD(shortPrices, 12, 26, 9)
      
      expect(rsiResults.every(r => r === null)).toBe(true)
      expect(macdResults.every(r => r === null)).toBe(true)
    })

    it('should handle identical prices', () => {
      const flatPrices = Array(30).fill(100)
      
      const rsiResults = calculateRSI(flatPrices, 14)
      const macdResults = calculateMACD(flatPrices, 12, 26, 9)
      
      // Should not crash and should handle division by zero
      expect(rsiResults).toHaveLength(30)
      expect(macdResults).toHaveLength(30)
    })
  })
})
