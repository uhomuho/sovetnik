<template lang="pug">
	div( @click='close' )
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
					v-if='waybills'
					:waybills='waybills'
					:total='total'
					:isLoading='isLoading',
					:status='$router.currentRoute.query.status')


		b-loading(
			v-if="isLoading"
			:is-full-page="true"
			v-model="isLoading")
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import monthName from '@/month'
import Table from '@/components/_table'
import Calendar from '@/components/calendar/_calendar-range.vue'

export default {
	name: 'Reports',
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
	props: ['status'],
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
	mounted() {

		let status = this.$router.currentRoute.query.status

		if(!this.dateTo || !this.dateFrom || this.dateFrom == "Invalid Date" || this.dateTo == "Invalid Date") {
			this.setDates()
				.then(() => {
					this.isLoading = true
					switch (status) {
						case "closed":
							this.getWaybills({
								serial: null,
								status: ["CLOSE"]
							})
								.then(() => this.isLoading = false)
							break
						case "check":
							this.getWaybills({
								serial: null,
								status: ["CHECK"]
							})
								.then(() => this.isLoading = false)
							break
						case "opened":
							this.getWaybills({
								serial: null,
								status: ["OPEN"]
							})
								.then(() => this.isLoading = false)
							break
						default:
							this.getWaybills()
								.then(() => this.isLoading = false)
							break
					}
				})
		} else {
			switch (status) {
				case "closed":
					this.getWaybills({
						serial: null,
						status: ["CLOSE"]
					})
						.then(() => this.isLoading = false)
					break
				case "check":
					this.getWaybills({
						serial: null,
						status: ["CHECK"]
					})
						.then(() => this.isLoading = false)
					break
				case "opened":
					this.getWaybills({
						serial: null,
						status: ["OPEN"]
					})
						.then(() => this.isLoading = false)
					break
				default:
					this.getWaybills()
						.then(() => this.isLoading = false)
					break
			}
		}
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

						.calendar.range
							position: absolute
							left: unset!important
							right: 0

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

						.wrapper
							text-align: left
							width: 206px
							padding: .8rem 1.25rem
							border: 1px dashed #D0D9DE
							border-bottom: unset
							cursor: pointer
							user-select: none
							position: relative
							&.to
								z-index: 99
							p
								font-size: .875rem
								font-weight: 500
								color: $graphite4
							.calendar 
								position: absolute
								top: 100%
								left: 0
								z-index: 99

</style>