import fs from "fs";
import { parseSummaryToFeishuBlock } from "../services/onebot/super-summary.service";
import { createDoc, createBlock } from "../utils/feishu";
import { test, expect } from "@jest/globals";

test("parseSummaryToFeishuBlock", async () => {
    // 注入环境变量
    process.env.LARK_APP_ID = 'cli_a7b552a58cf5d00c';
    process.env.LARK_APP_SECRET = '8xzwuXI51HvQIwcc04BfWhDK2IMnAOgj';
    process.env.LARK_FOLDER_TOKEN = 'HwYjf3wIslXoJIdauDFclO0Znxq';

    const summaryJson = fs.readFileSync("./src/test/super-sum.json", "utf-8");
    const blocks = parseSummaryToFeishuBlock(summaryJson);
    expect(blocks).toBeDefined();

    const doc = await createDoc('test1', 'Vx1bfDWoAlNcMydNNZUcRCyvnxf');
    expect(doc).toBeDefined();

    const block = await createBlock(doc?.document!.document_id!, doc?.document!.document_id!, blocks);
    expect(block).toBeDefined();
});
