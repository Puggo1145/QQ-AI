import { summaryGroupMsgService } from "./summary.service";
import { superSummaryService } from "./super-summary.service";
import { pingPongService } from "./ping-pong.service";
import { 
    checkDevPermission,
    showMessageDetails,
    getMessageHistory,
    getGroupFileList
} from "./dev.service";
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
const showMessageDetailsCommand: Command = {
    execute: (event) => showMessageDetails(event),
    validate: checkDevPermission,
    description: 'dev 命令：显示消息详情'
};
const getMessageHistoryCommand: Command = {
    execute: (event) => getMessageHistory(event),
    validate: checkDevPermission,
    description: 'dev 命令：获取历史消息'
};
const getGroupFileListCommand: Command = {
    execute: (event) => getGroupFileList(event),
    validate: checkDevPermission,
    description: 'dev 命令：获取群文件列表'
};

// registry
const registry: CommandRegistry = new Map();

registry.set('ping', pingCommand);
registry.set('sum', sumCommand);
registry.set('super-sum', superSumCommand);
registry.set('dev-show-msg', showMessageDetailsCommand);
registry.set('dev-get-history', getMessageHistoryCommand);
registry.set('dev-get-group-files', getGroupFileListCommand);

export const getCommand = (command: string) => registry.get(command);
