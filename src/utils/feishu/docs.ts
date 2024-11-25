import * as lark from '@larksuiteoapi/node-sdk';
import { getClient } from "./client";
import { tokenManager } from './token-manager';
// import axios from 'axios';
// import * as fs from 'fs';
// import * as path from 'path';

export const createDoc = async (title: string, folder_token: string) => {
    try {
        const client = getClient();

        const token = await tokenManager.getTenantAccessToken();
        // 创建文档
        const res = await client.docx.document.create({
            data: {
                title,
                folder_token,
            },
        }, lark.withTenantKey(token));
        
        if (res.code !== 0) {
            throw new Error(res.msg);
        }

        // 设置公开可阅读权限
        await client.drive.permissionPublic.patch({
            path: {
                token: res.data!.document!.document_id!,
            },
            params: {
                type: 'docx',
            },
            data: {
                external_access: true,
                security_entity: "anyone_can_view",
                share_entity: "anyone"
            },
        }, lark.withTenantKey(token));
        
        return res.data!;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

// 创建块
export const createBlock = async (document_id: string, block_id: string, blocks: any[]) => {
    try {
        const token = await tokenManager.getTenantAccessToken();
        const res = await getClient().docx.documentBlockChildren.create({
            path: {
                document_id,
                block_id,
            },
            data: {
                children: blocks,
                index: 0,
            },
        }, lark.withTenantKey(token));

        if (res.code !== 0) {
            throw new Error(res.msg);
        }

        return res.data!;
    } catch (error: any) {
        throw new Error(error.message);
    }
}

// 上传文件到飞书
// export const uploadFileToDoc = async (localUrl: string, fileName: string, fileBlockId: string) => {
//     try {
//         const token = await tokenManager.getTenantAccessToken();
//         const client = getClient();

//         // 1. 下载文件到临时目录
//         const response = await axios.get(localUrl, { responseType: 'stream' });
//         const tempPath = path.join(process.cwd(), 'temp', fileName);
        
//         // 确保临时目录存在
//         await fs.promises.mkdir(path.dirname(tempPath), { recursive: true });
        
//         // 将文件流写入临时文件
//         const writer = fs.createWriteStream(tempPath);
//         response.data.pipe(writer);
        
//         await new Promise((resolve, reject) => {
//             writer.on('finish', resolve);
//             writer.on('error', reject);
//         });

//         // 2. 上传文件到飞书
//         const fileStream = fs.createReadStream(tempPath);
//         const uploadRes = await client.drive.media.uploadAll({
//             data: {
//                 file_name: fileName,
//                 file: fileStream,
//                 parent_type: "docx_file",
//                 parent_node: fileBlockId,
//                 size: fs.statSync(tempPath).size,
//             },
//         }, lark.withTenantKey(token));

//         if (!uploadRes) {
//             throw new Error('Failed to upload file');
//         }

//         // 3. 清理临时文件
//         await fs.promises.unlink(tempPath);

//         // 4. 更新文件块
//         const updateRes = await client.docx.documentBlock.batchUpdate({
//             path: {
//                 document_id: fileBlockId,
//             },
//             data: {
//                 requests: [
//                     {
//                         replace_file: {
//                             token: uploadRes.file_token!,
//                         }
//                     }
//                 ]
//             }
//         }, lark.withTenantKey(token));

//         if (updateRes.code !== 0) {
//             throw new Error(updateRes.msg);
//         }

//         return uploadRes.file_token;
//     } catch (error: any) {
//         throw new Error(`Failed to upload file: ${error.message}`);
//     }
// }

