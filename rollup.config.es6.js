import babel from 'rollup-plugin-babel';

export default {
  format: 'es6',
  entry: 'src/index.js',
  dest: 'build/index.es6.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
};
