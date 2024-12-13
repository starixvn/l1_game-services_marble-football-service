import { Core } from "sc-game-base";
import { GameResultServiceConsumer } from "../consumers";
import { Socket } from "socket.io";

const BET_DETAILS_EVENT = "betDetails";

type BetDetailPayload = {
    mode: string;
    timeZoneOffset: number;
    roundId: number;
    language: string;
};

export default class SocketRouter extends Core.Routers.BaseSocketRouter {
    gameResultServiceConsumer: GameResultServiceConsumer;

    constructor({
        definition,
        gameData,
        userSignInConsumer,
        inGameConsumer,
        placeBetConsumer,
        userDisconnectConsumer,
        userSignInPublisher,
        historyQuery,
        logService,
        playGamePermissionValidator,
        roundQuery,
        gameResultServiceConsumer,
    }: any) {
        super({
            definition,
            gameData,
            userSignInConsumer,
            inGameConsumer,
            placeBetConsumer,
            userDisconnectConsumer,
            userSignInPublisher,
            historyQuery,
            logService,
            playGamePermissionValidator,
            roundQuery,
        });

        this.gameResultServiceConsumer = gameResultServiceConsumer;
    }

    init(socketClient: Socket) {
        super.init(socketClient);
        this.socketClient.on(BET_DETAILS_EVENT, this.handleBetDetails.bind(this));
    }

    async handleBetDetails(payload: BetDetailPayload) {
        try {
            if (!this.verify()) {
                return;
            }

            const { playerId, operatorId, siteId } = this.gameData.realPlayers[this.socketClient.id].session;
            const { mode, timeZoneOffset, roundId, language } = payload;

            const result = await this.gameResultServiceConsumer.getUrl({
                playerId,
                operatorId,
                siteId,
                roundId,
                mode,
                timeZoneOffset,
                language,
            });

            if (result.isAuthenticated) {
                this.socketClient.emit(this.definition.name, { betDetailsUrl: result.redirectUrl });
            }
        } catch (error) {
            this.logService.logError(error);
        }
    }
}
