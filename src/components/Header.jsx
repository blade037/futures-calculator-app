import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Calculator } from 'lucide-react'

const Header = () => {
  return (
    <header className="relative overflow-hidden border-b border-border/50 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
      
      <div className="container mx-auto px-4 py-8 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-primary to-secondary p-3 rounded-2xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Futures Calculator
              </h1>
              <p className="text-sm text-textSecondary">Advanced Trading Analytics</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-surface/50 rounded-xl border border-border/50"
            >
              <TrendingUp className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Live Markets</span>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-surface/50 rounded-xl border border-border/50"
            >
              <BarChart3 className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium">Analytics</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default Header
