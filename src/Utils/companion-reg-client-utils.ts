import type { WABrowserDescription } from '../Types'

export enum CompanionWebClientType {
	UNKNOWN = 0,
	CHROME = 1,
	FIREFOX = 2,
	IE = 3,
	OPERA = 4,
	SAFARI = 5,
	EDGE = 6,
	DESKTOP = 7,
	IPAD = 8,
	ANDROID_TABLET = 9,
	OHOS = 10,
	UWP = 11,
	ELECTRON = 12,
	OTHER_WEB_CLIENT = 13
}

const BROWSER_TO_COMPANION_WEB_CLIENT: { [T in string]?: CompanionWebClientType } = {
	Chrome: CompanionWebClientType.CHROME,
	Firefox: CompanionWebClientType.FIREFOX,
	IE: CompanionWebClientType.IE,
	Opera: CompanionWebClientType.OPERA,
	Safari: CompanionWebClientType.SAFARI,
	Edge: CompanionWebClientType.EDGE,
	Desktop: CompanionWebClientType.DESKTOP,
	iPad: CompanionWebClientType.IPAD,
	Android: CompanionWebClientType.ANDROID_TABLET,
	OHOS: CompanionWebClientType.OHOS
}

export const getCompanionWebClientType = ([os, browserName]: WABrowserDescription): CompanionWebClientType => {
	if (browserName === 'Desktop') {
		return os === 'Windows' ? CompanionWebClientType.UWP : CompanionWebClientType.ELECTRON
	}

	return BROWSER_TO_COMPANION_WEB_CLIENT[browserName] || CompanionWebClientType.OTHER_WEB_CLIENT
}

export const getCompanionPlatformId = (browser: WABrowserDescription): string => {
	return getCompanionWebClientType(browser).toString()
}

export const buildPairingQRData = (
	ref: string,
	noiseKeyB64: string,
	identityKeyB64: string,
	advB64: string,
	browser: WABrowserDescription
): string => {
	return (
		'https://wa.me/settings/linked_devices#' +
		[ref, noiseKeyB64, identityKeyB64, advB64, getCompanionPlatformId(browser)].join(',')
	)
}
