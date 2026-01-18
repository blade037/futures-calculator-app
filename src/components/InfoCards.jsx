import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Shield, TrendingUp, Zap } from 'lucide-react'

const infoData = [
  {
    icon: BookOpen,
    title: 'Educational Resources',
    description: 'Learn futures trading strategies, risk management, and market analysis techniques.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Calculate optimal position sizes and manage your trading risk effectively.',
    color: 'success',
  },
  {
    icon: TrendingUp,
    title: 'Profit Optimization',
    description: 'Maximize returns with precise profit/loss calculations and risk-reward analysis.',
    color: 'secondary',
  },
  {
    icon: Zap,
    title: 'Real-time Calculations',
    description: 'Instant results for all your futures trading calculations and scenarios.',
    color: 'accent',
  },
]

const InfoCards = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {infoData.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-surface/50 backdrop-blur-xl rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${item.color}/20 to-${item.color}/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 text-${item.color}`} />
            </div>
            <h4 className="text-lg font-bold mb-2">{item.title}</h4>
            <p className="text-sm text-textSecondary leading-relaxed">{item.description}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

export default InfoCards
