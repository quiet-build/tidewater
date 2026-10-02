import { App } from './App.js';
import { UI } from './ui/UI.js';
import { AppUI } from './ui/AppUI.js';
import { assetBase } from './assets.js';
import { loaderMarkup } from './ui/loader.js';
import styles from './ui/ui.css?inline';

// ponytail: the existing engine owns one GPU singleton; serialize teardown before remount.
let owner = null;
let teardown = Promise.resolve();

export class TidewaterElement extends HTMLElement {

	constructor() {

		super();
		this.attachShadow( { mode: 'open' } );

	}

	connectedCallback() {

		const session = { events: new AbortController(), paused: false, started: false };
		this.session = session;
		const style = document.createElement( 'style' );
		style.textContent = styles;
		const container = document.createElement( 'div' );
		container.className = 'tidewater-container';
		container.innerHTML = `<div id="app"></div>${ loaderMarkup( assetBase ) }<div class="resume" hidden><button type="button">Resume Tidewater</button></div>`;
		this.shadowRoot.replaceChildren( style, container );
		session.resume = container.querySelector( '.resume' );
		session.resume.querySelector( 'button' ).addEventListener( 'click', () => this.resume(), { signal: session.events.signal } );
		const art = container.querySelector( '.loader-art' );
		art.addEventListener( 'load', () => art.classList.add( 'is-in' ), { once: true, signal: session.events.signal } );
		if ( art.complete ) art.classList.add( 'is-in' );
		const ui = session.ui = new UI( container );
		const app = session.app = new App( container.querySelector( '#app' ), ui, session.events.signal );
		// Preserve the original fonts; this stylesheet contains only font-face declarations.
		const fonts = session.fonts = document.createElement( 'link' );
		fonts.rel = 'stylesheet';
		fonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Caveat+Brush&family=Kalam:wght@400;700&display=swap';
		document.head.append( fonts );
		const signal = session.events.signal;
		window.addEventListener( 'blur', () => this.pause(), { signal } );
		document.addEventListener( 'visibilitychange', () => { if ( document.hidden ) this.pause(); }, { signal } );
		// The mounted loading screen owns the long WebGPU compilation progress.
		this.emit( 'pma-ready' );
		session.initializing = ( async () => {

			await teardown;
			signal.throwIfAborted();
			if ( owner ) throw new Error( 'Only one Tidewater game can run at a time.' );
			owner = session;
			await app.init( ( p, text, until ) => ui.setLoading( p, text, until ) );
			signal.throwIfAborted();
			app.ui = new AppUI( app, ui );
			await ui.hideLoader();
			signal.throwIfAborted();
			session.started = true;
			if ( ! session.paused ) app.start();
			ui.showStartOverlay( () => {

				app.input.requestLock();
				app.audio?.resume();

			} );

		} )().catch( error => {

			if ( signal.aborted ) return;
			ui.setLoadingError( 'Something went wrong: ' + error.message );
			this.emit( 'pma-error' );

		} );

	}

	emit( type ) {

		this.dispatchEvent( new CustomEvent( type, { bubbles: true, composed: true, detail: { gameId: 'tidewater' } } ) );

	}

	pause() {

		const s = this.session;
		if ( ! s || s.events.signal.aborted ) return;
		s.paused = true;
		s.app.engine?.stop();
		s.app.input?.reset();
		if ( s.app.input ) s.app.input.enabled = false;
		s.app.audio?.ctx?.suspend().catch( () => {} );
		if ( this.shadowRoot.pointerLockElement ) document.exitPointerLock();
		s.resume.hidden = false;

	}

	resume() {

		const s = this.session;
		if ( ! s || s.events.signal.aborted ) return;
		s.paused = false;
		s.resume.hidden = true;
		if ( s.app.input ) s.app.input.enabled = true;
		if ( s.started ) {

			s.app.start();
			s.app.input.requestLock();
			s.app.audio?.resume();

		}

	}

	disconnectedCallback() {

		const s = this.session;
		if ( ! s ) return;
		this.pause();
		s.events.abort();
		s.ui.dispose();
		s.fonts.remove();
		this.session = null;
		this.shadowRoot.replaceChildren();
		teardown = s.initializing.then( async () => {

			if ( owner === s ) {

				try { await s.app.dispose(); } finally { owner = null; }

			}

		} );

	}

}

if ( ! customElements.get( 'pma-tidewater' ) ) customElements.define( 'pma-tidewater', TidewaterElement );
