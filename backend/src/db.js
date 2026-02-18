const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
console.log('Initializing SQLite database...');
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            course TEXT NOT NULL,
            college TEXT NOT NULL,
            year TEXT NOT NULL,
            status TEXT DEFAULT 'new',
            sheet_row_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating leads table:', err);
        else console.log('Leads table ready');
    });
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating admins table:', err);
        else console.log('Admins table ready');
    });
});

module.exports = {
    query: (text, params = []) => {
        // Convert $1, $2, etc. to ?1, ?2, etc. to support parameter reuse in SQLite
        let sqliteQuery = text.replace(/\$(\d+)/g, '?$1').replace(/ILIKE/g, 'LIKE');

        // Handle PostgreSQL specific 'ON CONFLICT'
        if (sqliteQuery.includes('ON CONFLICT')) {
            sqliteQuery = sqliteQuery.replace(/ON CONFLICT\s*\([^)]+\)\s*DO\s*NOTHING/i, '');
            sqliteQuery = sqliteQuery.replace(/INSERT INTO/i, 'INSERT OR IGNORE INTO');
        }

        return new Promise((resolve, reject) => {
            const isSelect = sqliteQuery.trim().toUpperCase().startsWith('SELECT');
            const hasReturning = sqliteQuery.toUpperCase().includes('RETURNING');

            if (isSelect) {
                db.all(sqliteQuery, params, (err, rows) => {
                    if (err) {
                        console.error('SQLite Query Error:', err, sqliteQuery);
                        return reject(err);
                    }
                    resolve({ rows });
                });
            } else if (hasReturning) {
                // Try executing with RETURNING, if it fails, fallback to separate query
                db.all(sqliteQuery, params, (err, rows) => {
                    if (err && err.message.includes('near "RETURNING": syntax error')) {
                        // Fallback: Remove RETURNING and execute as standard INSERT/UPDATE
                        const baseQuery = sqliteQuery.split(/RETURNING/i)[0].trim();
                        db.run(baseQuery, params, function (err2) {
                            if (err2) return reject(err2);

                            // Try to fetch the inserted/updated row
                            // For INSERT: this.lastID works. For UPDATE: we usually pass id as last param.
                            const id = this.lastID || (params.length > 0 ? params[params.length - 1] : null);
                            const tableMatch = baseQuery.match(/INTO\s+(\w+)|UPDATE\s+(\w+)/i);
                            const table = tableMatch?.[1] || tableMatch?.[2];

                            if (table && id) {
                                db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err3, row) => {
                                    resolve({ rows: row ? [row] : [] });
                                });
                            } else {
                                resolve({ rows: [] });
                            }
                        });
                    } else if (err) {
                        console.error('SQLite Query Error (with RETURNING):', err, sqliteQuery);
                        return reject(err);
                    } else {
                        resolve({ rows });
                    }
                });
            } else {
                db.run(sqliteQuery, params, function (err) {
                    if (err) {
                        console.error('SQLite Run Error:', err, sqliteQuery);
                        return reject(err);
                    }
                    resolve({ rows: [], lastID: this.lastID, changes: this.changes });
                });
            }
        });
    },
};
