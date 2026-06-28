const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const chalk = require('chalk');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const sock = makeWASocket({ auth: state, logger: pino({ level: 'silent' }) });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if(qr) {
            console.log(chalk.green('\n[SCANNE CE QR CODE AVEC TON WHATSAPP]\n'));
            qrcode.generate(qr, {small: true});
        }
        if(connection === 'open') console.log(chalk.green('✅ Bot Connecté!'));
        if(connection === 'close') startBot(); // Se relance tout seul
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || '';
        if(text === '!ping') {
            await sock.sendMessage(from, { text: 'Pong ✅ Bot actif' });
        }
        if(text === '!menu') {
            await sock.sendMessage(from, { text: '*HACKER UNION BOT*\n!menu\n!ping' });
        }
    });
}
startBot();
