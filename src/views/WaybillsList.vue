<template lang="pug">
	div
		.section
			.container
				.level
					.level-left
						.level-item
							h1 
								|Путевые листы
								br
								|за период:
					.level-right
						.level-item
							table
								tr
									td(
										@click='setFilter("year"), waybillsSort()'
										:class='filterType == "year" ? "active" : null') весь год
									td(
										@click='setFilter("yest"), waybillsSort()'
										:class='filterType == "yest" ? "active" : null') вчера
								tr
									td(
										@click='setFilter("month"), waybillsSort()'
										:class='filterType == "month" ? "active" : null') месяц
									td(
										@click='setFilter("today"), waybillsSort()'
										:class='filterType == "today" ? "active" : null') сегодня
								tr
									td(
										@click='setFilter("week"), waybillsSort()'
										:class='filterType == "week" ? "active" : null') неделя
									td(
										@click='setFilter("range"), waybillsSort()'
										:class='filterType == "range" ? "active" : null') период
						.level-item
							b-datepicker.first(
								@input='setFrom(range.dateFrom), waybillsSort()'
								v-model='range.dateFrom'
								:focused-date='dateFrom'
								:max-date='dateTo'
								loacale="ru-RU"
								:mobile-native='true'
								position='is-bottom-left')
								template( v-slot:trigger )
									.wrapper
										p {{ stringFrom }}
							
							b-datepicker.second(
								@input='setTo(range.dateTo), waybillsSort()'
								v-model='range.dateTo'
								:focused-date='range.dateTo'
								:min-date='dateFrom'
								loacale="ru-RU"
								:mobile-native='true'
								position='is-bottom-left')
								template( v-slot:trigger )
									.wrapper 
										p {{ stringTo }}

				hr
				Table(
					v-if='waybillsSortData'
					:waybills='waybillsSortData'
					:total='total'
					:isLoading='isLoading')


		b-loading(
			v-if="isLoading"
			:is-full-page="true"
			v-model="isLoading")
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
// import { mapGetters } from 'vuex'
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
				dateTo: this.dateTo,
				dateFrom: this.dateFrom
			}
		}
	},
	computed: {
		...mapGetters('waybills', {
			waybillsSortData: 'waybillsSortData',
			total: 'total',
			filterType: 'getFilterType'
		}),
		...mapState('waybills', {
			dateTo: state => state.dateTo,
			dateFrom: state => state.dateFrom
		}),
		stringFrom() {
			return `С ${this.dateFrom.getDate()} ${monthName.string[this.dateFrom.getMonth()]} ${this.dateFrom.getFullYear()}`
		},
		stringTo() {
			return `по ${this.dateTo.getDate()} ${monthName.string[this.dateTo.getMonth()]} ${this.dateTo.getFullYear()}`
		}
	},
	methods: {
		...mapActions('waybills', [
			'waybillsSort',
			'getWaybills',
			'setDates'
		]),
		...mapMutations('waybills', {
			setTo: 'dateTo',
			setFrom: 'dateFrom',
			setFilter: 'setFilterType'
		})
	},
	mounted() {

		if (!this.waybillsSortData) {
			this.isLoading = true
			this.getWaybills()
				.then(() => {
					this.waybillsSort()
						.then(() => this.isLoading = false)
				})
		}
	},
	beforeMount() {
		this.setDates()
	}
}

</script>

<style lang="sass" scoped>
.section	
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

						table
							width: 10rem
							td
								font-size: .875rem
								color: $graphite2
								text-align: right
								width: 50%
								padding: var(--columnGap)
								cursor: pointer
								&:hover
									color: $orange4
								&.active
									color: $orange4

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