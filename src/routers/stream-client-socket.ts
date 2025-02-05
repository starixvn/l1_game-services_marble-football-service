import { Socket } from "socket.io";
import GameData from "../game-data";
import GameDefinition, { GameSettings } from "../game-definition";
import { InGameConsumer } from "../consumers";

export default class StreamClientSocket {
    definition: GameDefinition;
    gameData: GameData;
    socketClient?: Socket;
    inGameConsumer: InGameConsumer;

    constructor({
        definition,
        gameData,
        inGameConsumer,
    }: {
        definition: any;
        gameData: GameData;
        inGameConsumer: InGameConsumer;
        gameSettings: any;
    }) {
        this.definition = definition;
        this.gameData = gameData;
        this.inGameConsumer = inGameConsumer;
    }

    init(socketClient: Socket) {
        this.socketClient = socketClient;
        this.socketClient.on("join", this.handleJoin.bind(this));
    }

    handleJoin(data: any) {
        if (!this.socketClient) return;
        this.gameData.streamClients[this.socketClient.id] = this.socketClient;
        const { remainingTime, roundId, liveStreamServer, publishedTournament: tournament } = this.gameData;
        const videoResult = this.inGameConsumer.getCurrentVideoResult();
        const matchResult = remainingTime <= 0 || remainingTime >= this.definition.durations.startingRound ? this.gameData?.result : {};
        this.socketClient.emit(this.definition.name, {
            liveStreamServer,
            tournament,
            videoResult,
            remainingTime,
            roundId,
            matchResult,
        });
    }
}
