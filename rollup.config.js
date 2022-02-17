import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const production = process.env.NODE_ENV === 'production'

export default {
	input: 'src/index.js',
	output: {
		name: 'solid-readotron',
		file: 'dist/index.js',
		format: 'es',
		sourcemap: 'inline',
	},
	external: ['solid-js', 'solid-js/web'],
	plugins: [
		resolve({
			extensions: ['.js', '.jsx'],
		}),
		babel({
			extensions: ['.js', '.jsx'],
			babelHelpers: 'bundled',
			exclude: 'node_modules/**',
			presets: ['babel-preset-solid'],
		}),
		production && terser()
	],
}
