export declare class KVS<T = unknown> {
    constructor(dbpath: any, collection?: string)
    close(): void
    get(key: string): T | undefined
    set(key: string, value: T): void
    setMany(keyValMap: Record<string, T>): void
    getMany<Ks extends string>(keys: Ks[]): Record<Ks, T> | undefined
    delete(key: string): void
    all(): Record<string, T> | undefined
    find(prefix: string): Record<string, T> | undefined
}
