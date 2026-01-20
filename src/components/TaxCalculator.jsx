import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, TrendingUp, TrendingDown, DollarSign, Percent, Info, MapPin } from 'lucide-react'

const TaxCalculator = () => {
  const [profitLoss, setProfitLoss] = useState('')
  const [includeCAState, setIncludeCAState] = useState(false)
  const [results, setResults] = useState(null)

  // Federal tax rates (Section 1256)
  const LONG_TERM_RATE = 0.20  // 20%
  const SHORT_TERM_RATE = 0.38 // 38%
  
  // California state tax rate
  const CA_STATE_RATE = 0.133 // 13.3% (highest bracket)

  const calculateTax = () => {
    const amount = parseFloat(profitLoss) || 0
    
    if (amount === 0) {
      setResults(null)
      return
    }

    // Section 1256: 60% long-term, 40% short-term
    const longTermPortion = amount * 0.60
    const shortTermPortion = amount * 0.40

    // Calculate federal taxes on each portion
    const longTermTax = longTermPortion * LONG_TERM_RATE
    const shortTermTax = shortTermPortion * SHORT_TERM_RATE
    const totalFederalTax = longTermTax + shortTermTax

    // Calculate CA state tax if enabled
    const caStateTax = includeCAState ? amount * CA_STATE_RATE : 0

    // Total tax liability (federal + state)
    const totalTax = totalFederalTax + caStateTax

    // Effective tax rate
    const effectiveRate = amount !== 0 ? (totalTax / amount) * 100 : 0
    const federalEffectiveRate = amount !== 0 ? (totalFederalTax / amount) * 100 : 0
    const stateEffectiveRate = amount !== 0 ? (caStateTax / amount) * 100 : 0

    // After-tax profit/loss
    const afterTax = amount - totalTax

    setResults({
      amount,
      longTermPortion,
      shortTermPortion,
      longTermTax,
      shortTermTax,
      totalFederalTax,
      caStateTax,
      totalTax,
      effectiveRate,
      federalEffectiveRate,
      stateEffectiveRate,
      afterTax,
      isProfit: amount > 0,
      includeCAState
    })
  }

  const handleInputChange = (e) => {
    setProfitLoss(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      calculateTax()
    }
  }

  const handleStateToggle = () => {
    setIncludeCAState(!includeCAState)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-accent to-secondary rounded-xl">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Section 1256 Tax Calculator</h3>
          <p className="text-sm text-textSecondary">60/40 Tax Treatment for Futures</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-primary font-semibold mb-1">How Section 1256 Works:</p>
            <ul className="text-textSecondary space-y-1">
              <li>• 60% taxed as long-term capital gains (20%)</li>
              <li>• 40% taxed as short-term capital gains (38%)</li>
              <li>• Applies regardless of holding period</li>
              <li>• Mark-to-market on December 31st</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-textSecondary mb-2">
          Total Profit/Loss from Futures Trading
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary text-lg">$</span>
          <input
            type="number"
            value={profitLoss}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter profit or loss amount"
            step="0.01"
            className="w-full pl-10 pr-4 py-4 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors text-lg"
          />
        </div>
        <p className="text-xs text-textSecondary mt-2">
          Enter positive number for profit, negative for loss
        </p>
      </div>

      {/* CA State Tax Toggle */}
      <div className="mb-6 p-4 bg-background/30 border border-border/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-secondary" />
            <div>
              <p className="font-semibold text-sm">California State Tax</p>
              <p className="text-xs text-textSecondary">Add CA state tax (13.3%)</p>
            </div>
          </div>
          <button
            onClick={handleStateToggle}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
              includeCAState ? 'bg-secondary' : 'bg-border'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                includeCAState ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Calculate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculateTax}
        className="w-full py-4 bg-gradient-to-r from-accent to-secondary rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-accent/50 transition-all mb-6"
      >
        Calculate Tax Liability
      </motion.button>

      {/* Results Section */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Total Tax Card */}
          <div className={`p-6 rounded-xl border bg-gradient-to-br ${
            results.isProfit 
              ? 'from-warning/20 to-warning/5 border-warning/50' 
              : 'from-success/20 to-success/5 border-success/50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-textSecondary font-medium">
                {results.isProfit ? 'Total Tax Liability' : 'Total Tax Benefit'}
              </span>
              {results.isProfit ? (
                <TrendingDown className="w-5 h-5 text-warning" />
              ) : (
                <TrendingUp className="w-5 h-5 text-success" />
              )}
            </div>
            <p className={`text-4xl font-bold ${results.isProfit ? 'text-warning' : 'text-success'}`}>
              {results.isProfit ? '-' : '+'}${Math.abs(results.totalTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Percent className="w-4 h-4 text-textSecondary" />
              <span className="text-sm text-textSecondary">
                Effective Rate: <span className="font-semibold">{Math.abs(results.effectiveRate).toFixed(2)}%</span>
              </span>
            </div>
            {results.includeCAState && (
              <div className="mt-2 pt-3 border-t border-border/20">
                <div className="flex justify-between text-xs">
                  <span className="text-textSecondary">Federal: {Math.abs(results.federalEffectiveRate).toFixed(2)}%</span>
                  <span className="text-textSecondary">CA State: {Math.abs(results.stateEffectiveRate).toFixed(2)}%</span>
                </div>
              </div>
            )}
          </div>

          {/* After-Tax Amount */}
          <div className={`p-6 rounded-xl border bg-gradient-to-br ${
            results.afterTax >= 0
              ? 'from-success/20 to-success/5 border-success/50' 
              : 'from-error/20 to-error/5 border-error/50'
          }`}>
            <span className="text-sm text-textSecondary font-medium block mb-2">
              After-Tax {results.afterTax >= 0 ? 'Profit' : 'Loss'}
            </span>
            <p className={`text-3xl font-bold ${results.afterTax >= 0 ? 'text-success' : 'text-error'}`}>
              ${results.afterTax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Tax Breakdown */}
          <div className="bg-background/30 border border-border/20 rounded-xl p-5">
            <h4 className="text-sm font-semibold text-textSecondary mb-4">Tax Breakdown</h4>
            
            <div className="space-y-4">
              {/* Original Amount */}
              <div className="flex justify-between items-center pb-3 border-b border-border/20">
                <span className="text-sm text-textSecondary">Original {results.isProfit ? 'Profit' : 'Loss'}</span>
                <span className="font-semibold">
                  ${Math.abs(results.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Federal Tax Section */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Federal Tax (Section 1256)</p>
                
                {/* Long-Term Portion */}
                <div className="space-y-2 pl-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-textSecondary">Long-Term (60%)</span>
                    <span className="text-sm font-medium">
                      ${Math.abs(results.longTermPortion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <span className="text-xs text-textSecondary">Tax @ 20%</span>
                    <span className="text-sm font-semibold text-primary">
                      ${Math.abs(results.longTermTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Short-Term Portion */}
                <div className="space-y-2 pl-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-textSecondary">Short-Term (40%)</span>
                    <span className="text-sm font-medium">
                      ${Math.abs(results.shortTermPortion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <span className="text-xs text-textSecondary">Tax @ 38%</span>
                    <span className="text-sm font-semibold text-secondary">
                      ${Math.abs(results.shortTermTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Federal Subtotal */}
                <div className="flex justify-between items-center pt-2 border-t border-border/10">
                  <span className="text-sm font-semibold text-textSecondary">Federal Subtotal</span>
                  <span className="font-bold text-primary">
                    {results.isProfit ? '-' : '+'}${Math.abs(results.totalFederalTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* CA State Tax Section */}
              {results.includeCAState && (
                <div className="space-y-3 pt-3 border-t border-border/20">
                  <p className="text-xs font-semibold text-secondary uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    California State Tax
                  </p>
                  <div className="flex justify-between items-center pl-3">
                    <span className="text-sm text-textSecondary">State Tax @ 13.3%</span>
                    <span className="font-bold text-secondary">
                      {results.isProfit ? '-' : '+'}${Math.abs(results.caStateTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Tax */}
              <div className="flex justify-between items-center pt-3 border-t border-border/20">
                <span className="text-sm font-semibold">Total Tax {results.isProfit ? 'Owed' : 'Benefit'}</span>
                <span className={`font-bold text-lg ${results.isProfit ? 'text-warning' : 'text-success'}`}>
                  {results.isProfit ? '-' : '+'}${Math.abs(results.totalTax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Tax Rates Info */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-primary mb-3">Tax Rates Applied</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-textSecondary">Federal Long-Term:</span>
                <span className="font-semibold">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-textSecondary">Federal Short-Term:</span>
                <span className="font-semibold">38%</span>
              </div>
              {results.includeCAState && (
                <div className="flex justify-between pt-2 border-t border-border/20">
                  <span className="text-textSecondary flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    CA State:
                  </span>
                  <span className="font-semibold text-secondary">13.3%</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TaxCalculator
