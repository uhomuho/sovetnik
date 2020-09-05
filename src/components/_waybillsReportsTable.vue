<template lang="pug">
	div#reports_table
			table.table
				thead
					tr
						th.id №
						th.car 
							b-dropdown
								.wrapper(
									slot="trigger"
									role="button")
									p Машины
									img.icon( src="@/assets/icons/angle.svg" )
								
								b-dropdown-item(
									aria-role="list-item"
									@click='setCar("ALL")'
									:class='filter.car == "ALL" ? "is-active" : null')
									|Все
								b-dropdown-item(
									aria-role="list-item"
									v-for="car in carsList"
									@click='setCar(car)'
									:class='car == filter.car ? "is-active" : null')
									|{{ car }}
						th.fuel Расход ГСМ, л
							table
								tr
									td по путевому листу
									td по автографу
						th.mileage Пройдено, км
							table
								tr
									td по путевому листу
									td по автографу
						th.status 
							b-dropdown
								.wrapper(
									slot="trigger"
									role="button")
									p Статус
									img.icon( src="@/assets/icons/angle.svg" )
								
								b-dropdown-item(
									aria-role="list-item"
									v-for="status in statusList"
									@click='setStatus(status.name)'
									:class='status.name == filter.status ? "is-active" : null')
									|{{ status.text }}
				tbody
					tr(
						v-for='waybill in waybills'
						:class='waybill.status.class')
						td.id(
							:class="waybill.status.class") {{ waybill.id }}
						td.car
							table
								tr
									td {{ waybill.car.name }}
									td {{ waybill.car.registrationPlate }}
						td.fuel
							table
								tr
									td {{ waybill.fuelWaybill }}
									td {{ waybill.fuelAutograph }}
						td.mileage
							table
								tr
									td {{ waybill.mileageWaybill }}
									td {{ waybill.mileageAutograph }}
						td.status(
							:class="waybill.status.class") {{ waybill.status.text }}
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'waybillsReportsTable',
	data() {
		return {
			filter: {
				status: "CLOSE",
				car: "ALL"
			},
			statusFilter: "CLOSE",
			carFilter: "ALL",
			statusList: [
				{
					name: "ALL",
					text: "Все"
				},
				{
					name: "CLOSE",
					text: "Закрыт"
				},
				{
					name: "OPEN",
					text: "Открыт"
				},
				{
					name: "CHECK",
					text: "Проверка"
				}
			]
		}
	},
	props: ['waybills', 'carsList'],
	computed: {
	},
	methods: {
		...mapActions('reports', {
			filterByStatus: 'filterByStatus',
			filterByCar: 'filterByCar'
		}),
		setStatus(val) {
			this.filter.status = val
			this.filterByStatus(this.filter)
		},
		setCar(val) {
			this.filter.car = val
			this.filterByCar(this.filter)
		}
	},
	beforeMount() {
		this.filterByStatus(this.filter)
	}
}
</script>