# Noth Baileys

Noth Baileys es una librería para desarrollar bots de WhatsApp con Node.js.

El proyecto es desarrollado y personalizado por **Edward**, incorporando funciones, modificaciones y herramientas propias enfocadas en facilitar la creación de bots y aplicaciones que utilizan WhatsApp.

## Características

- Conexión mediante código QR
- Conexión mediante Pairing Code
- Pairing Code personalizado
- Sistema de autenticación mediante sesiones
- Manejo de mensajes
- Envío de texto, imágenes, videos, audios y documentos
- Soporte para grupos
- Manejo de participantes
- Menciones
- Mensajes citados
- Eventos de conexión
- Sistema modular
- Herramientas adicionales para desarrolladores

## Funciones adicionales

### LID → JID

Noth Baileys incorpora soporte para trabajar con identificadores LID de WhatsApp y resolverlos al JID correspondiente cuando la información está disponible.

Ejemplo:

```js
const jid = await sock.resolveLidToJid(lid)
```

Esto permite trabajar con identificadores como:

```text
123456789@lid
```

y resolverlos al JID correspondiente:

```text
504XXXXXXXX@s.whatsapp.net
```

La resolución está integrada directamente en la librería para evitar que cada bot tenga que implementar su propio sistema de conversión.

## sendTable()

Noth Baileys incluye `sendTable()` para facilitar el envío de tablas formateadas.

Ejemplo:

```js
await sock.sendTable(jid, {
  title: 'Usuarios',
  headers: ['Nombre', 'Edad', 'Estado'],
  rows: [
    ['Edward', '14', 'Activo'],
    ['Usuario 2', '16', 'Activo'],
    ['Usuario 3', '15', 'Inactivo']
  ]
})
```

También se pueden utilizar tablas sin título:

```js
await sock.sendTable(jid, {
  headers: ['Comando', 'Descripción'],
  rows: [
    ['/menu', 'Muestra el menú'],
    ['/ping', 'Comprueba la conexión'],
    ['/info', 'Muestra información']
  ]
})
```

## Pairing Code

Noth Baileys permite conectar una cuenta de WhatsApp utilizando Pairing Code.

También permite utilizar un código personalizado de exactamente 8 caracteres.

Ejemplo:

```js
const code = await sock.requestPairingCode(
  '504XXXXXXXX',
  'NOTH1234'
)

console.log(code)
```

## Instalación

```bash
npm install
```

## Uso básico

```js
import makeWASocket, {
  useMultiFileAuthState
} from 'noth-baileys'

const { state, saveCreds } =
  await useMultiFileAuthState('./session')

const sock = makeWASocket({
  auth: state
})

sock.ev.on('creds.update', saveCreds)
```

## Sesiones

Las sesiones pueden almacenarse utilizando:

```js
useMultiFileAuthState('./session')
```

Esto permite mantener la autenticación de la cuenta entre reinicios del bot.

## Grupos

Noth Baileys permite trabajar con grupos de WhatsApp y sus participantes.

Incluye soporte para:

- Entrada de participantes
- Salida de participantes
- Cambios de participantes
- Información del grupo
- Menciones
- Mensajes enviados dentro de grupos

## Mensajes

Ejemplo de mensaje de texto:

```js
await sock.sendMessage(jid, {
  text: 'Hola desde Noth Baileys'
})
```

Ejemplo de imagen:

```js
await sock.sendMessage(jid, {
  image: {
    url: 'https://example.com/image.jpg'
  },
  caption: 'Imagen de prueba'
})
```

## Autor

**Edward**

Noth Baileys es desarrollado y personalizado por Edward.

## Licencia

Consulta el archivo `LICENSE` incluido en el proyecto para conocer las condiciones de uso y distribución.
