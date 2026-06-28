const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs');

const AUTH_FOLDER = './session'

async function startBot() {
    if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER);
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Chrome')
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(chalk.yellow('\n=== SCAN CE QR CODE AVEC WHATSAPP ===\n'));
            qrcode.generate(qr, { small: true });
            console.log(chalk.yellow('\nWhatsApp >... > Appareils connectés > Associer un appareil\n'));
        }

        if (connection === 'open') {
            console.log(chalk.green('\n✅ Bot HACKER UNION Connecté!'));
        } else if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode!== DisconnectReason.loggedOut;
            console.log(chalk.red('❌ Déconnecté. Reconnexion...'), shouldReconnect);
            if (shouldReconnect) startBot();
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;
        const text = msg.message.conversation || '';

        if (text === '!ping') {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Pong ✅ Bot HACKER UNION actif' });
        }

        if (text === '!menu') {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '*HACKER UNION BOT*\n\n!ping - Test de connexion\n!menu - Affiche ce menu'
            });
        }
    });
}

startBot();
