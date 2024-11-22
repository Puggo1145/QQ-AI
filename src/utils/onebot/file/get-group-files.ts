import axios from "axios";
import type { BotEvent } from "@/types/bot-event";
import type { StandardResponse } from "@/types/standard-res";

interface GroupFile {
    group_id: number;
    file_id: string;
    file_name: string;
    busid: number;
    file_size: number;
    upload_time: number;
    dead_time: number;
    modify_time: number;
    download_times: number;
    uploader: number;
    uploader_name: string;
}
type GroupFilesRes = StandardResponse<{ files: GroupFile[] }>;

/**
 * @description 获取群文件
 * @param group_id 需要获取所有文件信息的群号
 * @returns 群文件根目录下的文件列表
 */
export const getGroupFiles = async (group_id: BotEvent["group_id"]) => {
    try {
        const res = await axios.post<GroupFilesRes>(`http://localhost:${process.env.SEND_PORT}/get_group_root_files`, {
            group_id,
        });

        if (res.data.status !== 'ok' || res.data.retcode !== 0) {
            throw new Error('bot 错误：获取群文件失败');
        }

        return res.data.data.files;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}