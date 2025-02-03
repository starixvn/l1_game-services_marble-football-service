import * as awilix from "awilix";
import { Core } from "sc-game-base";
import GameStartup from "./game-startup";

export default class GameApp extends Core.BaseGameApp {
    async startGame(container: awilix.AwilixContainer) {
        container.register({ baseMetrics: awilix.asValue(this.baseMetrics) });
        const gameStartUp = new GameStartup(container);
        await gameStartUp.start(this.app, this.socketServer);
    }
}
