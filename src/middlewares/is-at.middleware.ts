import { Request, Response, NextFunction } from "express";
// types
import type { BotMessage } from "../utils/onebot/types/bot-message";

/**
 * @description 检查消息是否为 @自己 消息
 * @param req 
 * @param next 
 */
export const isAtMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const { message } = req.body as BotMessage;

    if (
        Array.isArray(message) &&
        message[0].type === 'at' &&
        message[0].data.qq === process.env.BOT_QQ_ID
    ) {
        next();
    }
}
