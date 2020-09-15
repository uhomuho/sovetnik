<template lang="pug">
div#main
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
									input(
										v-model="wbId"
										placeholder="ID"
										@input='getWaybill(wbId)'
										type="number")
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
									.level-item {{ waybill.car.registrationPlate }}

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
								span {{ waybill.fuelVolume.toLocaleString() }}
						tr
							td.title Выезд
							td 
								span {{ waybill.mileageStart.toLocaleString() }}
							td 
								span(v-html='dateTimeStringStart')
								Calendar(
									:range='false'
									:time='true'
									@select='setTimeStart')
							td 
								span {{ waybill.fuelStart }}
						tr
							td.title Возвращение
							td 
								input.finish(
									type="number"
									@keyup='changeWidth'
									v-model='milleageFinish'
									placeholder='ЗАПОЛНИ!')
							td 
								span(v-html='dateTimeStringFinish')
							td 
								span {{ waybill.fuelFinish }}	
						tr
							td.title Общий пробег/расход
							td 
								span {{ milleageFinish ? (milleageFinish - waybill.mileageStart > 0 ? (milleageFinish - waybill.mileageStart).toLocaleString() : null ) : null }}
							td
							td 
								span {{ totalFuel }}

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

export default {
	name: 'CloseWaybill',
	data() {
		return {
			startTime: false,
			finishTime: false,
			isLoading: false,
			wbId: this.id,
			milleageFinish: null,
			uts: ['']
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
			// console.log(this.closeWaybill.waybill)
			return this.closeWaybill.waybill
		},
		totalFuel() {
			return parseInt(this.waybill.fuelStart) + parseInt(this.waybill.fuelVolume) - parseInt(this.waybill.fuelFinish)
		},
		dateStringOf() {
			if (this.waybill) {
				let date = new Date(this.waybill.of),
						day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate()
						
				return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()}`
			} else {
				return null
			}
		},
		dateTimeStringStart() {
			let date = new Date(this.waybill.startFact),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()},&nbsp;${hours}:${minutes}`
		},
		dateTimeStringFinish() {
			let date = new Date(this.waybill.finishFact),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()},&nbsp;${hours}:${minutes}`
		}
	},
	methods: {
		...mapActions('waybills', {
			getWaybill: 'apiCloseWaybill'
		}),
		setTimeStart(date){
			console.log(date)
		},
		closeWb() {
			let formData = {}
			formData.id = this.wbId
			formData.of = this.waybill.of
			formData.fuelVolume = this.waybill.fuelVolume
			formData.mileageStart = this.waybill.mileageStart
			formData.mileageFinish = this.milleageFinish
			formData.mileageTotal = this.milleageFinish ? (this.milleageFinish - this.waybill.mileageStart > 0 ? (this.milleageFinish - this.waybill.mileageStart) : null ) : null
			formData.fuelTotal = this.totalFuel
			formData.status = "CLOSE"
			formData.workText = this.uts

			api.closeWaybill(formData)
				.then(r => console.log(r))
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
		}
	},
	beforeMount() {
		if (this.id) {
			this.isLoading = true
			this.getWaybill(this.id)
				.then(() => this.isLoading = false)
		}
	}
}
</script>