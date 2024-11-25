import type {
    BotMessage,
    TextMessage,
    FileMessage,
    JsonMessage,
} from '../types/bot-message';
import { extractUserMsg } from '@/utils/common/extract-user-msg';

// 文件消息解析器
const parseFileMessage = (data: FileMessage["data"]) => {
    return {
        // fileId: data.file_id,
        fileName: data.file,
        // url: data.url
    }
};

// 文本消息解析器
const parseTextMessage = (data: TextMessage["data"]) => {
    return data;
};

// At消息解析器
const parseAtMessage = (rawMessage: BotMessage["raw_message"]) => {
    return `${extractUserMsg(rawMessage)}`;
};

// JSON消息解析器
interface ParsedJsonData {
    app: string; // 应用名称，如 'com.tencent.structmsg'
    config: {
        ctime: number;
        forward: number;
        token: string;
        type: string;
    };
    extra: {
        app_type: number;
        appid: number;
        msg_seq: number;
        uin: number;
    };
    meta?: {
        news?: {
            action: string;
            android_pkg_name: string;
            app_type: number;
            appid: number;
            ctime: number;
            desc: string;
            jumpUrl: string;
            preview: string;
            source_icon: string;
            source_url: string;
            tag: string;
            title: string;
            uin: number;
        };
    };
    prompt: string;
    ver: string;
    view: string;
}
const parseJsonMessage = (jsonString: JsonMessage["data"]) => {
    try {
        const data = JSON.parse(jsonString.data) as ParsedJsonData;
        if (data.meta && data.meta.news) {
            return {
                jumpUrl: data.meta.news.jumpUrl,
                title: data.meta.news.title,
            };
        }
    } catch (error: any) {
        console.error(error.message);
        return '[未知消息]';
    }
};

// 未知类型消息解析器
const parseUnknownMessage = () => {
    return '[未知消息]';
};

// 消息解析器映射表
const messageParserMap = {
    'file': parseFileMessage,
    'text': parseTextMessage,
    'json': parseJsonMessage
};

// 消息解析主函数
export const parseMessage = (botMessage: BotMessage) => {
    const messageType = botMessage.message[0].type;
    if (messageType === 'at') {
        return parseAtMessage(botMessage.raw_message);
    }

    const parser = messageParserMap[messageType] ?? parseUnknownMessage;
    return parser(botMessage.message[0].data as any);
};
