<template lang="pug">
	div( @click='close' )
		.section
			.container(v-if='!byCars')
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

			.container.by-car(v-else)
				.level
					.level-left
						.level-item
							h1 
								|Путевые листы
								br
								|по автомобилям
					.level-right
						.level-item
							.wrapper.car.has-text-centered(@click='toggleCars')
								p.title Тип ТС
								p {{ selectedCar ? selectedCar : "Выберите автомобиль" }}
								.dropdown(
									v-if='cars && openCars')
									p(
										v-for='(car, index) in cars'
										@click='setCar(index)'
										:class='selectedCar == index ? "selected" : ""') 
										|{{ index }}
							.wrapper.month.has-text-centered(
								@click='openMonthSelector')
								p.title Месяц
								p 
									b {{ stringMonth }}
								MonthSelector(
									@select='getWaybillsMonth'
									@change='setDateMonth'
									:date='choosenMonth'
									:class='monthSelector ? "" : "is-hidden"')
				hr
				.carousel
					VueSlickCarousel(
						v-if='cars && showSlider'
						:dots='false'
						:arrows='true'
						:slidesToShow='10')
						template(#nextArrow)
							.custom-arrow
								img( src="@/assets/icons/incrase.svg" )
						template(#prevArrow)
							.custom-arrow
								img( src="@/assets/icons/decrase.svg" )
							
						p(
							v-for='(car, index) in cars[selectedCar]'
							@click='setPlate(car)'
							:class='serial == car.serial ? "selected" : ""')
							|{{ car.registrationPlate.toLowerCase() }}
				.container
					byCarsTable(
						v-if='waybills && waybills.listWaybill.length !== 0'
						:waybills='waybills.listWaybill')
					.content(
						v-else-if='!selectedCar')
						p.is-size-4.has-text-warning Выберите автомобиль
					.content(
						v-else-if='!serial')
						p.is-size-4.has-text-warning Выберите регистрационный номер автомобиля
					.content(
						v-else)
						p.is-size-4.has-text-warning Нет путевых листов по заданным параметрам

		b-loading(
			v-if="isLoading"
			:is-full-page="true"
			v-model="isLoading"
			:centerMode='true')
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import monthName from '@/month'
import Table from '@/components/_table'
import byCarsTable from '@/components/_table-by-cars.vue'
import Calendar from '@/components/calendar/_calendar-range.vue'
import MonthSelector from '@/components/calendar/_calendar-month.vue'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import api from '@/api/apiActions'

export default {
	name: 'Reports',
	components: {
		Table,
		Calendar,
		VueSlickCarousel,
		MonthSelector,
		byCarsTable
	},
	data() {
		return {
			isLoading: false,
			showCalendar: false,
			byCars: false,
			selectedCar: null,
			choosenMonth: new Date(),
			monthSelector: false,
			cars: null,
			openCars: false,
			showSlider: false,
			serial: null
		}
	},
	watch: {
		byCars() {
			this.premount()
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
		stringMonth() {
			return `${monthName.calendarMonth[this.choosenMonth.getMonth()]} ${this.choosenMonth.getFullYear()}`
		},
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
			setFilter: 'setFilterType',
			setWaybills: 'waybills'
		}),
		setCar(car) {
			this.selectedCar = car
			this.showSlider = false
			setTimeout(() => {
				this.showSlider = true
			}, 50)
		},
		setPlate(car) {
			this.serial = car.serial
			let filter = {
				byMonth: true,
				from: this.choosenMonth,
				serial: this.serial
			}
			this.getWaybills(filter)
		},
		setDateMonth(e) {
			this.choosenMonth = e.date
		},
		getWaybillsMonth(e) {
			this.choosenMonth = e.date
			this.monthSelector = false
			let filter = {
				byMonth: true,
				from: e.date
			}
			this.getWaybills(filter)
		},
		toggleCars() {
			this.openCars = !this.openCars
		},
		openMonthSelector(e) {
			if(e.target.matches('.wrapper.month *') && !e.target.matches('.wrapper.month .calendar *')) {
				this.monthSelector = !this.monthSelector
			}
		},
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
				this.showCalendar = !this.showCalendar
			}
		},
		close(e) {
			if(!e.target.matches('.calendar *, .wrapper.to *, .wrapper.from *') ) {
				if (this.showCalendar || this.monthSelector) {
					this.showCalendar = false
				}
			}
			if (!e.target.matches('.wrapper.month, .wrapper.month *, .calendar *')) {
				if (this.monthSelector) {
					this.monthSelector = false
				}
			}
			if (!e.target.matches('.wrapper.car, .wrapper.car *, .dropdown *')) {
				if (this.openCars) {
					this.openCars = false
				}
			}
		},
		invalidDate(date) {
			if (date == "Invalid Date") {
				return true
			} else {
				return false
			}
		},
		premount() {
			if (this.byCars) {
				this.setWaybills(null)
				api.getCarsFilter()
					.then((r) => this.cars = r.data)
			} else {
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
	},
	mounted() {
		this.premount()
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
	.by-car
		.wrapper
			.title
				font-size: .625rem!important
				color: $graphite2!important
				position: absolute
				top: 0
				left: 0
			&.car
				position: relative
				height: 3rem
				padding:
					top: .1rem
					bottom: .1rem
				display: flex
				align-items: center
				justify-content: center
				.dropdown
					background: #fff
					padding: 1rem .5rem
					border: 1px dashed #D0D9DE
					box-shadow: 0px 8px 32px rgba(176, 191, 198, 0.5)
					display: flex
					flex-direction: column
					align-items: flex-end
					justify-content: flex-start
					position: absolute
					top: 100%
					right: 0
					z-index: 3
					p
						text-align: right
						margin: .125rem 0
						padding: .125rem .25rem
						&.selected
							color: #ffffff!important
							font-weight: bold!important
							background: $graphite4
							border-radius: 4px
		.carousel
			min-height: unset!important
			.custom-arrow
				display: flex
				&.slick-prev
					flex-direction: row-reverse
			p
				font-size: .875rem
				text-align: center
				color: $graphite4
				padding: .65rem .125rem
				position: relative
				cursor: pointer
				&::before
					display: block
					content: ""
					width: 100%
					height: 0px
					margin: 0 auto
					position: absolute
					bottom: 0
					right: 0
					left: 0
					transition: height .3s ease-in-out 
					background: $blue2
				&.selected
					&::before
						height: 5px
						background: $blue4
				&:hover
					&::before
						height: 5px
</style>