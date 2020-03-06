import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import html from 'rollup-plugin-bundle-html';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

const dest = process.env.WEBPACK_OUT_DIR || 'public/asset';
function outPath(fn) {
    const filename = production ? fn : fn.replace(/\[hash\]/, 'development');
    return [dest, filename].join('/');
}

export default {
    input: 'src/main.js',
    output: {
	sourcemap: true,
	    format: 'iife',
	    name: 'app',
	    file: outPath('app.[hash].js')
    },
    plugins: [
	svelte({
	    // enable run-time checks when not in production
	    dev: !production,
	    // we'll extract any component CSS out into
	    // a separate file — better for performance
	    css: css => {
		css.write(outPath('app.[hash].css'));
	    }
	}),

	// If you have external dependencies installed from
	// npm, you'll most likely need these plugins. In
	// some cases you'll need additional configuration —
	// consult the documentation for details:
	// https://github.com/rollup/plugins/tree/master/packages/commonjs
	resolve({
	    browser: true,
	    dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
	}),
	commonjs(),

	// Needed by M::P::WebPack so it can include generated files using
	// helper ``asset'' see:
	// https://metacpan.org/pod/Mojolicious::Plugin::Webpack#asset
	html({
	    dest,
	    filename: 'webpack.' + (production ? 'production' : 'development') + '.html',
	    inject: 'head',
	    template: '<html><head></head><body></body></html>',
	}),
	// Watch the `public` directory and refresh the
	// browser on changes when not in production
	!production && livereload('public'),

	// If we're building for production (npm run build
	// instead of npm run dev), minify
	production && terser(),
	postcss({extract: true, plugins: [] }),
    ],
    watch: {
	clearScreen: false
    }
};
