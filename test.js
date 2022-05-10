const { strictEqual } = require('assert')
const { KVS } = require('./kvslite.js')

const db = new KVS(':memory:')

function setAndGet() {
    db.set('foo', 'bar')
    const get = db.get('foo')
    strictEqual(get, 'bar')
}

function main() {
    const tests = [setAndGet]
    for (const t of tests) {
        console.log(`\n\nstarting test ${t.name}`)
        try {
            t()
        } catch (e_) {
            const e = e_
            console.error(`${t.name} FAILED:`, e.message)
            process.exitCode = 1
            continue
        }
        console.log(`test ${t.name} passed`)
    }
}
main()
