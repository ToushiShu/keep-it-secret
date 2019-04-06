import express from "express";
import { Configs } from "./configurations";

const port = Configs.getServerConfigs().port;

const app = express();

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));