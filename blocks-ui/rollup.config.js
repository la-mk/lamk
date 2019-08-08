import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import multiInput from 'rollup-plugin-multi-input';

import pkg from './package.json';

export default {
  input: ['src/**/*.ts', 'src/**/*.tsx'],
  output: [
    {
      dir: 'dist/',
      format: 'es',
    },
  ],
  external: [...Object.keys(pkg.peerDependencies)],
  plugins: [external(), multiInput(), resolve(), typescript()],
};
