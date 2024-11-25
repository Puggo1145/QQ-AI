import axios from "axios";
import type { BotMessage } from "@/utils/onebot/types/bot-message";
import type { StandardResponse } from "@/utils/onebot/types/standard-res";

type GetGroupFileUrlRes = StandardResponse<{
    url: string;
}>;

/**
 * @description 获取群文件 url
 * @param group_id 文件所在群的群号
 * @param file_id 文件 id
 * @returns 文件的本地 url
 */
export const getGroupFileUrl = async (group_id: BotMessage["group_id"], file_id: string) => {
    try {
        const res = await axios.post<GetGroupFileUrlRes>(`http://localhost:${process.env.SEND_PORT}/get_group_file_url`, {
            group_id,
            file_id,
        });

        if (res.data.status !== 'ok' || res.data.retcode !== 0) {
            throw new Error('bot 错误：获取群文件失败');
        }

        return res.data.data.url;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}