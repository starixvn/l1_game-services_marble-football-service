import { RunningRoundInfoPublisher as RunningRoundInfoPublisherBase } from "sc-game-base/src/core/event-publishers";

import GameData from "../game-data";
import { getUserBetPercentage } from "../helpers/bet-percentage";

export default class RunningRoundInfoPublisher extends RunningRoundInfoPublisherBase {
    declare gameData: GameData;
    publish() {
        super.publish();

        this.publishBetPercentage();
    }

    publishToAllStreamClients(payload: any) {
        const socketClients = Object.values(this.gameData.streamClients).filter((client) => client.connected);
        socketClients.forEach((client) => {
            client.emit("message", { [this.gameName]: payload });
        });
    }

    publishBetPercentage() {
        const { playerBetCount } = this.gameData as GameData;
        const userBetPercentage = getUserBetPercentage(playerBetCount);

        const choices = Object.keys(playerBetCount);
        if (choices.some((choice) => playerBetCount[choice])) {
            this.publishToAllUsers({ userBetPercentage });
        }
    }
}
