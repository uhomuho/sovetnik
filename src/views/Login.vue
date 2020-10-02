<template lang="pug">
	.login
		img( src="@/assets/login_bg.png" )
		.wrapper
			img.bg( src="@/assets/big_logo.svg" )
			.columns.is-flex.is-centered.is-mobile
				.column.is-6
					.column-container
						.content
							h1 
								|ЦСППР
								br
								|«СОВЕТНИК»
							p
								|г. Екатеринбург,
								br
								|Кировский район
				.column.is-6
					form#form.column-container( @submit.prevent='login' )
						.field
							.control
								img( src="@/assets/icons/login.svg" )
								input.input(
									v-model='formData.username'
									placeholder="Логин")
							p.help.is-danger(v-if='errors.username') Заполните поле!
						.field
							.control
								img( src="@/assets/icons/password.svg" )
								input.input(
									v-model='formData.password'
									type="password"
									placeholder="Пароль")
							p.help.is-danger(v-if='errors.password') Заполните поле!
						.field.bottom
							.control
								router-link( to="/reset" ) Забыли пароль?
								button.button Войти
						.field.hr
							.control
								p Новый пользователь
								hr
						.field.reg
							.control
								router-link.button( to='/register' ) Регистрация

</template>

<script>
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'
import CryptoJS from 'crypto-js'

export default {
	name: 'Login',
	components: {},
	data() {
		return {
			formData: {
				username: null,
				password: null
			},
			errors: {
				username: false,
				password: false
			}
		}
	},
	props: ['user'],
	methods: {
		login() {
			if (!this.formData.username)
				this.errors.username = true
			else
				this.errors.username = false

			if (!this.formData.password)
				this.errors.password = true
			else
				this.errors.password = false

			if (this.errors.username || this.errors.password)	
				return false

			api.login(this.formData)
				.then(r => {
					let data = r.data
					if ( data.status ) {
						let user = data
						let userData = JSON.stringify(user)
						userData = CryptoJS.AES.encrypt(userData, 'kFLeCZ19095').toString()
						localStorage.user = userData

						this.$router.push('/waybills')
					} else {
						if ( !data.status && data.error === "Bad Credentials" ) {
							return Snackbar.open({
								message: 'Логин или пароль введён неверно!',
								type: 'is-warning'
							})
						} else {
							return Snackbar.open({
								message: 'Неизвестная ошибка!',
								type: 'is-danger'
							})
						}
					}
				})
		}
	}
}

</script>

<style lang="sass">
.login
	padding:
		top: 5rem
	.wrapper
		position: relative
		padding:
			right: 1.75rem
			left: 1.75rem
		.bg
			position: absolute
			top: 0
			bottom: 0
			left: 0
			margin: auto 0
		.columns
			.column
				&:first-of-type
					.column-container
						padding:
							top: 6rem
							left: 20%
				&:last-of-type
					.column-container
						padding: 
							top: 6rem
							right: 20%
						.field
							position: relative
							&+.field
								margin-top: 2rem
							.control
								position: relative
								&+.help
									position: absolute
									top: 102%
									left: 1.5rem
								img
									position: absolute
									top: 0
									right: 105%
									bottom: 0
									margin: auto 0
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
							&.bottom
								.control
									display: flex
									align-items: center
									justify-content: space-between
							&.hr
								margin-top: 3.25rem
								.control
									p
										font-size: .75rem
										color: $grey3
										padding: 0 .625rem
										background-color: #fff
										display: inline-block
										width: fit-content
										position: absolute
										top: -.5rem
										right: 0
										bottom: 0
										left: 0
										margin: auto
									hr
										background: $grey2
							&.reg
								margin-top: 2.5rem
								.control
									display: flex
									justify-content: center
									.button
										font-weight: normal!important
										color: $blue2!important
										background-color: #fff!important
										box-shadow: none!important
										padding:
											right: 1.5rem
											left:	1.5rem
							&:last-of-type
								margin-bottom: 3rem

</style>