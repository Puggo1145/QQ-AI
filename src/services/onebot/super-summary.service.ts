import { getGroupMsgHistory } from "../../utils/onebot/message/get-group-msg-history";
// utils
import { subDays } from "date-fns";
// types
import type { BotEvent } from "../../types/bot-event";

export const superSummaryService = async (group_id: BotEvent["group_id"]) => {
    const history = await getGroupMsgHistory(group_id, 200, {
        includeBotMessage: false,
        timeRange: {
            startTime: subDays(new Date(), 7).getTime(),
            endTime: new Date().getTime()
        }
    });
}
