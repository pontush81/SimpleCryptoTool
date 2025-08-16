export interface PriceData {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface RSIResult {
  value: number
  signal: 'oversold' | 'overbought' | 'neutral'
  timestamp: string
}

export interface MACDResult {
  macd: number
  signal: number
  histogram: number
  crossover: 'bullish' | 'bearish' | 'none'
  timestamp: string
}

export interface CTOResult {
  value: number
  signal: 'bullish' | 'bearish' | 'neutral'
  crossover: 'bullish' | 'bearish' | 'none'
  timestamp: string
}

export interface TradingSignal {
  type: 'buy' | 'sell' | 'hold'
  strength: number
  confidence: number
  reasons: string[]
  timestamp: string
}

export function calculateRSI(prices: number[], period: number = 14): RSIResult[] {
  if (prices.length < period + 1) {
    return []
  }

  const results: RSIResult[] = []
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    gains.push(change > 0 ? change : 0)
    losses.push(change < 0 ? Math.abs(change) : 0)
  }

  for (let i = period - 1; i < gains.length; i++) {
    const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
    const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsi = 100 - (100 / (1 + rs))
    
    let signal: 'oversold' | 'overbought' | 'neutral' = 'neutral'
    if (rsi <= 30) signal = 'oversold'
    else if (rsi >= 70) signal = 'overbought'
    
    results.push({
      value: rsi,
      signal,
      timestamp: new Date().toISOString()
    })
  }

  return results
}

export function calculateEMA(prices: number[], period: number): number[] {
  if (prices.length < period) return []
  
  const multiplier = 2 / (period + 1)
  const ema: number[] = []
  
  ema[0] = prices.slice(0, period).reduce((a, b) => a + b, 0) / period
  
  for (let i = 1; i < prices.length - period + 1; i++) {
    ema[i] = (prices[i + period - 1] - ema[i - 1]) * multiplier + ema[i - 1]
  }
  
  return ema
}

export function calculateMACD(prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9): MACDResult[] {
  if (prices.length < slowPeriod + signalPeriod) {
    return []
  }

  const fastEMA = calculateEMA(prices, fastPeriod)
  const slowEMA = calculateEMA(prices, slowPeriod)
  
  if (fastEMA.length === 0 || slowEMA.length === 0) return []
  
  const macdLine: number[] = []
  const minLength = Math.min(fastEMA.length, slowEMA.length)
  
  for (let i = 0; i < minLength; i++) {
    macdLine.push(fastEMA[i] - slowEMA[i])
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod)
  const results: MACDResult[] = []
  
  for (let i = 0; i < signalLine.length; i++) {
    const histogram = macdLine[i] - signalLine[i]
    let crossover: 'bullish' | 'bearish' | 'none' = 'none'
    
    if (i > 0) {
      const prevHistogram = macdLine[i - 1] - signalLine[i - 1]
      if (prevHistogram <= 0 && histogram > 0) crossover = 'bullish'
      else if (prevHistogram >= 0 && histogram < 0) crossover = 'bearish'
    }
    
    results.push({
      macd: macdLine[i],
      signal: signalLine[i],
      histogram,
      crossover,
      timestamp: new Date().toISOString()
    })
  }
  
  return results
}

export function generateTradingSignals(rsi: RSIResult[], macd: MACDResult[]): TradingSignal[] {
  if (rsi.length === 0 || macd.length === 0) return []
  
  const signals: TradingSignal[] = []
  const minLength = Math.min(rsi.length, macd.length)
  
  for (let i = 0; i < minLength; i++) {
    const currentRSI = rsi[i]
    const currentMACD = macd[i]
    
    let type: 'buy' | 'sell' | 'hold' = 'hold'
    let strength = 50
    let confidence = 50
    const reasons: string[] = []
    
    if (currentRSI.signal === 'oversold' && currentMACD.crossover === 'bullish') {
      type = 'buy'
      strength = 80
      confidence = 75
      reasons.push('RSI oversold', 'MACD bullish crossover')
    } else if (currentRSI.signal === 'overbought' && currentMACD.crossover === 'bearish') {
      type = 'sell'
      strength = 80
      confidence = 75
      reasons.push('RSI overbought', 'MACD bearish crossover')
    } else if (currentRSI.signal === 'oversold') {
      type = 'buy'
      strength = 60
      confidence = 60
      reasons.push('RSI oversold')
    } else if (currentRSI.signal === 'overbought') {
      type = 'sell'
      strength = 60
      confidence = 60
      reasons.push('RSI overbought')
    }
    
    signals.push({
      type,
      strength,
      confidence,
      reasons,
      timestamp: new Date().toISOString()
    })
  }
  
  return signals
}

export function getLatestSignal(signals: TradingSignal[]): TradingSignal | null {
  return signals.length > 0 ? signals[signals.length - 1] : null
}
