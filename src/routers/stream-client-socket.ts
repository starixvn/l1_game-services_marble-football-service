import { Socket } from "socket.io";
import GameData from "../game-data";
import GameDefinition from "../game-definition";

const MATCH_VIDEO_RESULT_TIME = 51;

export default class StreamClientSocket {
    definition: GameDefinition;
    gameData: GameData;
    socketClient?: Socket;

    constructor({ definition, gameData }: { definition: any; gameData: GameData }) {
        this.definition = definition;
        this.gameData = gameData;
    }

    init(socketClient: Socket) {
        this.socketClient = socketClient;
        this.socketClient.on("join", this.handleJoin.bind(this));
    }

    handleJoin(data: any) {
        if (!this.socketClient) return;
        this.gameData.streamClients[this.socketClient.id] = this.socketClient;
        const liveStreamServer = this.gameData.liveStreamServer;
        const tournament = this.gameData.publishedTournament;
        const videoResult = this.getCurrentVideoResult();
        this.socketClient.emit(this.definition.name, {
            liveStreamServer,
            tournament,
            videoResult,
        });
    }

    getCurrentVideoResult() {
        const { durations } = this.definition;

        const remainingTime = this.gameData.remainingTime;

        const isFirstHalf = remainingTime < durations.streamingVideo && remainingTime >= durations.streamingVideo - MATCH_VIDEO_RESULT_TIME;
        const isSecondHalf = remainingTime < durations.streamingVideo - MATCH_VIDEO_RESULT_TIME && remainingTime >= 0;

        const isShowingResult = remainingTime <= durations.wholeRound && remainingTime > durations.startingRound;

        if (isFirstHalf) {
            return {
                firstHalfVideo: this.gameData.result?.firstHalfVideo,
                firstHalfTimeline: this.gameData.result?.firstHalfTimeline,
                firstHalf: this.gameData.result?.firstHalf,
            };
        }

        if (isSecondHalf) {
            return {
                firstHalfVideo: this.gameData.result?.firstHalfVideo,
                secondHalfVideo: this.gameData.result?.secondHalfVideo,
                firstHalfTimeline: this.gameData.result?.firstHalfTimeline,
                secondHalfTimeline: this.gameData.result?.secondHalfTimeline,
                firstHalf: this.gameData.result?.firstHalf,
                secondHalf: this.gameData.result?.secondHalf,
            };
        }

        if (isShowingResult) {
            return {
                firstHalfTimeline: this.gameData.result?.firstHalfTimeline,
                secondHalfTimeline: this.gameData.result?.secondHalfTimeline,
                firstHalf: this.gameData.result?.firstHalf,
                secondHalf: this.gameData.result?.secondHalf,
            };
        }

        return {};
    }
}
