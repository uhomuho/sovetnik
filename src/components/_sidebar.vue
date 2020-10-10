<template lang="pug">
	#aside
		.aside-item.main-item( @mousemove='showNav' @mouseout='hideNav' )
			img( src="@/assets/icons/logo.svg" )
			.menu
		.items(
			v-for='(route, key) in routes'
			:key='key'
			v-if='!route.hidden && route.name == "Waybills"')
			router-link.aside-item.has-text-centered(
				v-for='(item, key) in route.children'
				:key='key'
				v-if='!item.hidden && user && user.can[item.permission]'
				:class='item.name == curRoute ? "router-link-exact-active" : ""'
				:to='item.path ? `${route.path}/${item.path}` : route.path')
					img( :src='user.can[item.permission].img.replace(".png", ".svg")' )
					|{{item.menuName}}
		
		.items(
			v-for='(route, key) in routes'
			:key='key'
			v-if='!route.hidden && route.name == "Reports" && user && (user.can.reportWaybill || user.can.reportAutograph)')
			.head(v-if='route.menuName') {{ route.menuName }}
			router-link.aside-item.has-text-centered(
				v-for='(item, key) in route.children'
				:key='key'
				v-if='!item.hidden && user && user.can[item.permission]'
				:to='item.path ? `${route.path}/${item.path}` : route.path')
					img( :src='user.can[item.permission].img.replace(".png", ".svg")' )
					|{{item.menuName}}
		.exit(@click='logout')
			|Выход
</template>

<script>
import { mapMutations } from 'vuex'
import api from '@/api/apiActions'

export default {
	name: 'Sidebar',
	props: ['routes', 'user'],
	data() {
		return {
			mode: process.env.NODE_ENV,
			curRoute: this.$router.currentRoute.name
		}
	},
	watch: {
		$route() {
			this.curRoute = this.$router.currentRoute.name
		}
	},
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
	},
}

</script>