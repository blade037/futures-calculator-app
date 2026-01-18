// Futures Contract Specifications Database
export const CONTRACTS = {
  MES: {
    symbol: '/MES',
    name: 'Micro E-mini S&P 500',
    tickSize: 0.25,
    tickValue: 1.25,
    contractMultiplier: 5,
    typicalMargin: 2466,
    defaultEntry: '5800.00',
    defaultExit: '5850.00',
    defaultStop: '5780.00',
    defaultTarget: '5860.00',
  },
  MGC: {
    symbol: '/MGC',
    name: 'Micro Gold',
    tickSize: 0.1,
    tickValue: 1.00,
    contractMultiplier: 10,
    typicalMargin: 3168,
    defaultEntry: '2650.0',
    defaultExit: '2660.0',
    defaultStop: '2645.0',
    defaultTarget: '2665.0',
  },
  SIL: {
    symbol: '/SIL',
    name: 'Micro Silver',
    tickSize: 0.005,
    tickValue: 5.00,
    contractMultiplier: 1000,
    typicalMargin: 8580,
    defaultEntry: '30.500',
    defaultExit: '30.600',
    defaultStop: '30.450',
    defaultTarget: '30.650',
  },
}

export const getContractById = (id) => CONTRACTS[id] || CONTRACTS.MES
export const getContractList = () => Object.values(CONTRACTS)
