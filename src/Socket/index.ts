import { DEFAULT_CONNECTION_CONFIG } from '../Defaults'
import type { UserFacingSocketConfig } from '../Types'
import { makeCommunitiesSocket } from './communities'
import { printBanner } from '../Modded/banner'

// export the last socket layer
const makeWASocket = (config: UserFacingSocketConfig) => {
	printBanner()

	const newConfig = {
		...DEFAULT_CONNECTION_CONFIG,
		...config
	}

	return makeCommunitiesSocket(newConfig)
}

export default makeWASocket
