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
	@include flex(space-between, inherit, column)
	height: 100vh

	&>.hero
		@include flex(flex-start, flex-start)
		flex-grow: 1

		#main 
			height: 100%
			width: 100%
			overflow: scroll
			-ms-overflow-style: none
			scrollbar-width: none
			
			&::-webkit-scrollbar
				display: none
</style>
