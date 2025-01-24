import { TableHttpRouter } from "sc-game-base/src/table/routers";
import GameData from "../game-data";
import GameDefinition from "../game-definition";
import { generateLoopFile, generatePlaylist, modifyM3U8 } from "../helpers/stream-file-helper";

const MEDIA_SEQUENCE_MAX = 200;
const STREAM_MIME_TYPE = "application/vnd.apple.mpegurl";
const VIDEO_DEFAULT = "cd99ef2549fe8aa77a7c8c65485a7d9f615f7cc8ee8d0d944f6d98497633fe2c";
let mediaSequenceFlag = true;

export class HttpRouter extends TableHttpRouter {
    declare gameData: GameData;

    definition: GameDefinition;

    constructor(appConfigs: any, gameData: GameData, historyQuery: any, metricQuery: any, logService: any, definition: GameDefinition) {
        super(appConfigs, gameData, historyQuery, metricQuery, logService);
        this.definition = definition;
    }

    init(app: any) {
        super.init(app);
        app.get("/api/stream.m3u8", (_: any, res: any) => {
            res.setHeader("Content-Type", STREAM_MIME_TYPE);
            res.send(generatePlaylist());
        });
        app.get("/api/stream_240p.m3u8", (_: any, res: any) => this.handleLiveStream(res, "240p"));
        app.get("/api/stream_720p.m3u8", (_: any, res: any) => this.handleLiveStream(res, "720p"));
    }

    async handleLiveStream(res: any, resolution: string = "720p") {
        const { remainingTime, roundId } = this.gameData;
        const { durations } = this.definition;
        const isFirstHalfVideo = remainingTime < durations.streamingVideo && remainingTime >= durations.streamingVideo - 50;
        const isSecondHalfVideo = remainingTime < durations.streamingVideo - 53 && remainingTime > 0;
        let m3u8Content = "";
        let timeToStart = durations.streamingVideo - remainingTime;
        if (isFirstHalfVideo) {
            m3u8Content = await fetch(
                new URL(`${this.gameData.result.firstHalfVideo}_${resolution}.m3u8`, this.appConfigs.liveStreamServer).toString()
            ).then((res) => res.text());
            m3u8Content = modifyM3U8(this.appConfigs.liveStreamServer, m3u8Content, 0, timeToStart);
        } else if (isSecondHalfVideo) {
            m3u8Content = await fetch(
                new URL(`${this.gameData.result.secondHalfVideo}_${resolution}.m3u8`, this.appConfigs.liveStreamServer).toString()
            ).then((res) => res.text());
            timeToStart = durations.streamingVideo - 53 - remainingTime;
            m3u8Content = modifyM3U8(this.appConfigs.liveStreamServer, m3u8Content, 0, timeToStart);
        } else {
            if (mediaSequenceFlag) {
                mediaSequenceFlag = false;
                m3u8Content = generatePlaylist();
            } else {
                mediaSequenceFlag = true;
                m3u8Content = generateLoopFile(this.appConfigs.liveStreamServer, `${VIDEO_DEFAULT}_${resolution}0.ts`, 0);
            }
        }

        res.setHeader("Content-Type", STREAM_MIME_TYPE);
        res.send(m3u8Content);
    }
}
