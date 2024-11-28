import express from "express";
import dotenv from "dotenv";
// global middlewares
import { groupWhitelistMiddleware } from "./middlewares/group-whitelist.middleware";
import { isAtMiddleware } from "./middlewares/is-at.middleware";
// controllers
import { onebotController } from "./controllers/onebot.controller";
// event
import { eventBus } from "./utils/event-bus";

dotenv.config({ path: './.env' });

eventBus.emit('init-ai-clients'); // 初始化 AI client
eventBus.emit('init-group-whitelist'); // 初始化群白名单
eventBus.emit('init-developer-whitelist'); // 初始化开发者白名单

const app = express();
app.use(express.json());
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
