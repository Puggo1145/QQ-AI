// 导入所有需要初始化的模块
import { initializeScheduler } from './services/schedules';
import { initializeGroupWhitelist, initializeDeveloperWhitelist } from './constants/whitelist';
import { initializeAiClients } from './utils/ai';

// 初始化顺序
const initSequence = [
    {
        initializeHandler: initializeAiClients,
        description: '初始化 AI client'
    },
    {
        initializeHandler: initializeGroupWhitelist,
        description: '初始化群白名单'
    },
    {
        initializeHandler: initializeDeveloperWhitelist,
        description: '初始化开发者白名单'
    },
    {
        initializeHandler: initializeScheduler,
        description: '初始化定时任务'
    }
];

/**
 * 执行所有初始化任务
 */
export const initialize = () => {
    console.log('Starting initialization sequence...');
    
    initSequence.forEach(({ initializeHandler, description }) => {
        try {
            console.log(`[Init] ${description}...`);
            initializeHandler();
        } catch (error: any) {
            console.error(`[Init Error] Failed to ${description}:`, error.message);
            process.exit(1);
        }
    });

    console.log('Initialization sequence completed.');
};
