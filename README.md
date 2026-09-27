# Noth Baileys

Fork de [`@whiskeysockets/baileys`](https://github.com/WhiskeySockets/Baileys) con sistemas extra propios
(botones, menus, y lo que se vaya agregando por niveles).

## Instalar

```bash
npm install
```

## Compilar

```bash
npm run build
```

## Probar el ejemplo con botones/menu

```bash
npm run example:noth
```

Envia `.botones` o `.menu` al numero conectado para probar el Nivel 1.

Para conectar con pairing code en vez de QR:

```bash
npm run example:noth -- --use-pairing-code --phone 521234567890
```

## Que trae encima de Baileys oficial (Nivel 1)

- `sendButtons(sock, jid, opts, quoted?)` — botones quick_reply / cta_url / cta_copy / cta_call
- `sendMenu(sock, jid, opts, quoted?)` — lista interactiva (single_select)

Codigo en `src/Modded/buttons.ts`, exportado desde el entrypoint principal junto con todo lo demas de Baileys.

## Roadmap

- [x] Nivel 1 — botones, url, copiar, llamar, menu/lista
- [ ] Nivel 2 — sendTable, sendCodeBlock, sendList
- [ ] Nivel 3 — carrusel, albumes, producto, mapa+botones
- [ ] Nivel 4 — newsletter extra, scheduler, anti-ban, reconexion, cache, auth SQLite
- [ ] Nivel 5 — VoIP, wrappers tipo clase

## Licencia

MIT — basado en Baileys (WhiskeySockets / Rajeh Taher). Ver `LICENSE`.
