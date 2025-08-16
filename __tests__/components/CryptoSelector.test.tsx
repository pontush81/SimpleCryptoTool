import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CryptoSelector from '../../components/CryptoSelector'

describe('CryptoSelector', () => {
  const mockOnCryptoChange = vi.fn()
  
  const mockCryptoData = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'btc',
      current_price: 43250,
      price_change_percentage_24h: 2.98,
      image: 'https://example.com/bitcoin.png'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'eth',
      current_price: 2650,
      price_change_percentage_24h: -1.68,
      image: 'https://example.com/ethereum.png'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render crypto selector with data', () => {
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    expect(screen.getByText('Bitcoin')).toBeInTheDocument()
    expect(screen.getByText('$43,250.00')).toBeInTheDocument()
  })

  it('should display price change percentage with correct styling', () => {
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    // Positive change should be green
    const positiveChange = screen.getByText('+2.98%')
    expect(positiveChange).toBeInTheDocument()
    expect(positiveChange).toHaveClass('text-green-600')
  })

  it('should open dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    const selector = screen.getByRole('button')
    await user.click(selector)
    
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
  })

  it('should call onCryptoChange when crypto is selected', async () => {
    const user = userEvent.setup()
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    // Open dropdown
    const selector = screen.getByRole('button')
    await user.click(selector)
    
    // Select Ethereum
    const ethereumOption = screen.getByText('Ethereum')
    await user.click(ethereumOption)
    
    expect(mockOnCryptoChange).toHaveBeenCalledWith('ethereum')
  })

  it('should close dropdown after selection', async () => {
    const user = userEvent.setup()
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    // Open dropdown
    const selector = screen.getByRole('button')
    await user.click(selector)
    
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
    
    // Select Ethereum
    const ethereumOption = screen.getByText('Ethereum')
    await user.click(ethereumOption)
    
    // Dropdown should close - Ethereum should not be visible in dropdown anymore
    await waitFor(() => {
      const dropdownEthereum = screen.queryAllByText('Ethereum')
      // Should only have one instance (the selected one), not the dropdown option
      expect(dropdownEthereum).toHaveLength(1)
    })
  })

  it('should display negative price change with red styling', () => {
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="ethereum"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    const negativeChange = screen.getByText('-1.68%')
    expect(negativeChange).toBeInTheDocument()
    expect(negativeChange).toHaveClass('text-red-600')
  })

  it('should handle empty crypto data gracefully', () => {
    render(
      <CryptoSelector 
        cryptoData={[]}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    // Should render without crashing
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should format prices correctly', () => {
    const cryptoWithDecimalPrice = [{
      id: 'cardano',
      name: 'Cardano',
      symbol: 'ada',
      current_price: 0.3456,
      price_change_percentage_24h: 5.23,
      image: 'https://example.com/cardano.png'
    }]

    render(
      <CryptoSelector 
        cryptoData={cryptoWithDecimalPrice}
        selectedCrypto="cardano"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    // Should format small prices with more decimals
    expect(screen.getByText('$0.3456')).toBeInTheDocument()
  })

  it('should show trending icons for price changes', () => {
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    // Should have trending up icon for positive change
    const trendingUpIcon = document.querySelector('[data-lucide="trending-up"]')
    expect(trendingUpIcon).toBeInTheDocument()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    render(
      <CryptoSelector 
        cryptoData={mockCryptoData}
        selectedCrypto="bitcoin"
        onCryptoChange={mockOnCryptoChange}
      />
    )
    
    const selector = screen.getByRole('button')
    
    // Should be focusable
    await user.tab()
    expect(selector).toHaveFocus()
    
    // Should open with Enter
    await user.keyboard('{Enter}')
    expect(screen.getByText('Ethereum')).toBeInTheDocument()
  })
})
