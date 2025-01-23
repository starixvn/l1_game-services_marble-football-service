import { TableHttpRouter } from "sc-game-base/src/table/routers";
import GameData from "../game-data";
import GameDefinition from "../game-definition";
import { generateLoopFile, modifyM3U8 } from "../helpers/stream-file-helper";

const MEDIA_SEQUENCE_MAX = 200;
const STREAM_MIME_TYPE = "application/vnd.apple.mpegurl";
const VIDEO_DEFAULT = "cd99ef2549fe8aa77a7c8c65485a7d9f615f7cc8ee8d0d944f6d98497633fe2c_720p0.ts";

export class HttpRouter extends TableHttpRouter {
    declare gameData: GameData;

    definition: GameDefinition;

    constructor(appConfigs: any, gameData: GameData, historyQuery: any, metricQuery: any, logService: any, definition: GameDefinition) {
        super(appConfigs, gameData, historyQuery, metricQuery, logService);
        this.definition = definition;
    }

    init(app: any) {
        super.init(app);
        app.get("/api/stream.m3u8", (_: any, res: any) => this.handleLiveStream(res));
    }

    async handleLiveStream(res: any) {
        const { remainingTime } = this.gameData;
        const { durations } = this.definition;
        const mediaSequence = MEDIA_SEQUENCE_MAX - remainingTime;
        const isStreamingVideo = remainingTime < durations.streamingVideo && remainingTime >= durations.startingRound;
        let m3u8Content = "";
        if (isStreamingVideo) {
            if (this.gameData.result.secondHalfVideo) {
                m3u8Content = await fetch(
                    new URL(`${this.gameData.result.secondHalfVideo}.m3u8`, this.appConfigs.liveStreamServer).toString()
                ).then((res) => res.text());
            } else {
                m3u8Content = await fetch(
                    new URL(`${this.gameData.result.firstHalfVideo}.m3u8`, this.appConfigs.liveStreamServer).toString()
                ).then((res) => res.text());
            }
            m3u8Content = modifyM3U8(m3u8Content, mediaSequence);
        } else {
            m3u8Content = generateLoopFile(this.appConfigs.liveStreamServer, VIDEO_DEFAULT, mediaSequence);
        }

        res.setHeader("Content-Type", STREAM_MIME_TYPE);
        res.send(m3u8Content);
    }
}
