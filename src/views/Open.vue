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
									input.id( 
										v-model='waybill.id'
										type="number")
							.level-right
								.level-item
									|от
									span.date-of(@click='openOf') {{ dateStringOf }}
									Calendar( 
										@select='selectOf'
										:class='ofTime ? null : "hide"')
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
										input.plate(
											@keyup='filterPlates'
											v-model='registrationPlate'
											placeholder="Гос. номер")
										img.icon( src="@/assets/icons/angle-4.svg" )

									b-dropdown-item(
										v-if='registrationPlate'
										v-for='car in listCar'
										:key='car.serial'
										@click='setRegistrationPlate(car), getLastWb()'
										:class='car.registrationPlate == registrationPlate ? "is-active" : null') {{ car.registrationPlate }}

					.level
						.level-left
							.level-item
								|Водитель:
						.level-right
							.level-item
								b-dropdown(
									aria-role="list"
									:scrollable='true'
									max-height="400")
									.wrapper( slot="trigger" )
										input.driver(
											@keyup="filterDriver" 
											v-model="driver"
											placeholder="Водитель")
										img.icon( src="@/assets/icons/angle-4.svg")

									b-dropdown-item(
										v-if='driver'
										v-for='driver in listDrivers'
										:key='driver.driverId'
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
										v-html='waybill.startPlan ? dateTimeStringStart : "XX/XX/XX, XX:XX"'
										:class='waybill.startPlan ? null : "placeholder"')
									img.icon( src="@/assets/icons/angle-4.svg" )

								Calendar( 
									@select='selectStart'
									:time='true'
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
										v-html='waybill.finishPlan ? dateTimeStringFinish : "XX/XX/XX, XX:XX"'
										:class='waybill.finishPlan ? null : "placeholder"')
									img.icon( src="@/assets/icons/angle-4.svg" )

								Calendar( 
									@select='selectFinish'
									:time='true'
									:class='finishTime ? null : "hide"',
									:dateStart='unixDateStart ? unixDateStart : null')
					hr

					.level
						.level-left
							.level-item
								span Спидометр:
						.level-right
							.level-item
								input(
									v-model='lastWb && lastWb.waybill !== null ? lastWb.waybill.mileageFinish : waybill.mileageStart'
									placeholder="Спидометр в начале смены")
								span.hint.is-danger(v-if='!lastWb || lastWb.waybill == null') Нет данных с предыдущей смены
								span.hint(v-else) (показание предыдущей смены)
					
					.level
						.level-left
							.level-item
								span Остаток при выдаче:
						.level-right
							.level-item
								input(
									v-model='lastWb && lastWb.waybill !== null ? lastWb.waybill.fuelFinish : waybill.fuelStart'
									placeholder="Топливо в начале смены")
								span.hint.is-danger(v-if='!lastWb || lastWb.waybill == null') Нет данных с предыдущей смены
								span.hint(v-else) (показание предыдущей смены)

				.tile
					Blank(
						:id='waybill.id'
						:dateOf='waybill.of'
						:model='waybill.car && waybill.car.model ? waybill.car.model : null'
						:registrationPlate='waybill.car && waybill.car.registrationPlate ? waybill.car.registrationPlate : null'
						:serial='waybill.serial'
						:driver='driver'
						:task='waybill.workText'
						:mileageLast='lastWb && lastWb.waybill !== null ? lastWb.waybill.mileageFinish : waybill.mileageStart'
						:fuelLast='lastWb && lastWb.waybill !== null ? lastWb.waybill.fuelFinish : waybill.fuelStart',
						:dateStart='waybill.startPlan'
						:dateFinish='waybill.finishPlan')
			hr
			.task
				span.title Задание водителю:
				input(
					placeholder="Задание",
					v-model='waybill.workText')

			.button.is-pulled-right(@click='openWb()') Просмотр

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
import Blank from '@/components/canvas/_wb-blank'
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

