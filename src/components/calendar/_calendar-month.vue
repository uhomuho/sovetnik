<template lang="pug">
	div.calendar(v-if='!range')
		.header
			.trigger(@click='decraseYear()')
				img(src="@/assets/icons/decrase.svg")
			span {{ year }}
			.trigger(@click='incraseYear()')
				img(src="@/assets/icons/incrase.svg")

		.month-selector
			.columns.is-flex.is-multiline.is-variable
				.column.is-6(@click='setMonth(0)')
					p(
						:class='selectedMonth == "01" ? "selected" : ""') Январь
				.column.is-6(@click='setMonth(1)')
					p(
						:class='selectedMonth == "02" ? "selected" : ""') Февраль
				.column.is-6(@click='setMonth(2)')
					p(
						:class='selectedMonth == "03" ? "selected" : ""') Март
				.column.is-6(@click='setMonth(3)')
					p(
						:class='selectedMonth == "04" ? "selected" : ""') Апрель
				.column.is-6(@click='setMonth(4)')
					p(
						:class='selectedMonth == "05" ? "selected" : ""') Май
				.column.is-6(@click='setMonth(5)')
					p(
						:class='selectedMonth == "06" ? "selected" : ""') Июнь
				.column.is-6(@click='setMonth(6)')
					p(
						:class='selectedMonth == "07" ? "selected" : ""') Июль
				.column.is-6(@click='setMonth(7)')
					p(
						:class='selectedMonth == "08" ? "selected" : ""') Август
				.column.is-6(@click='setMonth(8)')
					p(
						:class='selectedMonth == "09" ? "selected" : ""') Сентябрь
				.column.is-6(@click='setMonth(9)')
					p(
						:class='selectedMonth == "10" ? "selected" : ""') Октябрь
				.column.is-6(@click='setMonth(10)')
					p(
						:class='selectedMonth == "11" ? "selected" : ""') Ноябрь
				.column.is-6(@click='setMonth(11)')
					p(
						:class='selectedMonth == "12" ? "selected" : ""') Декабрь

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
		decraseYear() {
			let year = this.selectedYear ? this.selectedYear - 1 : this.currentYear - 1,
			date = new Date(year, 1, 0)


			this.selectedYear = date.getFullYear()
			this.$emit('change', {
				date: this.selectedDate
			})
		},
		incraseYear() {
			let year = this.selectedYear ? this.selectedYear + 1 : this.currentYear + 1,
			date = new Date(year, 1, 0)


			this.selectedYear = date.getFullYear()
			this.$emit('change', {
				date: this.selectedDate
			})
		},
		setMonth(month) {
			if (month == 0) this.decraseYear()
			this.selectedMonth = monthName.num[month]
			this.$emit('select', {
				date: this.selectedDate
			})
		}
	}
}

</script>

<style lang="sass" scoped>
	span
		text-align: center
	.calendar
		border: 1px dashed $graphite1
		width: 16rem
		left: unset!important
		right: 0
		background-color: #fff
		box-shadow: 0px 8px 32px rgba(176, 191, 198, 0.5)
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
		
		.month-selector
			padding: .75rem 1.75rem
			.column
				--columnGap: .5rem
				padding: var(--columnGap)
				p
					font-size: .875rem
					color: $graphite4
					padding: .2rem .5rem
					&.selected
						font-weight: bold
						color: #ffffff
						background: $graphite4
						border-radius: 4px
</style>