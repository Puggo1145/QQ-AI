import axios from "axios";
// types
import type { BotMessage } from "@/utils/onebot/types/bot-message";

export const sendGroupTextMsg = async (group_id: BotMessage["group_id"], message: string) => {    
    try {
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
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}
