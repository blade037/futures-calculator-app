import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, DollarSign, TrendingUp, Download, Search, X, Trash2, BarChart3, MapPin } from 'lucide-react'
import { taxDB } from '../utils/database'
import { profitLossDB } from '../utils/profitLossDatabase'

const SavedResultsTabs = () => {
  const [activeTab, setActiveTab] = useState('trades')
  const [taxHistory, setTaxHistory] = useState([])
  const [tradeHistory, setTradeHistory] = useState([])
  const [tradeStats, setTradeStats] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTaxHistory, setFilteredTaxHistory] = useState([])
  const [filteredTradeHistory, setFilteredTradeHistory] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      handleSearch()
    } else {
      setFilteredTaxHistory(taxHistory)
      setFilteredTradeHistory(tradeHistory)
    }
  }, [searchTerm, taxHistory, tradeHistory])

  const loadData = async () => {
    try {
      const [taxes, trades, stats] = await Promise.all([
        taxDB.getAllCalculations(),
        profitLossDB.getAllCalculations(),
        profitLossDB.getStatistics()
      ])
      setTaxHistory(taxes)
      setTradeHistory(trades)
      setTradeStats(stats)
      setFilteredTaxHistory(taxes)
      setFilteredTradeHistory(trades)
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setFilteredTaxHistory(taxHistory)
      setFilteredTradeHistory(tradeHistory)
      return
    }

    try {
      if (activeTab === 'taxes') {
        const results = await taxDB.searchCalculations(searchTerm)
        setFilteredTaxHistory(results)
      } else {
        const results = await profitLossDB.searchCalculations(searchTerm)
        setFilteredTradeHistory(results)
      }
    } catch (error) {
      console.error('Failed to search:', error)
    }
  }

  const handleDeleteTax = async (id) => {
    if (!confirm('Are you sure you want to delete this tax calculation?')) return
    try {
      await taxDB.deleteCalculation(id)
      loadData()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleDeleteTrade = async (id) => {
    if (!confirm('Are you sure you want to delete this trade?')) return
    try {
      await profitLossDB.deleteCalculation(id)
      loadData()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleExportTaxes = async () => {
    try {
      const data = await taxDB.exportData()
      downloadJSON(data, 'tax-calculations')
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }

  const handleExportTrades = async () => {
    try {
      const data = await profitLossDB.exportData()
      downloadJSON(data, 'profit-loss-history')
    } catch (error) {
      console.error('Failed to export:', error)
    }
  }

  const downloadJSON = (data, filename) => {
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const tabs = [
    { id: 'trades', label: 'Trade History', icon: TrendingUp, count: tradeHistory.length },
    { id: 'taxes', label: 'Tax History', icon: DollarSign, count: taxHistory.length }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Saved Results</h3>
              <p className="text-sm text-textSecondary">
                {activeTab === 'trades' ? tradeHistory.length : taxHistory.length} saved records
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={activeTab === 'trades' ? handleExportTrades : handleExportTaxes}
            className="flex items-center gap-2 px-4 py-2 bg-success/10 hover:bg-success/20 border border-success/30 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-semibold">Export</span>
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border/30">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-textSecondary hover:text-text'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-background/50 text-textSecondary'
                  }`}>
                    {tab.count}
                  </span>
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Statistics Panel - Only for Trades */}
        {activeTab === 'trades' && tradeStats && tradeStats.total_trades > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-5 bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold">Trading Statistics</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-xs text-textSecondary mb-1">Total Trades</p>
                <p className="text-2xl font-bold">{tradeStats.total_trades}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-xs text-textSecondary mb-1">Win Rate</p>
                <p className="text-2xl font-bold text-success">
                  {((tradeStats.winning_trades / tradeStats.total_trades) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-xs text-textSecondary mb-1">Total P/L</p>
                <p className={`text-2xl font-bold ${tradeStats.total_profit_loss >= 0 ? 'text-success' : 'text-error'}`}>
                  ${tradeStats.total_profit_loss.toFixed(2)}
                </p>
              </div>
              <div className="bg-background/30 rounded-lg p-3">
                <p className="text-xs text-textSecondary mb-1">Avg P/L</p>
                <p className={`text-2xl font-bold ${tradeStats.avg_profit_loss >= 0 ? 'text-success' : 'text-error'}`}>
                  ${tradeStats.avg_profit_loss.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'trades' ? 'Search by symbol, amount, or notes...' : 'Search by amount or notes...'}
              className="w-full pl-12 pr-4 py-3 bg-background border border-border/50 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-background/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-textSecondary" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'trades' ? (
            <TradeHistoryContent
              key="trades"
              history={filteredTradeHistory}
              onDelete={handleDeleteTrade}
              formatDate={formatDate}
            />
          ) : (
            <TaxHistoryContent
              key="taxes"
              history={filteredTaxHistory}
              onDelete={handleDeleteTax}
              formatDate={formatDate}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const TradeHistoryContent = ({ history, onDelete, formatDate }) => {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12"
      >
        <TrendingUp className="w-12 h-12 text-textSecondary/30 mx-auto mb-3" />
        <p className="text-textSecondary">No trades saved yet</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3 max-h-[600px] overflow-y-auto"
    >
      {history.map((trade, index) => (
        <motion.div
          key={trade.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-background/30 border border-border/20 rounded-xl p-5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg font-bold text-primary">{trade.symbol}</span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  trade.is_profit 
                    ? 'bg-success/20 text-success' 
                    : 'bg-error/20 text-error'
                }`}>
                  {trade.is_profit ? 'WIN' : 'LOSS'}
                </span>
                <span className={`text-xl font-bold ${trade.is_profit ? 'text-success' : 'text-error'}`}>
                  ${Math.abs(trade.profit_loss).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-textSecondary mb-1">{formatDate(trade.timestamp)}</p>
              {trade.notes && (
                <p className="text-sm text-textSecondary italic mt-2">{trade.notes}</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(trade.id)}
              className="p-2 bg-error/10 hover:bg-error/20 border border-error/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-error" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-textSecondary">Entry:</span>
              <p className="font-semibold">${trade.entry_price.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-textSecondary">Exit:</span>
              <p className="font-semibold">${trade.exit_price.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-textSecondary">Contracts:</span>
              <p className="font-semibold">{trade.num_contracts}</p>
            </div>
            <div>
              <span className="text-textSecondary">Return:</span>
              <p className={`font-semibold ${trade.profit_loss_pct >= 0 ? 'text-success' : 'text-error'}`}>
                {trade.profit_loss_pct >= 0 ? '+' : ''}{trade.profit_loss_pct.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border/20 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-textSecondary">Point Diff:</span>
              <span className="ml-2 font-semibold">{trade.point_diff.toFixed(2)} pts</span>
            </div>
            <div>
              <span className="text-textSecondary">Ticks:</span>
              <span className="ml-2 font-semibold">{trade.ticks.toFixed(0)}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

const TaxHistoryContent = ({ history, onDelete, formatDate }) => {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12"
      >
        <DollarSign className="w-12 h-12 text-textSecondary/30 mx-auto mb-3" />
        <p className="text-textSecondary">No tax calculations saved yet</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3 max-h-[600px] overflow-y-auto"
    >
      {history.map((calc, index) => (
        <motion.div
          key={calc.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-background/30 border border-border/20 rounded-xl p-5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-2xl font-bold ${calc.is_profit ? 'text-success' : 'text-error'}`}>
                  ${Math.abs(calc.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  calc.is_profit 
                    ? 'bg-success/20 text-success' 
                    : 'bg-error/20 text-error'
                }`}>
                  {calc.is_profit ? 'Profit' : 'Loss'}
                </span>
                {calc.include_ca_state === 1 && (
                  <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-secondary/20 text-secondary flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    CA Tax
                  </span>
                )}
              </div>
              <p className="text-xs text-textSecondary mb-1">{formatDate(calc.timestamp)}</p>
              {calc.notes && (
                <p className="text-sm text-textSecondary italic mt-2">{calc.notes}</p>
              )}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(calc.id)}
              className="p-2 bg-error/10 hover:bg-error/20 border border-error/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-error" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-textSecondary">Total Tax:</span>
              <p className={`font-semibold ${calc.is_profit ? 'text-warning' : 'text-success'}`}>
                {calc.is_profit ? '-' : '+'}${Math.abs(calc.total_tax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-textSecondary">After Tax:</span>
              <p className={`font-semibold ${calc.after_tax >= 0 ? 'text-success' : 'text-error'}`}>
                ${calc.after_tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <span className="text-textSecondary">Effective Rate:</span>
              <p className="font-semibold">{Math.abs(calc.effective_rate).toFixed(2)}%</p>
            </div>
            <div>
              <span className="text-textSecondary">Federal Tax:</span>
              <p className="font-semibold text-primary">
                ${Math.abs(calc.total_federal_tax).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default SavedResultsTabs
