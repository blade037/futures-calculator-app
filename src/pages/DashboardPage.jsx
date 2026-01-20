import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target, Award } from 'lucide-react'
import { profitLossDB } from '../utils/profitLossDatabase'
import { taxDB } from '../utils/database'

const DashboardPage = () => {
  const [tradeStats, setTradeStats] = useState(null)
  const [recentTrades, setRecentTrades] = useState([])
  const [taxSummary, setTaxSummary] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [stats, trades, taxes] = await Promise.all([
        profitLossDB.getStatistics(),
        profitLossDB.getAllCalculations(),
        taxDB.getAllCalculations()
      ])
      
      setTradeStats(stats)
      setRecentTrades(trades.slice(0, 5))
      
      // Calculate tax summary
      const totalTaxLiability = taxes.reduce((sum, calc) => 
        sum + (calc.is_profit ? calc.total_tax : 0), 0
      )
      const totalTaxBenefit = taxes.reduce((sum, calc) => 
        sum + (!calc.is_profit ? Math.abs(calc.total_tax) : 0), 0
      )
      
      setTaxSummary({
        totalLiability: totalTaxLiability,
        totalBenefit: totalTaxBenefit,
        netTax: totalTaxLiability - totalTaxBenefit,
        calculationCount: taxes.length
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

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
          <span className="text-sm font-semibold text-primary">Trading Dashboard</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Performance Overview
        </h1>
        <p className="text-lg text-textSecondary max-w-2xl mx-auto">
          Track your trading performance and tax obligations at a glance
        </p>
      </div>

      {/* Stats Grid */}
      {tradeStats && tradeStats.total_trades > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={BarChart3}
            label="Total Trades"
            value={tradeStats.total_trades}
            color="primary"
            delay={0.2}
          />
          <StatCard
            icon={Target}
            label="Win Rate"
            value={`${((tradeStats.winning_trades / tradeStats.total_trades) * 100).toFixed(1)}%`}
            color="success"
            delay={0.3}
          />
          <StatCard
            icon={TrendingUp}
            label="Total P/L"
            value={`$${tradeStats.total_profit_loss.toFixed(2)}`}
            color={tradeStats.total_profit_loss >= 0 ? 'success' : 'error'}
            delay={0.4}
          />
          <StatCard
            icon={Award}
            label="Avg P/L"
            value={`$${tradeStats.avg_profit_loss.toFixed(2)}`}
            color={tradeStats.avg_profit_loss >= 0 ? 'success' : 'error'}
            delay={0.5}
          />
        </div>
      )}

      {/* Tax Summary */}
      {taxSummary && taxSummary.calculationCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-warning to-accent rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Tax Summary</h3>
              <p className="text-sm text-textSecondary">Section 1256 Tax Overview</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-5">
              <p className="text-sm text-textSecondary mb-2">Total Tax Liability</p>
              <p className="text-3xl font-bold text-warning">
                ${taxSummary.totalLiability.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-success/10 border border-success/30 rounded-xl p-5">
              <p className="text-sm text-textSecondary mb-2">Total Tax Benefit</p>
              <p className="text-3xl font-bold text-success">
                ${taxSummary.totalBenefit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`border rounded-xl p-5 ${
              taxSummary.netTax >= 0 
                ? 'bg-error/10 border-error/30' 
                : 'bg-success/10 border-success/30'
            }`}>
              <p className="text-sm text-textSecondary mb-2">Net Tax Position</p>
              <p className={`text-3xl font-bold ${taxSummary.netTax >= 0 ? 'text-error' : 'text-success'}`}>
                {taxSummary.netTax >= 0 ? '-' : '+'}${Math.abs(taxSummary.netTax).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recent Trades */}
      {recentTrades.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-secondary to-accent rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Recent Trades</h3>
                <p className="text-sm text-textSecondary">Last 5 trades</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {recentTrades.map((trade, index) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                className="bg-background/30 border border-border/20 rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      trade.is_profit ? 'bg-success/20' : 'bg-error/20'
                    }`}>
                      {trade.is_profit ? (
                        <TrendingUp className="w-5 h-5 text-success" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-error" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-primary">{trade.symbol}</span>
                        <span className="text-xs text-textSecondary">{formatDate(trade.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-textSecondary">
                        <span>Entry: ${trade.entry_price.toFixed(2)}</span>
                        <span>Exit: ${trade.exit_price.toFixed(2)}</span>
                        <span>{trade.num_contracts} contract{trade.num_contracts > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${trade.is_profit ? 'text-success' : 'text-error'}`}>
                      {trade.is_profit ? '+' : ''}${trade.profit_loss.toFixed(2)}
                    </p>
                    <p className={`text-sm ${trade.profit_loss_pct >= 0 ? 'text-success' : 'text-error'}`}>
                      {trade.profit_loss_pct >= 0 ? '+' : ''}{trade.profit_loss_pct.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {(!tradeStats || tradeStats.total_trades === 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center py-20"
        >
          <div className="inline-block p-6 bg-primary/10 rounded-full mb-6">
            <BarChart3 className="w-16 h-16 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">No Trading Data Yet</h3>
          <p className="text-textSecondary mb-6 max-w-md mx-auto">
            Start using the calculators to track your trades and see your performance metrics here
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'calculators' }))}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
          >
            Go to Calculators
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/30 text-primary',
    secondary: 'from-secondary/20 to-secondary/5 border-secondary/30 text-secondary',
    success: 'from-success/20 to-success/5 border-success/30 text-success',
    error: 'from-error/20 to-error/5 border-error/30 text-error',
    warning: 'from-warning/20 to-warning/5 border-warning/30 text-warning'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 shadow-xl`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]}`} />
        <span className="text-sm font-medium text-textSecondary">{label}</span>
      </div>
      <p className={`text-3xl font-bold ${colorClasses[color].split(' ')[2]}`}>
        {value}
      </p>
    </motion.div>
  )
}

export default DashboardPage
