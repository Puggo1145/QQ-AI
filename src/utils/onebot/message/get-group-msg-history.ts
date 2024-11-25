import axios from "axios";
import { z } from "zod";
// utils
import { mergeConfig } from "@/utils/common/merge-config";
// types
import type { BotMessage } from "@/utils/onebot/types/bot-message";
import type { StandardResponse } from "@/utils/onebot/types/standard-res";

type GroupMsgHistory = StandardResponse<{ messages: BotMessage[] }>;
interface GroupHistoryConfig {
    includeBotMessage?: boolean;
    timeRange?: {
        startTime?: number; // Unix timestamp in milliseconds
        endTime?: number;   // Unix timestamp in milliseconds
    };
}

const defaultConfig: GroupHistoryConfig = {
    includeBotMessage: false,
    timeRange: undefined
}

const schema = z.object({
    groupId: z.number(),
    count: z.number().max(200),
    config: z.object({
        includeBotMessage: z.boolean(),
        timeRange: z.object({
            startTime: z.number().optional(),
            endTime: z.number().optional()
        }).optional()
    })
})

/**
 * @description 获取群消息历史
 * @param groupId 群号
 * @param count 获取的消息数量, 最大 200 条
 * @param config 配置
 * @returns 消息列表
 */
export const getGroupMsgHistory = async (
    groupId: BotMessage["group_id"],
    count: number = 200,
    userConfig: GroupHistoryConfig = defaultConfig
) => {
    const mergedConfig = mergeConfig(defaultConfig, userConfig);

    try {
        schema.parse({
            groupId,
            count,
            config: mergedConfig
        });

        const res = await axios.post<GroupMsgHistory>(`http://localhost:${process.env.SEND_PORT}/get_group_msg_history`, { 
            group_id: groupId,
            count,
        });

        if (res.data.status !== 'ok' || res.data.retcode !== 0) {
            throw new Error(`获取历史消息失败: ${res.data.message}`);
        }

        let messages = res.data.data.messages;

        // 默认过滤 bot 消息
        if (!mergedConfig.includeBotMessage) {
            messages = messages.filter(msg => msg.sender.user_id !== Number(process.env.BOT_QQ_ID));
        }

        // 根据时间范围过滤消息
        if (mergedConfig.timeRange) {
            messages = messages.filter(msg => {
                const messageTime = msg.time * 1000; // 转换为毫秒
                const { startTime, endTime } = mergedConfig.timeRange!;

                if (startTime && messageTime < startTime) return false;
                if (endTime && messageTime > endTime) return false;

                return true;
            });
        }

        // 过滤掉 message 为空的消息
        messages = messages.filter(msg => msg.message.length > 0);

        return messages;
    } catch (error: any) {
        console.error(error);
        if (error instanceof z.ZodError) {
            throw new Error(`参数校验不通过: ${error.message}`);
        }

        throw new Error(error.message);
    }
}
