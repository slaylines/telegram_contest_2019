import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import glob from 'glob';

const [file] = glob.sync('dist/main.*.js');

export default {
  input: 'src/scripts/main.js',
  output: {
    file,
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    terser(),
  ],
};
