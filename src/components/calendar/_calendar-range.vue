<template lang="pug">
	div.calendar.range(v-else)
		.header
			.trigger(@click='decraseYear()')
				img(src="@/assets/icons/decrase.svg")
			span {{ year }}
			.trigger(@click='incraseYear()')
				img(src="@/assets/icons/incrase.svg")

		.wrapper.body
			.month-container
				.month-selector
					.trigger(@click='decraseMonthFrom()')
						img(src="@/assets/icons/decrase.svg")
					span {{ selectedMonthNameFrom }}
					.trigger(@click='incraseMonthFrom()')
						img(src="@/assets/icons/incrase.svg")

				.body
					table
						thead
							tr
								th пн
								th вт
								th ср
								th чт
								th пт
								th сб
								th вс
						tbody
							tr(v-for='week in weeksFrom')
								td.calendar-td(
									v-for='day in week'
									v-if='day.unix > 0 && day.unix < compDayTo'
									@click='setDayFrom(day.num)'
									:class='compDayFrom == day.unix ? "active" : day.unix <= compDayTo && day.unix > compDayFrom ? "in-range" : null')
									| {{day.num}}
								td.disabled.calendar-td(
									v-else-if='day.unix > compDayTo')
									| {{ day.num }}
								td(v-else)

			.month-container
				.month-selector
					.trigger(@click='decraseMonthTo()')
						img(src="@/assets/icons/decrase.svg")
					span {{ selectedMonthNameTo }}
					.trigger(@click='incraseMonthTo()')
						img(src="@/assets/icons/incrase.svg")

				.body
					table
						thead
							tr
								th пн
								th вт
								th ср
								th чт
								th пт
								th сб
								th вс
						tbody
							tr(v-for='week in weeksTo')
								td.calendar-td(
									v-for='day in week'
									v-if='day.unix > 0 && day.unix > compDayFrom'
									@click='setDayTo(day.num)'
									:class='compDayTo == day.unix ? "active" : day.unix < compDayTo && day.unix >= compDayFrom ? "in-range" : null')
									| {{ day.num }}
								td.calendar-td.disabled(v-else-if='day.unix < compDayFrom')
									|{{ day.num }}
								td(v-else)
</template>

<script>
import monthName from '@/month'

