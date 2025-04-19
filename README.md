# TI WhatsApp Bot (using Baileys)

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.x-brightgreen.svg)](https://nodejs.org/)
[![Baileys Version](https://img.shields.io/badge/baileys-%5E6.x.x-blue.svg)](https://github.com/WhiskeySockets/Baileys) <!-- Update Baileys version if needed -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) <!-- Choose a license and update if needed -->

A Node.js application designed to automate sending WhatsApp messages based on a schedule, utilizing the Baileys library.

**⚠️ Disclaimer:** This bot interacts with WhatsApp using the Baileys library, which reverse-engineers the WhatsApp Web API. This is not an official WhatsApp API. Using it might be against WhatsApp's Terms of Service and could potentially lead to your phone number being temporarily or permanently banned. **Use this software responsibly and at your own risk.**

## 🤔 What is this?

This is a simple whatsApp bot for academic purpose using a library called Baileys.

## ✨ Features

- **Direct WhatsApp Integration:** Connects directly to WhatsApp servers using the Baileys WebSocket interface.
- **Scheduled Messaging:** Sends messages automatically based on a defined schedule.
- **Contact & Group Support:** Can send messages to both individual contacts (JIDs) and group chats (Group JIDs).
- **Session Persistence:** Saves authentication data to avoid pairing the code everytime the code runs.

## 🛠️ Tech Stack

- **Node.js (v16.x or higher recommended)**
- **JavaScript (Vanilla)**
- **Libraries:**
    - `@whiskeysockets/baileys`: Core library for WhatsApp interaction. _[Verify exact package name in your `package.json`]_
    - `pino`: Logger, often used with Baileys.
    - `zustand`: State management..

## ⚙️ Prerequisites

1. **Node.js:** Make sure you have Node.js (version 16 or newer is recommended for modern Baileys) and npm (or yarn) installed. Download from [nodejs.org](https://nodejs.org/).
2. **WhatsApp Account:** A working WhatsApp account (ideally not your primary personal number, due to the risks mentioned above).

## 🚀 Installation & Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/MowlandCodes/ti_whatsapp_bot.git
    cd ti_whatsapp_bot
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or if you use yarn:
    # yarn install
    ```

## ▶️ How to Run

1. **Start the bot:**

    ```bash
    npm start
    # or directly using node:
    # node app.js
    ```

2. **Pairing Device (First Run):**

    - The first time you run the script (or if the session files are deleted/invalid), a message appeared to pair the bot to your whatsApp account by inserting your number then write the generated code from the terminal.
    - Open WhatsApp on your phone, go to `Settings` > `Linked Devices` > `Link a Device`, and insert the generated code.

3. **Bot Running:**
    - Once connected, the bot will initialize. You should see log messages indicating it's connected and running.
    - It will then monitor the chat withing the group you apply to.
    - When a scheduled time matches, it will use Baileys functions (like `sock.sendMessage`) to send the message to the specified JID.

## 📝 How It Works (Conceptual)

1. **Initialization:** The script initializes the Baileys socket connection (`makeWASocket`).
2. **Authentication:** It handles the connection events:
    - `connection.update`: Listens for updates like generated code to pair the bot to your device.
    - Session credentials are saved upon successful connection (`creds.update`).
3. **Data Loading:** Loads the schedule and message data from the terminal logs.
4. **Job Execution:** When the scheduler triggers:
    - It checks the current time and day.
    - It compares this against the loaded schedule data.
    - If a match is found, it constructs the message and uses `sock.sendMessage(targetJid, { text: messageContent })` to send the message via the active Baileys connection.
5. **Logging:** Throughout the process, information, warnings, and errors are logged to the console (likely using `pino`).

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find bugs, please feel free to:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 📧 Contact

[MowlandCodes](mailto:mowlandgaming@gmail.com) - [Mcqeems](mailto:mcqeemsofficial@gmail.com)

Project Link: [https://github.com/MowlandCodes/ti_whatsapp_bot](https://github.com/MowlandCodes/ti_whatsapp_bot)
