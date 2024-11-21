import { Request, Response, NextFunction } from "express";
// types
import type { BotEvent } from "../types/bot-event";

/**
 * @description 检查消息是否为 @消息
 * @param req 
 * @param next 
 */
export const isAtMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const { message } = (req.body as BotEvent);

    if (Array.isArray(message) && message[0].type === 'at') {
        next();
    }
}
