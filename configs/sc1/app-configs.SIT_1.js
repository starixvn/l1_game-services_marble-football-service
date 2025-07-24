export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://l1-game-api-sit1-service:5000",
        authUrl: "http://l1-auth-api-sit1-service:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 5000,
        placeBetTimeout: 2000,
        enabledApiLogs: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
        maxRequestsPerInterval: 100, // default 1000
        rateLimitInterval: 10 * 1000, // default 10 * 1000
    },
    enabledLogs: true,
    database: {
        url: "mongodb://lmn_backend:LmnBackend%40517@172.16.4.111:31301/?replicaSet=SabaSIT&appName=marblefootball",
        options: {
            dbName: "minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "http://52368c4019044019885440599c180bda@10.2.190.51:9009/24",
        logIdentifier: "MarbleFootBall",
        env: "SIT_1",
    },
    authenticateSettings: {
        url: "http://l1-auth-api-sit1-service:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://l1-user-service-sit1-service:5000",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    metrics: {
        enable: true,
        secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
    },
    enableMsgpackParser: true,
    gameManagementApiSettings: {
        BASE: "http://l1-game-management-service-sit1-service:5000",
    },
    otel: {
        system: "SG",
        enabled: true,
        endpoint: "http://10.2.190.51:4318/v1/traces",
    },

    liveStreamServer: "https://d10r8t0fxmjzn1.cloudfront.net/104/",
    gameResultSettings: {
        baseUrl: "http://l1-game-result-sit1-service:5000",
        id: "Game Service",
        key: "dded3dfe-261e-47f0-a46e-076b367c5a09",
    },
    proxyServer: {
        enabled: true,
        url: "http://lisasqd.nebula.prod:8801",
    },
};
