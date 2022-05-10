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

        this.setMany = db.transaction(obj => {
            for (const k in obj) {
                this.dbInsert.run(k, serialize(obj[k]))
            }
        })
    }

    close() {
        this.db.close()
    }

    get(key) {
        const row = this.dbGet.get(key)
        if (!row) return row
        return deserialize(row.value)
    }

    getMany(keys) {
        const o = {}
        try {
            const tx = this.db.transaction(keys => {
                keys.forEach(key => {
                    const res = this.dbGet.get(key)
                    if (!res) throw null
                    o[key] = deserialize(res.value)
                })
            })
            tx(keys)
        } catch (e) {
            return undefined
        }
        return o
    }

    set(key, value) {
        this.dbInsert.run(key, serialize(value))
    }

    delete(key) {
        this.dbDelete.run(key)
    }

    all() {
        const res = this.dbAll.all()
        if (!res) return res
        const o = {}
        res.forEach(({ key, value }) => (o[key] = deserialize(value)))
        return o
    }

    find(prefix) {
        const res = this.dbFind.all(prefix + '%')
        if (!res) return res
        const o = {}
        res.forEach(({ key, value }) => (o[key] = deserialize(value)))
        return o
    }
}

module.exports = { KVS }

// const insertMany = db.transaction((cats) => {
//     for (const cat of cats) insert.run(cat);
//   });
