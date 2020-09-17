<template lang="pug">
	#app
		//- Header(:breadcrumbs='breadcrumbs')
		.hero
			Sidebar(:routes='routes')
			router-view#main
		.modal.is-active#error(v-if='timezoneError')
			.modal-background
			.modal-content
				.content
					h2.has-text-danger Ошибка!
					p.has-text-white.has-text-weight-bold.is-size-5 {{ errorList[errorType].title }}
					p.has-text-white.has-text-weight-bold.is-size-6 {{ errorList[errorType].action }} 
					p.has-text-white.is-size-7 {{ errorList[errorType].file }} 
</template>

<script>
import Sidebar from '@/components/_sidebar'

export default {
  name: 'App',
  components: {
		Sidebar
	},
	data() {
		return {
			breadcrumbs: this.$router.currentRoute.meta.breadcrumbs,
			routes: this.$router.options.routes,
			timezoneError: false,
			errorType: "",
			errorList: {
				timezone: {
					title: "Некорректно введён часовой пояс!",
					action: "Повторите ввод и обновите страницу",
					file: "config.js"
				}
			}
		}
	},
	beforeMount() {
		const timezoneCheck = /^(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])$/
		if (!this.$timezone.match(timezoneCheck)) {
			this.timezoneError = true
			this.errorType = "timezone"
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
			height: 100vh
			width: 100%
			overflow: scroll
			-ms-overflow-style: none
			scrollbar-width: none
			
			&::-webkit-scrollbar
				display: none
	.modal#error
		.modal-content
			padding: 0 3rem
			p.has-text-white.has-text-weight-bold.is-size-5
				margin-bottom: 0
</style>
