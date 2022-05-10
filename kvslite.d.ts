/** Synchronous key-value store in node using `sqlite3` and v8's serialize & deserialize. */
export declare class KVS<T = unknown> {
    /** Make or open a collection. One path can hold multiple collections. */
    constructor(dbpath: any, collection?: string)
    /** Close the file and database*/
    close(): void
    /** Set or update key to value */
    get(key: string): T | undefined
    /** Get value by key */
    set(key: string, value: T): void
    /**  Set many values in one transaction, aborting if any fail */
    setMany(keyValMap: Record<string, T>): void
    /** Get many values, returns undefined if any keys are absent */
    getMany<Ks extends string>(keys: Ks[]): Record<Ks, T> | undefined
    /** Delete key if it exists */
    delete(key: string): void
    /** Get all keys and values */
    all(): Record<string, T> | undefined
    /** Get values for all keys starting with prefix */
    find(prefix: string): Record<string, T> | undefined
}
