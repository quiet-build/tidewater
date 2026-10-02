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

Standalone and portal mount the same `src/component.js` native Web Component.
The complete original WebGPU engine, gameplay and UI render directly in its
Shadow DOM. There is no iframe, postMessage bridge or separate full-page boot.
Input belongs to the canvas; UI queries, pointer lock and layout use the game
root. ResizeObserver follows the container. Disconnect stops input/audio/RAF,
waits for in-flight asset jobs, destroys the GPU device, and clears device-bound
shader, uniform and shared texture caches before a remount.

`src/assets.js` resolves resources against the module, independent of the host
origin. The Vite output keeps JavaScript at the distribution root. `_headers`
grants CORS for the complete runtime, including models, clouds and audio.
The original Google Fonts stylesheet is owned by the mounted component.

Main-site saves are new origin-local saves, as approved by the user; original
Worker-domain storage is neither imported nor deleted. The Worker standalone
page remains usable at the old origin with those saves.

## Verification

- `npm test`: game logic, component contract and local WebGPU engine smoke pass.
- `npm run build`: production build passes.
- `test/component.html`: real removal/remount and resize to 450px passed; the
  remounted canvas accepted R input and retained no WebGPU validation errors.
- Real browser input on the local production host: start, canvas clicks, W/R,
  outside pause, Resume, and returning to the canvas no longer repeat Resume.
- Production: game commit `9328844`, [CI 37021445667](https://github.com/quiet-build/tidewater/actions/runs/37021445667);
  portal commit `d644a43`, [CI 37021821179](https://github.com/quiet-build/mini-arcade-landing/actions/runs/37021821179).
  Fresh production launch and real clicks/W/R confirmed the same start and
  pause/resume sequence without repeated pauses. Shadow DOM contains no iframe;
  browser console has no errors. Published component bytes match the build.
- `pma-ready` means the loading UI is mounted; shader compilation continues with
  visible progress. Playability is checked separately using Click to explore.

Full fishing/selling/upgrading progression and mobile performance still need
player acceptance. Fullscreen remains unverified: even a separate minimal
fullscreen test returns `TypeError: not granted` in the automation browser.

## Native component source review (2026-10-03)

Player problem: clicking the iframe canvas blurs the portal window and repeatedly
triggers host pause. Reviewed local `quiet-build/voxel-garden` revision `4db6494`,
`src/component.tsx`: a Shadow DOM mount, composed readiness event, pause method and
disconnect cleanup. Adapt that lifecycle pattern to Tidewater's existing custom
WebGPU engine; no engine or asset replacement. Standalone and portal mount
the same component. User approved fresh main-site saves; old-domain saves stay
on their original origin without import or deletion. Acceptance: real canvas
start/movement, outside pause/resume, scoped controls, resize/fullscreen and remount.
