import OpenAI from "openai";

let client: OpenAI | null = null;

export const initializeClient = () => {
    if (!client) {
        client = new OpenAI({
            apiKey: process.env.KIMI_API_KEY,
            baseURL: "https://api.moonshot.cn/v1",
        });
    }
    return client;
};

export const getClient = () => {
    if (!client) {
        throw new Error("AI client has not been initialized");
    }
    return client;
};
