const badwordsEn = require("badwords-list");

const validGroups = [
    "Testing bot TI",
    "Komunitas laptop bajakan",
    "Komunitas Jual Beli Laptop/PC Ponorogo",
    "HECKER PRO PO",
];

const badWordsEn = badwordsEn.array;

const badWordsId = [
    "alay",
    "ampas",
    "ajg",
    "anjing",
    "anjir",
    "antek",
    "asing",
    "ateis",
    "autis",
    "ayam kampus",
    "babi",
    "bacot",
    "bajingan",
    "banci",
    "bandot",
    "bangkai",
    "bangsat",
    "bani",
    "bani kotak",
    "bego",
    "bejat",
    "bencong",
    "berak",
    "berengsek",
    "bispak",
    "bisu",
    "bisyar",
    "bodoh",
    "bokep",
    "bokong",
    "bong",
    "buaya",
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
    "gila",
    "goblok",
    "hina",
    "homo",
    "iblis",
    "idiot",
    "jablay",
    "jamban",
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
    "kampungan",
    "kejam",
    "keparat",
    "kntl",
    "komunis",
    "kontol",
    "koreng",
    "krempeng",
    "kunti",
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
    "onta",
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
    "sampah",
    "sange",
    "sarap",
    "seks",
    "serbet",
    "setan",
    "silit",
    "sinting",
    "sipit",
    "sitip",
    "sompret",
    "sontoloyo",
    "tai",
    "tol",
    "taplak",
    "terkutuk",
    "titit",
    "tolol",
    "transgendertuyul",
    "udik",
    "kafir",
    "dancok",
    "asu",
    "genjit",
    "monyet",
    "jelek",
    "pukimak",
    "mesum",
    "kotl",
    "anjeng",
    "gblk",
    "taik",
    "tai",
    "gelud",
    "cerewet",
    "jancok",
    "bgsd",
    "xhamster.com",
    "kimax",
    "pelacur",
    "germo",
    "crot",
    "pekok",
    "dunguk",
    "bajang",
    "songong",
    "tempik",
    "meki",
    "bgst",
    "mani",
    "pejuh",
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
* \`/up_info_a1\` *_not available_* : Mengupdate informasi kuliah untuk *kelas A1* 
* \`/up_info_a2\` *_not available_* : Mengupdate informasi kuliah untuk *kelas A2* 
* \`/antitoxic\` : Mengaktifkan/Nonaktifkan fitur *anti-toxic*

*PERKULIAHAN* :
* \`/help\` : Untuk melihat menu 📜
<<<<<<< HEAD
* \`/info_kuliah\` *_not available_* : Menampilkan jadwal dan info kuliah terdekat 📋
* \`/list_matakuliah\` *_not available_* : Menampilkan daftar matakuliah dan dosen yang mengampu 📑
* \`/list_tugas\` *_not available_* : List tugas yang diberikan oleh dosen 📚
=======
* \`/info_kuliah\` : Menampilkan jadwal dan info kuliah terdekat 📋
* \`/list_matakuliah\` :Menampilkan daftar matakuliah dan dosen yang mengampu 📑
* \`/list_tugas\` : List t ugas yang diberikan oleh dosen 📚
>>>>>>> qeem

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

module.exports = {
    validGroups,
    menuText,
    unknownCommand,
    serverMon,
    badWordsEn,
    badWordsId,
};
