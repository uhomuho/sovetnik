<template lang="pug">
	div#autograph_table(v-if='waybills')
		table.table.top
			thead
				tr
					th.car Машина
					th.fuel Расход ГСМ, л
						table
							tr
								td ост.нач
								td приход
								td расход
								td ост.кон
					th.distance Пройдено, км
						table
							tr
								td общий
								td рабочий
								td холостой
			tbody(v-if='waybills.length !== 0')
				tr(
						v-for='waybill in waybills')
					td.car.is-paddingless
						table
							tr
								td {{ waybill.model }}
								td {{ waybill.registrationPlate }}
					td.fuel.is-paddingless
						table
							tr
								td {{ waybill.firstFuel }}
								td {{ waybill.motionFuelUp }}
								td {{ waybill.motionFuelDown }}
								td {{ waybill.lastFuel }}
					td.distance.is-paddingless
						table
							tr
								td {{ waybill.totalDistance }}
								td {{ waybill.workDistance }}
								td {{ waybill.idingDistance }}
			tbody.no-data(v-else)
					tr
						td.car
							b-skeleton(:animated='false')
						td.fuel
							b-skeleton(:animated='false')
						td.distance
							b-skeleton(:animated='false')

		.content(v-if='waybills.length == 0')
			h4.has-text-centered Нет подходящих данных
		table.table.bottom(v-if='waybills.length !== 0')
			tr
				td.car
					table
						tr
							td 
							td Итого:
				td.fuel
					table
						tr
							td 
							td {{ total.motionFuelUp }} 
							td {{ total.motionFuelDown }}
							td 
				td.distance
					table
						tr
							td
							td
							td
				
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
	name: 'waybillsReportsTable',
	data() {
		return {
			filter: "ALL"
		}
	},
	props: ['waybills', 'carsList'],
	computed: {
		...mapGetters('reports', {
			total: 'getTotalData'
		})
	},
	methods: {
		...mapActions('reports', {
			autographReport: 'apiAutographReport'
		})
	},
	beforeMount() {
		this.autographReport()
	}
}
</script>