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
        } else if (lines[i].includes(MEDIA_SEQUENCE_FLAG_M3U8)) {
        } else {
            configLines.push(lines[i]);
        }
    }
    const segment: { duration: number; url: string }[] = [];
    let durationSum = 0;
    let chooseSegmentIndex = 0;
    let flag = false;
    let timeOffset = 0;
    for (let i = contentIndex; i < lines.length; i += 2) {
        if (lines[i].includes(END_FLAG_M3U8)) {
            break;
        }
        segment.push({ duration: parseFloat(lines[i].split(":")[1]), url: new URL(lines[i + 1], baseUrl).toString() });
        durationSum += parseFloat(lines[i].split(":")[1]);
        if (durationSum >= timeToStart && !flag) {
            chooseSegmentIndex = segment.length - 1;
            timeOffset = durationSum - timeToStart;
            flag = true;
        }
    }
    configLines.push(`#EXT-X-MEDIA-SEQUENCE:${chooseSegmentIndex}`);
    configLines.push(`#EXT-X-START:TIME-OFFSET=${timeOffset}`);
    configLines.push(`#EXT-X-DISCONTINUITY`);
    const segmentToPlay = segment.slice(
        chooseSegmentIndex,
        chooseSegmentIndex + 3 > segment.length ? segment.length : chooseSegmentIndex + 3
    );
    return [...configLines, ...segmentToPlay.map((item) => `#EXTINF:${item.duration},\n${item.url}`)].join("\n");
};

export const generateLoopFile = (baseUrl: string, fileName: string, mediaSequence: number) => {
    const encryptionKey = new URL("encryption.key", baseUrl).toString();
    const fileUrl = new URL(fileName, baseUrl).toString();
    return `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-KEY:METHOD=AES-128,URI=${encryptionKey}
#EXT-X-MEDIA-SEQUENCE:${mediaSequence}
#EXT-X-TARGETDURATION:3
#EXT-X-DISCONTINUITY
#EXTINF:2,
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
