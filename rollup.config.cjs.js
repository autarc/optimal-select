import babel from 'rollup-plugin-babel';

export default {
  format: 'cjs',
  entry: './src/index.js',
  dest: './build/index.cjs.js',
  plugins: [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: ["es2015-rollup"]
    })
  ]
};

