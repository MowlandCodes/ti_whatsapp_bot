const validGroups = ["Testing group ti 2"];

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
* \`/list_matakuliah\` : Menampilkan daftar matakuliah dan dosen yang mengampu 📑
* \`/list_tugas\` : List tugas yang diberikan oleh dosen 📚

*LAINNYA*:
* \`/server\` : Menampilkan informasi tentang server 📊
`;

const unknownCommand = `
⛔ Perintah anda *tidak dapat dikenal* oleh *Sobat Kuliah* ⛔

> Ketik \`/help\` untuk mendapatkan bantuan dari *Sobat Kuliah* 
`;

module.exports = {
    validGroups,
    menuText,
    unknownCommand,
};
