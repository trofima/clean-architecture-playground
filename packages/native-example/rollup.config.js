import pkg from './package.json' with {type: 'json'}

export default {
  input: './src/index.js',
  output: [
    {file: pkg.exports.require, format: 'cjs', exports: 'auto'},
    {file: pkg.exports.import, format: 'es'},
  ],
  plugins: [

  ],
}
