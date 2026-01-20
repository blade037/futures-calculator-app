import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Calculator, History } from 'lucide-react'

const Navigation = ({ activePage, setActivePage }) => {
  useEffect(() => {
    const handleNavigate = (e) => {
      setActivePage(e.detail)
    }
    
    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [setActivePage])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calculators', label: 'Calculators', icon: Calculator },
    { id: 'history', label: 'History', icon: History }
  ]

  return (
    <nav className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-6 py-4 font-semibold transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-textSecondary hover:text-text'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
