import type { BotMessage } from "@/utils/onebot/types/bot-message";

export interface Command {
    execute: (event: BotMessage) => Promise<void>;
    validate?: (event: BotMessage) => boolean;
    description?: string;
}
export type CommandRegistry = Map<string, Command>;
