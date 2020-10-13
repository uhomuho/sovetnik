<template lang="pug">
	div( @click='close' )
		.section
			.container(v-if='waybills')
				.columns.is-flex.is-centered
					.column.is-4.opened
						.column-container
							p.num {{ status.OPEN ? status.OPEN : 0 }}
							p 
								|СМЕН
								br
								|ОТКРЫТО
					.column.is-4.check
						.column-container
							p.num {{ status.CHECK ? status.CHECK : 0 }}
							p
								|СМЕН НА
								br
								|ПРОВЕРКЕ
					.column.is-4.closed
						.column-container
							p.num {{ status.CLOSE ? status.CLOSE : 0 }}
							p
								|СМЕН
								br
								|ЗАКРЫТО
			.container
				.level
					.level-left
						.level-item
							h1 
								|Отчет по
								br
								|путевым листам
					.level-right
						.level-item
							table
								tr
									td(
										@click='setFilter("year"), getWaybills(0)'
										:class='filterType == "year" ? "active" : null') весь год
									td(
										@click='setFilter("yest"), getWaybills(0)'
										:class='filterType == "yest" ? "active" : null') вчера
								tr
									td(
										@click='setFilter("month"), getWaybills(0)'
										:class='filterType == "month" ? "active" : null') месяц
									td(
										@click='setFilter("today"), getWaybills(0)'
										:class='filterType == "today" ? "active" : null') сегодня
								tr
									td(
										@click='setFilter("week"), getWaybills(0)'
										:class='filterType == "week" ? "active" : null') неделя
									td(
										@click='setFilter("range"), getWaybills(0)'
										:class='filterType == "range" ? "active" : null') период
						.level-item
							.wrapper.from(
								@click='openCalendar')
								p {{ stringFrom }}
								Calendar(
									v-if='!invalidDate(dateFrom) && !invalidDate(dateTo)'
									:class='showCalendar ? null : "is-hidden"'
									@dateTo='setTo'
									@dateFrom='setFrom'
									:firstDate='dateFrom'
									:lastDate='dateTo')
							.wrapper.to(
								@click='openCalendar')
								p {{ stringTo }}

				hr
				Table(
					:waybills='waybills ? waybills.listWaybill : null')
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import Table from '@/components/_waybillsReportsTable'
import Calendar from '@/components/calendar/_calendar-range.vue'
import monthName from '@/month'

export default {
	name: 'WaybillsReports',
	components: {
		Table,
		Calendar
	},
	data() {
		return {
			isLoading: false,
			showCalendar: false
		}
	},
	computed: {
		...mapGetters('waybills', {
			waybills: 'waybills',
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
		},
		status() {
			let statuses = this.waybills.totalStatus,
					list = {}
			for (let status of statuses) {
				list[status[1]] = status[0]
			}
			return list
		}
	},
	methods: {
		...mapActions('waybills', [
			'waybillsSort',
			'getWaybills',
			'setDates'
		]),
		...mapMutations('waybills', {
			setDateTo: 'dateTo',
			setDateFrom: 'dateFrom',
			setFilter: 'setFilterType'
		}),
		setTo(e) {
			this.setDateTo(e.date)

			setTimeout(() => {
				this.getWaybills()
			}, 50)
		},
		setFrom(e) {
			this.setDateFrom(e.date)

			setTimeout(() => {
				this.getWaybills()
			}, 50)
		},
		openCalendar(e) {
			if(e.target.matches('.wrapper.to *') || e.target.matches('.wrapper.from p') || e.target.matches('.wrapper.from')) {
				console.log('xex')
				this.showCalendar = !this.showCalendar
			}
		},
		close(e) {
			if(!e.target.matches('.calendar *, .wrapper.to *, .wrapper.from *')) {
				if (this.showCalendar) {
					this.showCalendar = false
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
		this.setDates()
	}
}

</script>

<style lang="sass" scoped>
.section	
	padding-top: 0
	.container
		&:last-of-type
			padding-top: 4rem
		&:first-of-type
			.opened
				background: #BFE5E3
				border-bottom-left-radius: 20px
			.check
				background: #FFE6C0
			.closed
				background: #F7CCCD
				border-bottom-right-radius: 20px
			.column
				.column-container
					display: flex
					align-items: center
					justify-content: center
					padding: 2rem 0 1.5rem
					p
						font-size: 1.5rem
						font-weight: bold
						color: #fff
						line-height: 1.6rem
						&.num
							font-size: 4rem
							margin-right: .5rem

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

						.wrapper.to
							z-index: 101

						.wrapper.to,
						.wrapper.from
							text-align: left
							width: 206px
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

							.calendar.range
								position: absolute
								top: 100%
								left: unset!important
								right: 0
								z-index: 100
</style>