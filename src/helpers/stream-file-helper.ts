const END_FLAG_M3U8 = "#EXT-X-ENDLIST";
const START_FLAG_M3U8 = "#EXTM3U";

export const modifyM3U8 = (m3u8Content: string, mediaSequence: number) => {
    m3u8Content = m3u8Content.replace(END_FLAG_M3U8, "");
    m3u8Content = m3u8Content.replace(START_FLAG_M3U8, `${START_FLAG_M3U8}\n#EXT-X-MEDIA-SEQUENCE:${mediaSequence}`);
    return m3u8Content;
};

export const generateLoopFile = (baseUrl: string, fileName: string, mediaSequence: number) => {
    const encryptionKey = new URL("encryption.key", baseUrl).toString();
    const fileUrl = new URL(fileName, baseUrl).toString();
    return `#EXTM3U
    #EXT-X-VERSION:3
    #EXT-X-MEDIA-SEQUENCE:${mediaSequence}
    #EXT-X-KEY:METHOD=AES-128,URI=${encryptionKey}
    #EXT-X-TARGETDURATION:11
    #EXTINF:
    ${fileUrl}`;
};
