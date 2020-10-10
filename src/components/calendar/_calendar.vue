<template lang="pug">
	div.calendar(v-if='!range')
		.header
			.trigger(@click='decraseYear()')
				img(src="@/assets/icons/decrase.svg")
			span {{ year }}
			.trigger(@click='incraseYear()')
				img(src="@/assets/icons/incrase.svg")

		.month-selector
			.trigger(@click='decraseMonth()')
				img(src="@/assets/icons/decrase.svg")
			span {{ selectedMonthName }}
			.trigger(@click='incraseMonth()')
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
					tr(v-for='week in weeks')
						td.calendar-td(
							v-for='day in week'
							v-if='day.unix > 0'
							@click='setDay(day.num)'
							:class='compDay == day.unix ? "active" : null')
							| {{ day.num }}
						td(v-else)
		.footer(v-if='time')
			.timepicker
				.trigger.incrase(@click='incraseHours()')
					img.incrase(src="@/assets/icons/incrase.svg")
				.day-part
					|{{ hours == '05' || hours == '08' || hours == '07' ? 'Утро' : hours == '13' ? 'День' : hours == '17' || hours == '20' || hours == '22' || hours == '19' ? 'Вечер' : "" }}
				.hours
					|{{ hours }}
				|:
				.minutes
					|{{ minutes }}
				.trigger.decrase(@click='decraseHours()')
					img.incrase(src="@/assets/icons/decrase.svg")
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
					.trigger(@click='decraseMonth()')
						img(src="@/assets/icons/decrase.svg")
					span {{ selectedMonthName }}
					.trigger(@click='incraseMonth()')
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
							tr(v-for='week in weeks')
								td(
									v-for='day in week'
									@click='setDay(day.num)'
									:class='compDay == day.unix ? "active" : null')
									| {{day.num}}

			.month-container
				.month-selector
					.trigger(@click='decraseMonth()')
						img(src="@/assets/icons/decrase.svg")
					span {{ selectedMonthName }}
					.trigger(@click='incraseMonth()')
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
							tr(v-for='week in weeks')
								td(
									v-for='day in week'
									@click='setDay(day.num)'
									:class='compDay == day.unix ? "active" : null')
									| {{day.num}}
</template>

<script>
import monthName from '@/month'
import { mapActions } from 'vuex'

