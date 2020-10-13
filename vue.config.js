module.exports = {
	publicPath: '/',
	css:  {
		loaderOptions: {
			sass: {
				additionalData: `@import "@/sass/_variables.sass"`
			}
		}
	}
}