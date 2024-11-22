// utils
import { extractUserMsg } from "../../utils/common/extract-user-msg";
import { sendGroupTextMsg } from "../../utils/onebot/message/send-group-text-msg";
import { getGroupMsgHistory } from "../../utils/onebot/message/get-group-msg-history";
import { format, subDays } from "date-fns";
// chat
// import { singleChat } from "../../utils/kimi";
import { singleChat } from "../../utils/ai/qwen";
// constants
import { prompts } from "../../constants/prompts";
// types
import type { BotEvent } from "../../types/bot-event";


export const summaryGroupMsgService = async (group_id: BotEvent["group_id"]) => {
    const history_count = 100;

    try {
        // 1. 响应信息
        await sendGroupTextMsg(group_id, `正在总结群事务（最近 ${history_count} 条消息）`);

        // 2. 获取历史消息
        const history = await getGroupMsgHistory(
            group_id, 
            history_count,
            {
                includeBotMessage: false,
                timeRange: {
                    startTime: subDays(new Date(), 7).getTime(),
                    endTime: new Date().getTime()
                }
            }
        );

        // 3. 筛选用户消息并提取信息
        const formattedMsg = history.map(msg => ({
            sender: msg.sender.nickname,
            time: format(msg.time * 1000, "yyyy-MM-dd HH:mm"),
            msg_type: msg.message[0].type,
            msg: extractUserMsg(msg.raw_message)
        }));

        // 4. 发送给 AI 总结
        const res = await singleChat(`${prompts.summary}\n${JSON.stringify(formattedMsg)}`);

        // 5. 发送总结消息
        await sendGroupTextMsg(
            group_id, 
            `${res}\n\n由通义千问 AI 总结`
        );
    } catch (error: any) {
        console.error(error.message);
        await sendGroupTextMsg(group_id, `总结失败：${error.message}`);
    }
}

