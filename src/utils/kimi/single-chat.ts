import { getClient } from "./client";

export const singleChat = async (msg: string) => {
    const client = getClient();

    try {
        const completion = await client.chat.completions.create({
            model: "moonshot-v1-8k",
            messages: [
                { role: "system", content: "你是 QQ AI Bot，你将帮助 QQ 群用户解决问题，提供简洁、清晰、安全和有帮助的回答。" },
                { role: "user", content: msg }
            ],
            temperature: 0.5,
        });
        
        const kimiRes = completion.choices[0].message.content;
        if (!kimiRes) {
            throw new Error("无响应内容");
        }

        return kimiRes;
    } catch (error: any) {
        throw new Error("[KIMI 响应失败] " + error.message);
    }
};
