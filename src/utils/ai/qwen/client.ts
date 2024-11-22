import OpenAI from "openai";

let qwenClient: OpenAI | null = null;

export const initializeQwenClient = () => {
    if (!qwenClient) {
        qwenClient = new OpenAI({
            apiKey: process.env.QWEN_API_KEY,
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        });
    }
    return qwenClient;
};

export const getQwenClient = () => {
    if (!qwenClient) {
        throw new Error("AI client has not been initialized");
    }
    return qwenClient;
};
