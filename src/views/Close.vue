<template lang="pug">
div#main(@click='close')
	.container#close
		.section
			.level
				.level-left
					.level-item
						h1
							|Закрываем
							br
							|путевой лист
			
				.level-right
					.level-item
						.level
							.level-left
								.level-item
									|№
									form(@submit.prevent='getWaybill(wbId).then(() => hint = false)')
										b-tooltip(
											:active='hint'
											label="Нажмите Enter"
											position="is-bottom"
											type="is-white"
											size="is-small"
											multilined
											always)
											input.id(
												v-model="wbId"
												placeholder="ID"
												type="number"
												@input='showHint'
												@keyup='changeWidthId')
							.level-right
								.level-item(v-if='closeWaybill')
									|от
									span {{ dateStringOf ? dateStringOf : "XX/XX/XXXX" }}
								
			hr

			.wrapper(v-if='closeWaybill')
				.level
					.level-left
						.level-item
							.level
								.level-left
									.level-item Гос. номер:
								.level-right
									.level-item
										input(
											v-model='waybill.car.registrationPlate'
											@input='getSerial(waybill.car.registrationPlate)')
										img.icon(
											src="@/assets/icons/angle-4.svg")
										
										.get-serial(
											v-if='results')
											.columns.is-multiline.is-flex
												.column.is-6(
													v-for='result in results')
													.item(
														@click='getWb(result.serial, result.registrationPlate)')
														| {{ result.registrationPlate }}

					.level-right
						.level-item
							.level
								.level-left
									.level-item Водитель:
								.level-right
									.level-item {{ waybill.driver.name }}
				hr

				table.table
					thead
						tr
							th &nbsp;
							th Спидометр
							th Дата/время/час
							th Горючее
					tbody
						tr
							td.title Выдано
							td
							td
							td 
								input(
									v-model='waybill.fuelVolume')
						tr
							td.title Выезд
							td
								input(
									v-model='waybill.mileageStart')
							td.date-start
								span(
									v-html='dateTimeStringStart'
									@click='toggleCalStart()')
								Calendar(
									v-if='waybill.startFact'
									:class='showCalStart ? "" : "is-hidden"'
									:range='false'
									:time='true'
									:date='new Date(waybill.startFact)'
									@select='setTimeStart')
							td 
								input(
									v-model='waybill.fuelStart')
						tr
							td.title Возвращение
							td 
								input.finish(
									type="number"
									@keyup='changeWidth'
									v-model='milleageFinish'
									placeholder='ЗАПОЛНИ!')
							td.date-finish 
								span(
									v-html='dateTimeStringFinish'
									@click='toggleCalEnd')
								Calendar(
									v-if='waybill.finishFact'
									:class='showCalEnd ? "" : "is-hidden"'
									:range='false'
									:time='true'
									:date='new Date(waybill.finishFact)'
									@select='setTimeFinish')
							td 
								input(
									v-model='waybill.fuelFinish')
						tr
							td.title Общий пробег/расход
							td 
								span {{ milleageFinish ? (milleageFinish - waybill.mileageStart > 0 ? (milleageFinish - waybill.mileageStart).toLocaleString() : null ) : null }}
							td
							td 
								span {{ totalFuel ? totalFuel : "" }}

				hr

				p.title Выполнение задания:
				p.subtitle Объект УДС
				.inputs-wrapper
					.input-wrapper(v-for='(value, key) in uts')
						input(v-model='uts[key]')
						img(
							src="@/assets/icons/delete.svg"
							@click='removeUts(key)'
							v-if='key > 0')
					img(
						src="@/assets/icons/add.svg"
						@click='addUts')

				.button.is-pulled-right(@click='closeWb') Закрыть

</template>

<script>
import monthName from '@/month'
import { mapGetters, mapActions } from 'vuex'
import Calendar from '@/components/calendar/_calendar.vue'
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

