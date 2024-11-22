import { Request } from "express";
// services
import { pingPongService, summaryGroupMsgService } from "../services/onebot";
import { devService } from "../services/dev/dev.service";
// utils
import { extractUserMsg } from "../utils/common/extract-user-msg";
import { replyGroupMsg } from "../utils/onebot/message/reply-group-msg";
// types
import type { BotEvent } from "../types/bot-event";

export const onebotController = async (req: Request) => {
    const event = req.body as BotEvent;
    const user_msg = extractUserMsg(event.raw_message);

    // 开发者命令
    if (user_msg.startsWith('dev-')) {
        await devService(event, user_msg);
        return;
    }

    switch (user_msg) {
        case 'ping':
            await pingPongService(event.group_id);
            break;
        case 'sum':
            await summaryGroupMsgService(event.group_id);
            break;
        default:
            await replyGroupMsg(event.group_id, event.message_id, `未识别的命令`);
            break;
    }
}
