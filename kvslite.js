const SQLite3 = require('better-sqlite3')
const { deserialize, serialize } = require('v8')

class KVS {
    constructor(dbpath, collection = 'items') {
        const coll = collection
        const db = new SQLite3(dbpath)
        this.db = db
        db.prepare(
            `CREATE TABLE IF NOT EXISTS ${coll} ( key TEXT PRIMARY KEY, value BLOB )`
        ).run()

        this.dbGet = db.prepare(`SELECT * FROM ${coll} WHERE key = ?`)
        this.dbInsert = db.prepare(
            `REPLACE INTO ${coll} (key, value) VALUES(?, ?)`
        )
        this.dbAll = db.prepare(`SELECT * FROM ${coll}`)
        this.dbFind = db.prepare(`SELECT * FROM ${coll} WHERE key LIKE ?`)
        this.dbDelete = db.prepare(`DELETE FROM ${coll} WHERE key = ?`)
        this.dbInsertMany = db.transaction(pairs => {
            for (const [key, value] of pairs) this.dbInsert.run(key, value)
        })
        this.dbGetMany = db.transaction(keys =>
            keys.map(key => this.dbGet.get(key))
        )
    }

    close() {
        this.db.close()
    }

    get(key) {
        const row = this.dbGet.get(key)
        if (!row) return row
        return deserialize(row.value)
    }

    set(key, value) {
        this.dbInsert.run(key, serialize(value))
    }

    setMany(pairs) {
        this.dbInsertMany(pairs)
    }

    getMany(keys) {
        return this.dbGetMany(keys)
    }

    delete(key) {
        this.dbDelete.run(key)
    }

    all() {
        return this.dbAll.run()
    }

    find(prefix) {
        return this.dbFind.run(prefix + '%')
    }
}

module.exports = { KVS }

// const insertMany = db.transaction((cats) => {
//     for (const cat of cats) insert.run(cat);
//   });
