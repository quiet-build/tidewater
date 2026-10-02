import { defineConfig } from 'vite';

export default defineConfig( {
	// relative asset paths: the build runs from any sub-path (GitHub Pages serves it under /tidewater/)
	base: './',
	build: {
		target: 'esnext', chunkSizeWarningLimit: 4000,
		rolldownOptions: {
			input: { main: 'index.html', component: 'src/component.js' },
			output: { entryFileNames: chunk => chunk.name === 'component' ? 'component.js' : '[name]-[hash].js', chunkFileNames: '[name]-[hash].js' },
		},
	},
	server: { port: 5188, strictPort: true, host: '127.0.0.1' },
} );
