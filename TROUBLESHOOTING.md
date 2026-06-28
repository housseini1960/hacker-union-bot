# TROUBLESHOOTING

### Bug: `Disconnected. Reconnecting... true` loop or No QR Code
**Cause:** Session corrompue ou IP bannie par WhatsApp.
**Fix:**
```bash
rm -rf session
npm start
### Bug: `Cannot find module 'qrcode-terminal'`
**Cause:** Mauvaise version de Baileys.
**Fix:**
```bash
npm install @whiskeysockets/baileys@6.5.0 qrcode-terminal pino chalk
