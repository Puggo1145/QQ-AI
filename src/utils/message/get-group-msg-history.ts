import axios from "axios";
import { BotEvent, Message } from "../../types/bot-event";
import type { StandardResponse } from "../../types/standard-res";

type GroupMsgHistory = StandardResponse<{ messages: Message[] }>;

export const getGroupMsgHistory = async (group_id: BotEvent["group_id"], count: number) => {
    try {
        const res = await axios.post<GroupMsgHistory>('http://localhost:3032/get_group_msg_history', {
            group_id,
            count
        });

        if (res.data.status !== 'ok' || res.data.retcode !== 0) {
            throw new Error('获取历史消息失败');
        }
        
        return res.data.data.messages;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}