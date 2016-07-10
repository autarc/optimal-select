import babel from 'rollup-plugin-babel';

export default {
  format: 'umd',
  entry: 'src/index.js',
  dest: 'build/index.umd.js',
  moduleName: 'OptimalSelect',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ['es2015-rollup']
    })
  ]
};
