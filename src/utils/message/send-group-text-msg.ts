import axios from "axios";
// types
import type { BotEvent } from "../../types/bot-event";

export const sendGroupTextMsg = async (group_id: BotEvent["group_id"], message: string) => {    
    await axios.post(`http://localhost:${process.env.SEND_PORT}/send_group_msg`, {
        group_id,
        message: [
            {
                type: 'text',
                data: {
                    text: message
                }
            }
        ]
    });
}
