import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, DollarSign } from 'lucide-react'
import CalculatorCard from '../components/CalculatorCard'
import ResultsPanel from '../components/ResultsPanel'
import TaxCalculator from '../components/TaxCalculator'

const CalculatorsPage = () => {
  const [results, setResults] = useState(null)
  const [activeCalculator, setActiveCalculator] = useState('profit-loss')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full"
        >
          <span className="text-sm font-semibold text-primary">Trading Calculators</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Calculate Your Results
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Professional tools for profit/loss calculations and tax estimations
        </p>
      </div>

      {/* Calculator Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="inline-flex gap-2 p-1 bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50">
          <button
            onClick={() => setActiveCalculator('profit-loss')}
            className={`relative px-8 py-4 rounded-xl font-semibold transition-all ${
              activeCalculator === 'profit-loss'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50'
                : 'text-textSecondary hover:text-text'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              <span>Profit/Loss Calculator</span>
            </div>
          </button>
          <button
            onClick={() => setActiveCalculator('tax')}
            className={`relative px-8 py-4 rounded-xl font-semibold transition-all ${
              activeCalculator === 'tax'
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/50'
                : 'text-textSecondary hover:text-text'
            }`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>Tax Calculator</span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Calculator Content */}
      <motion.div
        key={activeCalculator}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeCalculator === 'profit-loss' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CalculatorCard setResults={setResults} />
            </div>
            <div className="lg:col-span-1">
              <ResultsPanel results={results} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <TaxCalculator />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CalculatorsPage
