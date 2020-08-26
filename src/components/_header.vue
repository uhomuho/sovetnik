<template lang="pug">
	b-navbar
		template( slot="brand" )
			img( src="@/assets/icons/logo.svg" )
		template( slot="start" )
			b-navbar-item
				.breadcrumb( aria-label="breadcrumbs" )
					ul
						li(v-for='breadcrumb in breadcrumbs')
							router-link(:to='breadcrumb.to') {{ breadcrumb.text }}
</template>

<script>

export default {
	name: 'Header',
	components: {},
	props: ['breadcrumbs'],
	data() {
		return {
		}
	},
	mounted() {
	}
}

</script>