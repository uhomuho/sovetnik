<template lang="pug">
	header(
		:class='show || login ? "active" : ""')
		.container( @mousemove='showNav' @mouseout='hideNav' )
			img( src="@/assets/icons/logo.svg" )
</template>

<script>

export default {
	name: 'Header',
	components: {},
	props: ['show', 'login'],
	data() {
		return {
		}
	},
	methods: {
		showNav() {
			this.$emit('show', {
				show: true
			})
		},
		hideNav() {
			this.$emit('hide', {
				show: false
			})
		}
	},
	mounted() {
	}
}

</script>

<style lang="sass" scoped>
	header
		.container
			display: flex
			align-items: center
			justify-content: flex-start
			min-width: unset
			height: 5rem
			width: 7.5rem
			min-width: 0%
			background: $graphite4
			box-shadow: 0px 2px 4px -2px #617E8C
			position: fixed
			z-index: 2
			transition: all .2s ease-in-out
			img
				margin-left: 2.5rem
				height: 2.5rem
		&.active
			.container
				min-width: 100%

</style>