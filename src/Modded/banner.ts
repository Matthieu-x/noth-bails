// src/Modded/banner.ts
// Logo de inicio de Noth Bails — animacion de "descifrado" binario que
// termina formando EDWARD, seguida del logo con gradiente morado/negro.
//
// Corre en paralelo (no bloquea makeWASocket ni la conexion real —
// la libreria sigue siendo veloz, esto es solo cosmetico en consola).

const RESET = '\x1b[0m'
const DIM = '\x1b[2m'

// Cambia esta linea para usar azul en vez de morado:
//   const PRIMARY = '\x1b[38;2;80;140;255m'   // azul
const PRIMARY = '\x1b[38;2;168;85;247m' // morado (violeta)
const DARK = '\x1b[38;2;40;20;60m' // "un poco de negro" — morado casi negro
const NOISE = '\x1b[90m' // gris/negro tenue para el ruido binario

const GRADIENT = [PRIMARY, '\x1b[38;2;147;51;234m', '\x1b[38;2;126;34;206m', DARK]

const LOGO = [
	'  _   _       _   _       ____        _ _     ',
	' | \\ | | ___ | |_| |__   | __ )  __ _(_) |___ ',
	' |  \\| |/ _ \\| __| \'_ \\  |  _ \\ / _` | | / __|',
	' | |\\  | (_) | |_| | | | | |_) | (_| | | \\__ \\',
	' |_| \\_|\\___/ \\__|_| |_| |____/ \\__,_|_|_|___/'
]

const TARGET = 'EDWARD'
const BINARY_CHARS = ['0', '1']

let yaImpreso = false

function randomBinary() {
	return BINARY_CHARS[Math.floor(Math.random() * BINARY_CHARS.length)]
}

async function animarDecodificacion(durationMs: number) {
	const totalFrames = Math.ceil(durationMs / 120)
	const framesPorLetra = Math.floor(totalFrames / TARGET.length)

	for (let frame = 0; frame < totalFrames; frame++) {
		const letrasReveladas = Math.min(TARGET.length, Math.floor(frame / framesPorLetra))

		let linea = ''
		for (let i = 0; i < TARGET.length; i++) {
			if (i < letrasReveladas) {
				linea += `${PRIMARY}${TARGET[i]}${RESET}`
			} else {
				linea += `${NOISE}${randomBinary()}${RESET}`
			}
		}

		// tambien mostramos algo de "ruido" binario alrededor para el efecto de compilado
		const ruidoIzq = Array.from({ length: 6 }, randomBinary).join('')
		const ruidoDer = Array.from({ length: 6 }, randomBinary).join('')

		process.stdout.write(`\r${NOISE}${ruidoIzq}${RESET} ${linea} ${NOISE}${ruidoDer}${RESET}  `)

		await new Promise(resolve => setTimeout(resolve, 120))
	}

	// linea final ya resuelta, sin ruido
	process.stdout.write(`\r${PRIMARY}${TARGET}${RESET}` + ' '.repeat(20) + '\n')
}

function imprimirLogo() {
	const lines = LOGO.map((line, i) => `${GRADIENT[i % GRADIENT.length]}${line}${RESET}`)
	console.log('\n' + lines.join('\n'))
	console.log(`${DIM}${PRIMARY}  Noth Bails — veloz y estable${RESET}\n`)
}

/**
 * Imprime el banner de inicio. No bloquea: la animacion corre en
 * background mientras el socket ya se esta conectando de verdad.
 */
export function printBanner(durationMs = 4500) {
	if (yaImpreso) return
	yaImpreso = true

	void (async () => {
		await animarDecodificacion(durationMs)
		imprimirLogo()
	})()
}
