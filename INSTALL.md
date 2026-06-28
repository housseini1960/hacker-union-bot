# HACKER-UNION-BOT V2

### Installation Steps

```bash
pkg update -y && pkg install nodejs git -y
git clone https://github.com/housseini1960/hacker-union-bot
cd hacker-union-bot
npm install @whiskeysockets/baileys@6.5.0 qrcode-terminal pino chalk
npm start
### Connect WhatsApp
1. After `npm start`, a yellow QR code will appear.
2. Open WhatsApp > `...` > `Linked Devices` > `Link a Device`
3. Scan the QR code. It expires in 20 seconds.

**⚠️ SECURITY WARNING**: Never share your QR code or the `session/` folder. Anyone with it can access your WhatsApp.
