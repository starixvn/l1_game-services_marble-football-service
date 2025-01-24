const SEGMENT_FLAG_M3U8 = "#EXTINF";
const MEDIA_SEQUENCE_FLAG_M3U8 = "#EXT-X-MEDIA-SEQUENCE";
const KEY_FLAG_M3U8 = "#EXT-X-KEY";
const END_FLAG_M3U8 = "#EXT-X-ENDLIST";
const TARGET_DURATION_FLAG_M3U8 = "#EXT-X-TARGETDURATION";

export const modifyM3U8 = (baseUrl: string, m3u8Content: string, mediaSequence: number, timeToStart: number) => {
    const lines = m3u8Content.split("\n");
    const configLines = [];
    let contentIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(SEGMENT_FLAG_M3U8)) {
            contentIndex = i;
            break;
        }
        if (lines[i].includes(KEY_FLAG_M3U8)) {
            configLines.push(`${KEY_FLAG_M3U8}:METHOD=AES-128,URI=${new URL("encryption.key", baseUrl).toString()}`);
        } else {
            configLines.push(lines[i]);
        }
    }
    configLines.push(`${MEDIA_SEQUENCE_FLAG_M3U8}:${mediaSequence}`);
    configLines.push(`#EXT-X-START:TIME-OFFSET=${timeToStart}`);
    configLines.push(`#EXT-X-DISCONTINUITY`);
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
    return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:${mediaSequence}
#EXT-X-KEY:METHOD=AES-128,URI=${encryptionKey}
#EXT-X-TARGETDURATION:3
#EXT-X-DISCONTINUITY
#EXTINF:2.033333
${fileUrl}`;
};

export const generatePlaylist = () => {
    return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=744000
stream_240p.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=3894000
stream_720p.m3u8`;
};
