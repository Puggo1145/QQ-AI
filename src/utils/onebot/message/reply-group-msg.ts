import axios from "axios";
import type { BotEvent } from "@/types/bot-event";

export const replyGroupMsg = async (
    group_id: BotEvent["group_id"],
    message_id: BotEvent["message_id"],
    message: string
) => {
    try {
        await axios.post(`http://localhost:${process.env.SEND_PORT}/send_group_msg`, {
            group_id,
            message: [
                {
                    type: "reply",
                    data: {
                        id: message_id
                    }
                },
                {
                    type: "text",
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
