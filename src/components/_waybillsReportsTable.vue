<template lang="pug">
	div#reports_table(
		@click='close')
			table.table(v-if='waybills !== null' && waybills && waybills !== "null")
				thead
					tr
						th.id №
						th.car 
							.dropdown(
								@click='toggleCarDropdown'
								:class='openedCarDropdown ? "is-active" : null')
								p Машина
								img.icon( src="@/assets/icons/angle.svg" )

								.menu(v-if='openedCarDropdown && carFilter')
									.tile.is-ancestor
										.tile.is-parent
											.tile.is-child
												.title Тип ТС
												.field(v-for='(car, key) in carFilter')
													.choose(
														@mouseover='setCar(key)'
														:class='key == choosenCar ? "selected" : null')
														|{{ key }}
												.field
													.choose(
														@click='setCar(null)'
														:class='choosenCar == null ? "selected" : null')
														|Все
											.tile.is-child.is-8
												.title Гос. номер
												.columns.is-flex.is-multiline
													.column.is-4(
															v-if='choosenCar'
															v-for='car in carFilter[choosenCar]')
														.column-container.num(
															@click='setSerial(car.serial)'
															:class='filter.serial == car.serial ? "selected" : null')
															|{{car.registrationPlate}}
						th.fuel.is-paddingless Расход ГСМ, л
							table
								tr
									td по путевому листу
									td по автографу
						th.mileage.is-paddingless Пройдено, км
							table
								tr
									td по путевому листу
									td по автографу
						th.status 
							.dropdown(
								@click='openDropdown'
								:class='openedDropdown ? "is-active" : null')
								p Статус
								img.icon( src="@/assets/icons/angle.svg" )

								.menu(v-if='openedDropdown')
									.field(v-for='status in statusList')
										.control
											input(
												type="checkbox"
												:id='status.id'
												:value='status.name'
												v-model='filter.status',
												@input='setStatus')
											label.checkbox(:for='status.id')
												|{{ status.text }}
												img(:src='`/icons/check.svg`')
				tbody(
					v-if='waybills && waybills.length !== 0')
					tr(
						v-for='waybill in waybills'
						:class='waybill.status.class'
						@click='waybill.status.name == "CLOSE" ? to(waybill.id) : null')
						td.id(
							:class="waybill.status.class") {{ waybill.id }}
						td.car.is-paddingless
							table
								tr
									td {{ waybill.car.model }}
									td {{ waybill.car.registrationPlate }}
						td.fuel.is-paddingless
							table
								tr
									td {{ waybillFuelDown(waybill) ? waybillFuelDown(waybill) : "&nbsp;" }}
									td {{ waybill.trackFuelDown ? waybill.trackFuelDown : "&nbsp;" }}
						td.mileage.is-paddingless
							table
								tr
									td {{ waybill.mileageTotal }}
									td {{ waybill.trackMileage }}
						td.status(
							:class="waybill.status.class") {{ waybill.status.text }}

				tbody.no-data(v-else)
					tr
						td.id 
							b-skeleton(:animated='false')
						td.car
							b-skeleton(:animated='false')
						td.fuel
							b-skeleton(:animated='false')
						td.mileage
							b-skeleton(:animated='false')
						td.status
							b-skeleton(:animated='false')
			.content(v-if='!waybills && waybills == null')
				h4.has-text-centered Нет подходящих данных
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {
	name: 'waybillsReportsTable',
	data() {
		return {
			mode: process.env.NODE_ENV,
			openedDropdown: false,
			openedCarDropdown: false,
			choosenCar: null,
			filter: {
				status: ["CLOSE"],
				serial: null
			},
			statusFilter: "CLOSE",
			statusList: [
				{
					name: "CLOSE",
					text: "Закрыт",
					id: 	"close"
				},
				{
					name: "OPEN",
					text: "Открыт",
					id: 	"open"
				},
				{
					name: "CHECK",
					text: "Проверка",
					id: 	"check"
				}
			]
		}
	},
	props: ['waybills'],
	computed: {
		...mapGetters('waybills',{
			carFilter: 'getCarsFilter'
		})
	},
	methods: {
		...mapMutations('waybills', [
			'setCarFilter'
		]),
		...mapActions('waybills', {
			getWaybills: 'getWaybills',
			apiCarsFilter: 'apiCarsFilter'
		}),
		to(id) {
			this.$router.push(`/reports/waybill/${id}`)
		},
		waybillFuelDown(waybill) {
			return parseInt(waybill.fuelStart) + parseInt(waybill.fuelVolume) - parseInt(waybill.fuelFinish)
		},
		setCar(name) {
			this.filter.serial = name
			this.choosenCar = name
			if (name == null) {
				setTimeout(() => {
					this.getWaybills(this.filter)
						.then(() => {
							this.openedCarDropdown = false
						})
				})
			}
		},
		setStatus() {
			setTimeout(() => {
				this.getWaybills(this.filter)
			})
		},
		setSerial(serial) {
			this.filter.serial = serial
			setTimeout(() => {
				this.getWaybills(this.filter)
			})
			this.openedCarDropdown = false
		},
		openDropdown(e) {
			if (!e.target.matches('.menu *')) {
				this.openedDropdown = !this.openedDropdown
			}
		},
		close(e) {
			if(!e.target.matches('.dropdown *')) {
				this.openedDropdown = false
				this.openedCarDropdown = false
			}
		},
		toggleCarDropdown(e) {
			if (!e.target.matches('.menu *')) {
				this.openedCarDropdown = !this.openedCarDropdown
			}
		},
	},
	beforeMount() {
		this.apiCarsFilter()
		this.getWaybills(this.filter)
	}
}
</script>