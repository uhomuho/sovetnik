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
						td(
							v-for='day in week'
							@click='setDay(day.num)'
							:class='compDay == day.unix ? "active" : null')
							| {{day.num}}
		.footer(v-if='time')
			.timepicker
				.hours
					.trigger.incrase(@click='incraseHours()')
						img.incrase(src="@/assets/icons/incrase.svg")
					|{{ hours }}
					.trigger.decrase(@click='decraseHours()')
						img.incrase(src="@/assets/icons/decrase.svg")
				|:
				.minutes
					.trigger.incrase(@click='incraseMinutes()')
						img.incrase(src="@/assets/icons/incrase.svg")
					|{{ minutes }}
					.trigger.decrase(@click='decraseMinutes()')
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

			timepicker: {
				currentHours: `${new Date().getHours()}`.length == 1 ? `0${new Date().getHours()}` : new Date().getHours(),
				currentMinutes: this.minutesRound(new Date().getMinutes()),

				selectedHours: this.date ? this.date.getHours() : null,
				selectedMinutes: this.date ? this.date.getMinutes() : null
			},

			selectedMonth: this.date ? `${this.date.getMonth()}`.length == 1 ? `0${this.date.getMonth() + 1}` : `${this.date.getMonth()}` : null,
			selectedYear: this.date ? this.date.getFullYear() : null,

			currentDay:	new Date().getDate(),
			selectedDay: this.date ? this.date.getDate() : null,

			weeks: []
		}
	},
	props: ['dateStart', 'dateFinish', 'time', 'autograph', 'range', 'date'],
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
			return new Date(`${this.selectedYear}-${this.date ? this.date.getMonth() + 1 : this.selectedMonth}-${this.selectedDay} 06:00`).getTime()
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

			this.selectedDay = new Date(`${year}-${month}-${day}`).getTime()

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
		},
		incraseYear() {
			let year = this.selectedYear ? this.selectedYear + 1 : this.currentYear + 1,
			date = new Date(year, 1, 0)

			this.selectedYear = date.getFullYear()
			this.getDays()
		},
		decraseMonth() {
			let month = this.selectedMonth ? parseInt(this.selectedMonth, 10) - 1 : parseInt(this.currentMonth, 10) - 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					date 	= new Date(year, month, 0)
					
			if (month == 0) this.decraseYear()
			this.selectedMonth = monthName.num[date.getMonth()]
			this.getDays()
		},
		incraseMonth() {
			let month = this.selectedMonth ? parseInt(this.selectedMonth, 10) + 1 : parseInt(this.currentMonth, 10) + 1,
					year  = this.selectedYear ? this.selectedYear : this.currentYear,
					unix 	= new Date(year, month, 0)

			if (month == 13) this.incraseYear()
			this.selectedMonth = monthName.num[unix.getMonth()]
			this.getDays()
		},
		incraseHours() {
			let hours = this.timepicker.selectedHours ? parseInt(this.timepicker.selectedHours, 10) + 1 : parseInt(this.timepicker.currentHours, 10) + 1

			this.timepicker.selectedHours = hours == 24 ? '00' : (`${hours}`.length == 1 ? `0${hours}` : hours)

			console.log(this.selectedDate)
			this.$emit('select', {
				date: this.selectedDate
			})
		},
		decraseHours() {
			let hours = this.timepicker.selectedHours ? parseInt(this.timepicker.selectedHours, 10) - 1 : parseInt(this.timepicker.currentHours, 10) - 1

			this.timepicker.selectedHours = hours == -1 ? '23' : (`${hours}`.length == 1 ? `0${hours}` : hours)

			this.$emit('select', {
				date: this.selectedDate
			})
		},
		minutesRound(x) {
			return x%5<3 ? (x%5===0 ? x : Math.floor(x/5)*5) : Math.ceil(x/5)*5
		},
		incraseMinutes() {
			let minutes = this.timepicker.selectedMinutes ? parseInt(this.timepicker.selectedMinutes,10) + 5 : this.minutesRound(this.timepicker.currentMinutes + 5)
			
			if (minutes == 60) {
				this.incraseHours()
			}
			this.timepicker.selectedMinutes = minutes == 60 ? '00' : minutes

			this.$emit('select', {
				date: this.selectedDate
			})
		},
		decraseMinutes() {
			let minutes = this.timepicker.selectedMinutes ? parseInt(this.timepicker.selectedMinutes, 10) - 5 : this.minutesRound(this.timepicker.currentMinutes - 5)
			
			if (minutes == -5) {
				this.timepicker.selectedMinutes = '55'
				return this.decraseHours()
			} 
			this.timepicker.selectedMinutes = minutes == 0 ? '00' : minutes

			this.$emit('select', {
				date: this.selectedDate
			})
		},
		getDays() {
			let sortDays 		= {},
					weeksCount 	= Math.ceil(this.daysCount/7),
					year 				= this.selectedYear ? this.selectedYear : this.currentYear,
					month 			= this.selectedMonth ? this.selectedMonth : this.currentMonth,
					diff 				= 0

			for (var i = 1; i <= weeksCount; i++) {
				let daysCount 	= i * 7,
						y 					= 7 * (i - 1)

				sortDays[i] = []
				if (i == 1 && new Date(`${year}-${month}-${y+1}`).getDay() !== 1 && this.range) {
					let emptyDays = new Date(`${year}-${month}-${y+1}`).getDay() - 1
					for (var z = 1; z <= emptyDays; z++) {
						sortDays[i].unshift({unix: null, num: null})
						y++
						diff++
					}
					// console.log(new Date(`${year}-${month}-${y+1}`).getDay())
				} else {
					// diff = 0
				}

				for (y; y < daysCount; y++) {
					let data = {
						unix: new Date(`${year}-${month}-${y-diff+1}`).getTime(),
						num: y-diff+1
					}
					if (y+1 <= this.daysCount + diff) sortDays[i].push(data)
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
				td
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
				align-items: center
				justify-content: center
				.trigger
					display: flex
					align-items: center
					justify-content: center
					cursor: pointer
					&.incrase
						margin-bottom: .2rem
						img
							transform: rotate(-90deg)

					&.decrase
						margin-top: .2rem
						img
							transform: rotate(-90deg)

</style>