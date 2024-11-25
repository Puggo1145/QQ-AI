import { summaryGroupMsgService } from "./summary.service";
import { superSummaryService } from "./super-summary.service";
import { pingPongService } from "./ping-pong.service";
// types
import { Command, CommandRegistry } from "./types";

// commands
const pingCommand: Command = {
    execute: (event) => pingPongService(event.group_id),
    description: '测试机器人是否在线'
};
const sumCommand: Command = {
    execute: (event) => summaryGroupMsgService(event.group_id),
    description: '总结群消息为文本'
};
const superSumCommand: Command = {
    execute: (event) => superSummaryService(event.group_id),
    description: '总结群消息到飞书文档'
};

// registry
const registry: CommandRegistry = new Map();

registry.set('ping', pingCommand);
registry.set('sum', sumCommand);
registry.set('super-sum', superSumCommand);

export const getCommand = (command: string) => registry.get(command);
