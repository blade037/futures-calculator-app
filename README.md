# LN 1/19/26
# Futures Calculator App

A professional, production-ready web application for calculating profit/loss and managing margin requirements for multiple futures contracts. Built with modern web technologies and designed for traders who need precise calculations across different futures symbols.

## 🚀 Features

- **Multi-Symbol Support**: Calculate P&L for various futures contracts (ES, NQ, YM, RTY, CL, GC, etc.)
- **Real-time Calculations**: Instant profit/loss calculations based on entry/exit prices
- **Margin Management**: Track initial and maintenance margin requirements
- **Contract Specifications**: Built-in data for popular futures contracts
- **Tax Calculator**: Section 1256 tax treatment with optional California state tax (13.3%)
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Professional Grade**: Production-ready with attention to detail and user experience

## 🛠️ Tech Stack

- **React 18** - Modern UI library with hooks
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons

## 📦 Installation

This project runs in a WebContainer environment with automatic dependency management.

### Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will automatically install dependencies and start on `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🎯 Usage

### Futures Calculator
1. **Select a Futures Symbol**: Choose from popular contracts (ES, NQ, YM, etc.)
2. **Enter Trade Details**:
   - Entry price
   - Exit price
   - Number of contracts
   - Position type (Long/Short)
3. **View Results**: Instantly see:
   - Profit/Loss per contract
   - Total P&L
   - Margin requirements
   - Contract specifications

### Tax Calculator
1. **Enter Profit/Loss**: Input your total futures trading profit or loss
2. **Enable CA Tax** (Optional): Toggle California state tax if applicable
3. **Calculate**: View detailed breakdown including:
   - Section 1256 treatment (60% long-term, 40% short-term)
   - Federal tax liability
   - California state tax (if enabled)
   - After-tax profit/loss
   - Effective tax rates

## 📁 Project Structure

```
futures-calculator-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # App header with branding
│   │   ├── CalculatorCard.jsx  # Main calculator interface
│   │   ├── TaxCalculator.jsx   # Section 1256 tax calculator
│   │   ├── ResultsPanel.jsx    # P&L results display
│   │   ├── InfoCards.jsx       # Educational information
│   │   └── Footer.jsx          # App footer
│   ├── data/
│   │   └── contractSpecs.js    # Futures contract specifications
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── public/                     # Static assets
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── postcss.config.js         # PostCSS configuration
```

## 🎨 Design System

- **Color Palette**:
  - Primary: `#9E7FFF` (Purple)
  - Secondary: `#38bdf8` (Sky Blue)
  - Accent: `#f472b6` (Pink)
  - Background: `#171717` (Dark)
  - Surface: `#262626` (Charcoal)

- **Typography**: Sans-serif font stack for clarity
- **Spacing**: 8px grid system for consistency
- **Animations**: Smooth transitions with Framer Motion

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.js` with extended color palette and rounded corners.

### Vite
Optimized for React with HMR (Hot Module Replacement) for instant updates during development.

## 📊 Supported Futures Contracts

- **E-mini S&P 500 (ES)** - $50 per point
- **E-mini NASDAQ-100 (NQ)** - $20 per point
- **E-mini Dow (YM)** - $5 per point
- **E-mini Russell 2000 (RTY)** - $50 per point
- **Crude Oil (CL)** - $1,000 per point
- **Gold (GC)** - $100 per point
- **Euro FX (6E)** - $125,000 per point
- **10-Year T-Note (ZN)** - $1,000 per point

## 💰 Tax Information

### Section 1256 Treatment
Futures contracts receive favorable tax treatment under Section 1256:
- **60%** taxed as long-term capital gains (20% rate)
- **40%** taxed as short-term capital gains (38% rate)
- Applies regardless of holding period
- Mark-to-market on December 31st

### California State Tax
- Optional 13.3% state tax for CA residents
- Applied to total profit/loss
- Toggle on/off in the tax calculator

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for futures traders**
