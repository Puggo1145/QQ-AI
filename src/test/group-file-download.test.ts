import { 
    test,
    expect
} from "@jest/globals";

import { getGroupFiles, getGroupFileUrl } from "../utils/onebot/file";

const testGroupId = 585249482;

test.skip('get all group files', async () => {
    // init env
    process.env.SEND_PORT = '3032';

    const files = await getGroupFiles(testGroupId);
    expect(files).toBeInstanceOf(Array);

    const fileUrlsPromise = files.slice(0, 3).map((file) => {
        const fileUrl = getGroupFileUrl(testGroupId, file.file_id);
        return fileUrl;
    });

    const fileUrls = await Promise.all(fileUrlsPromise);
    expect(fileUrls).toBeInstanceOf(Array);
    fileUrls.forEach((fileUrl) => {
        expect(fileUrl).toBeInstanceOf(String);
    });
});