export default {
	name: 'Calendar',
	data() {
		return {
			currentMonthFrom: monthName.num[new Date().getMonth() - 2],
			currentMonthTo: monthName.num[new Date().getMonth() + 2],
			currentYear: new Date().getFullYear(),

			selectedMonthFrom: this.firstDate ? `${this.firstDate.getMonth() + 1}`.length == 1 ? `0${this.firstDate.getMonth() + 1}` : this.firstDate.getMonth() + 1 : null,
			selectedMonthTo: this.lastDate ? `${this.lastDate.getMonth() + 1}`.length == 1 ? `0${this.lastDate.getMonth() + 1}` : this.lastDate.getMonth() + 1 : null,

			selectedYear: this.firstDate ? this.firstDate.getFullYear() : null,

			currentDayFrom:	new Date().getDate(),
			currentDayTo:	new Date().getDate(),

			selectedDayFrom: this.firstDate ? this.firstDate.getDate() : null,
			selectedDayTo: this.lastDate ? this.lastDate.getDate() : null,

			weeksFrom: [],
			weeksTo: []
		}
	},
	props: ['firstDate', 'lastDate'],
	computed: {
		selectedMonthNameFrom() {
			let month = this.selectedMonthFrom ? this.selectedMonthFrom : this.currentMonthFrom
			return monthName.calendar[month]
		},
		selectedMonthNameTo() {
			let month = this.selectedMonthTo ? this.selectedMonthTo : this.currentMonthTo
			return monthName.calendar[month]
		},
		compDayFrom() {
			let length = `${this.selectedDayFrom}`.length
			
			return new Date(`${this.selectedYear ? this.selectedYear : this.currentYear}-${this.firstDate ? this.firstDate.getMonth() + 1 : this.selectedMonthFrom ? this.selectedMonthFrom : this.currentMonthFrom}-${length > 1 && length > 2 ? new Date(this.selectedDayFrom).getDate() : this.selectedDayFrom} 07:00`).getTime()
		},
		compDayTo() {
			let length = `${this.selectedDayTo}`.length
			
			return new Date(`${this.selectedYear ? this.selectedYear : this.currentYear}-${this.lastDate ? this.lastDate.getMonth() + 1 : this.selectedMonthTo ? this.selectedMonthTo : this.currentMonthTo}-${length > 1 && length > 2 ? new Date(this.selectedDayTo).getDate() : this.selectedDayTo} 19:00`).getTime()
		},
		year() {
			let year = this.selectedYear ? this.selectedYear : this.currentYear
			return year
		},
		selectedDateFrom() {
			let year 		= this.selectedYear ? this.selectedYear : this.currentYear,
					month 	= this.selectedMonthFrom ? this.selectedMonthFrom : this.currentMonthFrom,
					day 		= this.selectedDayFrom ? new Date(this.selectedDayFrom).getDate() : new Date(this.currentDayFrom).getDate()

			return new Date(`${year}-${month}-${day}, 07:00`)
		},
		selectedDateTo() {
			let year 		= this.selectedYear ? this.selectedYear : this.currentYear,
					month 	= this.selectedMonthTo ? this.selectedMonthTo : this.currentMonthTo,
					day 		= this.selectedDayTo ? new Date(this.selectedDayTo).getDate() : new Date(this.currentDayTo).getDate()
					
			return new Date(`${year}-${month}-${day}, 19:00`)
		}
	},
	methods: {
		setDayFrom(day) {
			let year 		= this.selectedYear ? this.selectedYear : this.currentYear,
					month 	= this.selectedMonthFrom ? this.selectedMonthFrom : this.currentMonthFrom

			this.selectedDayFrom = new Date(`${year}-${month}-${day} 07:00`).getTime()

			this.$emit('dateFrom', {
				date: this.selectedDateFrom
			})
		},
		setDayTo(day) {
			let year 		= this.selectedYear ? this.selectedYear : this.currentYear,
					month 	= this.selectedMonthTo ? this.selectedMonthTo : this.currentMonthTo

			this.selectedDayTo = new Date(`${year}-${month}-${day} 19:00`).getTime()

			this.$emit('dateTo', {
				date: this.selectedDateTo
			})
		},
		decraseYear() {
			let year = this.selectedYear ? this.selectedYear - 1 : this.currentYear - 1,
					date = new Date(year, 1, 0)


			this.selectedYear = date.getFullYear()
			this.getDaysFrom()
			this.getDaysTo()
			this.$emit('changeYear', {
				dateFrom: this.selectedDateFrom,
				dateTo: this.selectedDateTo
			})
		},
		incraseYear() {
			let year = this.selectedYear ? this.selectedYear + 1 : this.currentYear + 1,
					date = new Date(year, 1, 0)


			this.selectedYear = date.getFullYear()
			this.getDaysFrom()
			this.getDaysTo()
			this.$emit('changeYear', {
				dateFrom: this.selectedDateFrom,
				dateTo: this.selectedDateTo
			})
		},
		decraseMonthFrom() {
			let month = this.selectedMonthFrom ? parseInt(this.selectedMonthFrom, 10) - 1 : parseInt(this.currentMonthFrom, 10) - 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					date 	= new Date(year, month, 0)
	

			if (month == 0) this.decraseYear()
			this.selectedMonthFrom = monthName.num[date.getMonth()]
			this.getDaysFrom()
		},
		decraseMonthTo() {
			let month = this.selectedMonthTo ? parseInt(this.selectedMonthTo, 10) - 1 : parseInt(this.currentMonthTo, 10) - 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					date 	= new Date(year, month, 0)
	

			if (month == 0) this.decraseYear()
			this.selectedMonthTo = monthName.num[date.getMonth()]
			this.getDaysTo()
		},
		incraseMonthFrom() {
			let month = this.selectedMonthFrom ? parseInt(this.selectedMonthFrom, 10) + 1 : parseInt(this.currentMonthFrom, 10) + 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					unix 	= new Date(year, month, 0)


			if (month == 13) this.incraseYear()
			this.selectedMonthFrom = monthName.num[unix.getMonth()]
			this.getDaysFrom()
		},
		incraseMonthTo() {
			let month = this.selectedMonthTo ? parseInt(this.selectedMonthTo, 10) + 1 : parseInt(this.currentMonthTo, 10) + 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					unix 	= new Date(year, month, 0)


			if (month == 13) this.incraseYear()
			this.selectedMonthTo = monthName.num[unix.getMonth()]
			this.getDaysTo()
		},
		getDaysFrom() {
			let sortDays 			= [],
					year 					= this.selectedYear ? this.selectedYear : this.currentYear,
					month 				= this.selectedMonthFrom ? this.selectedMonthFrom : this.currentMonthFrom,
					hours 				= `07:00`,
					lastDay 			= new Date(year, month, 0).getDate(),
					lastDayWeek 	= new Date(`${year}-${month}-${lastDay}`).getDay(),
					firstDayWeek 	= new Date(`${year}-${month}-1`).getDay(),
					firstDayOffset,
					weeksCount,
					date = 1

			// Количество пустых клеток перед первым днём
			if (firstDayWeek !== 0) {
				firstDayOffset = firstDayWeek - 1
			} else {
				firstDayOffset = 6
			}

			// Количество недель
			weeksCount = (lastDay + firstDayOffset - lastDayWeek + 7) / 7

			// Распихиваем дни по неделям
			for (let w = 0; w <= weeksCount - 1; w++) {
				sortDays[w] = []
				if (w == 0) {
					// Первая неделя месяца
					for (let d = 1; d <= firstDayOffset; d++) {
						sortDays[w].push({
							unix: 0,
							num: ""
						})
					}
					for (let d = firstDayOffset+1; d <= 7; d++) {
						sortDays[w].push({
							unix: new Date(`${year}-${month}-${date} ${hours}`).getTime(),
							num: date
						})
						date++
					}
				} else if (sortDays.length == weeksCount) {
					// Последняя неделя месяца
					for (let d = 1; d <= lastDayWeek; d++) {
						sortDays[w].push({
							unix: new Date(`${year}-${month}-${date} ${hours}`).getTime(),
							num: date
						})
						date++
					}
					for (let d = lastDayWeek + 1; d <= 7; d++) {
						sortDays[w].push({
							unix: 0,
							num: ""
						})
						date++
					}
				} else {
					// Все остальные недели :)
					for (let d = 1; d <= 7; d++) {
						sortDays[w].push({
							unix: new Date(`${year}-${month}-${date} ${hours}`).getTime(),
							num: date
						})
						date++
					}
				}
			}
			this.weeksFrom = sortDays
		},
		getDaysTo() {
			let sortDays 			= [],
					year 					= this.selectedYear ? this.selectedYear : this.currentYear,
					month 				= this.selectedMonthTo ? this.selectedMonthTo : this.currentMonthTo,
					hours 				= `19:00`,
					lastDay 			= new Date(year, month, 0).getDate(),
					lastDayWeek 	= new Date(`${year}-${month}-${lastDay}`).getDay(),
					firstDayWeek 	= new Date(`${year}-${month}-1`).getDay(),
					firstDayOffset,
					weeksCount,
					date = 1

			// Количество пустых клеток перед первым днём
			if (firstDayWeek !== 0) {
				firstDayOffset = firstDayWeek - 1
			} else {
				firstDayOffset = 6
			}

			// Количество недель
			weeksCount = (lastDay + firstDayOffset - lastDayWeek + 7) / 7

			// Распихиваем дни по неделям
			for (let w = 0; w <= weeksCount - 1; w++) {
				sortDays[w] = []
				if (w == 0) {
					// Первая неделя месяца
					for (let d = 1; d <= firstDayOffset; d++) {
						sortDays[w].push({
							unix: 0,
							num: ""
						})
					}
					for (let d = firstDayOffset+1; d <= 7; d++) {
						sortDays[w].push({
							unix: new Date(`${year}-${month}-${date} ${hours}`).getTime(),
							num: date
						})
						date++
					}
				} else if (sortDays.length == weeksCount) {
					// Последняя неделя месяца
					for (let d = 1; d <= lastDayWeek; d++) {
						sortDays[w].push({
							unix: new Date(`${year}-${month}-${date} ${hours}`).getTime(),
							num: date
						})
						date++
					}
					for (let d = lastDayWeek + 1; d <= 7; d++) {
						sortDays[w].push({
							unix: 0,
							num: ""
						})
						date++
					}
				} else {
					// Все остальные недели :)
					for (let d = 1; d <= 7; d++) {
						sortDays[w].push({
							unix: new Date(`${year}-${month}-${date} ${hours}`).getTime(),
							num: date
						})
						date++
					}
				}
			}
			this.weeksTo = sortDays
		}
	},
	mounted() {
		this.getDaysFrom()
		this.getDaysTo()
	}
}

