const { getUrlInfo, jidNormalizedUser, isJidGroup } = require("baileys");
const { menuText, unknownCommand, serverMon, badWordsEn, badWordsId, listMataKuliah } = require("../databases/data");
const { commandPrefix } = require("../databases/settings");
const { REDBG, RED, BLUEBG, BLUE } = require("../util/user_interaction");
const osUtils = require("node-os-utils");
const { toTitleCase } = require("../util");
const { filterBadWords } = require("./antitoxic");
const { createStore } = require("zustand/vanilla");

// --- 1. Create the store OUTSIDE the event handler ---
const jadwalStore = createStore((set) => ({
    jadwalA1: "Belum ada jadwal A1.",
    jadwalA2: "Belum ada jadwal A2.",
    updateJadwalA1: (newJadwal) => set({ jadwalA1: newJadwal }),
    updateJadwalA2: (newJadwal) => set({ jadwalA2: newJadwal }),
}));

const tugasStore = createStore((set) => ({
    tugasA1: "Belum ada Tugas A1",
    tugasA2: "Belum ada Tugas A2",
    updateTugasA1: (newTugas) => set({ tugasA1: newTugas }),
    updateTugasA2: (newTugas) => set({ tugasA2: newTugas }),
}));

// Optional: Subscribe to changes for debugging
const unsubscribe =
    jadwalStore.subscribe((newState) => console.log("Jadwal Store Updated:", newState)) ||
    tugasStore.subscribe((newState) => console.log("Tugas Store Updated:", newState));

let antiToxic = false;
/*
 * @returns Promise<boolean>
 */
const antiToxicToggle = () => {
    return new Promise((resolve) => {
        antiToxic = !antiToxic;
        resolve(antiToxic);
    });
};

/**
 * @param {import("baileys").WASocket} bot
 * @param {string[]} validGroups
 * @param {string} botJid
 * @returns Promise<void>
 */
