import makeWASocket, {
	useMultiFileAuthState,
	DisconnectReason,
	Browsers,
	sendButtons,
	sendMenu
} from '../src'
import P from 'pino'
import qrcode from 'qrcode-terminal'

// Nota: WhatsApp exige que un pairing code personalizado tenga EXACTAMENTE 8 caracteres.
// "noth-1234" (con guion) tiene 9 y sera rechazado — se uso "NOTH1234".
const DEFAULT_PAIRING_CODE = 'NOTH1234'
const usePairingCode = process.argv.includes('--use-pairing-code')
const phoneNumber = process.argv[process.argv.indexOf('--phone') + 1]

const logger = P({ level: 'silent' })

async function startBot() {
	const { state, saveCreds } = await useMultiFileAuthState('./session')

	const sock = makeWASocket({
		auth: state,
		logger,
		browser: Browsers.ubuntu('Noth Baileys')
	})

	sock.ev.on('creds.update', saveCreds)

	sock.ev.on('connection.update', async update => {
		const { connection, lastDisconnect, qr } = update

		if (usePairingCode && phoneNumber && !sock.authState.creds.registered) {
			const code = await sock.requestPairingCode(phoneNumber, DEFAULT_PAIRING_CODE)
			console.log('[Noth Baileys] Pairing code:', code)
		} else if (qr) {
			qrcode.generate(qr, { small: true })
		}

		if (connection === 'close') {
			const shouldReconnect =
				(lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
			if (shouldReconnect) startBot()
		}
		if (connection === 'open') console.log('[Noth Baileys] Conectado.')
	})

	sock.ev.on('messages.upsert', async ({ messages }) => {
		const msg = messages[0]
		if (!msg?.message || msg.key.fromMe) return
		const jid = msg.key.remoteJid!
		const text = msg.message.conversation || msg.message.extendedTextMessage?.text || ''

		if (text === '.botones') {
			await sendButtons(
				sock,
				jid,
				{
					title: 'Noth Baileys',
					body: 'Elige una opcion:',
					footer: 'Powered by Noth',
					buttons: [
						{ type: 'reply', text: 'Menu', id: '.menu' },
						{ type: 'url', text: 'Repo', url: 'https://github.com/Edward-oficial' },
						{ type: 'copy', text: 'Copiar codigo', code: DEFAULT_PAIRING_CODE }
					]
				},
				msg
			)
		}

		if (text === '.menu') {
			await sendMenu(
				sock,
				jid,
				{
					title: 'Noth Baileys',
					body: 'Selecciona una categoria:',
					footer: 'Powered by Noth',
					buttonText: 'Abrir menu',
					sections: [
						{
							title: 'General',
							rows: [
								{ title: 'Ayuda', description: 'Ver comandos', id: '.help' },
								{ title: 'Info', description: 'Sobre el bot', id: '.info' }
							]
						}
					]
				},
				msg
			)
		}
	})
}

startBot()
