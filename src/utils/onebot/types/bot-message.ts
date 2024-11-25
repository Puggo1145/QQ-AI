export interface BotMessage {
    self_id: number;
    user_id: number;
    time: number;
    message_id: number;
    real_id: number;
    message_seq: number;
    message_type: 'group' | string;
    sender: {
        user_id: number;
        nickname: string;
        card: string;
        role: 'owner' | 'admin' | 'member';
        title: string;
    };
    raw_message: string;
    font: number;
    sub_type: 'normal' | string;
    message: Message[]
    message_format: 'array' | string;
    post_type: 'message' | string;
    group_id: number;
}

export type Message = TextMessage | AtMessage | FileMessage | JsonMessage;

export interface TextMessage {
    type: 'text';
    data: {
        text: string; // 文本内容
    };
}
export interface AtMessage {
    type: 'at';
    data: {
        qq: string; // QQ 号
        name: string; // 昵称
    };
}
export interface FileMessage {
    type: 'file';
    data: {
        file: string; // 文件名
        url: string; // 文件 URL
        file_id: string; // 文件 ID
        path: string; // 文件路径
        file_size: string; // 文件大小
    }
}
export interface JsonMessage {
    type: 'json';
    data: {
        data: string;
    }
}
