import express from "express";
// plugins
import dotenv from "dotenv";
// utils
import { initializeClient } from "./utils/kimi/client";
// global middlewares
import { groupWhitelistMiddleware } from "./middlewares/group-whitelist.middleware";
import { isAtMiddleware } from "./middlewares/is-at.middleware";
// controllers
import { onebotController } from "./controllers/onebot.controller";

dotenv.config({ path: './.env' });

// 在此处初始化 client，避免 env api key 没有加载到问题
initializeClient();

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