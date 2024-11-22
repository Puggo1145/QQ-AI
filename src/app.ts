import express from "express";
// plugins
import dotenv from "dotenv";
// utils
import { initializeAiClients } from "./utils/ai";
import { initializeGroupWhiteList, initializeDeveloperWhiteList } from "./constants/whitelist";
// global middlewares
import { groupWhitelistMiddleware } from "./middlewares/group-whitelist.middleware";
import { isAtMiddleware } from "./middlewares/is-at.middleware";
// controllers
import { onebotController } from "./controllers/onebot.controller";

dotenv.config({ path: './.env' });

// 初始化 AI client
initializeAiClients();
// 初始化群白名单
initializeGroupWhiteList();
// 初始化开发者白名单
initializeDeveloperWhiteList();

const app = express();
// plugins
app.use(express.json());
// routes
app.use(
    "/onebot",
    groupWhitelistMiddleware,
    isAtMiddleware,
    onebotController
);

const port = process.env.RECEIVE_PORT;
app.listen(port, () => {
  console.log(`GPTbot for QQ message handler is waiting for messages on port: ${port}`);
});
