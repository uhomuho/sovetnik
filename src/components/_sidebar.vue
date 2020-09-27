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
				v-if='!item.hidden'
				:to='item.path ? `${route.path}/${item.path}` : route.path')
					img( :src='`${mode == "development" ? "/" : $userConfig.publicPath}icons/${item.menuIcon}.svg`' )
					|{{item.menuName}}
		
		.items(
			v-for='(route, key) in routes'
			:key='key'
			v-if='!route.hidden && route.name == "Reports"')
			.head(v-if='route.menuName') {{ route.menuName }}
			router-link.aside-item.has-text-centered(
				v-for='(item, key) in route.children'
				:key='key'
				v-if='!item.hidden'
				:to='item.path ? `${route.path}/${item.path}` : route.path')
					img( :src='`${mode == "development" ? "/" : $userConfig.publicPath}icons/${item.menuIcon}.svg`' )
					|{{item.menuName}}
</template>

<script>

export default {
	name: 'Sidebar',
	props: ['routes'],
	data() {
		return {
			mode: process.env.NODE_ENV
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
	}
}

</script>