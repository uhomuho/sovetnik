module.exports = {
	publicPath: '/advisor/',
	css:  {
		loaderOptions: {
			sass: {
				additionalData: `@import "@/sass/_variables.sass"`,
			}
		}
	}
}