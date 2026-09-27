import { Boom } from '@hapi/boom'
import type { BinaryNode } from '../WABinary'
import { getBinaryNodeChild, getBinaryNodeChildren } from '../WABinary'
import type { WASocket } from '../Types'

export const executeMexQuery = async (sock: WASocket, query: BinaryNode) => {
	const result = await sock.query({
		tag: 'iq',
		attrs: {
			to: '@s.whatsapp.net',
			type: 'get',
			xmlns: 'w:mex'
		},
		content: [
			{
				tag: 'query',
				attrs: {},
				content: query
			}
		]
	})

	const resultNode = getBinaryNodeChild(result, 'result')
	if (!resultNode) {
		throw new Boom('No result node', { statusCode: 400 })
	}

	return resultNode
}
