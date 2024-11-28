import { sendGroupTextMsg, replyGroupMsg, getGroupMsgHistory } from "@/utils/onebot/message";
import { getGroupFiles } from "@/utils/onebot/file";
import { developerWhitelist } from "@/constants/whitelist";
import type { BotMessage } from "@/utils/onebot/types/bot-message";

// 权限检查函数
export const checkDevPermission = (event: BotMessage): boolean => {
    return !developerWhitelist.includes(event.sender.user_id);
};

// 显示消息详情
export const showMessageDetails = async (event: BotMessage) => {
    await sendGroupTextMsg(event.group_id, JSON.stringify(event, null, 2));
};

// 获取历史消息
export const getMessageHistory = async (event: BotMessage) => {
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
};

// 获取群文件
export const getGroupFileList = async (event: BotMessage) => {
    try {
        const files = await getGroupFiles(event.group_id);
        console.log(JSON.stringify(files, null, 2));
        await replyGroupMsg(event.group_id, event.message_id, "群文件已打印到控制台");
    } catch (error: any) {
        console.error('获取群文件失败:', error);
        await replyGroupMsg(event.group_id, event.message_id, `获取群文件失败: ${error.message}`);
    }
};
