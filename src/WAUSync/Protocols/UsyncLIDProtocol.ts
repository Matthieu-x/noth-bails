import type { USyncQueryProtocol } from '../../Types/USync'
import { assertNodeErrorFree, type BinaryNode } from '../../WABinary'
import { USyncUser } from '../USyncUser'

export class UsyncLIDProtocol implements USyncQueryProtocol {
	name = 'lid'

	getQueryElement(): BinaryNode {
		return {
			tag: 'lid',
			attrs: {}
		}
	}

	getUserElement(user: USyncUser): BinaryNode | null {
		void user
		return null
	}

	parser(node: BinaryNode): string | null {
		if (node.tag === 'lid') {
			assertNodeErrorFree(node)
			return typeof node.content === 'string' ? node.content : null
		}

		return null
	}
}
