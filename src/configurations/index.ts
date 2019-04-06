import nconf from "nconf";
import path from "path";

/**
 * config.(dev|test).json database file structure.
 */
export interface DbConfiguration {
    connectionString: string;
}

/**
 * config.(dev|test).json server file structure.
 */
export interface ServerConfiguration {
    port: string;
}

/**
 * Import Configs to get app configuration.
 */
export class Configs {

    // Read Configurations
    private static configs = new nconf.Provider({
        env: true,
        argv: true,
        store: {
            type: "file",
            file: path.join(__dirname, `./config.${process.env.NODE_ENV || "dev"}.json`)
        }
    });

    /**
     * Database configuration.
     */
    static getDatabaseConfig(): DbConfiguration {
        return this.configs.get("database");
    }

    /**
     * Server configuration.
     */
    static getServerConfigs(): ServerConfiguration {
        return this.configs.get("server");
    }
}
