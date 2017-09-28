module.exports = {
  entry: './src/index.ts',
  target: "node",
  output: { filename: './dist/bundle.js' },
  devtool: 'source-map',
  resolve: { extensions: ['.ts', '.tsx', '.js'] },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [{ loader: 'ts-loader' }]
    }]
  }
};