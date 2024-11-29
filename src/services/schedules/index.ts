import { SchedulerManager } from './scheduler-manager';
import { taskRegistry } from './task-registry';

// Initialize scheduler with all tasks from registry
export const initializeScheduler = () => {
    try {
        const scheduler = SchedulerManager.getInstance();
        scheduler.initializeFromRegistry(taskRegistry);
        console.log('Successfully initialized scheduler with tasks from registry');
    } catch (error: any) {
        console.error('Failed to initialize scheduler:', error.message);
    }
};