export default {
	name: 'CreateWaybill',
	components: {
		Calendar,
		Blank
	},
	data() {
		return {
			startTime: false,
			finishTime: false,
			ofTime: false,
			isLoading: false,
			registrationPlate: null,
			carSerial: null,
			driver: null,
			lastWb: null,
			mode: process.env.NODE_ENV
		}
	},
	computed: {
		...mapState('waybills', {
			waybill: state => state.newWaybill
		}),
		...mapGetters('waybills', {
			listDrivers: 	'getNewListDrivers',
			listCar: 			'getNewListCar'
		}),
		unixDateStart() {
			return this.waybill.startPlan ? new Date(this.waybill.start).getTime() : null
		},
		unixDateFinish() {
			return this.waybill.finishPlan ? new Date(this.waybill.finishPlan).getTime() : null
		},
		dateStringOf() {
			let date = new Date(this.waybill.of),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate()
					
			return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()}`
		},
		fuelStart() {
			return this.lastWb.fuelStart
		},
		mileageStart() {
			return this.lastWb.mileageStart
		},
		dateTimeStringStart() {
			let date = new Date(this.waybill.startPlan),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()},&nbsp;${hours}:${minutes}`
		},
		dateTimeStringFinish() {
			let date = new Date(this.waybill.finishPlan),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()},&nbsp;${hours}:${minutes}`
		},
		formData() {
			return {
				id: this.waybill.id ? this.waybill.id : null,
				of: this.waybill.of ? this.waybill.of : null,
				car: this.waybill.car ? this.waybill.car : null,
				serial: this.waybill.car.serial ? this.waybill.car.serial : null,
				workText: this.waybill.workText ? this.waybill.workText : null,
				driverId: this.waybill.driverId ? this.waybill.driverId : null,
				startPlan: this.waybill.startPlan ? this.waybill.startPlan : null,
				finishPlan: this.waybill.finishPlan ? this.waybill.finishPlan : null,
				mileageStart: this.waybill.mileageStart ? this.waybill.mileageStart : null,
				fuelStart: this.waybill.fuelStart ? this.waybill.fuelStart : null
			}
		}
	},
	methods: {
		async openWb() {
			for (var data in this.formData) {
				if (!this.formData[data]) {
					Snackbar.open({
						message: 'Заполните все поля!',
						type: 'is-danger'
					})
					return false
				}
			}
			let newWaybill = {
				waybill: this.formData
			}
			this.setNewWaybill(newWaybill)
			
		},
		...mapActions('waybills', {
			getNewWaybill: 'getNewWaybillData'
		}),
		...mapMutations('waybills', {
			setListDrivers: 'setListDrivers',
			setListCars: 'setListCars',
			setNewWaybill: 'setAllNewWaybillData'
		}),
		async filterDriver() {
			await api.getDrivers(this.driver)
				.then(r => {
					this.setListDrivers(r.data.listDrivers)
				})
		},
		async filterPlates() {
			await api.getPlates(this.registrationPlate)
				.then(r => this.setListCars(r.data.listCar))
		},
		async getLastWb() {
			await api.getLastWb({serial: this.waybill.serial})
				.then(r => this.lastWb = r.data)
		},
		selectStart(data) {
			this.waybill.startPlan = data.date.getTime()
		},
		selectFinish(data) {
			this.waybill.finishPlan = data.date.getTime()
		},
		selectOf(data) {
			this.waybill.of = data.date.getTime()
		},
		openOf() {
			this.ofTime = !this.ofTime
			this.startTime = false
			this.finishTime = false
		},
		openStart() {
			this.startTime = !this.startTime
			this.finishTime = false
			this.ofTime = false
		},
		openFinish() {
			this.finishTime = !this.finishTime
			this.startTime = false
			this.ofTime = false
		},
		close(e) {
			if(!e.target.matches('.date *') && !e.target.matches('span.date-of')) {
				if (this.startTime) {
					this.startTime = false
				}
				if (this.finishTime) {
					this.finishTime = false
				}
				if (this.ofTime) {
					this.ofTime = false
				}
			}
		},
		changeWidthId(target) {
			if (this.waybill.id) {
				let width = this.waybill.id.length * 12
				document.querySelector(target).style.width = `${width}px`
				// this.milleageFinish = this.milleageFinish.toLocaleString()
			} else {
				document.querySelector(target).style.width = `0px`
			}
		},
		setRegistrationPlate(obj) {
			this.registrationPlate = obj.registrationPlate
			this.waybill.serial = obj.serial
			this.waybill.car = obj
		},
		setDriver(obj) {
			this.driver = obj.name
			this.waybill.driverId = obj.id
		}
	},
	beforeMount() {
		if (!this.waybill) {
			this.isLoading = true
			this.getNewWaybill()
				.then(() => this.isLoading = false)
		}
		if (this.registrationPlate) {
			this.getLastWb()
		}
	}
}
</script>