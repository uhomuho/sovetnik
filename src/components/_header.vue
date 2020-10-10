<template lang="pug">
	header(
		:class='show || login ? "active" : ""')
		.container( @mousemove='showNav' @mouseout='hideNav' )
			img.logo( src="@/assets/icons/logo.svg" )
			.user-data(v-if='user')
				img.user( :src='user.avatar.replace(".png", ".svg")' )
				.data
					p {{ user.role }}:
					p {{ user.name }}
				p( @click='logout' ) Выход
</template>

<script>
import { mapMutations } from 'vuex'
import api from '@/api/apiActions'

export default {
	name: 'Header',
	props: ['show', 'login', 'user'],
	methods: {
		...mapMutations('user', [
			'setUser'
		]),
		showNav() {
			this.$emit('show', {
				show: true
			})
		},
		hideNav() {
			this.$emit('hide', {
				show: false
			})
		},
		logout() {
			if (localStorage.user && localStorage.user !== 'null') {
				localStorage.user = null
			} else {
				this.setUser(null)
			}
			api.logout()
			this.$router.push({ name: 'Login' })
		}
	}
}

</script>

<style lang="sass" scoped>
	header
		.container
			display: flex
			align-items: center
			justify-content: space-between
			min-width: unset
			height: 5rem
			width: 7.5rem
			min-width: 0%
			background: $graphite4
			box-shadow: 0px 2px 4px -2px #617E8C
			position: fixed
			z-index: 2
			transition: all .2s ease-in-out
			overflow: hidden
			img
				margin-left: 2.5rem
				height: 2.3rem
				margin-rigth: 2rem
				&.logo
					margin-right: 4rem
			.user-data
				margin-right: 2.5rem
				display: flex
				align-items: center
				justify-content: flex-end
				img
					height: 2rem
				.data
					display: flex
					align-items: center
					justify-content: space-between
					margin: 
						left: 1rem
						right: 2rem
					p
						color: $graphite2
						font-size: .875rem
						cursor: auto
						&+p
							margin-left: .3rem
						&::before
							display: none
				p
					font-size: 1.125rem
					line-height: 1.125rem
					font-weight: bold
					color: $orange4
					position: relative
					cursor: pointer
					&::before
						display: block
						content: ""
						position: absolute
						top: 100%
						width: 100%
						height: 1px
						background-color: $orange4
		&.active
			.container
				min-width: 100%

</style>