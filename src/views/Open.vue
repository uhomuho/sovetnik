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
										type="number"
										@input='changeWidthId')
							.level-right
								.level-item
									|от
									span.date-of(@click='openOf') {{ dateStringOf }}
									Calendar.cal-of( 
										@select='selectOf'
										@change='changeOf'
										:class='ofTime ? null : "hide"'
										:date='new Date(waybill.of)')
			hr
			.tile.is-ancestor.is-marginless
				.tile
					.level
						.level-left
							.level-item
								|Гос. номер:
						.level-right
							.level-item.plate(
								:class='plates ? "is-active" : ""')
									input#registrationPlate(
										v-if='waybill'
										@keyup='filterPlates'
										placeholder="Гос. номер"
										:disabled="waybill.car && waybill.car.registrationPlate")
									.tag(
										v-if='waybill.car && waybill.car.registrationPlate'
										@click='setRegistrationPlate({serial: null, registrationPlate: null})') 
										|{{ waybill.car ? waybill.car.registrationPlate : "" }}
										img.delete( src="@/assets/icons/delete.svg" )
									img.icon( src="@/assets/icons/angle-4.svg" )
									.plates.dropdown(v-if='plates')
										p(
											v-for='plate in plates'
											@click='setCar(plate), getLastWb(plate.serial), plates = null'
											:class='plate.registrationPlate == waybill.car.registrationPlate ? "selected" : ""')
											| {{ plate.registrationPlate }}

					.level
						.level-left
							.level-item
								|Водитель:
						.level-right
							.level-item
								input.driver#driver(
									v-if='waybill'
									@keyup="filterDriver"
									placeholder="Водитель"
									:disabled="waybill.driver && waybill.driver.name")
								.tag(
									v-if='waybill.driver && waybill.driver.name'
									@click='setDriver(null)') 
									|{{ waybill.driver.name }}
									img.delete( src="@/assets/icons/delete.svg" )
								img.icon( src="@/assets/icons/angle-4.svg")

								.drivers.dropdown(
									v-if='drivers')
									p(
										v-for='driver in drivers'
										@click='setDriver(driver), drivers = null'
										:class='waybill.driver && driver.id == waybill.driver.id ? "selected" : ""')
										|{{ driver.name }}
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
									@change='changeStart'
									@select='selectStart'
									:date='waybill.startPlan ? new Date(waybill.startPlan) : timeForDatepicker'
									:time='true'
									:class='startTime ? null : "hide"',
									:dateFinish='unixDateFinish ? unixDateFinish : null'
									:open='true')
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
									@change='changeFinish'
									@select='selectFinish'
									:date='waybill.finishPlan ? new Date(waybill.finishPlan) : timeForDatepicker'
									:time='true'
									:class='finishTime ? null : "hide"',
									:dateStart='unixDateStart ? unixDateStart : null'
									:open='true')
					hr

					.level
						.level-left
							.level-item
								span Спидометр:
						.level-right
							.level-item
								input(
									v-model='waybill.mileageStart'
									placeholder="Спидометр в начале смены")
								span.hint.is-danger(v-if='!lastWb') Нет данных с предыдущей смены
								span.hint(v-else) (показание предыдущей смены)
					
					.level
						.level-left
							.level-item
								span Остаток при выдаче:
						.level-right
							.level-item
								input(
									v-model='waybill.fuelStart'
									placeholder="Топливо в начале смены")
								span.hint.is-danger(v-if='!lastWb') Нет данных с предыдущей смены
								span.hint(v-else) (показание предыдущей смены)

				.tile
					Blank(
						:id='waybill.id'
						:dateOf='waybill.of'
						:model='waybill.car && waybill.car.model ? waybill.car.model : null'
						:registrationPlate='waybill.car && waybill.car.registrationPlate ? waybill.car.registrationPlate : null'
						:serial='waybill.serial'
						:driver='waybill.driver ? waybill.driver.name : null'
						:task='waybill.workText'
						:mileageLast='waybill.mileageStart'
						:fuelLast='waybill.fuelStart',
						:dateStart='waybill.startPlan'
						:dateFinish='waybill.finishPlan')
			hr
			.task
				span.title Задание водителю:
				input(
					placeholder="Задание",
					v-model='waybill.workText')

			.button.is-pulled-right(
				@click.prevent='openWb()') Просмотр

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
import { mapGetters, mapActions, mapMutations } from 'vuex'
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
			mode: process.env.NODE_ENV,
			plates: null,
			drivers: null
		}
	},
	watch: {
		waybill() {
			if (this.waybill && !this.waybill.driver) {
				this.waybill.driver = {
					name: null
				}
			}
			if (this.waybill && !this.waybill.car) {
				this.waybill.car = {
					registrationPlate: null,
					model: null
				}
			}
			if (this.lastWb) {
				this.waybill.mileageStart = this.lastWb.mileageFinish
				this.waybill.fuelStart = this.lastWb.fuelFinish
			}
		}
	},
	computed: {
		// ...mapState('waybills', {
		// 	waybill: state => state.newWaybill
		// }),
		...mapGetters('waybills', {
			listDrivers: 	'getNewListDrivers',
			listCar: 			'getNewListCar',
			waybill: 			'getNewWaybill'
		}),
		timeForDatepicker() {
			return new Date(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} 05:00`)
		},
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
			this.error = false
			let driver = this.waybill.driver ? this.waybill.driver.name : false
			if (!this.waybill.id || !this.waybill.of || !this.waybill.car.registrationPlate || !driver || !this.waybill.fuelStart || !this.waybill.mileageStart || !this.waybill.workText || !this.waybill.startPlan || !this.waybill.finishPlan) {
				return Snackbar.open({
					message: 'Не все поля заполнены или заполнены неверно!'
				})
			}

			this.setNewWaybill({waybill: this.waybill})
			this.$router.push({name: "PreviewWaybill"})
		},
		...mapActions('waybills', {
			getNewWaybill: 'getNewWaybillData'
		}),
		...mapMutations('waybills', {
			setListDrivers: 'setListDrivers',
			setListCars: 'setListCars',
			setNewWaybill: 'setAllNewWaybillData',
			setPlate: 'setNewWbRegistrationPlate',
			setDriverName: 'setNewWbDriverName',
			setCar: 'setNewWbCar'
		}),
		async filterDriver(e) {
			await api.getDrivers(e.target.value)
				.then(r => this.drivers = r.data)
		},
		async filterPlates(e) {
			await api.getPlates(e.target.value)
				.then(r => this.plates = r.data)
		},
		async getLastWb(serial) {
			document.querySelector('#registrationPlate').value = ""
			await api.getLastWb({serial: serial})
				.then(r => {
					this.lastWb = r.data
					localStorage.lastWb = JSON.stringify(r.data)
					if (this.lastWb) {
						this.waybill.mileageStart = this.lastWb.mileageFinish
						this.waybill.fuelStart = this.lastWb.fuelFinish
					}
				})
		},
		selectStart(data) {
			this.waybill.startPlan = data.date.getTime()
			let startDate = new Date(this.waybill.startPlan).getDate(),
					startMonth = new Date(this.waybill.startPlan).getMonth(),
					startYear = new Date(this.waybill.startPlan).getFullYear(),
					startHours = new Date(this.waybill.startPlan).getHours()
			switch (startHours) {
				case 5:
					this.waybill.finishPlan = new Date(`${startYear}-${startMonth + 1}-${startDate} 13:00`).getTime()
					break
				case 8:
					this.waybill.finishPlan = new Date(`${startYear}-${startMonth + 1}-${startDate} 17:00`).getTime()
					break
				case 7:
					this.waybill.finishPlan = new Date(`${startYear}-${startMonth + 1}-${startDate} 17:00`).getTime()
					break
				case 20:
					this.waybill.finishPlan = new Date(`${startYear}-${startMonth + 1}-${startDate+1} 05:00`).getTime()
					break
				case 22:
					this.waybill.finishPlan = new Date(`${startYear}-${startMonth + 1}-${startDate+1} 07:00`).getTime()
					break
			}
			this.startTime = false
		},
		selectFinish(data) {
			this.waybill.finishPlan = data.date.getTime()
			this.finishTime = false
		},
		changeStart(data) {
			this.waybill.startPlan = data.date.getTime()
		},
		changeFinish(data) {
			this.waybill.finishPlan = data.date.getTime()
		},
		selectOf(data) {
			this.waybill.of = data.date.getTime()
			this.ofTime = false
		},
		changeOf(data) {
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
			if(!e.target.matches('.date *') && !e.target.matches('span.date-of') && !e.target.matches('.calendar *')) {
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
		changeWidthId() {
			if (this.waybill.id) {
				// if (`${this.waybill.id}`.length <= 5) {
				// 	let width = `${this.waybill.id}`.length * 31
				// 	document.querySelector(".id").style.width = `${width}px`
				// }
			} else {
				// document.querySelector(".id").style.width = `0px`
			}
		},
		setRegistrationPlate(obj) {
			this.registrationPlate = obj.registrationPlate
			this.waybill.serial = obj.serial
			this.waybill.car = obj
		},
		setDriver(obj) {
			document.querySelector('#driver').value = ""
			if (obj) {
				this.driver = obj.name
				this.waybill.driver = obj
				this.waybill.driverID = obj.id
			} else {
				this.waybill.driver = null
				this.waybill.driverID = null
			}
		}
	},
	beforeMount() {
		if (!this.waybill) {
			this.isLoading = true
			this.getNewWaybill()
				.then(() => this.isLoading = false)
		}
		if (this.registrationPlate) {
			this.getLastWb(this.waybill.serial)
		}
	},
	mounted() {
		if (localStorage.lastWb && localStorage.lastWb !== null && localStorage.lastWb !== 'null') {
			this.lastWb = JSON.parse(localStorage.lastWb)
		}
		if (this.waybill && !this.waybill.driver) {
			this.waybill.driver = {}
			this.waybill.driver.name = null
		}
		if (this.waybill) {
			this.waybill.of = new Date().getTime()
		}
		if (this.waybill && !this.waybill.car) {
			this.waybill.car = {
				registrationPlate: null,
				model: null
			}
		}
	}
}
</script>