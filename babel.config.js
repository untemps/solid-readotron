module.exports = (api) => ({
	presets: ['@babel/preset-env', 'babel-preset-solid'],
	plugins: [...(api.env('test') ? ['@babel/plugin-transform-runtime'] : [])],
})
