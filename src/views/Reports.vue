<template lang="pug">
	div
		.section
			.container
				.columns.is-flex.is-mobile.is-paddingless.is-marginless
					.column.is-4.happens
						.column-container
							span.title {{ happens }}
							span.subtitle Происшествий

					.column.is-4.expired
						.column-container
							span.title {{ expired }}
							span.subtitle Просрочено

					.column.is-4.fixed
						.column-container
							span.title {{ fixed }}
							span.subtitle Исправлено

			.container
				.level
					.level-left
						.level-item
							h1 
								|Отчет
								br
								|по сменам
					.level-right
						.level-item
							b-datepicker.first(
								@input='getData'
								v-if='range.from' 
								v-model='range.from'
								loacale="ru-RU"
								:mobile-native='true'
								position='is-bottom-left')
								template( v-slot:trigger )
									.wrapper
										p {{ stringFrom }}
							
							b-datepicker.second(
								@input='getData'
								v-if='range.to' 
								v-model='range.to'
								loacale="ru-RU"
								:mobile-native='true'
								position='is-bottom-left')
								template( v-slot:trigger )
									.wrapper 
										p {{ stringTo }}

				hr
				//- pre {{ waybills }}
				Table(
					v-if='waybills'
					:waybills='waybills' 
					:isLoading='isLoading'
					:paginationData='paginationData')


		b-loading(
			v-if="isLoading"
			:is-full-page="true"
			v-model="isLoading")
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import monthName from '@/month'
import Table from '@/components/_table'

export default {
	name: 'Reports',
	components: {
		Table
	},
	data() {
		return {
			isLoading: false,
			happens: 20,
			expired: 12,
			fixed: 5,
			range: {
				from: false,
				to: false 
			}
		}
	},
	computed: {
		...mapGetters(['waybills', 'paginationData']),
		stringFrom() {
			return `С ${this.range.from.getDate()} ${monthName.string[this.range.from.getMonth()]} ${this.range.from.getFullYear()}`
		},
		stringTo() {
			return `по ${this.range.to.getDate()} ${monthName.string[this.range.to.getMonth()]} ${this.range.to.getFullYear()}`
		}
	},
	methods: {
		// ...mapActions(['getWaybills'])
		createDateString(date) {
			return `${date.getFullYear()}-${monthName.num[date.getMonth()]}-${date.getDate()}T00:00`
		},
		getData() {
			this.isLoading = true
			let data = {
				from: this.createDateString(this.range.from),
				to:	this.createDateString(this.range.to)
			}
			this.$store.dispatch('getWaybills', data)
				.then(() => this.isLoading = false )
		}
	},
	mounted() {
		// Set default dates for datepicker
		let dateFrom = new Date()
		dateFrom = new Date(dateFrom.setMonth(dateFrom.getMonth() - 3))
		this.range.from = dateFrom
		let dateTo = new Date()
		dateTo = new Date(dateTo.setMonth(dateTo.getMonth() + 1))
		this.range.to = dateTo

		this.isLoading = true
		let data = {
			from: this.createDateString(dateFrom),
			to: this.createDateString(dateTo)
		}
		this.$store.dispatch('getWaybills', data)
												.then(() => this.isLoading = false )
	}
}

</script>

<style lang="sass" scoped>
.section
	padding-top: 0
	padding-left: 7rem
	padding-right: 8.5rem
	
	.container
		&+.container
			margin-top: 4.5rem

		&:first-of-type
			.columns
				.happens
					background-color: $happens
					border-bottom-left-radius: 20px
				.expired
					background-color: $expired
				.fixed
					background-color: $fixed
					border-bottom-right-radius: 20px

				.column
					.column-container
						display: flex
						flex-direction: column
						align-items: center
						justify-content: flex-start
						padding: 1.5rem 0 1.125rem
						.title
							font-size: 5rem
						.subtitle
							font-size: 1.5rem

						span
							font-weight: bold
							color: #fff
							text-align: center
							user-select: none

		&:last-of-type
			hr
				background-color: $graphite2
				margin: 0
			.level
				align-items: flex-end
				margin-bottom: 0

				.level-right
					.level-item
						display: flex
						align-items: flex-end
						justify-content: flex-end
						flex-direction: column

						.datepicker
							width: 100%

							.wrapper
								text-align: left
								width: 100%
								padding: .8rem 1.25rem
								border: 1px dashed #D0D9DE
								border-bottom: unset
								cursor: pointer
								user-select: none

								p
									font-size: .875rem
									font-weight: 500
									color: $graphite4

</style>