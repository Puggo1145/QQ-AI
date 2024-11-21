// utils
import { extractUserMsg } from "../../utils/extract-user-msg";
import { sendGroupTextMsg } from "../../utils/message/send-group-text-msg";
import { getGroupMsgHistory } from "../../utils/message/get-group-msg-history";
import { format } from "date-fns";
// chat
import { singleChat } from "../../utils/kimi";
// constants
import { prompts } from "../../constants/prompts";
// types
import type { BotEvent } from "../../types/bot-event";


export const summaryGroupMsgService = async (group_id: BotEvent["group_id"]) => {
    const history_count = 50;

    try {
        // 1. 响应信息
        await sendGroupTextMsg(group_id, `正在总结群内事项（最近 ${history_count} 条消息）`);

        // 2. 获取历史消息
        const history_msgs = await getGroupMsgHistory(group_id, history_count);

        // 3. 筛选用户消息并提取信息
        const user_msgs = history_msgs.filter(msg => msg.sender.user_id !== Number(process.env.BOT_QQ_ID));
        const formattedMsg = user_msgs.map(msg => ({
            sender: msg.sender.nickname,
            time: format(msg.time * 1000, "yyyy-MM-dd HH:mm:ss"),
            msg: extractUserMsg(msg.raw_message)
        }));

        // 4. 发送给 AI 总结
        const kimiRes = await singleChat(
            `${prompts.summary}\n${JSON.stringify(formattedMsg)}`
        );

        // 5. 发送总结消息
        await sendGroupTextMsg(
            group_id, 
            `${kimiRes}\n\n由 KIMI AI 总结`
        );
    } catch (error: any) {
        console.error(error.message);
        await sendGroupTextMsg(group_id, `总结失败：${error.message}`);
    }
}

