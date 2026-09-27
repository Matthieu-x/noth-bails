import type { BinaryNode } from '../WABinary'

/**
 * Builds an ACK stanza for a received node.
 * Particularly useful for message, receipt and call nodes.
 */
export const getAckStanza = (node: BinaryNode, type?: string): BinaryNode => {
	const attrs: BinaryNode['attrs'] = {
		to: node.attrs.from!,
		id: node.attrs.id!,
		class: node.tag
	}
	if (type) {
		attrs.type = type
	}
	if (node.attrs.participant) {
		attrs.participant = node.attrs.participant
	}
	if (node.attrs.recipient) {
		attrs.recipient = node.attrs.recipient
	}
	return {
		tag: 'ack',
		attrs
	}
}
