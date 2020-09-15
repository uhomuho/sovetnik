<template lang="pug">
	div#reports_table(@click='close')
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
									:key='car'
									@click='setCar(car)'
									:class='car == filter.car ? "is-active" : null')
									|{{ car }}
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
												@input='choose')
											label.checkbox(:for='status.id')
												|{{ status.text }}
				tbody(v-if='waybills.length !== 0')
					tr(
						v-for='waybill in waybills'
						:class='waybill.status.class')
						td.id(
							:class="waybill.status.class") {{ waybill.id }}
						td.car.is-paddingless
							table
								tr
									td {{ waybill.car.name }}
									td {{ waybill.car.registrationPlate }}
						td.fuel.is-paddingless
							table
								tr
									td {{ waybill.fuelWaybill }}
									td {{ waybill.fuelAutograph }}
						td.mileage.is-paddingless
							table
								tr
									td {{ waybill.mileageWaybill }}
									td {{ waybill.mileageAutograph }}
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
			.content(v-if='waybills.length == 0')
				h4.has-text-centered Нет подходящих данных
</template>

<script>
import { mapActions } from 'vuex'

export default {
	name: 'waybillsReportsTable',
	data() {
		return {
			openedDropdown: false,
			filter: {
				status: ["CLOSE"],
				car: "ALL"
			},
			statusFilter: "CLOSE",
			carFilter: "ALL",
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
	props: ['waybills', 'carsList'],
	computed: {
	},
	methods: {
		...mapActions('reports', {
			filterReports: 'filterReports'
		}),
		choose() {
			setTimeout(()=>{
				this.filterReports(this.filter)
			}, 50)
		},
		setCar(val) {
			this.filter.car = val
			this.filterReports(this.filter)
		},
		openDropdown(e) {
			if (!e.target.matches('.menu *')) {
				this.openedDropdown = !this.openedDropdown
			}
		},
		close(e) {
			if(!e.target.matches('.dropdown *')) {
				this.openedDropdown = false
			}
		},
	},
	beforeMount() {
		this.filterReports(this.filter)
	}
}
</script>