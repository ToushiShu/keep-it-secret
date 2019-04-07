import Server from "./server";
import { Configs } from "./configurations";

// listening port
const port = process.env.PORT || Configs.getServerConfigs().port;
// secret key
const secret = process.env["SECRET"] || Configs.getServerConfigs().secretKey;

const server = new Server(port, secret);

server.start();