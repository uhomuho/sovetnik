<template lang="pug">
div
	.container
		.columns.is-flex.is-mobile
			.column.is-6
				.column-container
					img.bg( src="@/assets/big_logo.svg" )
					h1
						|Регистрация
						br
						|нового
						br
						|сотрудника
			.column.is-6
				.column-container
					.field
						.control
							input.input(
								type="text"
								placeholder="Логин")
					.field
						.control
							input.input(
								type="password"
								placeholder="Пароль"
								v-model='formData.password')
					.field
						.control
							input.input(
								type="password"
								placeholder="Пароль еще раз"
								v-model='formData.passwordCheck'
								@click='checkClicked = true')
						p.help.is-danger(v-if='formData.password !== formData.passwordCheck && checkClicked') Пароли не совпадают!
					.field
						.control
							input.input(
								placeholder="Город")
					.field
						.control
							input.input(
								placeholder="Район")
					.field
						.control
							input.input(
							placeholder="Электронная почта")
					.field
						.control
							button.button.is-pulled-right Регистрация

</template>

<script>
export default {
	name: 'Register',
	data() {
		return {
			formData: {
				login: null,
				password: null,
				passwordCheck: null,
				city: null,
				district: null,
				email: null
			},
			checkClicked: false
		}
	},
}
</script>

<style lang="sass" scoped>
.container
	padding: 
		top: 13.75rem
		right: 1.75rem
		left: 1.75rem
	max-width: 100%
	.column
		&:first-of-type
			img
				margin: auto 0
				position: absolute
				top: 0
				bottom: 0
				left: -1rem
		&:last-of-type
			.column-container
				.field
					&+.field
						margin-top: 2rem
					.control
						.input
							font-family: 'Montserrat', sans-serif
							font-size: 1.125rem
							font-weight: bold
							color: $graphite4
							padding: 1.8rem 1.5rem
							border: 1px solid $grey2
							border-radius: 5px
							&::placeholder
								font-family: 'Montserrat', sans-serif
								font-size: 1.125rem
								font-weight: bold
								color: $graphite4
							&:-internal-autofill-selected 
								color: $graphite4!important
</style>