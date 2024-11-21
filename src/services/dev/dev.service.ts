import { sendGroupTextMsg } from "../../utils/message/send-group-text-msg";
import { developerWhitelist } from "../../constants/whitelist";
import { replyGroupMsg } from "../../utils/message/reply-group-msg";
import type { BotEvent } from "../../types/bot-event";
import { getGroupMsgHistory } from "../../utils/message/get-group-msg-history";

export const devService = async (event: BotEvent, command: string) => {
    // Check if user is in dev whitelist
    if (!developerWhitelist.includes(event.sender.user_id)) {
        await replyGroupMsg(event.group_id, event.message_id, "您没有权限执行开发者命令");
        return;
    }

    switch (command) {
        case 'dev-show-msg':
            await sendGroupTextMsg(event.group_id, JSON.stringify(event, null, 2));
            break;
        case 'dev-get-history':
            const history_msgs = await getGroupMsgHistory(event.group_id, 2);
            await sendGroupTextMsg(event.group_id, JSON.stringify(history_msgs, null, 2));
            break;
        // Add more dev commands here
        default:
            await replyGroupMsg(event.group_id, event.message_id, "未知的开发者命令");
            break;
    }
} 