const SQLite3 = require('better-sqlite3')
const { deserialize, serialize } = require('v8')

class KVS {
    constructor(dbpath) {
        const db = new SQLite3(dbpath)
        this.db = db
        db.prepare(
            `CREATE TABLE IF NOT EXISTS items(
                     key   TEXT PRIMARY KEY,
                     value BLOB)`
        ).run()

        this.stmt_get = db.prepare('SELECT * FROM items WHERE key = ?')
        this.stmt_insert = db.prepare(
            // 'INSERT INTO items (key, value) VALUES(?, ?) ON DUPLICATE KEY UPDATE'
            'REPLACE INTO items (key, value) VALUES(?, ?)'
        )
        this.stmt_all = db.prepare('SELECT * FROM items')
        this.stmt_find = db.prepare('SELECT * FROM items WHERE key LIKE ?')
        this.stmt_delete = db.prepare('DELETE FROM items WHERE key = ?')
    }
    close() {
        this.db.close()
    }

    get(key) {
        const row = this.stmt_get.get(key)
        if (!row || !row.value) {
            return undefined
        }
        return deserialize(row.value)
    }

    set(key, value) {
        this.stmt_insert.run(key, serialize(value))
    }

    delete(key) {
        this.stmt_delete.run(key)
    }

    all() {
        return this.stmt_all.run()
        // return rows2obj(rows)
    }

    find(prefix) {
        return this.stmt_find.run(prefix + '%')
        // return rows2obj(rows)
    }
}

module.exports = { KVS }

// const insertMany = db.transaction((cats) => {
//     for (const cat of cats) insert.run(cat);
//   });