const botCommands = (bot, validGroups, botJid) => {
    const badWords = new Set([...badWordsEn, ...badWordsId]);

    bot.ev.on("messages.upsert", async (event) => {
        const latest_message = event.messages[0]; // Get the latest message
        if (!latest_message.message) return; // Ignore messages without content

        const isGroup = isJidGroup(latest_message.key?.remoteJid);
        const groupJid = latest_message.key?.remoteJid;
        const senderJid = latest_message.key?.participant || latest_message.key?.remoteJid; // Participant in group, remoteJid in PM

        if (isGroup) {
            try {
                // Wrap group logic in try/catch for safety
                const groupMetadata = await bot.groupMetadata(groupJid);
                const groupName = groupMetadata.subject;

                if (validGroups.includes(groupName)) {
                    // Check for Message containing bad words
                    if (antiToxic) {
                        const wasFiltered = await filterBadWords(bot, latest_message, badWords, validGroups); // Deleted Message that contains bad words

                        if (wasFiltered) {
                            console.log(`${BLUEBG("INFO")} ${BLUE("Message deleted because it contained bad words")}`);
                            return;
                        }
                    }

                    const messageContent =
                        latest_message.message?.extendedTextMessage?.text ||
                        latest_message.message?.conversation ||
                        latest_message.message?.imageMessage?.caption ||
                        latest_message.message?.videoMessage?.caption ||
                        ""; // Ensure it's a string

                    const mentions = latest_message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    const botMentionTag = `@${botJid.split("@")[0]}`;

                    // --- Commands requiring bot mention ---
                    if (mentions.includes(botJid)) {
                        const commandHelp = `${botMentionTag} ${commandPrefix}help`;
                        const commandInfoKuliah = `${botMentionTag} ${commandPrefix}info_kuliah`;
                        const commandListMataKuliah = `${botMentionTag} ${commandPrefix}list_matakuliah`;
                        const commandListTugas = `${botMentionTag} ${commandPrefix}list_tugas`;

                        // Use startsWith for more reliable command matching
                        if (messageContent.trim() === commandHelp) {
                            try {
                                const linkPreview = await getUrlInfo(
                                    "https://github.com/mowlandcodes/ti_whatsapp_bot.git",
                                    {
                                        thumbnailWidth: 1024,
                                        fetchOpts: { timeout: 5000 },
                                        uploadImage: bot.waUploadToServer,
                                    }
                                );
                                await bot.sendMessage(groupJid, {
                                    text: menuText,
                                    linkPreview,
                                });
                            } catch (err) {
                                console.log(`${REDBG("ERROR")} ${RED("Error when fetching link preview")}: ${err}`);
                                await bot.sendMessage(groupJid, {
                                    text: menuText,
                                });
                            }
                        } else if (messageContent.trim() === commandInfoKuliah) {
                            // --- 2. Correctly GET state ---
                            const currentJadwalA1 = jadwalStore.getState().jadwalA1;
                            const currentJadwalA2 = jadwalStore.getState().jadwalA2;
                            await bot.sendMessage(groupJid, {
                                text: `📚 *Info Jadwal Kuliah* 📚

*Jadwal Kuliah A1:*
${currentJadwalA1}

*Jadwal Kuliah A2:*
${currentJadwalA2}

> _*Jadwal dapat berubah sewaktu-waktu*_, tergantung dengan kondisi kelas.`,
                            });
                        } else if (messageContent.trim() === commandListMataKuliah) {
                            await bot.sendMessage(groupJid, {
                                text: listMataKuliah,
                            });
                        } else if (messageContent.trim() === commandListTugas) {
                            // --- 2. Correctly GET state ---
                            const currentTugasA1 = tugasStore.getState().tugasA1;
                            const currentTugasA2 = tugasStore.getState().tugasA2;
                            await bot.sendMessage(groupJid, {
                                text: `📚 *Info Tugas Kuliah* 📚

*List Tugas A1:*
${currentTugasA1}

*List Tugas A2:*
${currentTugasA2}

> _*Kerjakan tugas tepat waktu*_ kalo mau tepat waktu tod.`,
                            });
                        } else {
                            // Avoid replying to own messages if logic gets complex
                            if (!latest_message.key?.fromMe && messageContent.startsWith(botMentionTag)) {
                                await bot.sendMessage(groupJid, {
                                    text: unknownCommand,
                                    mentions: [senderJid],
                                });
                            }
                        }
                    } else {
                        // --- Commands that run when bot is NOT mentioned ---
                        const commandUpdateA1 = `${commandPrefix}up_info_a1`;
                        const commandUpdateA2 = `${commandPrefix}up_info_a2`;
                        const commandUpdateTugasA1 = `${commandPrefix}up_tugas_a1`;
                        const commandUpdateTugasA2 = `${commandPrefix}up_tugas_a2`;

                        // Tag All Group Members
                        if (messageContent.startsWith("@everyone")) {
                            const groupMembers = groupMetadata.participants.map((participant) => participant.id);
                            await bot.sendMessage(groupJid, {
                                text: `> 📢 *@${senderJid.split("@")[0]} men-tag semua anggota grup*`,
                                mentions: groupMembers,
                            });
                            // Server information
                        } else if (messageContent.startsWith(`${commandPrefix}server`)) {
                            try {
                                const perfData = performance.toJSON();
                                const runtime = perfData.nodeTiming.duration;
                                const cpuUsagePercent = await osUtils.cpu.usage();
                                const cpuModel = osUtils.cpu.model();
                                const ramInfo = await osUtils.mem.info();
                                const driveInfo = await osUtils.drive.info();
                                const osPlatform = toTitleCase(osUtils.os.platform());
                                let osDistro = await osUtils.os.oos().catch(() => "N/A"); // Handle potential promise rejection or undefined
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
                            // Anti Toxic Toggle
                        } else if (messageContent.trim().startsWith(`${commandPrefix}antitoxic`)) {
                            const normalizedUserJid = jidNormalizedUser(senderJid);
                            const participant = groupMetadata.participants.find(
                                (p) => jidNormalizedUser(p.id) === normalizedUserJid
                            );

                            const isSenderAdmin = participant?.admin === "superadmin" || participant?.admin === "admin";

                            if (isSenderAdmin) {
                                const groupMembers = groupMetadata.participants.map((participant) => participant.id);
                                const state = await antiToxicToggle();
                                await bot.sendMessage(groupJid, {
                                    text: `⚠️ *Anti Toxic telah di${
                                        state === true ? "aktif" : "nonaktif"
                                    }kan oleh Admin* ⚠️\n> _Status: ${state}_`,
                                    mentions: groupMembers,
                                });
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: "⛔ *Perintah ini khusus untuk Admin Group* ⛔",
                                    mentions: [senderJid],
                                });
                            }
                            // Info Kuliah A1 Update
                        } else if (messageContent.startsWith(commandUpdateA1)) {
                            const normalizedUserJid = jidNormalizedUser(senderJid);
                            const participant = groupMetadata.participants.find(
                                (p) => jidNormalizedUser(p.id) === normalizedUserJid
                            );

                            const isSenderAdmin = participant?.admin === "superadmin" || participant?.admin === "admin";

                            if (isSenderAdmin) {
                                const scheduleText = messageContent.substring(commandUpdateA1.length).trim();

                                if (scheduleText) {
                                    jadwalStore.getState().updateJadwalA1(scheduleText);
                                    await bot.sendMessage(groupJid, {
                                        text: `*Jadwal A1 Berhasil disimpan* ✅`,
                                    });
                                } else {
                                    await bot.sendMessage(groupJid, {
                                        text: `*Format Salah!* ❌
Contoh Format:
${commandUpdateA1} 
1. Sistem Operasi (Jam Ke-1 | Lab Lt.1)
2. ...`,
                                    });
                                }
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: "⛔ *Perintah ini khusus untuk Admin Group* ⛔",
                                    mentions: [senderJid],
                                });
                            }
                            //// Info Kuliah A2 Update
                        } else if (messageContent.startsWith(commandUpdateA2)) {
                            const normalizedUserJid = jidNormalizedUser(senderJid);
                            const participant = groupMetadata.participants.find(
                                (p) => jidNormalizedUser(p.id) === normalizedUserJid
                            );

                            const isSenderAdmin = participant?.admin === "superadmin" || participant?.admin === "admin";

                            if (isSenderAdmin) {
                                const scheduleText = messageContent.substring(commandUpdateA2.length).trim();

                                if (scheduleText) {
                                    jadwalStore.getState().updateJadwalA2(scheduleText);
                                    await bot.sendMessage(groupJid, {
                                        text: `*Jadwal A2 Berhasil disimpan* ✅`,
                                    });
                                } else {
                                    await bot.sendMessage(groupJid, {
                                        text: `*Format Salah!* ❌
Contoh Format:
${commandUpdateA1} 
1. Sistem Operasi (Jam Ke-1 | Lab Lt.1)
2. ...`,
                                    });
                                }
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: "⛔ *Perintah ini khusus untuk Admin Group* ⛔",
                                    mentions: [senderJid],
                                });
                            }
                        } else if (messageContent.startsWith(commandUpdateTugasA1)) {
                            const normalizedUserJid = jidNormalizedUser(senderJid);
                            const participant = groupMetadata.participants.find(
                                (p) => jidNormalizedUser(p.id) === normalizedUserJid
                            );

                            const isSenderAdmin = participant?.admin === "superadmin" || participant?.admin === "admin";

                            if (isSenderAdmin) {
                                const scheduleText = messageContent.substring(commandUpdateTugasA1.length).trim();

                                if (scheduleText) {
                                    tugasStore.getState().updateTugasA1(scheduleText);
                                    await bot.sendMessage(groupJid, {
                                        text: `*Tugas A1 Berhasil disimpan* ✅`,
                                    });
                                } else {
                                    await bot.sendMessage(groupJid, {
                                        text: `*Format Salah!* ❌
Contoh Format:
${commandUpdateA1} 
1. Sistem Operasi ( Exp: 10/10/2025 )
2. ...`,
                                    });
                                }
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: "⛔ *Perintah ini khusus untuk Admin Group* ⛔",
                                    mentions: [senderJid],
                                });
                            }
                        } else if (messageContent.startsWith(commandUpdateTugasA2)) {
                            const normalizedUserJid = jidNormalizedUser(senderJid);
                            const participant = groupMetadata.participants.find(
                                (p) => jidNormalizedUser(p.id) === normalizedUserJid
                            );

                            const isSenderAdmin = participant?.admin === "superadmin" || participant?.admin === "admin";

                            if (isSenderAdmin) {
                                const scheduleText = messageContent.substring(commandUpdateTugasA2.length).trim();

                                if (scheduleText) {
                                    tugasStore.getState().updateTugasA2(scheduleText);
                                    await bot.sendMessage(groupJid, {
                                        text: `*Tugas A2 Berhasil disimpan* ✅`,
                                    });
                                } else {
                                    await bot.sendMessage(groupJid, {
                                        text: `*Format Salah!* ❌
Contoh Format:
${commandUpdateA1} 
1. Sistem Operasi ( Exp: 10/10/2025 )
2. ...`,
                                    });
                                }
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: "⛔ *Perintah ini khusus untuk Admin Group* ⛔",
                                    mentions: [senderJid],
                                });
                            }
                        } else {
                            // Avoid replying to own messages if logic gets complex
                            if (!latest_message.key?.fromMe && messageContent.startsWith(botMentionTag)) {
                                await bot.sendMessage(groupJid, {
                                    text: unknownCommand,
                                    mentions: [senderJid],
                                });
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(`${REDBG("ERROR")} ${RED("An error occurred")}: ${err}`);
            }
        }
    });
};

module.exports = {
    botCommands,
};
