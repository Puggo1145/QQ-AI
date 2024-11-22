import OpenAI from "openai";

let kimiClient: OpenAI | null = null;

export const initializeKimiClient = () => {
    if (!kimiClient) {
        kimiClient = new OpenAI({
            apiKey: process.env.KIMI_API_KEY,
            baseURL: "https://api.moonshot.cn/v1",
        });
    }
    return kimiClient;
};

export const getKimiClient = () => {
    if (!kimiClient) {
        throw new Error("AI client has not been initialized");
    }
    return kimiClient;
};
