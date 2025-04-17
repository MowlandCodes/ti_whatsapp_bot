const {
    BLUEBG,
    GREENBG,
    GREEN,
    BLUE,
    YELLOWBG,
} = require("./user_interaction");

module.exports = {
    chatLog: async (bot, validGroups, botNumber) => {
        bot.ev.on("messages.upsert", async (event) => {
            const latest_message = event.messages[0];
            const message_timestamp = latest_message.messageTimestamp;
            let sender;
            let group;
            let group_name;

            const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
            if (isGroup) {
                sender = latest_message.key?.fromMe
                    ? "You"
                    : latest_message.key?.participant;
                group = latest_message.key?.remoteJid;
                group_name = await bot.groupMetadata(group);
                group_name = group_name.subject;
            } else {
                sender = latest_message.key?.fromMe
                    ? "You"
                    : latest_message.key?.remoteJid;
                group = latest_message.key?.remoteJid;
            }

            const message_content =
                latest_message.message?.extendedTextMessage?.text ||
                latest_message.message?.conversation;
            const isMediaMessage =
                latest_message.message?.imageMessage ||
                latest_message.message?.videoMessage ||
                latest_message.message?.audioMessage ||
                latest_message.message?.documentMessage
                    ? true
                    : false;

            const sender_origin = isGroup ? group_name : group;

            if (isGroup) {
                // Hanya memantau log chat pada group yang valid
                if (validGroups.includes(group_name)) {
                    console.log(
                        `${BLUEBG("INFO")} ${YELLOWBG("GROUP CHAT")} Timestamp: ${GREEN(
                            message_timestamp,
                        )} ${BLUE(`[${sender}@${sender_origin}]: `)} ${message_content} ${
                            isMediaMessage ? BLUEBG("[MediaMessage]") : ""
                        }`,
                    );
                }
            } else if (latest_message.key?.fromMe) {
                // You sending message to someone
                if (sender_origin === botNumber) {
                    // You sending message to yourself
                    console.log(
                        `${BLUEBG("INFO")} ${GREENBG("PRIVATE CHAT")} Timestamp: ${GREEN(
                            message_timestamp,
                        )} ${BLUE(`You -> You: `)} ${message_content} ${
                            isMediaMessage ? BLUEBG("[MediaMessage]") : ""
                        }`,
                    );
                } else {
                    console.log(
                        `${BLUEBG("INFO")} ${GREENBG("PRIVATE CHAT")} Timestamp: ${GREEN(
                            message_timestamp,
                        )} ${BLUE(`You -> [${sender_origin}]: `)} ${message_content} ${
                            isMediaMessage ? BLUEBG("[MediaMessage]") : ""
                        }`,
                    );
                }
            } else {
                // Someone sending message to you
                console.log(
                    `${BLUEBG("INFO")} ${GREENBG("PRIVATE CHAT")} Timestamp: ${GREEN(
                        message_timestamp,
                    )} ${BLUE(`[${sender}] -> You: `)} ${message_content} ${
                        isMediaMessage ? BLUEBG("[MediaMessage]") : ""
                    }`,
                );
            }
        });
    },
};
