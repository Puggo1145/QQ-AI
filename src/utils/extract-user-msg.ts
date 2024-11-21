export const extractUserMsg = (raw_message: string) => {
    const matchedMsg = raw_message.match(/\[CQ:at,.*?\]\s*(.*)/)?.[1];
    if (matchedMsg) {
        return matchedMsg.trim();
    }

    return raw_message;
}
