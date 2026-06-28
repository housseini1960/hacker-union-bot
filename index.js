cd ~/hacker-union-bot
cat > index.js << 'EOF'
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs');

const AUTH_FOLDER = './session'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBot() {
    if (!fs.existsSync(AUTH_FOLDER)) fs.mkdirSync(AUTH_FOLDER);
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS('Chrome')
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = await question(chalk.yellow('\nEntre ton numéro WhatsApp avec indicatif. Ex: 22790xxxxxx\n> '));
        const code = await sock.requestPairingCode(phoneNumber.replace(/[^0-9]/g, ''));
        console.log(chalk.green(`\n=== TON CODE : ${code} ===\n`));
        console.log(chalk.yellow('WhatsApp >... > Appareils connectés > Associer avec le numéro de téléphone > Entre le code\n'));
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log(chalk.green('\n✅ Bot Connecté!'));
            rl.close();
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
        if (text === '!ping') await sock.sendMessage(msg.key.remoteJid, { text: 'Pong ✅' });
        if (text === '!menu') await sock.sendMessage(msg.key.remoteJid, { text: '*HACKER UNION*\n!ping\n!menu' });
    });
}

startBot();
EOF