</script>

<style lang="sass" scoped>
	span
		text-align: center
	.calendar
		border: 1px dashed $graphite1
		width: 12rem
		background-color: #fff
		box-shadow: 0px 21px 32px rgba(176, 191, 198, 0.5)
		&.range
			width: fit-content
			background-color: transparent
			border: none

			.header
				width: 50%
				background-color: #fff
				border: 1px dashed $graphite1
				border-bottom: none

			.wrapper
				width: fit-content
				background-color: #fff
				border: 1px dashed $graphite1
				display: flex
				align-items: flex-start
				justify-content: flex-start
				.month-container
					padding: 0 .2rem
		*
			user-select: none

		.header
			border-bottom: 1px dashed $graphite1

		.header, .month-selector
			display: flex
			align-items: center
			justify-content: space-around
			span
				font-size: .875rem!important
				color: $graphite4!important

			.trigger
				height: 2.9rem
				padding: 0 1rem
				display: flex
				align-items: center
				justify-content: center
				cursor: pointer
				img
					height: 1rem
		
		.body
			padding: .5rem 1rem 1rem
			&.wrapper
				padding: 0
			table
				text-align: center
				color: $graphite4
				width: 100%
				thead
					th
						font-size: .625rem
						font-weight: normal
						color: $graphite1
				td.calendar-td
					padding: .2rem .1rem
					border-radius: 4px
					border: unset
					cursor: pointer
					font-size: .875rem
					&.disabled
						opacity: .4
						&:hover
							background-color: transparent
							cursor: not-allowed
					&:hover
						background-color: rgba($graphite4, .2)
					&.active
						background-color: rgba($graphite4, .8)
						color: #fff
					&.in-range
						background-color: rgba($graphite4, .1)
						border-radius: 0
						&:hover
							background-color: rgba($graphite4, .3)

</style>