const { getUrlInfo, jidNormalizedUser } = require("baileys");
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
const { createStore } = require("zustand/vanilla");

// --- 1. Create the store OUTSIDE the event handler ---
const jadwalStore = createStore((set) => ({
    jadwalA1: "Belum ada jadwal A1.",
    jadwalA2: "Belum ada jadwal A2.",
    updateJadwalA1: (newJadwal) => set({ jadwalA1: newJadwal }),
    updateJadwalA2: (newJadwal) => set({ jadwalA2: newJadwal }),
}));

// Optional: Subscribe to changes for debugging
const unsubscribe = jadwalStore.subscribe((newState) =>
    console.log("Jadwal Store Updated:", newState),
);

/**
 * @param {import("baileys").WASocket} bot
 * @param {string[]} validGroups
 * @param {string} botJid
 * @returns Promise<void>
 */
const botCommands = (bot, validGroups, botJid) => {
    bot.ev.on("messages.upsert", async (event) => {
        const latest_message = event.messages[0]; // Get the latest message
        if (!latest_message.message) return; // Ignore messages without content

        const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
        const groupJid = latest_message.key?.remoteJid;
        const senderJid =
            latest_message.key?.participant || latest_message.key?.remoteJid; // Participant in group, remoteJid in PM

        const badWords = new Set(badWordsEn.concat(badWordsId));

        if (antiToxic) {
            await filterBadWords(bot, latest_message, badWords); // Deleted Message that contains bad words
        }

        if (isGroup) {
            try {
                // Wrap group logic in try/catch for safety
                const groupMetadata = await bot.groupMetadata(groupJid);
                const groupName = groupMetadata.subject;

                if (validGroups.includes(groupName)) {
                    const messageContent =
                        latest_message.message?.extendedTextMessage?.text ||
                        latest_message.message?.conversation ||
                        latest_message.message?.imageMessage?.caption ||
                        latest_message.message?.videoMessage?.caption ||
                        ""; // Ensure it's a string

                    const mentions =
                        latest_message.message?.extendedTextMessage?.contextInfo
                            ?.mentionedJid || [];
                    const botMentionTag = `@${botJid.split("@")[0]}`;

                    // --- Commands requiring bot mention ---
                    if (mentions.includes(botJid)) {
                        const commandHelp = `${botMentionTag} ${commandPrefix}help`;
                        const commandUpdateA1 = `${botMentionTag} ${commandPrefix}up_info_a1`; // Note: Check start, not includes
                        const commandUpdateA2 = `${botMentionTag} ${commandPrefix}up_info_a2`;
                        const commandInfoKuliah = `${botMentionTag} ${commandPrefix}info_kuliah`;

                        // Use startsWith for more reliable command matching
                        if (messageContent.trim() === commandHelp) {
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
                                    `${REDBG("ERROR")} ${RED("Error when fetching link preview")}: ${err}`,
                                );
                                await bot.sendMessage(groupJid, {
                                    text: menuText,
                                });
                            }
                        } else if (messageContent.startsWith(commandUpdateA1)) {
                            const scheduleText = messageContent
                                .substring(commandUpdateA1.length)
                                .trim();

                            if (scheduleText) {
                                jadwalStore
                                    .getState()
                                    .updateJadwalA1(scheduleText);
                                await bot.sendMessage(groupJid, {
                                    text: `*Jadwal A1 Berhasil disimpan* ✅`,
                                });
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: `Format Salah! ❌
Contoh Format:
${commandUpdateA1} 
1. Sistem Operasi (Jam Ke-1 | Lab Lt.1)
2. ...`,
                                });
                            }
                        } else if (messageContent.startsWith(commandUpdateA2)) {
                            const scheduleText = messageContent
                                .substring(commandUpdateA2.length)
                                .trim();

                            if (scheduleText) {
                                jadwalStore
                                    .getState()
                                    .updateJadwalA2(scheduleText);
                                await bot.sendMessage(groupJid, {
                                    text: `*Jadwal A2 Berhasil disimpan* ✅`,
                                });
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: `Format Salah! ❌
Contoh Format:
${commandUpdateA1} 
1. Sistem Operasi (Jam Ke-1 | Lab Lt.1)
2. ...`,
                                });
                            }
                        } else if (
                            messageContent.trim() === commandInfoKuliah
                        ) {
                            // --- 2. Correctly GET state ---
                            const currentJadwalA1 =
                                jadwalStore.getState().jadwalA1;
                            const currentJadwalA2 =
                                jadwalStore.getState().jadwalA2;
                            await bot.sendMessage(groupJid, {
                                text: `📚 *Info Jadwal Kuliah* 📚

*Jadwal Kuliah A1:*
${currentJadwalA1}

*Jadwal Kuliah A2:*
${currentJadwalA2}

> _*Jadwal dapat berubah sewaktu-waktu*_, tergantung dengan kondisi kelas.`,
                            });
                        } else {
                            // Avoid replying to own messages if logic gets complex
                            if (
                                !latest_message.key?.fromMe &&
                                messageContent.startsWith(botMentionTag)
                            ) {
                                await bot.sendMessage(groupJid, {
                                    text: unknownCommand,
                                    mentions: [senderJid],
                                });
                            }
                        }
                    } else {
                        // --- Commands that run when bot is NOT mentioned ---

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
                            try {
                                const perfData = performance.toJSON();
                                const runtime = perfData.nodeTiming.duration;
                                const cpuUsagePercent =
                                    await osUtils.cpu.usage();
                                const cpuModel = osUtils.cpu.model();
                                const ramInfo = await osUtils.mem.info();
                                const driveInfo = await osUtils.drive.info();
                                const osPlatform = toTitleCase(
                                    osUtils.os.platform(),
                                );
                                let osDistro = await osUtils.os
                                    .oos()
                                    .catch(() => "N/A"); // Handle potential promise rejection or undefined
                                const osArch = osUtils.os.arch();

                                const stats = {
                                    runtime,
                                    cpuUsagePercent,
                                    cpuModel,
                                    ramTotal: ramInfo.totalMemMb,
                                    ramUsed: ramInfo.usedMemMb,
                                    ramFree: ramInfo.freeMemMb,
                                    driveFree: driveInfo.freeGb,
                                    driveTotal: driveInfo.totalGb,
                                    driveUsed: driveInfo.usedGb,
                                    osPlatform,
                                    osDistro: osDistro || "N/A",
                                    osArch,
                                };
                                const serverStats = serverMon(stats);
                                await bot.sendMessage(groupJid, {
                                    text: serverStats,
                                    mentions: [senderJid],
                                });
                            } catch (err) {
                                console.log(`${REDBG("ERROR")} : ${err}`);
                                await bot.sendMessage(groupJid, {
                                    text: `> ❌ *Gagal mendapatkan status server.*`,
                                    mentions: [senderJid],
                                });
                            }
                        } else if (
                            messageContent
                                .trim()
                                .startsWith(`${commandPrefix}antitoxic`)
                        ) {
                            const normalizedUserJid =
                                jidNormalizedUser(senderJid);
                            const participant = groupMetadata.participants.find(
                                (p) =>
                                    jidNormalizedUser(p.id) ===
                                    normalizedUserJid,
                            );

                            const isSenderAdmin =
                                participant?.admin === "superadmin" ||
                                participant?.admin === "admin";

                            console.log(participant);
                            console.log(isSenderAdmin);

                            if (isSenderAdmin) {
                                const groupMembers =
                                    groupMetadata.participants.map(
                                        (participant) => participant.id,
                                    );
                                const state = await antiToxicToggle();
                                await bot.sendMessage(groupJid, {
                                    text: `⚠️ *Anti Toxic telah diaktifkan oleh Admin* ⚠️\n> _Status: ${state}_`,
                                    mentions: groupMembers,
                                });
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: "⛔ *Perintah ini khusus untuk Admin Group* ⛔",
                                    mentions: [senderJid],
                                });
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(
                    `${REDBG("ERROR")} ${RED("An error occurred")}: ${err}`,
                );
            }
        }
    });
};

module.exports = {
    botCommands,
};
