import axios from "axios";
// types
import type { BotMessage } from "../../utils/onebot/types/bot-message";

export const pingPongService = async (group_id: BotMessage["group_id"]) => {
    // 向 localhost:3032/send_group_msg 发送消息
    await axios.post('http://localhost:3032/send_group_msg', {
        group_id,
        message: [
            {
                type: 'text',
                data: {
                    text: 'pong'
                }
            }
        ]
    });
}
