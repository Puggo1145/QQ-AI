import { getGroupMsgHistory, sendGroupTextMsg } from "@/utils/onebot/message";
import { getGroupFileUrl } from "@/utils/onebot/file";
// utils
import { subDays } from "date-fns";
// types
import type { BotEvent } from "@/types/bot-event";

export const superSummaryService = async (group_id: BotEvent["group_id"]) => {
    try {
        // 1. 获取最近 7 天的群消息历史
        const history = await getGroupMsgHistory(group_id, 200, {
            timeRange: {
                startTime: subDays(new Date(), 7).getTime(),
                endTime: new Date().getTime()
            }
        });
        
        // 2. 格式化群消息
        const formattedMessages = history.map((msg) => {
            return {
                sender: msg.sender.nickname,
                time: msg.time,
                messageType: msg.message[0].type,
                message: msg.message[0].data
            }
        })

        await sendGroupTextMsg(group_id, "Dev Mode: 数据已打印到控制台");
        console.log(formattedMessages);
    } catch (error: any) {
        console.error(error);
        await sendGroupTextMsg(group_id, `bot 执行错误：${error.message}`);
    }
}
