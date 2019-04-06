import express from "express";
import { Configs } from "./configurations";

// listening port
const port = Configs.getServerConfigs().port;

const app = express();

// Route for '/'
app.get("/", (req, res) => res.send("Hello World!"));

// Listen to requests
app.listen(port, () => console.log(`Example app listening on port ${port}!`));