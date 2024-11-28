import { initializeKimiClient } from "./kimi/client";
import { initializeQwenClient } from "./qwen/client";
import { eventBus } from "../event-bus";

eventBus.on('init-ai-clients', () => {
    const apiKeys = {
        KIMI_API_KEY: process.env.KIMI_API_KEY,
        QWEN_API_KEY: process.env.QWEN_API_KEY,
    };

    if (Object.values(apiKeys).every(key => key === undefined)) {
        console.warn("没有提供 AI API Key，请在 .env 文件中设置 API Key");
        process.exit(1);
    };

    apiKeys.KIMI_API_KEY && initializeKimiClient();
    apiKeys.QWEN_API_KEY && initializeQwenClient();
});
