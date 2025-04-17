const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    Browsers,
    makeInMemoryStore,
    fetchLatestBaileysVersion,
    jidNormalizedUser,
} = require("baileys");
const {
    question,
    BLUEBG,
    GREENBG,
    REDBG,
    GREEN,
    RED,
    chatLog,
} = require("./util");

const { botCommands } = require("./features");
const { pino } = require("pino");
const { NodeCache } = require("@cacheable/node-cache");
const { Boom } = require("@hapi/boom");
const { validGroups } = require("./databases/data");

const store = makeInMemoryStore({
    logger: pino({ level: "silent" }).child({
        level: "silent",
        stream: "store",
    }),
});
const msgRetryCounterCache = new NodeCache({
    stdTTL: 5 * 60,
    useClones: false,
});
const groupCache = new NodeCache({ stdTTL: 5 * 60, useClones: false });

const connectToWhatsapp = async () => {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState("session-auth");
    const logger = pino({ level: "silent" });

    const bot = makeWASocket({
        version,
        logger,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        printQRInTerminal: false,
        syncFullHistory: true,
        markOnlineOnConnect: false,
        browser: Browsers.ubuntu("Firefox"),
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid);
            let msg = await store.loadMessage(jid, key.jid);

            return msg?.message || "";
        },
        defaultQueryTimeoutMs: undefined,
    });

    store.bind(bot.ev);

    if (!bot.authState.creds.registered) {
        const phoneNumber = await question(
            `${BLUEBG("INFO")} Enter you WhatsApp Phone Number (ex. 628xxxxxxxxx): `,
        );

        setTimeout(async () => {
            let pairingCode = await bot.requestPairingCode(phoneNumber);
            pairingCode = pairingCode?.match(/.{1,4}/g)?.join("-") || code;

            console.log(
                `${GREENBG("SUCCESS")} Pairing Code: ${GREEN(pairingCode)}`,
            );
        }, 3000);
    }

    const botNumber = `${bot?.authState?.creds?.me?.id.split("@")[0].split(":")[0]}@s.whatsapp.net`; // Get Current Bot Number

    // Check connection status
    bot.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === "open") {
            console.log(
                `${GREENBG("SUCCESS")} ${GREEN("Bot Connected to WhatsApp!")}`,
            );
        } else if (qr) {
            console.log(`${BLUEBG("INFO")} Using Pairing Code to Login...`);
        } else if (connection === "close") {
            const shouldReconnect =
                (lastDisconnect.error instanceof Boom)?.output?.statusCode !==
                DisconnectReason.loggedOut;
            console.log(
                `${REDBG("CONNECTION ERROR")} Connection closed due to ${
                    lastDisconnect.error
                }`,
            );
            if (shouldReconnect) {
                console.log(`${BLUEBG("INFO")} Reconnecting to Bot...`);
                connectToWhatsapp();
            }
        }
    });

    // Features
    // Enter Bot Features below

    chatLog(bot, validGroups, botNumber);
    botCommands(bot, validGroups, botNumber);

    /*******************************************************************/
    /*******************************************************************/

    // Watch credentials update and store it in session-auth
    bot.ev.on("creds.update", saveCreds);
};

connectToWhatsapp();

process.on("uncaughtException", function (err) {
    let e = String(err);
    if (e.includes("conflict")) return;
    if (e.includes("Socket connection timeout")) return;
    if (e.includes("not-authorized")) return;
    if (e.includes("already-exists")) return;
    if (e.includes("rate-overlimit")) return;
    if (e.includes("Connection Closed")) return;
    if (e.includes("Timed Out")) return;
    if (e.includes("Value not found")) return;
    console.log(`${REDBG("ERROR")} ${RED("Caught exception")}: ${err}`);
});
