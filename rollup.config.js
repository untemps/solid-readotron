import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

const production = process.env.NODE_ENV === 'production'

export default {
	input: 'src/index.js',
	output: {
		name: 'solid-readotron',
		file: 'dist/index.es.js',
		format: 'es',
		sourcemap: 'inline',
	},
	plugins: [
		postcss({
			plugins: [],
		}),
		babel({
			exclude: 'node_modules/**',
			babelHelpers: 'bundled',
			presets: ['babel-preset-solid'],
		}),
		resolve(),
		commonjs(),
		production && terser(),
		visualizer({
			sourcemap: true,
		}),
	],
}