export default {
	name: 'Calendar',
	data() {
		return {
			currentMonth: monthName.num[new Date().getMonth()],
			currentYear: new Date().getFullYear(),
			curHourIndex: 0,
			hoursList: ['05', '07', '08', '13', '17', '19', '20', '22'],

			timepicker: {
				currentHours: '05',
				currentMinutes: '00',

				selectedHours: this.open && this.date ? (`${new Date(this.date).getHours()}`.length == 1 ? `0${new Date(this.date).getHours()}` : new Date(this.date).getHours()) : "05",
				selectedMinutes: '00'
			},

			selectedMonth: this.date ? `${this.date.getMonth() + 1}`.length == 1 ? `0${this.date.getMonth() + 1}` : this.date.getMonth() + 1 : null,
			selectedYear: this.date ? this.date.getFullYear() : null,

			currentDay:	new Date().getDate(),
			selectedDay: this.date ? this.date.getDate() : null,

			weeks: [],
		}
	},
	props: ['dateStart', 'dateFinish', 'time', 'autograph', 'range', 'date', 'open'],
	computed: {
		daysCount() {
			let year = this.selectedYear ? this.selectedYear : this.currentYear,
					month = this.selectedMonth ? this.selectedMonth : this.currentMonth
			return new Date(year, month, 0).getDate()
		},
		selectedMonthName() {
			let month = this.selectedMonth ? this.selectedMonth : this.currentMonth
			return monthName.calendar[month]
		},
		compDay() {
			let length = `${this.selectedDay}`.length
			
			return new Date(`${this.selectedYear ? this.selectedYear : this.currentYear}-${this.date ? this.date.getMonth() + 1 : this.selectedMonth ? this.selectedMonth : this.currentMonth}-${length > 1 && length > 2 ? new Date(this.selectedDay).getDate() : this.selectedDay} ${this.timepicker.selectedHours}:00`).getTime()
		},
		year() {
			let year = this.selectedYear ? this.selectedYear : this.currentYear
			return year
		},
		hours() {
			let hours = this.timepicker.selectedHours ? this.timepicker.selectedHours : this.timepicker.currentHours

			return hours
		},
		minutes() {
			let minutes = this.timepicker.selectedMinutes ? (`${this.timepicker.selectedMinutes}`.length == 1 ? `0${this.timepicker.selectedMinutes}` : this.timepicker.selectedMinutes) : (`${this.minutesRound(this.timepicker.currentMinutes)}`.length == 1 ? `0${this.minutesRound(this.timepicker.currentMinutes)}` : this.minutesRound(this.timepicker.currentMinutes))

			return minutes
		},
		selectedDate() {
			let year 		= this.selectedYear ? this.selectedYear : this.currentYear,
					month 	= this.selectedMonth ? this.selectedMonth : this.currentMonth,
					day 		= this.selectedDay ? new Date(this.selectedDay).getDate() : new Date(this.currentDay).getDate(),
					hours 	= this.timepicker.selectedHours ? this.timepicker.selectedHours : this.timepicker.currentHours,
					minutes = this.timepicker.selectedMinutes ? this.timepicker.selectedMinutes : this.timepicker.currentMinutes
			return new Date(`${year}-${month}-${day}, ${hours}:${minutes}`)
		}
	},
	methods: {
		...mapActions('reports', {
			getAutographReport: 'apiAutographReport'
		}),
		setDay(day) {
			let year 		= this.selectedYear ? this.selectedYear : this.currentYear,
					month 	= this.selectedMonth ? this.selectedMonth : this.currentMonth

			this.selectedDay = new Date(`${year}-${month}-${day} ${this.timepicker.selectedHours}:00`).getTime()

			this.$emit('select', {
				date: this.selectedDate
			})
			
			if (this.autograph) this.getAutographReport()
		},
		decraseYear() {
			let year = this.selectedYear ? this.selectedYear - 1 : this.currentYear - 1,
			date = new Date(year, 1, 0)


			this.selectedYear = date.getFullYear()
			this.getDays()
			this.$emit('change', {
				date: this.selectedDate
			})
		},
		incraseYear() {
			let year = this.selectedYear ? this.selectedYear + 1 : this.currentYear + 1,
			date = new Date(year, 1, 0)


			this.selectedYear = date.getFullYear()
			this.getDays()
			this.$emit('change', {
				date: this.selectedDate
			})
		},
		decraseMonth() {
			let month = this.selectedMonth ? parseInt(this.selectedMonth, 10) - 1 : parseInt(this.currentMonth, 10) - 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					date 	= new Date(year, month, 0)
	

			if (month == 0) this.decraseYear()
			this.selectedMonth = monthName.num[date.getMonth()]
			this.getDays()
			this.$emit('change', {
				date: this.selectedDate
			})
		},
		incraseMonth() {
			let month = this.selectedMonth ? parseInt(this.selectedMonth, 10) + 1 : parseInt(this.currentMonth, 10) + 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					unix 	= new Date(year, month, 0)


			if (month == 13) this.incraseYear()
			this.selectedMonth = monthName.num[unix.getMonth()]
			this.getDays()
			this.$emit('change', {
				date: this.selectedDate
			})
		},
		incraseHours() {
			this.curHourIndex++
			if (this.curHourIndex > this.hoursList.length - 1) {
				this.curHourIndex = 0
			}
			this.timepicker.selectedHours = this.hoursList[this.curHourIndex]

			this.getDays()

			this.$emit('change', {
				date: this.selectedDate
			})
		},
		decraseHours() {
			this.curHourIndex--
			if (this.curHourIndex < 0) {
				this.curHourIndex = this.hoursList.length - 1
			}
			this.timepicker.selectedHours = this.hoursList[this.curHourIndex]

			this.getDays()

			this.$emit('change', {
				date: this.selectedDate
			})
		},
		minutesRound(x) {
			return x%5<3 ? (x%5===0 ? x : Math.floor(x/5)*5) : Math.ceil(x/5)*5
		},
		getDays() {
			let sortDays 			= [],
					year 					= this.selectedYear ? this.selectedYear : this.currentYear,
					month 				= this.selectedMonth ? this.selectedMonth : this.currentMonth,
					hours 				= `${this.timepicker.selectedHours}:00`,
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
			
			this.weeks = sortDays
		}
	},
	mounted() {
		this.getDays()
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
		box-shadow: 0px 8px 32px rgba(176, 191, 198, 0.5)
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
					&:hover
						background-color: rgba($graphite4, .2)
					&.active
						background-color: rgba($graphite4, .8)
						color: #fff

		.footer
			padding: .3rem
			border-top: 1px dashed $graphite1
			.timepicker
				font-size: 1.5rem
				line-height: 29px
				color: $graphite4
				display: flex
				padding: 1.4rem 0
				align-items: center
				justify-content: center
				position: relative
				.day-part
					font-size: 1rem
					margin: 
						top: .3rem
						right: .5rem
				.trigger
					display: flex
					align-items: center
					justify-content: center
					cursor: pointer
					position: absolute
					right: 0
					left: 0
					margin: 0 auto
					img
						height: 1rem!important
						margin: unset!important
					&.incrase
						top: .2rem
						img
							transform: rotate(-90deg)

					&.decrase
						bottom: .2rem
						img
							transform: rotate(-90deg)

</style>