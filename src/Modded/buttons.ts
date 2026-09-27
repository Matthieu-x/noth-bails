// src/Modded/buttons.ts
// Sistema de botones / mensajes interactivos — Noth Baileys (Nivel 1)
//
// Construido sobre las utilidades propias del core (generateWAMessageFromContent,
// prepareWAMessageMedia) — no depende de codigo de ningun fork de terceros.

import { generateWAMessageFromContent, prepareWAMessageMedia } from '../Utils/messages'
import type { WAMessage } from '../Types/Message'
import type makeWASocket from '../Socket'

type WASocket = ReturnType<typeof makeWASocket>

export type ButtonSpec =
	| { type: 'reply'; text: string; id: string }
	| { type: 'url'; text: string; url: string }
	| { type: 'copy'; text: string; code: string }
	| { type: 'call'; text: string; phone: string }

export interface SendButtonsOptions {
	title?: string
	body: string
	footer?: string
	imageUrl?: string
	buttons: ButtonSpec[]
}

export interface MenuRow {
	title: string
	description?: string
	id: string
}

export interface MenuSection {
	title: string
	rows: MenuRow[]
}

export interface SendMenuOptions {
	title?: string
	body: string
	footer?: string
	buttonText: string
	sections: MenuSection[]
}

function mapButton(btn: ButtonSpec) {
	switch (btn.type) {
		case 'reply':
			return {
				name: 'quick_reply',
				buttonParamsJson: JSON.stringify({ display_text: btn.text, id: btn.id })
			}
		case 'url':
			return {
				name: 'cta_url',
				buttonParamsJson: JSON.stringify({ display_text: btn.text, url: btn.url })
			}
		case 'copy':
			return {
				name: 'cta_copy',
				buttonParamsJson: JSON.stringify({ display_text: btn.text, copy_code: btn.code })
			}
		case 'call':
			return {
				name: 'cta_call',
				buttonParamsJson: JSON.stringify({ display_text: btn.text, phone_number: btn.phone })
			}
	}
}

/** Botones mixtos (quick_reply, cta_url, cta_copy, cta_call) en un solo mensaje. */
export async function sendButtons(
	sock: WASocket,
	jid: string,
	opts: SendButtonsOptions,
	quoted?: WAMessage
) {
	const nativeButtons = opts.buttons.map(mapButton)

	let header: any
	if (opts.imageUrl) {
		const media = await prepareWAMessageMedia(
			{ image: { url: opts.imageUrl } },
			{ upload: sock.waUploadToServer }
		)
		header = { title: opts.title || '', hasMediaAttachment: true, imageMessage: media.imageMessage }
	} else {
		header = { title: opts.title || '', hasMediaAttachment: false }
	}

	const msg = generateWAMessageFromContent(
		jid,
		{
			viewOnceMessage: {
				message: {
					messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} },
					interactiveMessage: {
						body: { text: opts.body },
						footer: opts.footer ? { text: opts.footer } : undefined,
						header,
						nativeFlowMessage: { buttons: nativeButtons }
					}
				}
			}
		},
		{ quoted, userJid: sock.authState.creds.me!.id }
	)

	await sock.relayMessage(jid, msg.message!, { messageId: msg.key.id! })
	return msg
}

/** Menu/lista interactiva (single_select). */
export async function sendMenu(
	sock: WASocket,
	jid: string,
	opts: SendMenuOptions,
	quoted?: WAMessage
) {
	const msg = generateWAMessageFromContent(
		jid,
		{
			viewOnceMessage: {
				message: {
					messageContextInfo: { deviceListMetadataVersion: 2, deviceListMetadata: {} },
					interactiveMessage: {
						body: { text: opts.body },
						footer: opts.footer ? { text: opts.footer } : undefined,
						header: { title: opts.title || '', hasMediaAttachment: false },
						nativeFlowMessage: {
							buttons: [
								{
									name: 'single_select',
									buttonParamsJson: JSON.stringify({
										title: opts.buttonText,
										sections: opts.sections
									})
								}
							]
						}
					}
				}
			}
		},
		{ quoted, userJid: sock.authState.creds.me!.id }
	)

	await sock.relayMessage(jid, msg.message!, { messageId: msg.key.id! })
	return msg
}
