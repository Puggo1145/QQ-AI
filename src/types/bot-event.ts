export interface BotEvent {
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
    message: Array<{
        type: 'text' | string;
        data: Record<string, any>;
    }>;
    message_format: 'array' | string;
    post_type: 'message' | string;
    group_id: number;
}

export type Message = BotEvent;
