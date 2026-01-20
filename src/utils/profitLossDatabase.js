import initSqlJs from 'sql.js';

class ProfitLossDatabase {
  constructor() {
    this.db = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from localStorage
      const savedDb = localStorage.getItem('profitLossDB');
      
      if (savedDb) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new SQL.Database(uint8Array);
      } else {
        this.db = new SQL.Database();
        this.createTables();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize profit/loss database:', error);
      throw error;
    }
  }

  createTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS profit_loss_calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        symbol TEXT NOT NULL,
        contract_name TEXT NOT NULL,
        entry_price REAL NOT NULL,
        exit_price REAL NOT NULL,
        num_contracts REAL NOT NULL,
        point_diff REAL NOT NULL,
        ticks REAL NOT NULL,
        profit_loss REAL NOT NULL,
        profit_loss_pct REAL NOT NULL,
        total_value REAL NOT NULL,
        margin_used REAL NOT NULL,
        starting_balance REAL NOT NULL,
        remaining_balance REAL NOT NULL,
        is_profit INTEGER NOT NULL,
        tick_size REAL NOT NULL,
        tick_value REAL NOT NULL,
        contract_multiplier REAL NOT NULL,
        typical_margin REAL NOT NULL,
        notes TEXT
      )
    `);
    this.save();
  }

  save() {
    if (!this.db) return;
    
    const data = this.db.export();
    const buffer = Array.from(data);
    localStorage.setItem('profitLossDB', JSON.stringify(buffer));
  }

  async saveCalculation(results, notes = '') {
    if (!this.initialized) await this.init();

    const stmt = this.db.prepare(`
      INSERT INTO profit_loss_calculations (
        timestamp, symbol, contract_name, entry_price, exit_price,
        num_contracts, point_diff, ticks, profit_loss, profit_loss_pct,
        total_value, margin_used, starting_balance, remaining_balance,
        is_profit, tick_size, tick_value, contract_multiplier,
        typical_margin, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      new Date().toISOString(),
      results.contractSpecs.symbol,
      results.contractSpecs.name,
      results.entryPrice || 0,
      results.exitPrice || 0,
      results.numContracts || 0,
      results.pointDiff,
      results.ticks,
      results.profitLoss,
      results.profitLossPct,
      results.totalValue,
      results.marginUsed,
      results.startingBalance,
      results.remainingBalance,
      results.isProfit ? 1 : 0,
      results.contractSpecs.tickSize,
      results.contractSpecs.tickValue,
      results.contractSpecs.contractMultiplier,
      results.contractSpecs.typicalMargin,
      notes
    ]);

    stmt.free();
    this.save();

    return this.getLastInsertId();
  }

  getLastInsertId() {
    const result = this.db.exec('SELECT last_insert_rowid() as id');
    return result[0]?.values[0]?.[0] || null;
  }

  async getAllCalculations() {
    if (!this.initialized) await this.init();

    const result = this.db.exec(`
      SELECT * FROM profit_loss_calculations 
      ORDER BY timestamp DESC
    `);

    if (!result.length) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });
  }

  async getCalculationById(id) {
    if (!this.initialized) await this.init();

    const result = this.db.exec(`
      SELECT * FROM profit_loss_calculations WHERE id = ?
    `, [id]);

    if (!result.length) return null;

    const columns = result[0].columns;
    const row = result[0].values[0];
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  }

  async deleteCalculation(id) {
    if (!this.initialized) await this.init();

    this.db.run('DELETE FROM profit_loss_calculations WHERE id = ?', [id]);
    this.save();
  }

  async searchCalculations(searchTerm) {
    if (!this.initialized) await this.init();

    const result = this.db.exec(`
      SELECT * FROM profit_loss_calculations 
      WHERE notes LIKE ? 
         OR symbol LIKE ?
         OR CAST(profit_loss AS TEXT) LIKE ?
         OR CAST(entry_price AS TEXT) LIKE ?
         OR CAST(exit_price AS TEXT) LIKE ?
      ORDER BY timestamp DESC
    `, [
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`,
      `%${searchTerm}%`
    ]);

    if (!result.length) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });
  }

  async getCalculationsBySymbol(symbol) {
    if (!this.initialized) await this.init();

    const result = this.db.exec(`
      SELECT * FROM profit_loss_calculations 
      WHERE symbol = ?
      ORDER BY timestamp DESC
    `, [symbol]);

    if (!result.length) return [];

    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });
  }

  async getStatistics() {
    if (!this.initialized) await this.init();

    const result = this.db.exec(`
      SELECT 
        COUNT(*) as total_trades,
        SUM(CASE WHEN is_profit = 1 THEN 1 ELSE 0 END) as winning_trades,
        SUM(CASE WHEN is_profit = 0 THEN 1 ELSE 0 END) as losing_trades,
        SUM(profit_loss) as total_profit_loss,
        AVG(profit_loss) as avg_profit_loss,
        MAX(profit_loss) as max_profit,
        MIN(profit_loss) as max_loss
      FROM profit_loss_calculations
    `);

    if (!result.length) return null;

    const columns = result[0].columns;
    const row = result[0].values[0];
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  }

  async exportData() {
    const calculations = await this.getAllCalculations();
    return JSON.stringify(calculations, null, 2);
  }

  async clearAllData() {
    if (!this.initialized) await this.init();

    this.db.run('DELETE FROM profit_loss_calculations');
    this.save();
  }
}

export const profitLossDB = new ProfitLossDatabase();
