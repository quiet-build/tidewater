# Tidewater source and Mini Arcade release record

Upstream: <https://github.com/dgreenheck/tidewater>

Fork: <https://github.com/quiet-build/tidewater>

The fork retains the complete upstream Git history. Mini Arcade work began from
upstream revision `1438b1abfcaee3267092b75573014f4d9b4a983c` and keeps `upstream`
as the source reference.

## Reuse and licenses

All upstream gameplay, rendering, assets and credits are retained. Repository
code is MIT licensed; the original copyright and license remain in `LICENSE`.
Third-party audio, scans, characters and fonts keep the licenses and attribution
listed in `CREDITS.md` and the adjacent asset credit files. No upstream credit or
reference was removed.

## Mini Arcade adaptation

The standalone game remains intact. `public/component.js` adds the
`pma-tidewater` host contract and uses a same-origin iframe because Tidewater is
a full-document WebGPU game with Pointer Lock and global UI. `src/main.js` adds
only pause/resume messages for host lifecycle handling. The fork publishes the
verified static build through GitHub Actions to Cloudflare Workers Static Assets.

## Verification

- `npm test`: game logic, component contract and local WebGPU engine smoke pass.
- `npm run build`: production build passes.
- `npx wrangler deploy --dry-run`: 148 static assets accepted.
- Live component entry returns JavaScript with CORS and registers
  `pma-tidewater`.
- Mini Arcade local production build loads the live component and iframe, then
  reaches `Ready to play`; pause/resume is exercised with real browser input.

Headless Chromium does not establish playable WebGPU rendering quality. The
standalone game was separately opened for human local play before publication.
