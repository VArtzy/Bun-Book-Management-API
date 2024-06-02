import { drizzle } from "drizzle-orm/bun-sqlite"
import { Logger } from "drizzle-orm"
import { Database } from 'bun:sqlite'
import { log } from './logging'

class Log implements Logger {
    logQuery(query: string, params: unknown[]): void {
        log.info(query, params)
    }
}

const sqlite = new Database('../database/db.sqlite')
export const db = drizzle(sqlite, { logger: new Log() })
