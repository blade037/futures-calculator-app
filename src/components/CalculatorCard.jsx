import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Edit2, Save, X, Wallet } from 'lucide-react'
import SymbolSelector from './SymbolSelector'
import { getContractById, getContractList } from '../data/contractSpecs'

const CalculatorCard = ({ setResults }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('/MES')
  const [contractSpecs, setContractSpecs] = useState(getContractById('MES'))
  const contracts = getContractList()

  const [formData, setFormData] = useState({
    entryPrice: contractSpecs.defaultEntry,
    exitPrice: contractSpecs.defaultExit,
    contracts: '1',
  })

  // Margin Balance state - stores the STARTING balance
  const [isEditingBalance, setIsEditingBalance] = useState(false)
  const [startingBalance, setStartingBalance] = useState(25000) // Default starting balance
  const [tempBalanceValue, setTempBalanceValue] = useState('')

  // Calculate margin used
  const calculateMarginUsed = () => {
    const numContracts = parseFloat(formData.contracts) || 0
    return numContracts * contractSpecs.typicalMargin
  }

  // Calculate remaining balance (inverse relationship)
  const calculateRemainingBalance = () => {
    return startingBalance - calculateMarginUsed()
  }

  // Update contract specs and form defaults when symbol changes
  useEffect(() => {
    const symbolKey = selectedSymbol.replace('/', '')
    const newSpecs = getContractById(symbolKey)
    setContractSpecs(newSpecs)
    
    // Update form with new defaults
    setFormData(prev => ({
      ...prev,
      entryPrice: newSpecs.defaultEntry,
      exitPrice: newSpecs.defaultExit,
    }))
    
    // Reset editing state when changing symbols
    setIsEditingBalance(false)
    
    // Clear results when changing symbols
    setResults(null)
  }, [selectedSymbol, setResults])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditBalance = () => {
    setTempBalanceValue(startingBalance.toString())
    setIsEditingBalance(true)
  }

  const handleSaveBalance = () => {
    const newBalance = parseFloat(tempBalanceValue) || 25000
    setStartingBalance(newBalance)
    setIsEditingBalance(false)
  }

  const handleCancelEdit = () => {
    setIsEditingBalance(false)
    setTempBalanceValue('')
  }

  const handleResetBalance = () => {
    setStartingBalance(25000)
    setIsEditingBalance(false)
  }

  const calculateResults = () => {
    const entry = parseFloat(formData.entryPrice) || 0
    const exit = parseFloat(formData.exitPrice) || 0
    const contracts = parseFloat(formData.contracts) || 0

    const pointDiff = exit - entry
    const ticks = pointDiff / contractSpecs.tickSize
    const profitLoss = pointDiff * contracts * contractSpecs.contractMultiplier
    const profitLossPct = entry > 0 ? (pointDiff / entry) * 100 : 0
    const marginUsed = calculateMarginUsed()
    const remainingBalance = calculateRemainingBalance()
    
    const result = {
      profitLoss,
      profitLossPct,
      pointDiff,
      ticks,
      totalValue: exit * contracts * contractSpecs.contractMultiplier,
      marginUsed,
      remainingBalance,
      startingBalance,
      isProfit: profitLoss >= 0,
      contractSpecs,
      // Add these for saving to database
      entryPrice: entry,
      exitPrice: exit,
      numContracts: contracts
    }

    setResults(result)
  }

  const marginUsed = calculateMarginUsed()
  const remainingBalance = calculateRemainingBalance()
  const balancePercentage = startingBalance > 0 ? (remainingBalance / startingBalance) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Profit/Loss Calculator</h3>
          <p className="text-sm text-textSecondary">{contractSpecs.symbol} - {contractSpecs.name}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <SymbolSelector 
            selectedSymbol={selectedSymbol}
            onSymbolChange={setSelectedSymbol}
            contracts={contracts}
          />
        </div>
        
        <InputField
          label="Entry Price (Index Points)"
          name="entryPrice"
          value={formData.entryPrice}
          onChange={handleInputChange}
          placeholder={contractSpecs.defaultEntry}
          step={contractSpecs.tickSize.toString()}
        />
        
        <InputField
          label="Exit Price (Index Points)"
          name="exitPrice"
          value={formData.exitPrice}
          onChange={handleInputChange}
          placeholder={contractSpecs.defaultExit}
          step={contractSpecs.tickSize.toString()}
        />
        
        <div>
          <InputField
            label="Number of Contracts"
            name="contracts"
            value={formData.contracts}
            onChange={handleInputChange}
            placeholder="1"
            step="1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-textSecondary mb-2">
            Margin Used
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-warning/10 border border-warning/30 rounded-xl">
            <Calculator className="w-5 h-5 text-warning flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xl font-bold text-warning">
                ${marginUsed.toLocaleString()}
              </p>
              <p className="text-xs text-textSecondary mt-0.5">
                ${contractSpecs.typicalMargin.toLocaleString()} per contract
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-textSecondary mb-2">
            Total Margin Balance
          </label>
          {isEditingBalance ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary">$</span>
                <input
                  type="number"
                  value={tempBalanceValue}
                  onChange={(e) => setTempBalanceValue(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-background border border-primary rounded-xl focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter starting balance"
                  autoFocus
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveBalance}
                className="p-3 bg-success hover:bg-success/80 rounded-xl transition-colors"
                title="Save"
              >
                <Save className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancelEdit}
                className="p-3 bg-error/20 hover:bg-error/30 border border-error/50 rounded-xl transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5 text-error" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-4 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Wallet className="w-6 h-6 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-primary">
                      ${remainingBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-textSecondary mt-1">
                      Remaining Balance
                    </p>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-3">
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
                  <p className="text-xs text-textSecondary mt-1 text-right">
                    {balancePercentage.toFixed(1)}% remaining
                  </p>
                </div>

                {/* Balance Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-background/30 rounded-lg p-2">
                    <p className="text-xs text-textSecondary">Starting Balance</p>
                    <p className="font-semibold">${startingBalance.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/30 rounded-lg p-2">
                    <p className="text-xs text-textSecondary">Margin Used</p>
                    <p className="font-semibold text-warning">-${marginUsed.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditBalance}
                  className="p-3 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-xl transition-colors"
                  title="Edit Starting Balance"
                >
                  <Edit2 className="w-5 h-5 text-primary" />
                </motion.button>
                {startingBalance !== 25000 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleResetBalance}
                    className="p-3 bg-warning/20 hover:bg-warning/30 border border-warning/50 rounded-xl transition-colors"
                    title="Reset to $25,000"
                  >
                    <X className="w-5 h-5 text-warning" />
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculateResults}
        className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all"
      >
        Calculate Results
      </motion.button>
    </motion.div>
  )
}

const InputField = ({ label, name, value, onChange, placeholder, step = "any" }) => (
  <div>
    <label className="block text-sm font-medium text-textSecondary mb-2">
      {label}
    </label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      className="w-full px-4 py-3 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors"
    />
  </div>
)

export default CalculatorCard
