import { sendGroupTextMsg, replyGroupMsg, getGroupMsgHistory } from "@/utils/onebot/message";
import { getGroupFiles } from "@/utils/onebot/file";
// constants
import { developerWhitelist } from "@/constants/whitelist";
// types
import type { BotMessage } from "@/utils/onebot/types/bot-message";

export const devService = async (event: BotMessage, command: string) => {
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
            try {
                const history_msgs = await getGroupMsgHistory(event.group_id, 10, {
                    includeBotMessage: true
                });
                console.log('最近10条历史消息：');
                console.log(JSON.stringify(history_msgs, null, 2));
                await replyGroupMsg(event.group_id, event.message_id, "历史消息已打印到控制台");
            } catch (error: any) {
                console.error('获取历史消息失败:', error);
                await replyGroupMsg(event.group_id, event.message_id, `获取历史消息失败: ${error.message}`);
            }
            break;
        case 'dev-get-files':
            try {
                const files = await getGroupFiles(event.group_id);
                console.log(JSON.stringify(files, null, 2));
                await replyGroupMsg(event.group_id, event.message_id, "群文件已打印到控制台");
            } catch (error: any) {
                console.error('获取群文件失败:', error);
                await replyGroupMsg(event.group_id, event.message_id, `获取群文件失败: ${error.message}`);
            }
            break;
        default:
            await replyGroupMsg(event.group_id, event.message_id, "未知的开发者命令");
            break;
    }
} 