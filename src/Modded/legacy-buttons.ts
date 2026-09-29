// src/Modded/legacy-buttons.ts
// Botones rapidos y listas desplegables en formato "clasico"
// (buttonsMessage / listMessage) — el mismo que sigue usando
// github: Matthieu-x/noth-bails y varios bots que aun le sacan
// provecho a este formato en vez del nativeFlowMessage moderno.
//
// El protocolo (WAProto) todavia soporta estos tipos de mensaje,
// asi que se arman directo contra el proto en vez de depender de un
// atajo tipo `buttons:` en sendMessage (Baileys oficial ya no trae ese atajo).

import { generateWAMessageFromContent } from '../Utils/messages'
import type { WAMessage } from '../Types/Message'
import type makeWASocket from '../Socket'

type WASocket = ReturnType<typeof makeWASocket>

const SIMBOLO = 'ꕥ'
const MAX_BOTONES = 3

export interface BotonSimple {
	texto: string
	id: string
}

export interface OpcionesBotones {
	texto: string
	footer?: string
	botones: BotonSimple[]
	mensajeCitado?: WAMessage
	menciones?: string[]
}

export interface FilaLista {
	titulo: string
	id: string
	descripcion?: string
}

export interface SeccionLista {
	titulo?: string
	filas: FilaLista[]
}

export interface OpcionesLista {
	texto: string
	footer?: string
	titulo?: string
	textoBoton?: string
	secciones: SeccionLista[]
	mensajeCitado?: WAMessage
	menciones?: string[]
}

/**
 * Envia un mensaje con botones rapidos (formato clasico buttonsMessage).
 * WhatsApp solo permite mostrar hasta 3 botones a la vez.
 */
export async function enviarBotones(sock: WASocket, chat: string, opciones: OpcionesBotones) {
	const { texto, footer, botones, mensajeCitado, menciones } = opciones

	if (!texto) {
		throw new Error('enviarBotones requiere "texto"')
	}

	if (!Array.isArray(botones) || !botones.length) {
		throw new Error('enviarBotones requiere al menos un boton en "botones"')
	}

	if (botones.length > MAX_BOTONES) {
		console.log(`${SIMBOLO}\n> Aviso: WhatsApp solo muestra hasta ${MAX_BOTONES} botones, se recorto la lista.`)
	}

	const botonesFormateados = botones.slice(0, MAX_BOTONES).map((b, i) => {
		if (!b?.id) throw new Error(`El boton en la posicion ${i} no tiene "id"`)
		return {
			buttonId: b.id,
			buttonText: { displayText: b.texto || 'Opcion' },
			type: 1 // RESPONSE
		}
	})

	const msg = generateWAMessageFromContent(
		chat,
		{
			buttonsMessage: {
				contentText: texto,
				footerText: footer,
				headerType: 1, // EMPTY
				buttons: botonesFormateados
			}
		},
		{
			quoted: mensajeCitado,
			userJid: sock.authState.creds.me!.id
		}
	)

	if (menciones?.length) {
		msg.message!.buttonsMessage!.contextInfo = { mentionedJid: menciones }
	}

	await sock.relayMessage(chat, msg.message!, { messageId: msg.key.id! })
	return msg
}

/**
 * Envia una lista desplegable interactiva (formato clasico listMessage).
 */
export async function enviarLista(sock: WASocket, chat: string, opciones: OpcionesLista) {
	const { texto, footer, titulo, textoBoton, secciones, mensajeCitado, menciones } = opciones

	if (!texto) {
		throw new Error('enviarLista requiere "texto"')
	}

	if (!Array.isArray(secciones) || !secciones.length) {
		throw new Error('enviarLista requiere al menos una seccion en "secciones"')
	}

	const seccionesFormateadas = secciones.map((s, i) => {
		const filas = Array.isArray(s.filas) ? s.filas : []
		if (!filas.length) throw new Error(`La seccion en la posicion ${i} no tiene "filas"`)

		return {
			title: s.titulo || '',
			rows: filas.map((f, j) => {
				if (!f?.id) throw new Error(`La fila ${j} de la seccion ${i} no tiene "id"`)
				return {
					title: f.titulo || 'Opcion',
					rowId: f.id,
					description: f.descripcion || ''
				}
			})
		}
	})

	const msg = generateWAMessageFromContent(
		chat,
		{
			listMessage: {
				title: titulo,
				description: texto,
				footerText: footer,
				buttonText: textoBoton || 'Ver opciones',
				listType: 1, // SINGLE_SELECT
				sections: seccionesFormateadas
			}
		},
		{
			quoted: mensajeCitado,
			userJid: sock.authState.creds.me!.id
		}
	)

	if (menciones?.length) {
		msg.message!.listMessage!.contextInfo = { mentionedJid: menciones }
	}

	await sock.relayMessage(chat, msg.message!, { messageId: msg.key.id! })
	return msg
}
