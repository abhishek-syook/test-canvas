import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import reactSvg from 'rollup-plugin-react-svg';

const packageJson = require('./package.json');

export default {
	input: 'src/entry.ts',
	output: [
		{
			file: packageJson.main,
			format: 'cjs',
			sourcemap: true
		},
		{
			file: packageJson.module,
			format: 'esm',
			sourcemap: true
		}
	],
	plugins: [
		peerDepsExternal(),
		resolve(),
		commonjs(),
		typescript({ useTsconfigDeclarationDir: true }),
		postcss(),
		image(),
		reactSvg({
			// svgo options
			svgo: {
				plugins: [], // passed to svgo
				multipass: true
			},

			// whether to output jsx
			jsx: false,

			// include: string
			include: null,

			// exclude: string
			exclude: null
		})
	]
};
