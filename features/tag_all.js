const tagAll = (bot, group_names) => {
    bot.ev.on('messages.upsert', async (event) => {
        const latest_message = event.messages[0];

        const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
        const message_content = latest_message.message?.extendedTextMessage?.text || latest_message.message?.conversation

        if (!message_content) return

        if (isGroup && message_content.includes("@everyone")) {
            const group_metadata = await bot.groupMetadata(latest_message.key?.remoteJid);

            // Check if the message is from the specified group
            if (group_names.includes(group_metadata?.subject)) {
                let group_members = group_metadata.participants.map(p => p.id);

                const pengirim = latest_message?.key?.participant.split("@")[0]

                const pesan = `🔔 @${pengirim} *Men-tag semua anggota grup* 🔔`

                await bot.sendMessage(latest_message.key?.remoteJid, { text: pesan, mentions: group_members })
            }
        }
    })
}

module.exports = {
    tagAll
}
