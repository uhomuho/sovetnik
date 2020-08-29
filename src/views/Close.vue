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
			
				.level-right(v-if='!isIntegerId && waybill')
					.level-item
						.level
							.level-left
								.level-item
									|№
									span {{ id }}
							.level-right
								.level-item
									|от
									span {{ dateStringOf }}
			hr

			.wrapper(v-if='!isIntegerId && waybill')
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
								span {{ waybill.fuelStart.toLocaleString() }}
						tr
							td.title Выезд
							td 
								span {{ waybill.mileageStart.toLocaleString() }}
							td 
								span {{ getTimeStringStart }}
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
								span {{ waybill.finish }}
							td 
								span {{ getTimeStringFinish }}	
						tr
							td.title Общий пробег/расход
							td 
								span {{ milleageFinish ? (milleageFinish - waybill.mileageStart > 0 ? (milleageFinish - waybill.mileageStart).toLocaleString() : null ) : null }}
							td
							td 
								span {{ waybill.fuelFinish }}

				hr

			.container(v-else)
				span Выберите путевой лист для закрытия
				b-dropdown(
					aria-role="list"
					:scrollable='true'
					max-height='400')
					.wrapper.button( slot="trigger" )
						span Путевые листы
						img( src="@/assets/icons/angle.svg" )

					b-dropdown-item(
						v-for='waybill in waybills'
						aria-role="menu-item"
						@click="to(waybill.id)")
						|{{ waybill.id }}
			b-loading(
				v-if="isLoading"
				:is-full-page="true"
				v-model="isLoading")
</template>

<script>
import monthName from '@/month'
import { mapGetters, mapActions } from 'vuex'
// import api from '@/api/apiActions'
// import { SnackbarProgrammatic as Snackbar } from 'buefy'

export default {
	name: 'CreateWaybill',
	data() {
		return {
			startTime: false,
			finishTime: false,
			isLoading: false,
			waybillData: {
				id: 36,
				of: 1598608006254,
				start: null,
				finish: null,
				milleageStart: 0,
				milleageFinish: 0
			},
			listDrivers: [
				{
					id: 1,
					name: " Иванов И.И."
				},
				{
					id: 2,
					name: "Садыков А.Р."
				}
			],
			listCar: [],
			registrationPlate: null,
			driver: null,
			milleageFinish: null
		}
	},
	props: ['id'],
	computed: {
		...mapGetters('waybills', [
			'waybills'
		]),
		isIntegerId() {
			return this.id == 'main'
		},
		waybill() {
			if (this.waybills) {
				let waybill = this.waybills.filter(item => item.id == this.id) 
				return waybill[0]
			}
			return null
		},
		dateStringOf() {
			let date = new Date(this.waybill.of),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate()
					
			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()}`
		},
		dateTimeStringStart() {
			let date = new Date(this.waybill.start),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()},&nbsp;${hours}:${minutes}`
		},
		dateTimeStringFinish() {
			let date = new Date(this.waybill.finish),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]}/${date.getFullYear()},&nbsp;${hours}:${minutes}`
		}
	},
	methods: {
		...mapActions('waybills', [
			'getWaybills',
			'waybillsSort'
		]),
		changeWidth() {
			if (this.milleageFinish) {
				let width = this.milleageFinish.length * 12
				document.querySelector('.finish').style.width = `${width}px`
				this.milleageFinish = this.milleageFinish.toLocaleString()
			} else {
				document.querySelector('.finish').style.width = `0px`
			}
			// this.milleageFinish = this.milleageFinish.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ')
			// console.log(this.milleageFinish)
		},
		to(id) {
			this.$router.push(`/waybills/close/${id}`)
		}
	},
	beforeMount() {
		if (!this.waybills) {
			this.isLoading = true
			this.getWaybills()
				.then(() => {
					this.waybillsSort()
					this.isLoading = false
				})
		}
	},
	mounted() {
		let path = this.$router.history.current.path
		if (!this.waybills && path !== '/waybills/close') this.to('')
	}
}
</script>