import Server from "./server";
import Database from "./database";
import { Configs } from "./configurations";

// listening port
const port = process.env.PORT || Configs.getServerConfigs().port;
// secret key
const secret = process.env["SECRET"] || Configs.getServerConfigs().secretKey;
// connection string
const connectionString = process.env["MONGO_URI"] || Configs.getDatabaseConfig().connectionString;

const db = new Database(connectionString);
const server = new Server(port, secret);

server.start();
db.start();