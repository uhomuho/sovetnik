<template lang="pug">
	#app
		Header(
			v-if='header'
			:user='storedUser ? storedUser : user'
			:show='show'
			@show='showNav'
			@hide='hideNav'
			:login='isLogin')
		.hero
			Sidebar(
				:user='storedUser ? storedUser : user'
				v-if='!isLogin'
				:routes='routes'
				@show='showNav'
				@hide='hideNav')
			router-view#main(:user='storedUser ? storedUser : user')
</template>

<script>
import Sidebar from '@/components/_sidebar'
import Header from '@/components/_header'
import { mapActions, mapState } from 'vuex'
import CryptoJS from 'crypto-js'

export default {
  name: 'App',
  components: {
		Sidebar,
		Header
	},
	data() {
		return {
			breadcrumbs: this.$router.currentRoute.meta.breadcrumbs,
			routes: this.$router.options.routes,
			show: false,
			isLogin: false,
			user: null,
			header: true
		}
	},
	computed: {
		...mapState('waybills', {
			dateFrom: state => state.dateFrom,
			dateTo: state => state.dateTo
		}),
		...mapState('reports', {
			repDateFrom: state => state.dateFrom,
			repDateTo: state => state.dateTo
		}),
		...mapState('user', {
			storedUser: state => state.user
		})
	},
	methods: {
		...mapActions('waybills', {
			setDates: 'setDates',
			getNewWb: 'getNewWaybillData'
		}),
		...mapActions('reports', {
			setRepDates: 'setDates'
		}),
		showNav(e) {
			this.show = e.show
		},
		hideNav(e) {
			this.show = e.show
		}
	},
	watch: {
		$route() {
			if (this.$router.currentRoute.name == 'Login' || this.$router.currentRoute.name == 'Register') {
				this.isLogin = true
			} else {
				this.isLogin = false
			}

			if ( localStorage.user && localStorage.user !== 'null' ) {
				let userData = CryptoJS.AES.decrypt(localStorage.user, 'kFLeCZ19095')
				userData = userData.toString(CryptoJS.enc.Utf8)
				userData = JSON.parse(userData)
				this.user = userData
			} else {
				this.user = null
			}

			if ( localStorage.newWaybill == 'null' || !localStorage.newWaybill ) {
				this.getNewWb()
			}
		},
		localStorage() {
			if ( localStorage.user && localStorage.user !== 'null' ) {
				let userData = CryptoJS.AES.decrypt(localStorage.user, 'kFLeCZ19095')
				userData = userData.toString(CryptoJS.enc.Utf8)
				userData = JSON.parse(userData)
				this.user = userData
			} else {
				this.user = null
			}
		}
	},
	beforeMount() {

		if (!this.dateFrom || !this.dateTo) {
			this.setDates()
		}
		if (!this.repDateFrom || !this.repDateTo) {
			this.setRepDates()
		}
		if (this.$router.currentRoute.name == 'Login' || this.$router.currentRoute.name == 'Register' || this.$router.currentRoute.name == 'Reset') {
			this.isLogin = true
		} else {
			this.isLogin = false
		}

		if ( localStorage.user && localStorage.user !== 'null' ) {
			let userData = CryptoJS.AES.decrypt(localStorage.user, 'kFLeCZ19095')
			userData = userData.toString(CryptoJS.enc.Utf8)
			userData = JSON.parse(userData)
			this.user = userData
		} else if (this.storedUser && this.storedUser !== 'null') {
			this.user = this.storedUser
		} else {
			this.user = null
		}
	},
	beforeDestroy() {
		localStorage.user = null
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
