<template lang="pug">
	div(@click='close')
		.section
			.container
				.level
					.level-left
						.level-item
							h1 
								|Отчет по
								br
								|автографу
					.level-right
						.level-item
							table
								tr
									td(
										@click='setFilter("year"), getAutographReport()'
										:class='filter == "year" ? "active" : null') весь год
									td(
										@click='setFilter("yest"), getAutographReport()'
										:class='filter == "yest" ? "active" : null') вчера
								tr
									td(
										@click='setFilter("month"), getAutographReport()'
										:class='filter == "month" ? "active" : null') месяц
									td(
										@click='setFilter("today"), getAutographReport()'
										:class='filter == "today" ? "active" : null') сегодня
								tr
									td(
										@click='setFilter("week"), getAutographReport()'
										:class='filter == "week" ? "active" : null') неделя
									td(
										@click='setFilter("range"), getAutographReport()'
										:class='filter == "range" ? "active" : null') период
							.level-item
								.wrapper.from(
									@click='openFrom')
									p {{ stringFrom }}
									Calendar(
										@select='setDateFrom'
										v-if='showFrom && !invalidDate(dateFrom)'
										:autograph='true'
										:date='new Date(dateFrom)'
										:time='false')
								.wrapper.to(
									@click='openTo')
									p {{ stringTo }}
									Calendar(
										@select='setDateTo'
										v-if='showTo && !invalidDate(dateTo)'
										:autograph='true'
										:time='false'
										:date='new Date(dateTo)'
										:range='false')

				hr
				Table(
					:waybills='autographReport')
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Table from '@/components/_autographReportTable'
import Calendar from '@/components/calendar/_calendar.vue'
import monthName from '@/month'

export default {
	name: 'AutographReport',
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
			autographReport: 'getAutographReport'
		}),
		...mapState('reports', {
			dateTo: state => state.dateTo,
			dateFrom: state => state.dateFrom,
			carsList: state => state.carsList,
			filter: state => state.filter
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
			getAutographReport: 'apiAutographReport',
			setDates: 'setDates'
		}),
		...mapMutations('reports', {
			setDateTo: 'setDateTo',
			setDateFrom: 'setDateFrom',
			setFilter: 'setFilter'
		}),
		to(date) {
			this.setDateTo(date)
				.then(() => {
					this.getAutographReport()
				})
		},
		from(date) {
			this.setDateFrom(date)
				.then(() => {
					this.getAutographReport()
				})
		},
		openTo(e) {
			if(e.target.matches('.wrapper.to p') || e.target.matches('.wrapper.to')) {
				this.showTo = !this.showTo
			}
		},
		openFrom(e) {
			if(e.target.matches('.wrapper.from p') || e.target.matches('.wrapper.from')) {
				this.showFrom = !this.showFrom
			}
		},
		close(e) {
			if(!e.target.matches('.calendar *, .wrapper.to *, .wrapper.from *')) {
				if (this.showTo) {
					this.showTo = false
				}
				if (this.showFrom) {
					this.showFrom = false
				}
			}
		},
		invalidDate(date) {
			if (date == "Invalid Date") {
				return true
			} else {
				return false
			}
		}
	},
	beforeMount() {
		if (this.dateTo == 'null' || this.dateFrom == 'null' || !this.dateTo || !this.dateFrom || this.dateFrom == "Invalid Date" || this.dateTo == "Invalid Date") {
			this.setDates()
		}
	}
}
</script>

<style lang="sass" scoped>
.section	
	padding-right: 5rem
	padding-left: 6rem
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
						align-items: center
						justify-content: flex-end
						.level-item
							align-items: flex-end
							flex-direction: column

						table
							width: 10rem
							margin-right: 1rem
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
								// top: -1px
								// left: -101%
								top: 100%
								left: 0
								z-index: 99
</style>