import { scheduleJob } from 'node-schedule';
import { TaskRegistration, TaskConfig, ScheduledTaskWithJob } from './types';

export class SchedulerManager {
    private static instance: SchedulerManager;
    private runningJobs: Map<string, ScheduledTaskWithJob>;

    private constructor() {
        this.runningJobs = new Map();
    }

    public static getInstance(): SchedulerManager {
        if (!SchedulerManager.instance) {
            SchedulerManager.instance = new SchedulerManager();
        }
        return SchedulerManager.instance;
    }

    /**
     * Initialize tasks from registry
     */
    public initializeFromRegistry(
        registry: Record<string, { task: TaskRegistration; config: TaskConfig[string] }>
    ): void {
        // Cancel all existing jobs first
        this.cancelAllJobs();

        // Schedule tasks from registry
        for (const [taskId, { task, config }] of Object.entries(registry)) {
            if (!config.enabled) {
                console.log(`Task ${taskId} is disabled`);
                continue;
            }

            // Schedule for each configured group
            config.groups.forEach(groupId => {
                this.scheduleTaskForGroup(task, config, groupId);
            });
        }
    }

    /**
     * Schedule a task for a specific group
     */
    private scheduleTaskForGroup(
        task: TaskRegistration,
        config: TaskConfig[string],
        groupId: number
    ): void {
        const jobId = `${task.id}-${groupId}`;
        const job = scheduleJob(config.cronExpression, async () => {
            try {
                await task.handler({ groupId, ...config.params });
            } catch (error: any) {
                console.error(`Task ${task.id} failed for group ${groupId}:`, error);
            }
        });

        this.runningJobs.set(jobId, {
            taskId: task.id,
            groupId,
            job
        });

        console.log(`Scheduled ${task.id} for group ${groupId} with cron: ${config.cronExpression}`);
    }

    /**
     * Cancel all running jobs
     */
    private cancelAllJobs(): void {
        for (const [jobId, scheduledTask] of this.runningJobs.entries()) {
            scheduledTask.job.cancel();
            this.runningJobs.delete(jobId);
        }
    }

    /**
     * Get all running jobs
     */
    public getRunningJobs(): Map<string, ScheduledTaskWithJob> {
        return new Map(this.runningJobs);
    }
}
