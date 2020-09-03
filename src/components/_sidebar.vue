<template lang="pug">
	#aside
		.aside-item.main-item
			img( src="@/assets/icons/logo.svg" )
		.items(
			v-for='(route, key) in routes'
			:key='key'
			v-if='!route.hidden && route.name == "Waybills"')
			router-link.aside-item.has-text-centered(
				v-for='(item, key) in route.children'
				:key='key'
				v-if='!item.hidden'
				:to='`${route.path}/${item.path}`')
					img( :src='`/icons/${item.menuIcon}.svg`' )
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
				:to='`${route.path}/${item.path}`')
					img( :src='`/icons/${item.menuIcon}.svg`' )
					|{{item.menuName}}
		//- router-link.aside-item.has-text-centered(
		//- 	v-for='(route, key) in routes'
		//- 	:key='key'
		//- 	v-if='!route.hidden && route.name == "Waybills"'
		//- 	:to='{name: route.name}')
		//- 	img( src='/icons/waybills.svg' )
		//- 	p {{ route.menuName }}
</template>

<script>

export default {
	name: 'Sidebar',
	props: ['routes'],
	beforeMount() {
		console.log(this.routes)
	}
}

</script>