export type BinaryNode = {
	tag: string
	attrs: { [key: string]: string }
	content?: BinaryNode[] | string | Uint8Array
}

export type BinaryNodeAttributes = BinaryNode['attrs']

export type BinaryNodeContent = BinaryNode['content']

export type FullJid = {
	user: string
	server: string
	device?: number
	domainType?: number
}
