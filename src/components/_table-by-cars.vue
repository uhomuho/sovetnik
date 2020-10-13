<template lang="pug">
table.table.is-fullwidth
	thead
		tr
			th.date Дата	
			th.wb Путевой лист
			th.fs Нач. ост.
			th.inc Приход
			th.out Расход
			th.fe Кон. ост.
			th.mls
				|Спидометр
				br
				|начало
			th.mlend
				|Спидометр
				br
				|конец	
	tbody
		tr(v-for='waybill in waybills')
			td.date {{ new Date(waybill.of).getDate() }}
			td.wb {{ waybill.id }}
			td.fs {{ waybill.fuelStart }}
			td.inc {{ waybill.trackFuelUp }}
			td.out {{ waybill.trackFuelDown }}
			td.fe {{ waybill.fuelFinish }}
			td.mls {{ waybill.mileageStart }}
			td.mlend {{ waybill.mileageFinish }}
	tfoot
		tr
			th.date
			th.wb
			th.fs Итого:
			th.inc {{ totalTrack.fuelUp }}
			th.out {{ totalTrack.fuelDown }}
			th.fe
			th.mls
			th.mlend
</template>

<script>
export default {
	name: "TableByCars",
	props: ['waybills'],
	computed: {
		totalTrack() {
			let total = {
				fuelUp: 0,
				fuelDown: 0
			}
			for(let waybill of this.waybills) {
				if (waybill.trackFuelUp && waybill.trackFuelUp !== 'null') total.fuelUp += parseFloat(waybill.trackFuelUp.replace(",", "."))
				if (waybill.trackFuelDown && waybill.trackFuelDown !== 'null') total.fuelDown += parseFloat(waybill.trackFuelDown.replace(",", "."))
			}
			return total
		}
	}
}
</script>

<style lang="sass" scoped>
table
	thead
		background: $grey2
		th
			font-size: .875rem
			font-weight: normal
			line-height: .875rem
			text-align: center!important
			vertical-align: middle
			color: $graphite4
			border: unset
	tbody
		tr
			box-shadow: 0px 1px 0px #EEEEEE
			td
				font-size: .75rem
				text-align: center
				color: $graphite4
				border: unset
	tfoot
		tr
			th
				font-size: .75rem
				font-weight: normal
				text-align: center!important
				color: $graphite4
				border: unset
				&.fs
					border-top: 1px solid $graphite4
				&.inc
					border-top: 1px solid $graphite4
				&.out
					border-top: 1px solid $graphite4
	.date
		width: 8%
	.wb
		width: 21%
		text-align: left!important
	.fs
		width: 10%
	.inc
		width: 10%
	.out
		width: 10%
	.fe
		width: 10%
	.mls
		width: 15.5%
	.mlend
		width: 15.5%
</style>