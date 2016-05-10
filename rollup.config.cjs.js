import babel from 'rollup-plugin-babel';

export default {
  format: 'cjs',
  entry: './src/index.js',
  dest: './build/index.cjs.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};

