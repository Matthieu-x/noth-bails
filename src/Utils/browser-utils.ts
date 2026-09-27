import type { WABrowserDescription } from '../Types'

const BROWSER_MAP: { [T in string]?: WABrowserDescription } = {
	MacOS: ['Mac OS', 'Chrome', '10.15.7'],
	Windows: ['Windows', 'Chrome', '10.0'],
	Ubuntu: ['Ubuntu', 'Chrome', '22.04'],
	iOS: ['iOS', 'Safari', '16.0'],
	Android: ['Android', 'Chrome', '10.0']
}

export const Browsers = {
	macOS: (browser: string) => ['Mac OS', browser, '10.15.7'] as WABrowserDescription,
	windows: (browser: string) => ['Windows', browser, '10.0'] as WABrowserDescription,
	ubuntu: (browser: string) => ['Ubuntu', browser, '22.04'] as WABrowserDescription,
	iOS: (browser: string) => ['iOS', browser, '16.0'] as WABrowserDescription,
	android: (browser: string) => ['Android', browser, '10.0'] as WABrowserDescription,
	appropriate: () => {
		const platform = process.platform
		if (platform === 'darwin') return Browsers.macOS('Chrome')
		if (platform === 'win32') return Browsers.windows('Chrome')
		return Browsers.ubuntu('Chrome')
	}
}
