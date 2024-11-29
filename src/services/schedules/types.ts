import { Job } from 'node-schedule';

// Task handler type - the basic function that executes the task
export type TaskHandler<T = any> = (params: T) => Promise<void>;

// Base task registration interface
export interface TaskRegistration<T = any> {
    id: string;
    description: string;
    handler: TaskHandler<T>;
}

// Task configuration interface
export interface TaskConfig {
    [taskId: string]: {
        cronExpression: string;
        enabled: boolean;
        groups: number[];
        params?: any;  // Additional parameters for the task
    }
}

// Internal task tracking interface
export interface ScheduledTaskWithJob {
    taskId: string;
    groupId: number;
    job: Job;
}
