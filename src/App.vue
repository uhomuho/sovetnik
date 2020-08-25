<template lang="pug">
	#app
		Header(:breadcrumbs='breadcrumbs')
		.hero
			Sidebar(:routes='routes')
			router-view#main
		Footer
</template>

<script>
import Header from '@/components/_header'
import Sidebar from '@/components/_sidebar'
import Footer from '@/components/_footer'

export default {
  name: 'App',
  components: {
		Header,
		Sidebar,
		Footer
	},
	data() {
		return {
			breadcrumbs: this.$router.currentRoute.meta.breadcrumbs,
			routes: this.$router.options.routes
		}
	}
}
</script>

<style lang="sass">
@import "@/sass/main.sass"

#app
	// @include flex(space-between, inherit, column)
	height: 100vh

	&>.hero
		@include flex(flex-start, flex-start)

		#main 
			height: 100vh
			width: 100%
			background-color: rgba(0, 0, 0, 0.5)
</style>
