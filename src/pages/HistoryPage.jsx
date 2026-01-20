import React from 'react'
import { motion } from 'framer-motion'
import SavedResultsTabs from '../components/SavedResultsTabs'

const HistoryPage = () => {
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
          <span className="text-sm font-semibold text-primary">Trading History</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Your Trading Records
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          View, search, and manage all your saved calculations and trade history
        </p>
      </div>

      {/* History Content */}
      <SavedResultsTabs />
    </motion.div>
  )
}

export default HistoryPage
