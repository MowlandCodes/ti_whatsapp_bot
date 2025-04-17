const { getUrlInfo } = require("baileys");
const { menuText, unknownCommand } = require("../databases/data");
const { commandPrefix } = require("../databases/settings");
const { REDBG, RED } = require("../util/user_interaction");
const osUtils = require("node-os-utils");

const botCommands = (bot, validGroups, botJid) => {
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
                if (mentions.includes(botJid)) {
                    if (messageContent.includes(`${commandPrefix}help`)) {
                        try {
                            const linkPreview = await getUrlInfo(
                                "https://github.com/mowlandcodes/ti_whatsapp_bot.git",
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
                        } catch (err) {
                            console.log(
                                `${REDBG("ERROR")} ${RED("Caught exception")}: ${err}`,
                            );

                            await bot.sendMessage(groupJid, {
                                text: menuText,
                            });
                        }
                    } else {
                        if (!latest_message.key?.fromMe) {
                            await bot.sendMessage(groupJid, {
                                text: unknownCommand,
                                mentions: [senderJid],
                            });
                        }
                    }
                } else {
                    // Commands that run when bot is not mentioned

                    // Tag All Group Members
                    if (messageContent.startsWith("@everyone")) {
                        const groupMembers = groupMetadata.participants.map(
                            (participant) => participant.id,
                        );

                        await bot.sendMessage(groupJid, {
                            text: `> 📢 *@${senderJid.split("@")[0]} men-tag semua anggota grup*`,
                            mentions: groupMembers,
                        });
                    } else if (
                        messageContent.includes(`${commandPrefix}server`)
                    ) {
                        const perfData = performance.toJSON();
                        const runtime = perfData.nodeTiming.duration;

                        // Get Server Statistics
                        await bot.sendMessage(groupJid, {
                            text: `📊 *Informasi tentang server* 📊`,
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
