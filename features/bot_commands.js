const { getUrlInfo } = require("baileys");
const { menuText, unknownCommand, serverMon } = require("../databases/data");
const {
    commandPrefix,
    antiToxic,
    antiToxicToggle,
} = require("../databases/settings");
const { REDBG, RED } = require("../util/user_interaction");
const osUtils = require("node-os-utils");
const { toTitleCase } = require("../util");
const { filterBadWords } = require("./antitoxic");
const { badWordsEn, badWordsId } = require("../databases/data");

/**
 * @param {import("baileys").WASocket} bot
 * @param {string[]} validGroups
 * @param {string} botJid
 * @returns Promise<void>
 */
const botCommands = (bot, validGroups, botJid) => {
    bot.ev.on("messages.upsert", async (event) => {
        const latest_message = event.messages[0]; // Get the latest message

        const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
        const groupJid = latest_message.key?.remoteJid;
        const senderJid = latest_message.key?.participant;

        const badWords = new Set(badWordsEn.concat(badWordsId));

        if (antiToxic) {
            await filterBadWords(bot, latest_message, badWords); // Deleted Message that contains bad words
        }

        if (isGroup) {
            const groupMetadata = await bot.groupMetadata(
                latest_message.key?.remoteJid,
            );
            const groupName = groupMetadata.subject;
            if (validGroups.includes(groupName)) {
                const messageContent =
                    latest_message.message?.extendedTextMessage?.text ||
                    latest_message.message?.conversation ||
                    latest_message.message.imageMessage?.caption ||
                    latest_message.message.videoMessage?.caption;

                const mentions =
                    latest_message.message?.extendedTextMessage?.contextInfo
                        ?.mentionedJid || [];

                // Run command in the group only if the bot is mentioned
                if (mentions.includes(botJid)) {
                    if (
                        messageContent ===
                        `@${botJid.split("@")[0]} ${commandPrefix}help`
                    ) {
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
                        messageContent.startsWith(`${commandPrefix}server`)
                    ) {
                        const perfData = performance.toJSON();

                        // Server Runtime
                        const runtime = perfData.nodeTiming.duration;

                        // Server CPU Stats
                        const cpuUsagePercent = await osUtils.cpu.usage();
                        const cpuModel = osUtils.cpu.model();

                        // Server Memory Stats
                        const ramInfo = await osUtils.mem.info();
                        const ramFree = ramInfo.freeMemMb;
                        const ramTotal = ramInfo.totalMemMb;
                        const ramUsed = ramInfo.usedMemMb;

                        // Server Drive Stats
                        const driveInfo = await osUtils.drive.info();
                        const driveFree = driveInfo.freeGb;
                        const driveTotal = driveInfo.totalGb;
                        const driveUsed = driveInfo.usedGb;

                        // Server OS Stats
                        const osPlatform = toTitleCase(osUtils.os.platform());
                        let osDistro;
                        osUtils.os.oos().then((info) => {
                            osDistro = info === undefined ? "" : info;
                        });
                        const osArch = osUtils.os.arch();

                        const stats = {
                            runtime,
                            cpuUsagePercent,
                            cpuModel,
                            ramTotal,
                            ramUsed,
                            ramFree,
                            driveFree,
                            driveTotal,
                            driveUsed,
                            osPlatform,
                            osDistro,
                            osArch,
                        };

                        const serverStats = serverMon(stats);

                        // Get Server Statistics
                        await bot.sendMessage(groupJid, {
                            text: serverStats,
                            mentions: [senderJid],
                        });
                    } else if (messageContent === `${commandPrefix}antitoxic`) {
                        antiToxic = antiToxicToggle();
                        const groupMembers = groupMetadata.participants.map(
                            (participant) => participant.id,
                        );

                        if (antiToxic === true) {
                            bot.sendMessage(groupJid, {
                                text: `🔔 *Fitur Anti-Toxic _diaktifkan_* 🔔`,
                                mentions: groupMembers,
                            });
                        } else {
                            bot.sendMessage(groupJid, {
                                text: `🔔 *Fitur Anti-Toxic _di-nonaktifkan_* 🔔`,
                            });
                        }
                    }
                }
            }
        }
    });
};

module.exports = {
    botCommands,
};
