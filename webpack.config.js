const path = require('path');

module.exports = {
  entry:{
    index: "./src/index.jsx",
    background: "./src/background/background.js",
    content: "./src/content/content.js"
  },
  output:{
    filename: '[name].js',
    path: path.resolve(__dirname,'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-react',
              {
                runtime:'automatic'
              }
            ]
          ]
        }
      },
      {
        test: /\.css$/,
        use:['style-loader', 'css-loader']
      }
    ]
  }
}