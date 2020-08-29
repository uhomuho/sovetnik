<template lang="pug">
div
	.container#create(v-on:click="close")
		.section(v-if='waybill')
			.level
				.level-left
					.level-item
						h1
							|Новый
							br
							|путевой лист
			
				.level-right
					.level-item
						.level
							.level-left
								.level-item
									|№
									span {{ waybill.id }}
							.level-right
								.level-item
									|от
									span {{ dateStringOf }}
			hr
			.tile.is-ancestor.is-marginless
				.tile
					.level
						.level-left
							.level-item
								|Гос. номер:
						.level-right
							.level-item
								b-dropdown( 
									aria-role="list"
									:scrollable='true',
									max-height="400")
									.wrapper( slot="trigger" )
										span.placeholder(v-if='!registrationPlate') Гос. номер
										span(v-else) {{ registrationPlate }}
										img.icon( src="@/assets/icons/angle-4.svg" )

									b-dropdown-item(
										v-for='car in listCar'
										@click='setRegistrationPlate(car.registrationPlate)'
										:class='car.registrationPlate == registrationPlate') {{ car.registrationPlate }}

					.level
						.level-left
							.level-item
								|Водитель:
						.level-right
							.level-item
								b-dropdown(
									aria-role="list")
									.wrapper( slot="trigger" )
										span.placeholder(v-if='!driver') Водитель
										span(v-else) {{ driver.name }}
										img.icon( src="@/assets/icons/angle-4.svg")

									b-dropdown-item(
										v-for='driver in listDrivers'
										@click='setDriver(driver)'
										:class='driver.id == driver ? "is-active" : null') {{ driver.name }}
					.level
						.level-left
							.level-item
								|Выезд из гаража:
						.level-right
							.level-item.date
								.wrapper(
									@click='openStart'
									:class='startTime ? "is-active" : null')
									span(
										v-html='waybillData.start ? dateTimeStringStart : "XX/XX/XX, XX:XX"'
										:class='waybillData.start ? null : "placeholder"')
									img.icon( src="@/assets/icons/angle-4.svg" )

								Calendar( 
									@select='selectStart'
									:class='startTime ? null : "hide"',
									:dateFinish='unixDateFinish ? unixDateFinish : null')
					.level
						.level-left
							.level-item
								|Возвращение в гараж:
						.level-right
							.level-item.date
								.wrapper(
									@click='openFinish'
									:class='finishTime ? "is-active" : null')
									span(
										v-html='waybillData.finish ? dateTimeStringFinish : "XX/XX/XX, XX:XX"'
										:class='waybillData.finish ? null : "placeholder"')
									img.icon( src="@/assets/icons/angle-4.svg" )

								Calendar( 
									@select='selectFinish'
									:class='finishTime ? null : "hide"',
									:dateStart='unixDateStart ? unixDateStart : null')
					hr

					.level
						.level-left
							.level-item
								span Спидометр:
						.level-right
							.level-item
								span(v-if='waybill.milleageFinish') {{ waybill.milleageFinish }}
								span(v-else) 116,58
								span.hint (показание предыдущей смены)
					
					.level
						.level-left
							.level-item
								span Остаток при выдаче:
						.level-right
							.level-item
								span(v-if='waybill.fuelFinish') {{ waybill.fuelFinish }}
								span(v-else) 26,14
								span.hint (показание предыдущей смены)

				.tile
					img(src="/img/waybillexample.svg")
			hr

			.task
				span.title Задание водителю:
				input(
					placeholder="Задание",
					v-model='waybill.workText')

			b-loading(
				v-if="isLoading"
				:is-full-page='true'
				v-model="isLoading")
		b-loading(
			v-else
			:is-fill-page='true')
					
</template>

<script>
import monthName from '@/month'
import Calendar from '@/components/calendar/_calendar'
import { mapGetters, mapActions } from 'vuex'

export default {
	name: 'CreateWaybill',
	components: {
		Calendar
	},
	data() {
		return {
			startTime: false,
			finishTime: false,
			isLoading: false,
			// waybillData: {
			// 	id: 36,
			// 	of: 1598608006254,
			// 	start: null,
			// 	finish: null,
			// 	milleageStart: 0,
			// 	milleageFinish: 0
			// },
			// listDrivers: [
			// 	{
			// 		id: 1,
			// 		name: " Иванов И.И."
			// 	},
			// 	{
			// 		id: 2,
			// 		name: "Садыков А.Р."
			// 	}
			// ],
			// listCar: [],
			registrationPlate: null,
			driver: null
		}
	},
	computed: {
		...mapGetters('waybills', {
			waybillData: 	'getNewWaybill',
			listDrivers: 	'getNewListDrivers',
			listCar: 			'getNewListCar'
		}),
		waybill() {
			return this.waybillData
		},
		unixDateStart() {
			return this.waybillData.start ? new Date(this.waybillData.start).getTime() : null
		},
		unixDateFinish() {
			return this.waybillData.finish ? new Date(this.waybillData.finish).getTime() : null
		},
		dateStringOf() {
			let date = new Date(this.waybillData.of),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate()
					
			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()}`
		},
		dateTimeStringStart() {
			let date = new Date(this.waybillData.start),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()},&nbsp;${hours}:${minutes}`
		},
		dateTimeStringFinish() {
			let date = new Date(this.waybillData.finish),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()},&nbsp;${hours}:${minutes}`
		}
	},
	methods: {
		...mapActions('waybills', {
			getNewWaybill: 'getNewWaybillData'
		}),
		selectStart(data) {
			this.waybillData.start = data.date
		},
		selectFinish(data) {
			this.waybillData.finish = data.date
		},
		openStart() {
			this.startTime = !this.startTime
			this.finishTime = false
		},
		openFinish() {
			this.finishTime = !this.finishTime
			this.startTime = false
		},
		close(e) {
			if(!e.target.matches('.date *')) {
				if (this.startTime) {
					this.startTime = false
				}
				if (this.finishTime) {
					this.finishTime = false
				}
			}
		},
		setRegistrationPlate(num) {
			this.registrationPlate = num
		},
		setDriver(obj) {
			this.driver = obj
		}
	},
	mounted() {
		if (!this.waybill) {
			this.isLoading = true
			this.getNewWaybill()
				.then(() => this.isLoading = false)
		}
	}
}
</script>