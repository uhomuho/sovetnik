<template lang="pug">
	.wrapper#reports_table
		.container(v-if='!waybills.false')
			.table-container
				table.table.is-fullwidth(v-if='')
					thead
						tr
							th Машина
							th Расход ГСМ
							th Пробег

					tbody
						tr(v-for='waybill in waybills[currentPage]')
							td.car {{ waybill.model }}
							td.gsm
								table.table.is-fullwidth
									tr
										td {{ waybill.motionFuelUp ? waybill.motionFuelUp :	'&nbsp;' }}
										td {{ waybill.motienFuelDown ? waybill.motienFuelDown : '&nbsp;' }}
										td {{ waybill.tankFuelUp ? waybill.tankFuelUp : '&nbsp;' }}
										td {{ waybill.tankFuelDown ? waybill.tankFuelDown : '&nbsp;' }}
							td.mileage
								table.table.is-fullwidth
									tr
										td {{ waybill.totalDistance ? waybill.totalDistance : '&nbsp;' }}
										td {{ waybill.workDistance ? waybill.workDistance : '&nbsp;' }}
										td(:class='noWorkDistance(waybill.totalDistance, waybill.workDistance) < 0 ? "has-text-warning" : null') {{ noWorkDistance(waybill.totalDistance, waybill.workDistance) }} 					

			b-pagination(
				:total='paginationData.total'
				per-page='4'
				:simple='true'
				v-model='currentPage')

		.container(v-else)
			.content
				span.subtitle.has-text-warning Ничего не найдено

</template>

<script>

export default {
	name: 'Table',
	data() {
		return {
			currentPage: 1
		}
	},
	props: ['waybills', 'paginationData', 'isLoading'],
	computed: {
		isEmpty() {
			return this.waybills == {} ? true : false
		}
	},
	methods: {
		noWorkDistance(totalDistance, workDistance) {
			return (totalDistance - workDistance).toFixed(2)
		}
	}
}

</script>
