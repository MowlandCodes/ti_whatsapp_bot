const { getUrlInfo } = require("baileys");
const { menuText, unknownCommand } = require("../databases/data");
const { commandPrefix } = require("../databases/settings");

const botCommands = (bot, validGroups, botNumber) => {
    bot.ev.on("messages.upsert", async (event) => {
        const latest_message = event.messages[0]; // Get the latest message

        const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
        const groupJid = latest_message.key?.remoteJid;
        const senderJid = latest_message.key?.participant;

        if (isGroup) {
            const groupMetadata = await bot.groupMetadata(
                latest_message.key?.remoteJid,
            );
            const groupName = groupMetadata.subject;
            if (validGroups.includes(groupName)) {
                const messageContent =
                    latest_message.message?.extendedTextMessage?.text ||
                    latest_message.message?.conversation;

                const mentions =
                    latest_message.message?.extendedTextMessage?.contextInfo
                        ?.mentionedJid || [];

                // Run command in the group only if the bot is mentioned
                if (mentions.includes(botNumber)) {
                    if (messageContent.includes(`${commandPrefix}help`)) {
                        const linkPreview = await getUrlInfo(
                            "https://github.com/mowlandcodes/ti_whatsapp_bot",
                            {
                                thumbnailWidth: 1024,
                                fetchOpts: { timeout: 5000 },
                                uploadImage: bot.waUploadToServer,
                            },
                        );

                        await bot.sendMessage(groupJid, {
                            text: menuText,
                            linkPreview,
                        });
                    } else {
                        await bot.sendMessage(groupJid, {
                            text: unknownCommand,
                            mentions: [senderJid],
                        });
                    }
                }
            }
        }
    });
};

module.exports = {
    botCommands,
};
