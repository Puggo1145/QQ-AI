import { getGroupMsgHistory, sendGroupTextMsg } from "@/utils/onebot/message";
import { singleChat } from "@/utils/ai/qwen";
import z from "zod";
// import { getGroupFileUrl } from "@/utils/onebot/file";
// utils
import { format, subDays } from "date-fns";
import { parseMessage } from "@/utils/onebot/message";
// types
import type { BotMessage } from "@/utils/onebot/types/bot-message";
import { prompts } from "@/constants/prompts";
import { createBlock, createDoc } from "@/utils/feishu";

interface SuperSummary {
    category: string;
    title: string;
    sender: string;
    time: string;
    content: string;
    files: string[];
    links: string[];
}

export const superSummaryService = async (group_id: BotMessage["group_id"]) => {
    let timeoutId: NodeJS.Timeout | undefined;

    try {
        await sendGroupTextMsg(group_id, "开始总结群事务文档");

        // 设置 15 秒超时提醒
        timeoutId = setTimeout(async () => {
            await sendGroupTextMsg(group_id, "消息较多，需要较长时间，请稍候...");
        }, 20000);

        // 1. 获取最近 7 天的群消息历史
        const history = await getGroupMsgHistory(group_id, 40, {
            timeRange: {
                startTime: subDays(new Date(), 7).getTime(),
                endTime: new Date().getTime()
            }
        });

        // 2. 格式化群消息
        const formattedMessages = history.map((msg) => {
            return {
                sender: msg.sender.nickname,
                time: format(msg.time * 1000, 'yyyy-MM-dd HH:mm'),
                messageType: msg.message[0].type,
                message: parseMessage(msg)
            }
        })

        // 3. 调用 AI 总结群事务 json
        const summary = await singleChat(`${prompts.superSummary}\n${JSON.stringify(formattedMessages)}`);

        // 4. 创建飞书文档
        const doc = await createDoc(
            `群事务总结-${format(new Date(), 'yyyy-MM-dd')}`, 
            process.env.LARK_FOLDER_TOKEN as string
        );

        // 5. 解析 summary 并创建文档 blocks
        const blocks = parseSummaryToFeishuBlock(summary);
        await createBlock(doc.document!.document_id!, doc.document!.document_id!, blocks);

        await sendGroupTextMsg(
            group_id, 
            `群事务总结文档已生成：https://${process.env.LARK_TENANT_ID}.feishu.cn/docx/${doc.document!.document_id}，请查收！\n由 通义千问 总结（AI 大模型可能存在错误，请仔细甄别）`
        );
    } catch (error: any) {
        console.error(error);
        await sendGroupTextMsg(group_id, `bot 执行错误：${error.message}`);
    } finally {
        // 清除超时计时器
        clearTimeout(timeoutId);
    }
}

const superSummarySchema = z.array(z.object({
    category: z.string(),
    title: z.string(),
    sender: z.string(),
    time: z.string(),
    content: z.string(),
    files: z.array(z.object({
        // fileId: z.string(),
        fileName: z.string(),
        // url: z.string(),
    })).optional().default([]),
    links: z.array(z.object({
        url: z.string(),
        title: z.string(),
    })).optional().default([]),
}))

export const parseSummaryToFeishuBlock = (summaryJson: string) => {
    try {
        // 1. 解析群事务 json
        const summary = JSON.parse(summaryJson) as SuperSummary[];
        
        // 2. 进行字段兜底验证
        superSummarySchema.parse(summary);

        // 3. 根据 category 进行分类
        const groupedByCategory = summary.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {} as Record<string, SuperSummary[]>);

        // 4. 构建飞书文档块
        const blocks = [];
        
        for (const [category, items] of Object.entries(groupedByCategory)) {
            // 分类作为 H1
            blocks.push({
                block_type: 3,
                heading1: {
                    elements: [{
                        text_run: {
                            content: category,
                            text_element_style: {
                                bold: true,
                                text_color: 1
                            }
                        }
                    }],
                    style: {}
                }
            });

            // Add items under this category
            items.forEach(item => {
                // 事件标题作为 H3
                blocks.push({
                    block_type: 5,
                    heading3: {
                        elements: [{
                            text_run: {
                                content: item.title,
                                text_element_style: {
                                    bold: true
                                }
                            }
                        }],
                        style: {}
                    }
                });

                // 发送者和时间
                blocks.push({
                    block_type: 2,
                    text: {
                        elements: [
                            {
                                text_run: {
                                    content: `来自：${item.sender} | 时间：${item.time}`,
                                    text_element_style: {
                                        text_color: 5
                                    }
                                }
                            }
                        ],
                        style: {}
                    }
                });

                // 内容
                blocks.push({
                    block_type: 2,
                    text: {
                        elements: [{
                            text_run: {
                                content: item.content
                            }
                        }],
                        style: {}
                    }
                });

                // // 如果有附件，添加文件块
                // if (item.files && item.files.length > 0) {
                //     blocks.push({
                //         block_type: 2,
                //         text: {
                //             elements: [{
                //                 text_run: {
                //                     content: "📎 附件：",
                //                     text_element_style: {
                //                         bold: true
                //                     }
                //                 }
                //             }],
                //             style: {}
                //         }
                //     });

                //     // 为每个文件创建文件块
                //     item.files.forEach(file => {
                //         blocks.push({
                //             block_type: 23,  // File Block
                //             file: {
                //                 token: ""    // 初始为空，后续上传后更新
                //             }
                //         });
                //     });
                // }
            });
        }

        return blocks;
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            throw new Error(`[AI 总结错误]: ${error.message}`);
        }

        throw new Error(error.message);
    }
}
