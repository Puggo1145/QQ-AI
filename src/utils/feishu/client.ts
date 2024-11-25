import * as lark from '@larksuiteoapi/node-sdk';

let client: lark.Client;

export const initFeishuClient = () => {
    if (!process.env.LARK_APP_ID || !process.env.LARK_APP_SECRET) {
        throw new Error('Feishu credentials not found in environment variables');
    }

    client = new lark.Client({
        appId: process.env.LARK_APP_ID,
        appSecret: process.env.LARK_APP_SECRET,
    });
};

export const getClient = (): lark.Client => {
    if (!client) {
        initFeishuClient();
    }
    return client;
};
