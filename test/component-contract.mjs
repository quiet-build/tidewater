import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Input } from '../src/core/Input.js';
import { GPU } from '../src/engine/gpu/GPU.js';
import { UniformBlock } from '../src/engine/gpu/Uniforms.js';

const source = await readFile( new URL( '../src/component.js', import.meta.url ), 'utf8' );
assert.match( source, /customElements\.define\( 'pma-tidewater'/ );
assert.doesNotMatch( source, /iframe|postMessage/ );
assert.match( source, /'pma-ready'/ );
assert.match( source, /disconnectedCallback\(\)/ );

// Input belongs to the canvas, follows shadow-root pointer lock, and releases listeners.
globalThis.window = new EventTarget();
globalThis.document = new EventTarget();
const root = { pointerLockElement: null };
const canvas = Object.assign( new EventTarget(), { getRootNode: () => root, focus() {} } );
const input = new Input( canvas );
const key = code => Object.assign( new Event( 'keydown', { cancelable: true } ), { code } );
window.dispatchEvent( key( 'KeyW' ) );
assert.equal( input.down( 'KeyW' ), false, 'Host keyboard events must not move the player' );
canvas.dispatchEvent( key( 'KeyW' ) );
assert.equal( input.down( 'KeyW' ), true );
root.pointerLockElement = canvas;
document.dispatchEvent( new Event( 'pointerlockchange' ) );
assert.equal( input.locked, true );
root.pointerLockElement = null;
document.dispatchEvent( new Event( 'pointerlockchange' ) );
assert.equal( input.down( 'KeyW' ), false );
input.dispose();
canvas.dispatchEvent( key( 'KeyW' ) );
assert.equal( input.down( 'KeyW' ), false, 'Unmount must remove input listeners' );

// Shared uniform blocks must allocate on the new device even with the same frame token.
globalThis.GPUBufferUsage = { UNIFORM: 1, STORAGE: 2, COPY_DST: 4 };
const device = () => ( { createBuffer: () => ( {} ) } );
GPU.queue = { writeBuffer() {} };
GPU.device = device();
const block = new UniformBlock( 'Probe', { value: [ 'f32', 1 ] } );
const first = block.upload( 1 );
GPU.device = device();
assert.notEqual( block.upload( 1 ), first );
console.log( 'ok   native component: canvas input, shadow pointer lock, disconnect and device remount' );
