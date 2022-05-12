const { strictEqual, deepStrictEqual, ok } = require('assert')
const { statSync } = require('fs')
const { KVS } = require('./kvslite')

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
    const gotten = db.getMany(['a', 'b', 'c', 'd'])
    deepStrictEqual(obj, gotten)
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

function setALot() {
    const start = performance.now()
    const db = new KVS(':memory:')
    for (let i = 0; i < 100_000; i++) {
        db.set(i.toString(), Math.random())
        db.get(i.toString())
    }
    const end = performance.now()
    ok(end - start < 2500)
}
function fileLimitCheck() {
    const start = performance.now()
    const path = 'temp.db'
    const db = new KVS(path)
    const maxRecords = 100_000_000
    const updateInterval = 100_000
    for (let i = 0; i < maxRecords; i++) {
        if (i % updateInterval === 0) {
            // const sizeMb = statSync(path).size / 1024 / 1024
            const elapsedSec = (performance.now() - start) / 1000
            console.log({
                i,
                // sizeMb,
                elapsedSec,
            })
        }
        db.set(i.toString(), Math.random())
    }
    const end = performance.now()
}

function main() {
    const tests = [fileLimitCheck] //setAndGet, grabBag, setALot]
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
