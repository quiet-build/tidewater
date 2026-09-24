import { App } from './App.js';
import { UI } from './ui/UI.js';
import { AppUI } from './ui/AppUI.js';

const ui = new UI();
const app = new App();
window.__ui = ui;
let pausedByHost = false;

window.addEventListener( 'message', ( event ) => {

	if ( event.source !== window.parent || ! event.data ) return;
	if ( event.data.type === 'pma-pause' && app.engine && ! pausedByHost ) {

		pausedByHost = true;
		app.engine.stop();
		app.audio?.ctx?.suspend();

	} else if ( event.data.type === 'pma-resume' && app.engine && pausedByHost ) {

		pausedByHost = false;
		app.engine.start( ( dt, t ) => app.frame( dt, t ) );
		app.audio?.resume();

	}

} );

app.init( ( p, text, until ) => ui.setLoading( p, text, until ) ).then( async () => {

	app.ui = new AppUI( app, ui );
	ui.setLoading( 1, 'Ready' );
	await ui.hideLoader();
	app.start();
	ui.showStartOverlay( () => {

		app.input.requestLock();
		if ( app.audio ) app.audio.resume();

	} );

} ).catch( ( e ) => {

	console.error( e );
	ui.setLoadingError( 'Something went wrong: ' + e.message );

} );
