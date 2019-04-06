import Server from "./server";
import Database from "./database";
import { Configs } from "./configurations";

// listening port
const port = Configs.getServerConfigs().port;
// connectionString for mongoose
const connectionString = Configs.getDatabaseConfig().connectionString;

const server = new Server(port);
const database = new Database(connectionString);

database.connectToDb();
server.start();