export default {
	name: 'CloseWaybill',
	data() {
		return {
			startTime: false,
			finishTime: false,
			isLoading: false,
			wbId: this.id,
			milleageFinish: null,
			uts: [''],
			showResults: true,
			results: null,
			showCalStart: false,
			showCalEnd: false,
			hint: false
		}
	},
	components: {
		Calendar
	},
	props: {
		id: {
			default: null
		}
	},
	computed: {
		...mapGetters('waybills', {
			closeWaybill: 'getCloseWaybill'
		}),
		waybill() {
			if (this.closeWaybill && this.closeWaybill.waybill) {
				return this.closeWaybill.waybill
			}
			return null
		},
		totalFuel() {
			return parseInt(this.waybill.fuelStart) + parseInt(this.waybill.fuelVolume) - parseInt(this.waybill.fuelFinish)
		},
		dateStringOf() {
			if (this.waybill) {
				let date = new Date(this.waybill.of),
						day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate()
						
				return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()}`
			} else {
				return null
			}
		},
		dateTimeStringStart() {
			let date = new Date(this.waybill.startFact),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()},&nbsp;${hours}:${minutes}`
		},
		dateTimeStringFinish() {
			let date = new Date(this.waybill.finishFact),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()},&nbsp;${hours}:${minutes}`
		}
	},
	methods: {
		showHint() {
			this.hint = false
			setTimeout(() => {
				this.hint = true
			}, 5000)
		},
		...mapActions('waybills', {
			getWaybill: 'apiCloseWaybill',
			getWbBySerial: 'apiLastOpenWb' 
		}),
		setTimeStart(date){
			this.waybill.startFact = date.date
		},
		setTimeFinish(date){
			this.waybill.finishFact = date.date
		},
		toggleCalStart() {
			this.showCalStart = !this.showCalStart
		},
		toggleCalEnd() {
			this.showCalEnd = !this.showCalEnd
		},
		getSerial(key) {
			if (key.length !== 0) {
				api.getPlates(key)
					.then(r => {
						if (r.data.listCar.length == 0) {
							this.results = false
						} else {
							this.results = r.data.listCar
						}
					})
			} else {
				this.results = false
			}
		},
		getWb(serial, registrationPlate) {
			this.getWbBySerial(serial)
				.then(() => this.results = null)
			this.waybill.car.registrationPlate = registrationPlate
		},
		closeWb() {
			let formData = {}
			formData.id = this.wbId || this.waybill.id
			formData.of = this.waybill.of
			formData.fuelVolume = this.waybill.fuelVolume
			formData.mileageStart = this.waybill.mileageStart
			formData.mileageFinish = this.milleageFinish
			formData.mileageTotal = this.milleageFinish - this.waybill.mileageStart
			formData.fuelTotal = this.totalFuel
			formData.startFact = this.waybill.startFact
			formData.finishFact = this.waybill.finishFact
			formData.status = "CLOSE"
			formData.workText = this.uts

			if (formData.mileageTotal < 0) {
				return Snackbar.open({
					message: 'Разница спидометра старт/финиш должна быть положительной!'
				})
			}

			for (var data in formData) {
				if (!formData[data]) {
					return Snackbar.open({
						message: 'Заполните все поля!'
					})
				}
			}
			for (var task in formData.workText) {
				if (!formData.workText[task]) {
					return Snackbar.open({
						message: 'Заполните все поля!'
					})
				}
			}

			this.waybill.mileageTotal = formData.mileageTotal

			api.closeWaybill(this.waybill)
				.then(() => {
					Snackbar.open({
						message: 'Путевой лист успешно закрыт!'
					})
					this.$router.push('/waybills')
				})
				.catch(err => console.error(err))
		},
		addUts() {
			this.uts.push('')
		},
		removeUts(key) {
			this.uts.splice(key, 1)
		},
		changeWidth() {
			if (this.milleageFinish) {
				let width = this.milleageFinish.length * 12
				document.querySelector('.finish').style.width = `${width}px`
				this.milleageFinish = this.milleageFinish.toLocaleString()
			} else {
				document.querySelector('.finish').style.width = `0px`
			}
		},
		changeWidthId() {
			if (this.wbId) {
				if (this.wbId.length <= 5) {
					let width = this.wbId.length * 30
					document.querySelector(".id").style.width = `${width}px`
				}
				// this.milleageFinish = this.milleageFinish.toLocaleString()
			} else {
				document.querySelector(".id").style.width = `0px`
			}
		},
		close(e) {
			if(!e.target.matches('.dropdown *')) {
				this.openedDropdown = false
			}
			if(!e.target.matches('.date-start *')) {
				this.showCalStart = false
			}
			if(!e.target.matches('.date-finish *')) {
				this.showCalEnd = false
			}
		}
	},
	beforeMount() {
		if (this.id) {
			this.isLoading = true
			this.getWaybill(this.id)
				.then(() => this.isLoading = false)
		}
		if (this.waybill && this.waybill.id) {
			this.wbId = this.waybill.id
		}
	}
}
</script>