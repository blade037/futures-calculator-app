import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import CalculatorCard from './components/CalculatorCard'
import ResultsPanel from './components/ResultsPanel'
import TaxCalculator from './components/TaxCalculator'
import InfoCards from './components/InfoCards'
import Footer from './components/Footer'

function App() {
  const [results, setResults] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative">
        <Header />
        
        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
              <span className="text-sm font-semibold text-primary">Multi-Symbol Futures Calculator</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Professional P&L Calculator
            </h2>
            <p className="text-xl text-textSecondary max-w-3xl mx-auto">
              Calculate profit/loss, manage margin requirements, and estimate tax liability for futures contracts
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <CalculatorCard 
                setResults={setResults}
              />
            </div>
            
            <div className="lg:col-span-1">
              <ResultsPanel results={results} />
            </div>
          </div>

          {/* Tax Calculator Section */}
          <div className="mb-12">
            <TaxCalculator />
          </div>

          <InfoCards />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
