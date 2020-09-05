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
							//- table
							//- 	tr
							//- 		td(
							//- 			@click='setFilter("year"), waybillsSort()'
							//- 			:class='filterType == "year" ? "active" : null') весь год
							//- 		td(
							//- 			@click='setFilter("yest"), waybillsSort()'
							//- 			:class='filterType == "yest" ? "active" : null') вчера
							//- 	tr
							//- 		td(
							//- 			@click='setFilter("month"), waybillsSort()'
							//- 			:class='filterType == "month" ? "active" : null') месяц
							//- 		td(
							//- 			@click='setFilter("today"), waybillsSort()'
							//- 			:class='filterType == "today" ? "active" : null') сегодня
							//- 	tr
							//- 		td(
							//- 			@click='setFilter("week"), waybillsSort()'
							//- 			:class='filterType == "week" ? "active" : null') неделя
							//- 		td(
							//- 			@click='setFilter("range"), waybillsSort()'
							//- 			:class='filterType == "range" ? "active" : null') период
							.level-item
								.wrapper.from(
									@click='openFrom')
									p {{ stringFrom }}
									Calendar(
										@select='setDateFrom'
										v-if='showFrom'
										:time='false')
								.wrapper.to(
									@click='openTo')
									p {{ stringTo }}
									Calendar(
										@select='setDateTo'
										v-if='showTo'
										:time='false')

				hr
				Table(
					:waybills='filteredWaybillsReports ? filteredWaybillsReports : waybillsReports'
					:carsList='carsList')
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Table from '@/components/_waybillsReportsTable'
import Calendar from '@/components/calendar/_calendar.vue'
import monthName from '@/month'

export default {
	name: 'WaybillsReports',
	components: {
		Table,
		Calendar
	},
	data() {
		return {
			date: new Date(),
			showTo: false,
			showFrom: false
		}
	},
	computed: {
		...mapGetters('reports', {
			waybillsReports: 'getWaybillsReports',
			filteredWaybillsReports: 'getFilteredWaybillsReports'
		}),
		...mapState('reports', {
			dateTo: state => state.dateTo,
			dateFrom: state => state.dateFrom,
			carsList: state => state.carsList
		}),
		stringFrom() {
			let date = new Date(this.dateFrom)
			return `С ${date.getDate()} ${monthName.string[date.getMonth()]} ${date.getFullYear()}`
		},
		stringTo() {
			let date = new Date(this.dateTo)
			return `по ${date.getDate()} ${monthName.string[date.getMonth()]} ${date.getFullYear()}`
		}
	},
	methods: {
		...mapActions('reports', {
			getWaybillsReports: 'apiWaybillsReport'
		}),
		...mapMutations('reports', {
			setDateTo: 'setDateTo',
			setDateFrom: 'setDateFrom'
		}),
		openTo() {
			this.showTo = !this.showTo
		},
		openFrom() {
			this.showFrom = !this.showFrom
		}
	},
	beforeMount() {
		this.getWaybillsReports()
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

						
						.wrapper.to,
						.wrapper.from
							text-align: left
							width: 100%
							padding: .8rem 1.25rem
							border: 1px dashed #D0D9DE
							border-bottom: unset
							cursor: pointer
							user-select: none
							position: relative

							p
								font-size: .875rem
								font-weight: 500
								color: $graphite4

							.calendar
								position: absolute
								top: 100%
								z-index: 99
</style>