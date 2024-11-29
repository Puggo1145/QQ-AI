import express from "express";
import dotenv from "dotenv";
// global middlewares
import { groupWhitelistMiddleware } from "./middlewares/group-whitelist.middleware";
import { isAtMiddleware } from "./middlewares/is-at.middleware";
// controllers
import { onebotController } from "./controllers/onebot.controller";
// initialization
import { initialize } from "./init";

dotenv.config({ path: './.env' });

// 初始化相关服务
initialize();

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
