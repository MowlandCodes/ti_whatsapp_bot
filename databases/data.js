const badwordsEn = require("badwords-list");

const validGroups = [
    "Testing bot TI",
    "Komunitas laptop bajakan",
    "Komunitas Jual Beli Laptop/PC Ponorogo",
    "HECKER PRO PO",
];

const badWordsEn = badwordsEn.array;

const badWordsId = [
    "ajg",
    "anjing",
    "anjir",
    "anjay",
    "anying",
    "autis",
    "ayam kampus",
    "babi",
    "bacot",
    "bajingan",
    "banci",
    "bandot",
    "bangke",
    "bangsat",
    "bani",
    "bani kotak",
    "bego",
    "bejat",
    "bencong",
    "berak",
    "berengsek",
    "brengsek",
    "bispak",
    "bisyar",
    "bokep",
    "pekob",
    "bokong",
    "bong",
    "budek",
    "burik",
    "buta",
    "cacat",
    "cct",
    "cebong",
    "celeng",
    "cocot",
    "congor",
    "culun",
    "cungkring",
    "cupu",
    "dongok",
    "dungu",
    "entot",
    "edan",
    "gay",
    "geblek",
    "gembel",
    "gembrot",
    "gendut",
    "goblok",
    "homo",
    "iblis",
    "idiot",
    "jablay",
    "jancuk",
    "jembud",
    "jembut",
    "jijik",
    "kntl",
    "kacrut",
    "kafir",
    "kancut",
    "kampang",
    "kampret",
    "keparat",
    "komunis",
    "kontol",
    "koreng",
    "krempeng",
    "kimak",
    "kunyuk",
    "lengser",
    "lesbi",
    "lgbt",
    "lonte",
    "me2k",
    "mampus",
    "memek",
    "modar",
    "monyet",
    "mucikari",
    "munafik",
    "najis",
    "nenen",
    "nete",
    "ngaceng",
    "ngentot",
    "ngewe",
    "nista",
    "noob",
    "panasbung",
    "panastak",
    "pantat",
    "pecun",
    "perek",
    "picek",
    "porno",
    "puki",
    "pler",
    "peler",
    "rejim",
    "rezim",
    "sange",
    "sarap",
    "seks",
    "sex",
    "setan",
    "silit",
    "sinting",
    "sipit",
    "sitip",
    "sompret",
    "sontoloyo",
    "tai",
    "taik",
    "titit",
    "tolol",
    "transgendertuyul",
    "udik",
    "dancok",
    "asu",
    "genjit",
    "monyet",
    "pukimak",
    "mesum",
    "kotl",
    "anjeng",
    "gblk",
    "taik",
    "tai",
    "gelud",
    "jancok",
    "bgsd",
    "kimax",
    "pelacur",
    "germo",
    "crot",
    "pekok",
    "dunguk",
    "bajang",
    "tempik",
    "meki",
    "bgst",
    "mani",
    "pejuh",
    "peju",
    "sepong",
    "cipok",
    "ngewek",
    "bdsm",
    "pantek",
    "kimboknya",
    "burit",
    "genjek",
    "nyepong",
    "tobrut",
    "toket",
    "cacat",
    "tepos",
    "goblog",
    "telaso",
    "jomok",
    "k0nt0l",
    "ngocok",
    "ewe",
    "ngenskuy",
    "8==D",
    "8=D",
    "kintil",
    "k.o.n.t.o.l",
    "ngwntod",
];

const menuText = `🎓 *Selamat datang di  _Prodi Teknik Informatika Semester 3_* 🎓

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
* \`/up_tugas_a1\` : Mengupdate tugas kuliah untuk *kelas A1* 
* \`/up_tugas_a2\` : Mengupdate tugas kuliah untuk *kelas A2* 
* \`/antitoxic\` : Mengaktifkan/Nonaktifkan fitur *anti-toxic*

*PERKULIAHAN* :
* \`/help\` : Untuk melihat menu 📜
* \`/info_kuliah\` : Menampilkan jadwal dan info kuliah terdekat 📋
* \`/list_matakuliah\` :Menampilkan daftar matakuliah dan dosen yang mengampu 📑
* \`/list_tugas\` : List tugas yang diberikan oleh dosen 📚

*LAINNYA*:
* \`/server\` : Menampilkan informasi tentang server 📊
* \`@everyone [text]\` : Men-tag semua anggota grup 📣

> Untuk menjalankan perintah dengan bot pastikan untuk *Men-tag bot di grup anda* *_kecuali perintah pada bagian LAINNYA_*. Contoh: \`@bot [perintah]\``;

const unknownCommand = `⛔ Perintah anda *tidak dapat dikenal* oleh *Sobat Kuliah* ⛔

> Ketik \`/help\` untuk mendapatkan bantuan dari *Sobat Kuliah*`;

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

const listMataKuliah = `📑 *List Mata Kuliah TI Semester 3* 📑

1. Aljabar Linear (Triana Harmini, M.Pd.)
2. Desain Antar Muka (Rizfi Syarif, M.Kom.)
3. English for Academic Purpose (Taufiqurrahman, S.Pd., M.T., PCQI.)
4. Bahasa Arab Li Aghrad Khassah (Umma Fatayati, S.Pd.I., M.Pd.)
5. Teori Peluang (Triana Harmini, M.Pd.)
6. Statistika (Miftahuddin Fahmi, S.Kom, M.Kom.)
7. Pemrograman Berorientasi Objek (Miftahuddin Fahmi, S.Kom, M.Kom.)
8. Analisis dan Perancangan Sistem (Widya Kurniawan, M.Kom.)
9. Basis Data 1 (Aziz Musthafa, S.Kom, M.T.)
10. Teori Bahasa dan Automata (Faisal Reza Pradhana, S.Kom., M.Kom.)
11. Sistem Operasi (Eko Prasetio Widhi, S.Kom., M.Kom.)
`;

module.exports = {
    validGroups,
    menuText,
    unknownCommand,
    serverMon,
    badWordsEn,
    badWordsId,
    listMataKuliah,
};
