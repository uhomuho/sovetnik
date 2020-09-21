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
								@click='openFrom')
								p {{ stringFrom }}
								Calendar(
									:class='showFrom ? null : "is-hidden"'
									@select='setFrom'
									:time='false',
									:date='dateFrom')
							.wrapper.to(
								@click='openTo')
								p {{ stringTo }}
								Calendar(
									:class='showTo ? null : "is-hidden"'
									@select='setTo'
									:time='false',
									:date='dateTo')

				hr
				Table(
					v-if='waybills'
					:waybills='waybills'
					:total='total'
					:isLoading='isLoading')


		b-loading(
			v-if="isLoading"
			:is-full-page="true"
			v-model="isLoading")
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import monthName from '@/month'
import Table from '@/components/_table'
import Calendar from '@/components/calendar/_calendar.vue'

export default {
	name: 'Reports',
	components: {
		Table,
		Calendar
	},
	data() {
		return {
			isLoading: false,
			showTo: false,
			showFrom: false
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
			this.setDateTo(e)

			setTimeout(() => {
				this.getWaybills()
			}, 50)
		},
		setFrom(e) {
			this.setDateFrom(e)

			setTimeout(() => {
				this.getWaybills()
			}, 50)
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
		}
	},
	mounted() {

		if(!this.dateTo || !this.dateFrom || this.dateFrom == "Invalid Date" || this.dateTo == "Invalid Date") {
			this.setDates()
				.then(() => {
					this.isLoading = true
					this.getWaybills()
						.then(() => this.isLoading = false)
				})
		} else {
			this.isLoading = true
				this.getWaybills()
					.then(() => this.isLoading = false)
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
								left: 0
								z-index: 99

</style>