const SEGMENT_FLAG_M3U8 = "#EXTINF";
const MEDIA_SEQUENCE_FLAG_M3U8 = "#EXT-X-MEDIA-SEQUENCE";
const KEY_FLAG_M3U8 = "#EXT-X-KEY";
const END_FLAG_M3U8 = "#EXT-X-ENDLIST";

export const modifyM3U8 = (baseUrl: string, m3u8Content: string, mediaSequence: number, timeToStart: number) => {
    const lines = m3u8Content.split("\n");
    const configLines = [];
    let contentIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(SEGMENT_FLAG_M3U8)) {
            contentIndex = i;
            break;
        }
        if (lines[i].includes(MEDIA_SEQUENCE_FLAG_M3U8)) {
            configLines.push(`${MEDIA_SEQUENCE_FLAG_M3U8}:${mediaSequence}`);
        } else if (lines[i].includes(KEY_FLAG_M3U8)) {
            configLines.push(`${KEY_FLAG_M3U8}:METHOD=AES-128,URI=${new URL("encryption.key", baseUrl).toString()}`);
        } else {
            configLines.push(lines[i]);
        }
    }
    configLines.push(`#EXT-X-START:TIME-OFFSET=${timeToStart}`);
    const contentLines: string[] = [];
    for (let i = contentIndex; i < lines.length; i += 2) {
        if (lines[i].includes(END_FLAG_M3U8)) {
            break;
        }
        contentLines.push(lines[i]);
        contentLines.push(new URL(lines[i + 1], baseUrl).toString());
    }

    return [...configLines, ...contentLines].join("\n");
};

export const generateLoopFile = (baseUrl: string, fileName: string, mediaSequence: number) => {
    const encryptionKey = new URL("encryption.key", baseUrl).toString();
    const fileUrl = new URL(fileName, baseUrl).toString();
    return `#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-MEDIA-SEQUENCE:${mediaSequence}\n#EXT-X-KEY:METHOD=AES-128,URI=${encryptionKey}\n#EXT-X-TARGETDURATION:11\n#EXTINF:\n${fileUrl}`;
};
