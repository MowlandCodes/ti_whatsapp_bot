const { getUrlInfo } = require("baileys");
const { menuText, unknownCommand, serverMon } = require("../databases/data");
const { commandPrefix } = require("../databases/settings");
const { REDBG, RED } = require("../util/user_interaction");
const osUtils = require("node-os-utils");
const { toTitleCase } = require("../util");
const { createStore } = require("zustand/vanilla");

// --- 1. Create the store OUTSIDE the event handler ---
const jadwalStore = createStore((set) => ({
    jadwalA1: "Belum ada jadwal A1.",
    jadwalA2: "Belum ada jadwal A2.",
    // --- 3. Correct Action Definitions ---
    updateJadwalA1: (newJadwal) => set({ jadwalA1: newJadwal }),
    updateJadwalA2: (newJadwal) => set({ jadwalA2: newJadwal }),
}));

// Optional: Subscribe to changes for debugging
const unsubscribe = jadwalStore.subscribe((newState) => console.log("Jadwal Store Updated:", newState));
// Remember to call unsubscribe() if your bot process ends cleanly

const botCommands = (bot, validGroups, botJid) => {
    bot.ev.on("messages.upsert", async (event) => {
        const latest_message = event.messages[0]; // Get the latest message
        if (!latest_message.message) return; // Ignore messages without content

        const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
        const groupJid = latest_message.key?.remoteJid;
        const senderJid = latest_message.key?.participant || latest_message.key?.remoteJid; // Participant in group, remoteJid in PM

        // --- Store is now defined outside ---

        if (isGroup) {
            try {
                // Wrap group logic in try/catch for safety
                const groupMetadata = await bot.groupMetadata(groupJid);
                const groupName = groupMetadata.subject;

                if (validGroups.includes(groupName)) {
                    const messageContent =
                        latest_message.message?.extendedTextMessage?.text || latest_message.message?.conversation || ""; // Ensure it's a string

                    const mentions = latest_message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
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
                                        /* options */
                                    }
                                );
                                await bot.sendMessage(groupJid, { text: menuText, linkPreview });
                            } catch (err) {
                                console.log(`${REDBG("ERROR")} ${RED("Caught exception")}: ${err}`);
                                await bot.sendMessage(groupJid, { text: menuText });
                            }
                        } else if (messageContent.startsWith(commandUpdateA1)) {
                            // --- 5. Better command parsing ---
                            const scheduleText = messageContent.substring(commandUpdateA1.length).trim();

                            if (scheduleText) {
                                // --- 2 & 4. Correctly CALL the action ---
                                jadwalStore.getState().updateJadwalA1(scheduleText);
                                await bot.sendMessage(groupJid, { text: `Jadwal A1 Tersimpan ✅` });
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: `Format Salah!\nContoh: ${commandUpdateA1} 
1. Matkul (Jam Ruang)
2. ...`,
                                });
                            }
                        } else if (messageContent.startsWith(commandUpdateA2)) {
                            // --- 5. Better command parsing ---
                            const scheduleText = messageContent.substring(commandUpdateA2.length).trim();

                            if (scheduleText) {
                                // --- 2 & 4. Correctly CALL the action ---
                                jadwalStore.getState().updateJadwalA2(scheduleText);
                                await bot.sendMessage(groupJid, { text: `Jadwal A2 Tersimpan ✅` });
                            } else {
                                await bot.sendMessage(groupJid, {
                                    text: `Format Salah!\nContoh: ${commandUpdateA1} 
1. Matkul (Jam Ruang)
2. ...`,
                                });
                            }
                        } else if (messageContent.trim() === commandInfoKuliah) {
                            // --- 2. Correctly GET state ---
                            const currentJadwalA1 = jadwalStore.getState().jadwalA1;
                            const currentJadwalA2 = jadwalStore.getState().jadwalA2;
                            await bot.sendMessage(groupJid, {
                                text: `*Jadwal Kuliah A1:*\n${currentJadwalA1}\n\n*Jadwal Kuliah A2:*\n${currentJadwalA2}`,
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

                        // Tag All Group Members
                        if (messageContent.startsWith("@everyone")) {
                            const groupMembers = groupMetadata.participants.map((participant) => participant.id);
                            await bot.sendMessage(groupJid, {
                                text: `> 📢 *@${senderJid.split("@")[0]} men-tag semua anggota grup*`,
                                mentions: groupMembers,
                            });
                        } else if (messageContent.startsWith(`${commandPrefix}server`)) {
                            // Server stats logic (seems mostly okay, but check async handling of oos)
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
                                await bot.sendMessage(groupJid, { text: serverStats, mentions: [senderJid] });
                            } catch (err) {
                                console.error("Error getting server stats:", err);
                                await bot.sendMessage(groupJid, {
                                    text: "Gagal mendapatkan status server.",
                                    mentions: [senderJid],
                                });
                            }
                        }
                        // Add other non-mention commands here
                    }
                }
            } catch (err) {
                console.error(`Error processing group message in ${groupJid}:`, err);
                // Optionally send an error message back to the group/admin
            }
        } else {
            // Handle Private Messages (PM) if needed
            console.log("Received PM from:", senderJid);
        }
    });
};

module.exports = {
    botCommands,
};
