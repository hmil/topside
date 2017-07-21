import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
const pkg = require('./package.json')
const camelCase = require('lodash.camelcase')

const libraryName = 'topside'

export default {
  entry: `compiled/cli.js`,
  targets: [
	  { dest: 'dist/cli.js', moduleName: 'cli', format: 'umd' }
  ],
  sourceMap: true,
  // Indicate here all modules required by cli
  external: [ 'minimist', 'fs', 'glob', 'path' ],
  plugins: [
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps()
  ]
}