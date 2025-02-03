import { logger } from "sc-common";
import BaseGameStartup from "sc-game-base/src/core/base-game-startup";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Express } from "express";

export default class GameStartup extends BaseGameStartup {
    dependencies = {
        definition: "definition",
        gameData: "gameData",
        gameCron: "gameCron",
        processBetQueue: "processBetQueue",
        socketRouter: "socketRouter",
        adminSocketRouter: "adminSocketRouter",
        httpRouter: "httpRouter",
        streamClientSocket: "streamClientSocket",
    };

    async start(app: Express, socketServer: Server) {
        const gameNameInSocketNamespace = this.definition.name.toLowerCase();
        this.initHttpRouter(app);

        socketServer.of(`/user/${gameNameInSocketNamespace}`).on("connection", (socketClient: Socket) => {
            this.initSocketRouter(socketClient);
        });

        socketServer.of(`/admin/${gameNameInSocketNamespace}`).on("connection", (socketClient: Socket) => {
            this.initAdminSocketRouter(socketClient);
        });

        socketServer.of(`/stream/${gameNameInSocketNamespace}`).on("connection", (socketClient: Socket) => {
            this.initStreamSocketRouter(socketClient);
        });

        try {
            await this.gameCron.start();
            this.processBetQueue.start();
        } catch (error) {
            logger.logError(error);
        }
    }

    initStreamSocketRouter(socketClient: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        const router = this.container.resolve(this.dependencies.streamClientSocket);

        router.init(socketClient);
    }
}
