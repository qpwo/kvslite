const { strictEqual, deepStrictEqual } = require('assert')
const { KVS } = require('./kvslite.js')

function setAndGet() {
    const db = new KVS(':memory:')
    db.set('foo', 'bar')
    const get = db.get('foo')
    strictEqual(get, 'bar')

    const d = new Date()
    db.set('date', d)
    strictEqual(db.get('date').getTime(), d.getTime())
    db.close()
}

function grabBag() {
    const db = new KVS(':memory:')
    const obj = {
        a: 10,
        b: new Date(),
        c: 'hello there old pal',
        d: 13,
    }
    db.setMany(obj)
    deepStrictEqual(obj, db.getMany(['a', 'b', 'c', 'd']))
    db.delete('b')
    strictEqual(db.get('b'), undefined)
    db.delete('c')
    const all = db.all()
    deepStrictEqual(all, { a: 10, d: 13 })
    db.setMany({
        foobar: 1,
        foobaz: 2,
        barbar: 3,
        barbaz: 4,
    })
    const found = db.find('foo')
    deepStrictEqual(found, { foobar: 1, foobaz: 2 })
}

function main() {
    const tests = [setAndGet, grabBag]
    for (const t of tests) {
        console.log(`\n\nstarting test ${t.name}`)
        try {
            t()
        } catch (e_) {
            const e = e_
            console.error(`${t.name} FAILED:`, e)
            process.exitCode = 1
            continue
        }
        console.log(`test ${t.name} passed`)
    }
}
main()
