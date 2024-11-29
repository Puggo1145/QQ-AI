import { superSummaryService } from '../onebot/super-summary.service';
import { sendGroupTextMsg } from '@/utils/onebot/message';
import type { TaskRegistration, TaskConfig } from './types';

// Task registry - all tasks and their configurations
export const taskRegistry: Record<string, {
    task: TaskRegistration;
    config: TaskConfig[string];
}> = {
    'group-super-sum': {
        task: {
            id: 'group-super-sum',
            description: '定时任务：将群消息总结为飞书文档',
            handler: async ({ groupId }) => {
                await sendGroupTextMsg(groupId, "开始执行定时任务：将群消息总结为飞书文档");
                await superSummaryService(groupId)
            }
        },
        config: {
            enabled: true,
            cronExpression: '50 17 * * 5', // Every Friday at 5:50 PM
            groups: [521054591],
            params: {}
        }
    }
    // Add more tasks here
};
