const config = require('./public/config.js')

module.exports = {
	publicPath: process.env.NODE_ENV == 'development' ? '/' : config.publicPath,
	css:  {
		loaderOptions: {
			sass: {
				additionalData: `@import "@/sass/_variables.sass"`
			}
		}
	}
}