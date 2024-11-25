import { Request } from "express";
import { getCommand } from "@/services/onebot";
import { devService } from "@/services/dev/dev.service";
import { extractUserMsg } from "@/utils/common/extract-user-msg";
import { replyGroupMsg } from "@/utils/onebot/message";
import type { BotMessage } from "@/utils/onebot/types/bot-message";

export const onebotController = async (req: Request) => {
    const event = req.body as BotMessage;
    const user_msg = extractUserMsg(event.raw_message);

    // 开发者命令
    if (user_msg.startsWith('dev-')) {
        await devService(event, user_msg);
        return;
    }

    // 查找并执行命令
    const command = getCommand(user_msg);
    if (command) {
        try {
            // 如果有验证函数，先验证
            if (command.validate && !command.validate(event)) {
                await replyGroupMsg(event.group_id, event.message_id, "您没有权限执行此命令");
                return;
            }
            
            await command.execute(event);
        } catch (error: any) {
            await replyGroupMsg(event.group_id, event.message_id, `命令执行失败: ${error.message}`);
        }
    } else {
        await replyGroupMsg(event.group_id, event.message_id, "未识别的命令");
    }
}
