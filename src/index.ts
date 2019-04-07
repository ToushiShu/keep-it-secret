import Server from "./server";
import { Configs } from "./configurations";

// listening port
const port = Configs.getServerConfigs().port;
// secret key
const secret = Configs.getServerConfigs().secretKey;

const server = new Server(port, secret);

server.start();