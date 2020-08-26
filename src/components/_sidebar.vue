<template lang="pug">
	#aside
		router-link.aside-item.has-text-centered(v-for='(route, key) in routes', :key='key', v-if='!route.hidden', :to='route.path')
			img( src='@/assets/icons/waybills.svg' )
			p {{ route.name }}
</template>

<script>

export default {
	name: 'Sidebar',
	props: ['routes']
}

</script>

<style lang="sass" scoped>

</style>