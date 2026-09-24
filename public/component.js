const GAME_ID = 'tidewater';

class TidewaterElement extends HTMLElement {
	constructor() {
		super();
		this.attachShadow( { mode: 'open' } );
		this._ready = false;
	}

	connectedCallback() {
		if ( this._frame ) return;
		const style = document.createElement( 'style' );
		style.textContent = ':host{display:block;position:relative;width:100%;height:100%;min-height:610px;background:#07131d}iframe{display:block;width:100%;height:100%;min-height:610px;border:0}.resume{position:absolute;inset:0;display:none;place-items:center;background:rgba(7,19,29,.72);z-index:2}.resume[open]{display:grid}button{font:700 18px system-ui,sans-serif;padding:14px 24px;border:0;border-radius:999px;background:#f5c86a;color:#14212a;cursor:pointer}';
		const frame = document.createElement( 'iframe' );
		frame.title = 'Tidewater game';
		frame.allow = 'autoplay; fullscreen';
		frame.src = new URL( './', import.meta.url ).href;
		const resume = document.createElement( 'div' );
		resume.className = 'resume';
		const button = document.createElement( 'button' );
		button.type = 'button';
		button.textContent = 'Resume Tidewater';
		button.addEventListener( 'click', () => {
			resume.removeAttribute( 'open' );
			frame.contentWindow?.postMessage( { type: 'pma-resume' }, '*' );
		} );
		resume.append( button );
		frame.addEventListener( 'load', () => {
			this._ready = true;
			this.dispatchEvent( new CustomEvent( 'pma-ready', { bubbles: true, composed: true, detail: { gameId: GAME_ID } } ) );
		}, { once: true } );
		frame.addEventListener( 'error', () => this.dispatchEvent( new CustomEvent( 'pma-error', { bubbles: true, composed: true, detail: { gameId: GAME_ID } } ) ), { once: true } );
		this.shadowRoot.append( style, frame, resume );
		this._frame = frame;
		this._resume = resume;
	}

	pause() {
		if ( ! this._frame ) return;
		this._frame.contentWindow?.postMessage( { type: 'pma-pause' }, '*' );
		if ( this._ready ) this._resume.setAttribute( 'open', '' );
	}
}

if ( ! customElements.get( 'pma-tidewater' ) ) customElements.define( 'pma-tidewater', TidewaterElement );
