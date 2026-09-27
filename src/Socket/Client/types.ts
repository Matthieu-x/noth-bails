import type { BinaryNode } from '../../WABinary'
import type { ClientPayload } from '../../WAProto/index.js'

export type WAVersion = [number, number, number]

export type SocketConfig = {
	waWebSocketUrl: string | URL
	connectTimeoutMs: number
	keepAliveIntervalMs: number
	logger: any
	agent?: any
	version: WAVersion
	browser: [string, string, string]
	auth: any
	printQRInTerminal?: boolean
	generateHighQualityLinkPreview?: boolean
	markOnlineOnConnect?: boolean
	syncFullHistory?: boolean
	fireInitQueries?: boolean
	emitOwnEvents?: boolean
	defaultQueryTimeoutMs?: number
	customUploadHosts?: any[]
	retryRequestDelayMs?: number
	maxMsgRetryCount?: number
	appStateMacVerification?: { patch: boolean; snapshot: boolean }
	countryCode?: string
	options?: any
	getMessage?: (key: any) => Promise<any>
	cachedGroupMetadata?: (jid: string) => Promise<any>
	makeSignalRepository?: any
	shouldSyncHistoryMessage?: (msg: any) => boolean
	shouldIgnoreJid?: (jid: string) => boolean | undefined
	linkPreviewImageThumbnailWidth?: number
	transactionOpts?: { maxCommitRetries: number; delayBetweenTriesMs: number }
	enableAutoSessionRecreation?: boolean
	enableRecentMessageCache?: boolean
	patchMessageBeforeSending?: (msg: any) => any
}

export type UserFacingSocketConfig = Partial<SocketConfig> & { auth: any }

export type BaileysEventMap = any

export type BaileysEventEmitter = any

export type BinaryNodeSocket = any
