import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle, Save, Check, Wallet } from 'lucide-react'

const ResultsPanel = ({ results }) => {
  const [saveStatus, setSaveStatus] = useState(null)

  const handleSave = () => {
    if (!results) return

    const timestamp = new Date().toISOString()
    const savedData = {
      timestamp,
      calculationType: 'profit-loss',
      results,
      formattedDate: new Date().toLocaleString()
    }

    // Get existing saved results
    const existingSaves = JSON.parse(localStorage.getItem('futuresCalculatorResults') || '[]')
    
    // Add new result
    existingSaves.unshift(savedData)
    
    // Keep only last 50 results
    const trimmedSaves = existingSaves.slice(0, 50)
    
    // Save to localStorage
    localStorage.setItem('futuresCalculatorResults', JSON.stringify(trimmedSaves))

    // Show success feedback
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 2000)
  }

  if (!results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl h-full flex items-center justify-center"
      >
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-textSecondary/30 mx-auto mb-4" />
          <p className="text-textSecondary">Enter values and click Calculate to see results</p>
        </div>
      </motion.div>
    )
  }

  // Safety check for contractSpecs
  if (!results.contractSpecs) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
      >
        <div className="text-center text-error">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>Error: Contract specifications missing</p>
        </div>
      </motion.div>
    )
  }

  const balancePercentage = results.startingBalance > 0 
    ? (results.remainingBalance / results.startingBalance) * 100 
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Results</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl transition-all"
        >
          <AnimatePresence mode="wait">
            {saveStatus === 'saved' ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Saved!</span>
              </motion.div>
            ) : (
              <motion.div
                key="save"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm font-semibold">Save</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className="space-y-4">
        {/* Profit/Loss Card - Full Width */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`p-6 rounded-xl border transition-all bg-gradient-to-br ${
            results.isProfit 
              ? 'from-success/20 to-success/5 border-success/50' 
              : 'from-error/20 to-error/5 border-error/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-textSecondary font-medium">Profit/Loss</span>
            {results.isProfit ? (
              <TrendingUp className="w-5 h-5 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-error" />
            )}
          </div>
          <p className={`text-4xl font-bold ${results.isProfit ? 'text-success' : 'text-error'}`}>
            ${(results.profitLoss || 0).toFixed(2)}
          </p>
        </motion.div>

        {/* Margin Balance Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 rounded-xl border bg-gradient-to-br from-primary/20 to-primary/5 border-primary/50"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Total Margin Balance</span>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              balancePercentage > 50 ? 'bg-success/20 text-success' :
              balancePercentage > 25 ? 'bg-warning/20 text-warning' :
              'bg-error/20 text-error'
            }`}>
              {balancePercentage.toFixed(1)}%
            </span>
          </div>
          
          <p className="text-4xl font-bold text-primary mb-4">
            ${(results.remainingBalance || 0).toLocaleString()}
          </p>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, balancePercentage))}%` }}
                transition={{ duration: 0.5 }}
                className={`h-full rounded-full ${
                  balancePercentage > 50 ? 'bg-success' :
                  balancePercentage > 25 ? 'bg-warning' :
                  'bg-error'
                }`}
              />
            </div>
          </div>

          {/* Balance Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/30 rounded-lg p-3">
              <p className="text-xs text-textSecondary mb-1">Starting Balance</p>
              <p className="text-lg font-semibold">${(results.startingBalance || 0).toLocaleString()}</p>
            </div>
            <div className="bg-background/30 rounded-lg p-3">
              <p className="text-xs text-textSecondary mb-1">Margin Used</p>
              <p className="text-lg font-semibold text-warning">-${(results.marginUsed || 0).toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Contract Specs Card */}
        <ContractSpecsCard specs={results.contractSpecs} />
      </div>
    </motion.div>
  )
}

const ContractSpecsCard = ({ specs }) => {
  if (!specs) return null
  
  return (
    <div className="bg-background/30 border border-border/20 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-textSecondary mb-3">
        {specs.symbol} - {specs.name}
      </h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-textSecondary">Tick Size:</span>
          <span className="ml-2 font-semibold">{specs.tickSize} pts</span>
        </div>
        <div>
          <span className="text-textSecondary">Tick Value:</span>
          <span className="ml-2 font-semibold">${specs.tickValue}</span>
        </div>
        <div>
          <span className="text-textSecondary">Multiplier:</span>
          <span className="ml-2 font-semibold">${specs.contractMultiplier} per point</span>
        </div>
        <div>
          <span className="text-textSecondary">Margin Required:</span>
          <span className="ml-2 font-semibold">${specs.typicalMargin.toLocaleString()} per contract</span>
        </div>
      </div>
    </div>
  )
}

export default ResultsPanel
