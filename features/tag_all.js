const tagAll = (bot, group_name) => {
    bot.ev.on('messages.upsert', async (event) => {
        const latest_message = event.messages[0];

        const isGroup = latest_message.key?.remoteJid.endsWith("@g.us");
        const message_content = latest_message.message?.extendedTextMessage?.text || latest_message.message?.conversation

        if (!message_content) return

        if (isGroup && message_content.includes("@everyone")) {
            const group_metadata = await bot.groupMetadata(latest_message.key?.remoteJid);
            
            // Check if the message is from the specified group
            if (group_metadata.subject === group_name) {
                let group_members = group_metadata.participants.map(p => p.id);
                let each_members = group_members.map(p => p.split("@")[0])
                console.log(each_members)
    
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
