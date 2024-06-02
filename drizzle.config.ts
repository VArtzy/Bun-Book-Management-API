import type { Config } from "drizzle-kit";

export default {
    schema: "./src/database/schema.ts",
    out: "./src/database",
    dialect: "sqlite",
    dbCredentials: {
        url: "./src/database/db.sqlite",
    },
} satisfies Config;
