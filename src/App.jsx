import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import DashboardPage from './pages/DashboardPage'
import CalculatorsPage from './pages/CalculatorsPage'
import HistoryPage from './pages/HistoryPage'
import Navigation from './components/Navigation'
import Footer from './components/Footer'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage key="dashboard" />
      case 'calculators':
        return <CalculatorsPage key="calculators" />
      case 'history':
        return <HistoryPage key="history" />
      default:
        return <DashboardPage key="dashboard" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative">
        <Header />
        <Navigation activePage={activePage} setActivePage={setActivePage} />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl min-h-[calc(100vh-300px)]">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
