const { REDBG, RED, BLUEBG, BLUE } = require("../util");
const { isJidGroup } = require("baileys");

/**
 * @param {import("baileys").WASocket} bot
 * @param {import("baileys").WAMessage} msgObj
 * @param {Set<string>} forbiddenWords
 * @returns Promise<boolean>
 */
const filterBadWords = async (bot, msgObj, forbiddenWords) => {
    try {
        // Pastiin ada pesan
        if (!msgObj.message) return false;

        const chatJid = msgObj.key.remoteJid;

        if (!chatJid || !isJidGroup(chatJid)) return false; // Hanya Filter pesan yang datang dari group

        if (msgObj.key.fromMe) return false; // Hanya Filter pesan yang bukan dari bot

        const senderJid = msgObj.key.participant; // Pengirim dari group
        if (!senderJid) {
            console.log(`${REDBG("ERROR")} ${RED("Pengirim tidak ditemukan")}`);
            return false;
        }

        // Isi Pesan
        const messageContent =
            msgObj.message?.extendedTextMessage?.text ||
            msgObj.message?.conversation ||
            msgObj.message?.imageMessage?.caption ||
            msgObj.message?.videoMessage?.caption;

        if (!messageContent) return false; // Hanya Filter pesan yang berisi teks

        let isBadWord = false;

        const messageContentLower = messageContent.toLowerCase();

        // for (const word of forbiddenWords) {
        //     const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        //     const regex = new RegExp(`\\b${escapedWord}\\b`, "i");
        //
        //     if (regex.test(messageContentLower)) {
        //         isBadWord = true;
        //         break;
        //     }
        // }
        isBadWord = Array.from(forbiddenWords).some((word) => {
            const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            const regex = new RegExp(`\\b${escapedWord}\\b`, "i");

            return regex.test(messageContentLower);
        });

        if (isBadWord) {
            console.log(
                `${REDBG("WARNING")} ${RED("Pesan berisi kata kasar")}`,
            );

            const messageKey = {
                remoteJid: chatJid,
                fromMe: false,
                id: msgObj.key.id,
                participant: senderJid,
            };

            try {
                await bot.sendMessage(chatJid, { delete: messageKey });
                console.log(
                    `${BLUEBG("INFO")} ${BLUE("Pesan telah dihapus...")}`,
                );

                const senderName = msgObj.pushName || "Member Group";
                const senderMention = senderJid.split("@")[0];
                const warningText = `⚠️ *Peringatan keras untuk @${senderMention} [${senderName}]*⚠️
*Anda telah berkata kasar*, sehingga pesan anda harus kami hapus demi kenyamanan bersama.`;

                await bot.sendMessage(chatJid, {
                    text: warningText,
                    mentions: [senderJid],
                });

                return true;
            } catch (err) {
                console.log(
                    `${REDBG("ERROR")} ${RED("Terjadi kesalahan saat mencoba menghapus pesan")}`,
                );
                console.log(`${REDBG("ERROR")} ${RED("Error:")} ${err}`);
                return false;
            }
        }
        return false;
    } catch (err) {
        console.log(`${REDBG("ERROR")} ${RED("Caught exception")}: ${err}`);
        return false;
    }
};

module.exports = {
    filterBadWords,
};
