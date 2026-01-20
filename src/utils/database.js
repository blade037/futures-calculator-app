import initSqlJs from 'sql.js';

class TaxDatabase {
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
      const savedDb = localStorage.getItem('taxCalculatorDB');
      
      if (savedDb) {
        const uint8Array = new Uint8Array(JSON.parse(savedDb));
        this.db = new SQL.Database(uint8Array);
      } else {
        this.db = new SQL.Database();
        this.createTables();
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  createTables() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS tax_calculations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        amount REAL NOT NULL,
        is_profit INTEGER NOT NULL,
        include_ca_state INTEGER NOT NULL,
        long_term_portion REAL NOT NULL,
        short_term_portion REAL NOT NULL,
        long_term_tax REAL NOT NULL,
        short_term_tax REAL NOT NULL,
        total_federal_tax REAL NOT NULL,
        ca_state_tax REAL NOT NULL,
        total_tax REAL NOT NULL,
        effective_rate REAL NOT NULL,
        federal_effective_rate REAL NOT NULL,
        state_effective_rate REAL NOT NULL,
        after_tax REAL NOT NULL,
        notes TEXT
      )
    `);
    this.save();
  }

  save() {
    if (!this.db) return;
    
    const data = this.db.export();
    const buffer = Array.from(data);
    localStorage.setItem('taxCalculatorDB', JSON.stringify(buffer));
  }

  async saveCalculation(results, notes = '') {
    if (!this.initialized) await this.init();

    const stmt = this.db.prepare(`
      INSERT INTO tax_calculations (
        timestamp, amount, is_profit, include_ca_state,
        long_term_portion, short_term_portion,
        long_term_tax, short_term_tax,
        total_federal_tax, ca_state_tax, total_tax,
        effective_rate, federal_effective_rate, state_effective_rate,
        after_tax, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      new Date().toISOString(),
      results.amount,
      results.isProfit ? 1 : 0,
      results.includeCAState ? 1 : 0,
      results.longTermPortion,
      results.shortTermPortion,
      results.longTermTax,
      results.shortTermTax,
      results.totalFederalTax,
      results.caStateTax,
      results.totalTax,
      results.effectiveRate,
      results.federalEffectiveRate,
      results.stateEffectiveRate,
      results.afterTax,
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
      SELECT * FROM tax_calculations 
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
      SELECT * FROM tax_calculations WHERE id = ?
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

    this.db.run('DELETE FROM tax_calculations WHERE id = ?', [id]);
    this.save();
  }

  async searchCalculations(searchTerm) {
    if (!this.initialized) await this.init();

    const result = this.db.exec(`
      SELECT * FROM tax_calculations 
      WHERE notes LIKE ? OR CAST(amount AS TEXT) LIKE ?
      ORDER BY timestamp DESC
    `, [`%${searchTerm}%`, `%${searchTerm}%`]);

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

  async exportData() {
    const calculations = await this.getAllCalculations();
    return JSON.stringify(calculations, null, 2);
  }

  async clearAllData() {
    if (!this.initialized) await this.init();

    this.db.run('DELETE FROM tax_calculations');
    this.save();
  }
}

export const taxDB = new TaxDatabase();
