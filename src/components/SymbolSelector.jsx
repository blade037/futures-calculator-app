import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ChevronDown } from 'lucide-react'

const SymbolSelector = ({ selectedSymbol, onSymbolChange, contracts }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-textSecondary mb-2">
        Select Futures Contract
      </label>
      <div className="relative">
        <select
          value={selectedSymbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          className="w-full px-4 py-3 pr-10 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer font-semibold"
        >
          {contracts.map((contract) => (
            <option key={contract.symbol} value={contract.symbol}>
              {contract.symbol} - {contract.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary pointer-events-none" />
      </div>
      
      {/* Contract Quick Info */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="bg-background/50 border border-border/30 rounded-lg p-2 text-center">
          <div className="text-textSecondary mb-1">Tick Size</div>
          <div className="font-semibold text-primary">
            {contracts.find(c => c.symbol === selectedSymbol)?.tickSize} pts
          </div>
        </div>
        <div className="bg-background/50 border border-border/30 rounded-lg p-2 text-center">
          <div className="text-textSecondary mb-1">Tick Value</div>
          <div className="font-semibold text-secondary">
            ${contracts.find(c => c.symbol === selectedSymbol)?.tickValue}
          </div>
        </div>
        <div className="bg-background/50 border border-border/30 rounded-lg p-2 text-center">
          <div className="text-textSecondary mb-1">Multiplier</div>
          <div className="font-semibold text-accent">
            ${contracts.find(c => c.symbol === selectedSymbol)?.contractMultiplier}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SymbolSelector
