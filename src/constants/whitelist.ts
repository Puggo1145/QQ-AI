import z from "zod";

// 群白名单配置，只有被注册的群的消息才会被处理
export const groupWhitelist: number[] = [];
// 开发者白名单配置，只有注册的开发者才能使用 dev 命令
export const developerWhitelist: number[] = [];

export const initializeGroupWhitelist = () => {
    try {
        // 非空检查
        if (!process.env.GROUP_WHITELIST) {
            throw new Error("没有配置群白名单，请在 .env 文件中的 GROUP_WHITELIST 设置要机器人接管的群 id，如有多个 id，请用英文逗号(,)隔开");
        }
        
        // 白名单解析和纯数字检查
        const groupIds = process.env.GROUP_WHITELIST
        .split(',')
        .map(id => parseInt(id.trim()));
        const validatedIds = z.array(z.number()).parse(groupIds);
        groupWhitelist.push(...validatedIds);
        
        return groupWhitelist;
    } catch (error: any) {
        console.error("群白名单配置错误:", error.message);
        process.exit(1);
    }
}

export const initializeDeveloperWhitelist = () => {
    try {
        if (!process.env.DEVELOPER_WHITELIST) {
            console.warn("没有配置开发者白名单，dev 命令将不可用。您可以在 .env 文件中的 DEVELOPER_WHITELIST 设置开发者 id 来允许开发者使用 dev 命令，如有多个 id，请用英文逗号(,)隔开");
            return [];
        }
        
        // 白名单解析和纯数字检查
        const developerIds = process.env.DEVELOPER_WHITELIST
        .split(',')
        .map(id => parseInt(id.trim()));
        const validatedIds = z.array(z.number()).parse(developerIds);
        developerWhitelist.push(...validatedIds);
        
        return developerWhitelist;
    } catch (error: any) {
        console.error(error);
        process.exit(1);
    }
}
