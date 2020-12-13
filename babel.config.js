module.exports = {
  plugins: ['@babel/plugin-proposal-optional-chaining'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: true,
        },
      },
    ],
  ],
};
