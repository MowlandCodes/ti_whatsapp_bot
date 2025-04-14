const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("baileys");
const { Boom } = require("@hapi/boom");
const readline = require("node:readline");
const chalk = require("chalk").default;
const { question } = require("./util/user_interaction");

const connectToWhatsapp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('session-auth');
    const bot = makeWASocket({
        auth: state,
        printQRInTerminal: false,

    });

    if (!bot.authState.creds.registered) {
        const phoneNumber = question("Enter your phone number (ex. 6281234567890): ");
    }
}
