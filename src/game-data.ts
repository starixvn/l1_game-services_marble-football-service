import { TableGameData } from "sc-game-base/src/table";
import { ResultType } from "./models/rounds";
import { ITournament } from "./models/tournaments";
import { Socket } from "socket.io";

export default class GameData extends TableGameData {
    declare realPlayers: { [playerId: string]: RealPlayer };
    declare result: ResultType;

    constructor(remainingTime: number) {
        super(remainingTime);
        this.playerBetCount = {};
    }
    playerBetCount: Record<string, string[]> = {};
    liveStreamServer = "";
    tournament = {} as ITournament;
    publishedTournament = {} as ITournament;
    streamClients: Record<string, Socket> = {};
}

export type RealPlayer = {
    UID: string;
    profile: { name: string; minBet: number; maxBet: number };
    session: any;
    socketClient: any;
};
