<template lang="pug">
	#aside
		.aside-item.main-item
			img( src="@/assets/icons/logo.svg" )
		router-link.aside-item.has-text-centered(
			v-for='(route, key) in routes'
			:key='key'
			v-if='!route.hidden'
			:to='{name: route.name}'
			:class='router.includes("/waybills/close") ? "is-active" : null')
			img( src='@/assets/icons/waybills.svg' )
			p {{ route.menuName }}
</template>

<script>

export default {
	name: 'Sidebar',
	props: ['routes', 'router']
}

</script>