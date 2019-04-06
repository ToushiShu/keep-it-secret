import Server from "./server";
import { Configs } from "./configurations";

// listening port
const port = Configs.getServerConfigs().port;

const server = new Server(port);

server.start();