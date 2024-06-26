import { drizzle } from "drizzle-orm/bun-sqlite"
import { Logger } from "drizzle-orm"
import { Database } from 'bun:sqlite'
import { log } from './logging'
import * as schema from '../database/schema'
import { createClient } from "redis"

class Log implements Logger {
    logQuery(query: string, params: unknown[]): void {
        log.info(query, params)
    }
}

const sqlite = new Database(`${import.meta.dir}/../database/db.sqlite`)
export const db = drizzle(sqlite, { schema, logger: new Log() })
export const redis = createClient()
redis.on("error", err => log.error(err))
