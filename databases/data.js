const validGroups = ["Testing bot TI", "Komunitas laptop bajakan", "Komunitas Jual Beli Laptop/PC Ponorogo"];

const menuText = `
🎓 *Selamat datang di  _Prodi Teknik Informatika Semester 3_* 🎓

-----------------------------------------------
*OWNER* : *\`MowlandCodes\`*
*COLLABORATOR* : *\`Mcqeems\`*
-----------------------------------------------

\`Source Code\` : *https://github.com/mowlandcodes/ti_whatsapp_bot.git*

===============================================
Saya adalah *Sobat Kuliah*, Asisten Bot untuk _membantu kalian dalam perkuliahan_
di *Universitas Darussalam Gontor*

Berikut adalah beberapa menu yang saya sediakan untuk kalian berdasarkan kategori:

🤴🏻 *MENU ADMIN* 🤴🏻 : 
* \`/up_info_a1\` : Mengupdate informasi kuliah untuk *kelas A1* 
* \`/up_info_a2\` : Mengupdate informasi kuliah untuk *kelas A2* 

*PERKULIAHAN* :
* \`/help\` : Untuk melihat menu 📜
* \`/info_kuliah\` : Menampilkan jadwal dan info kuliah terdekat 📋
* \`/list_matakuliah\` :Menampilkan daftar matakuliah dan dosen yang mengampu 📑
* \`/list_tugas\` : List t ugas yang diberikan oleh dosen 📚

*LAINNYA*:
* \`/server\` : Menampilkan informasi tentang server 📊
* \`@everyone [text]\` : Men-tag semua anggota grup 📣

> Untuk menjalankan perintah dengan bot pastikan untuk *Men-tag bot di grup anda* *_kecuali perintah pada bagian LAINNYA_*. Contoh: \`@bot [perintah]\`
`;

const unknownCommand = `
⛔ Perintah anda *tidak dapat dikenal* oleh *Sobat Kuliah* ⛔

> Ketik \`/help\` untuk mendapatkan bantuan dari *Sobat Kuliah* 
`;

const serverMon = (serverStats) => {
    return `📊 *Server Status* 📊

\`RUNTIME\` => *${serverStats.runtime} miliseconds*

*OS INFO*
\`PLATFORM\` => *${serverStats.osPlatform} ${serverStats.osDistro} ${serverStats.osArch}*

*CPU INFO*
\`PROCESSOR\` => *${serverStats.cpuModel}*
\`CPU USAGE\` => *${serverStats.cpuUsagePercent} %*

*RAM / MEMORY*
\`TOTAL RAM\` => *${serverStats.ramTotal} Mb*
\`USED RAM\` => *${serverStats.ramUsed} Mb*
\`AVAILABLE RAM\` => *${serverStats.ramFree} Mb*

*DRIVE / STORAGE INFO*
\`DRIVE TOTAL\` => *${serverStats.driveTotal} Gb*
\`DRIVE FREE\` => *${serverStats.driveFree} Gb*
\`USED DRIVE\` => *${serverStats.driveUsed} Gb*

> 👨🏻‍🎓 *\`Sobat Kuliah\`* 👨🏻‍🎓 adalah bot yang dibuat untuk membantu kalian dalam perkuliahan di *Universitas Darussalam Gontor*
`;
};

module.exports = {
    validGroups,
    menuText,
    unknownCommand,
    serverMon,
};
