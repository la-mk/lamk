import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    // {
    //   file: pkg.main,
    //   name: 'blocksUi',
    //   format: 'umd',
    //   sourcemap: false,
    // },
    { file: pkg.module, format: 'es', sourcemap: false },
  ],
  external: [...Object.keys(pkg.peerDependencies)],
  plugins: [
    external(),
    typescript({ useTsconfigDeclarationDir: true }),
    resolve(),
  ],
};
