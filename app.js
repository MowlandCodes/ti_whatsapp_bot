const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require("baileys");
const { Boom } = require("@hapi/boom");
const readline = require("node:readline");
const { question, BLUEBG, GREENBG } = require("./util/user_interaction");

const connectToWhatsapp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('session-auth');
    const bot = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: Browsers.ubuntu("Desktop"),
        syncFullHistory: true
    });

    if (!bot.authState.creds.registered) {
        const phoneNumber = question(`${BLUEBG("INPUT")} Enter your phone number (ex. 628xxxxxxxxx) -> `);
        const code = await bot.requestPairingCode(phoneNumber);
        console.log(`${GREENBG("CODE")} Pairing code: ${code}`);
    }

}
