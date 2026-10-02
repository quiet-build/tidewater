// Keyboard / mouse input owned by the game canvas, including Shadow DOM pointer lock.
export class Input {

	constructor( dom ) {

		this.dom = dom;
		this.scope = dom.getRootNode();
		this.keys = new Set();
		this.pressed = new Set();
		this.look = { x: 0, y: 0 };
		this.locked = false;
		this.enabled = true;
		this.reset();
		this.events = new AbortController();
		const signal = this.events.signal;
		dom.addEventListener( 'keydown', ( e ) => {

			if ( ! this.enabled ) return;
			if ( ! this.keys.has( e.code ) ) this.pressed.add( e.code );
			this.keys.add( e.code );
			if ( [ 'Space', 'ArrowUp', 'ArrowDown', 'Tab' ].includes( e.code ) ) e.preventDefault();

		}, { signal } );
		window.addEventListener( 'keyup', ( e ) => this.keys.delete( e.code ), { signal } );
		window.addEventListener( 'blur', () => this.reset(), { signal } );
		dom.addEventListener( 'blur', () => this.reset(), { signal } );
		dom.addEventListener( 'mousedown', ( e ) => {

			if ( ! this.enabled ) return;
			dom.focus( { preventScroll: true } );
			if ( e.button === 0 ) this.mouseDown = true;
			if ( e.button === 2 ) this.rightDown = true;

		}, { signal } );
		window.addEventListener( 'mouseup', ( e ) => {

			if ( e.button === 0 ) this.mouseDown = false;
			if ( e.button === 2 ) this.rightDown = false;

		}, { signal } );
		dom.addEventListener( 'contextmenu', e => e.preventDefault(), { signal } );
		dom.addEventListener( 'mousemove', ( e ) => {

			if ( this.enabled && ( this.locked || this.mouseDown || this.rightDown ) ) {

				this.look.x += e.movementX;
				this.look.y += e.movementY;

			}

		}, { signal } );
		dom.addEventListener( 'wheel', ( e ) => {

			if ( this.enabled ) this.wheel += Math.sign( e.deltaY );
			e.preventDefault();

		}, { passive: false, signal } );
		document.addEventListener( 'pointerlockchange', () => {

			this.locked = this.scope.pointerLockElement === dom;
			if ( ! this.locked ) this.reset();

		}, { signal } );

	}

	reset() {

		this.keys.clear();
		this.pressed.clear();
		this.look.x = this.look.y = this.wheel = 0;
		this.mouseDown = this.rightDown = false;

	}

	dispose() {

		this.events.abort();
		this.reset();
		if ( this.scope.pointerLockElement === this.dom ) document.exitPointerLock();

	}

	requestLock() {

		if ( ! this.enabled ) return;
		this.dom.focus( { preventScroll: true } );
		if ( ! this.locked ) this.dom.requestPointerLock?.()?.catch?.( () => {} );

	}

	down( code ) { return this.enabled && this.keys.has( code ); }
	hit( code ) { return this.enabled && this.pressed.has( code ); }
	consumeLook() {

		const look = { ...this.look };
		this.look.x = this.look.y = 0;
		return look;

	}
	consumeWheel() {

		const wheel = this.wheel;
		this.wheel = 0;
		return wheel;

	}
	endFrame() { this.pressed.clear(); }

}
