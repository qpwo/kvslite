# kvslite

Synchronous persistent key-value store for node using `sqlite3` and v8's serialize & deserialize. No daemon!

```sh
npm i kvslite
```

-   ✅ Store any data including classes, sets, etc
-   ✅ Add 100k records per second
-   ✅ Use in memory or on drive
-   **better-sqlite3 seems to require node version 16**

## example

```ts
import { KVS } from 'kvslite'
type User = { id: string; name: string }
const users = new KVS()<User>('mydb.db')
const memoryDb = new KVS(':memory:')
db.set('key', 'value')
db.set('objectsAllowed', new Date())
db.set('yepThisWorks', { big: { complicated: { object: new Set() } } })
```

## API

-   `new KVS<T>(filepath, collectionName?)`: Make or open a collection. One path can hold multiple collections.
-   `db.close()`: Close the file
-   `db.set(key, value)`: Set or update key to value
-   `db.get(key): T?`: Get value by key
-   `setMany(mapping: Record<string, T>)`: Set many values in one transaction, aborting if any fail
-   `getMany(keys: string[]): Record<string, T>?`: Get many values, returns undefined if any keys are absent
-   `db.delete(key)`: Delete key if it exists
-   `db.all(): Record<string, T>?`: Get all keys and values
-   `db.find(prefix): Record<string, T>?`: Get values for all keys starting with prefix
