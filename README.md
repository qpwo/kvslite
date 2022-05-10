# kvslite

Key-value store in node using `sqlite3` and v8's serialize & deserialize. Synchronous.

```sh
npm i kvslite
```

## example

```js
const KVS = require('sqlite-kvs')
const db = new KVS()
db.set('key', 'value')
db.set('objectsAllowed', 'value')
```

## API

-   `new KVS<T>()`
-   `close()`
-   `get(key: string): T`
-   `set(key: string, value: T)`
-   `delete(key: string)`
-   `all()`
-   `find(prefix)`

## await db.open(path)

open database

## await db.get(key)

get value from key.

## await db.put(key, value)

put value to key.

## await db.delete(key)

delete key.

## await db.all()

get all values.

## await db.find(prefix)

find values.
