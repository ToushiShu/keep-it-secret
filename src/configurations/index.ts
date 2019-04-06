import nconf from "nconf";
import path from "path";

export interface DbConfiguration {
    connectionString: string;
}

export interface ServerConfiguration {
    port: string;
}

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

    static getDatabaseConfig(): DbConfiguration {
        return this.configs.get("database");
    }

    static getServerConfigs(): ServerConfiguration {
        return this.configs.get("server");
    }
}
