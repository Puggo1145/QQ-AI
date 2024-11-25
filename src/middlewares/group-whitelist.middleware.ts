import { Request, Response, NextFunction } from 'express';
import { groupWhitelist } from '../constants/whitelist';
// types
import type { BotMessage } from '../utils/onebot/types/bot-message';

export const groupWhitelistMiddleware = (req: Request, _: Response, next: NextFunction) => {
    const { group_id, message_type } = req.body as BotMessage;

    if (!group_id || message_type !== 'group') {
        // res.status(400).json({ error: 'Not a group message' });
        return;
    }

    if (!groupWhitelist.includes(group_id)) {
        // res.status(403).json({ error: 'Unsupported group' });
        return;
    }

    next();
}