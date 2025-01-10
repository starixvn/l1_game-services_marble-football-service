export const BET_CHOICES = {
    home: "home",
    away: "away",
    draw: "draw",
    over: "over",
    under: "under",
    odd: "odd",
    even: "even",
};

export const DEFAULT_MARGIN = 0.02;

export const IS_DEV_ENV = process.env.NODE_ENV === "development";

export const POOL_SIZE = 10_000;

export const DEFAULT_NUMBER_OF_VIDEOS: Record<string, number> = {
    AAAA: 9,
    AAAH: 10,
    AAA: 30,
    AAHA: 9,
    AAHH: 6,
    AAH: 21,
    AA: 96,
    AHAA: 8,
    AHAH: 11,
    AHA: 30,
    AHHA: 6,
    AHHH: 8,
    AHH: 26,
    AH: 102,
    A: 165,
    HAAA: 12,
    HAAH: 11,
    HAA: 24,
    HAHA: 9,
    HAHH: 10,
    HAH: 24,
    HA: 69,
    HHAA: 5,
    HHAH: 8,
    HHA: 15,
    HHHA: 10,
    HHHH: 5,
    HHH: 21,
    HH: 71,
    H: 109,
    "0": 130,
};

export const DEFAULT_TOURNAMENT_CODES = {
    code: "UCL",
    teams: ["MCI", "RMA", "BAR", "LIV", "ARS", "FCB", "INT", "LEV", "AVL", "ATA", "BVB", "JUV", "PSG", "SLB", "ATM", "MIL"],
};
