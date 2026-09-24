import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile( new URL( '../public/component.js', import.meta.url ), 'utf8' );
assert.match( source, /customElements\.define\( 'pma-tidewater'/ );
assert.match( source, /new URL\( '\.\/', import\.meta\.url \)/ );
assert.match( source, /type: 'pma-pause'/ );
assert.match( source, /type: 'pma-resume'/ );
assert.match( source, /'pma-ready'/ );
assert.match( source, /pause\(\)/ );
console.log( 'ok   Mini Arcade component contract' );
