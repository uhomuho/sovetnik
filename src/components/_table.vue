<template lang="pug">
	.wrapper#reports_table
		.container(v-if='waybills[0]')
			.table-container
				table.table.is-fullwidth
					thead
						tr
							th.id №
							th.car 
								b-dropdown( aria-role="list" )
									.wrapper(slot="trigger")
										span Машина
										img.icon( src="@/assets/icons/angle.svg" )
									b-dropdown-item(
										aria-role="lsititem"
										:class='carFilter == null ? "active" : null' 
										@click='setCarFilter(null), waybillsSort()')
											span Все
									b-dropdown-item(
										aria-role="listitem"
										v-for='value in filterValues'
										:key='value'
										:class='carFilter == value ? "active" : null'
										@click='setCarFilter(value), waybillsSort()')
											span {{ value }}
							th.start 
								|Время
								br
								|выезда
							th.finish
								|Время
								br
								|возвращения
							th.task Задание
							th.driver Водитель
							th.status Статус

					tbody(
						v-for='waybill in waybills[currentPage - 1]'
						@click='goTo(waybill.id)')
						tr
							td.id(
								:class='waybill.status.class') {{ waybill.id }}
							td.car.is-paddingless
								table.table.is-fullwidth
									tr
										td {{ waybill.car.model }}
										td.is-lowercase {{ waybill.car.registrationPlate }}
							td.start 
								|{{ waybill.startFact ? dateTimeStamp(waybill.startFact) : null }}
								span.icon.is-small(v-if='waybill.startPlan && waybill.startFact')
									i.far.fa-calendar-check(
										:class='waybill.startPlan == waybill.startFact ? "is-success" : "is-danger"')
							td.finish
								|{{ waybill.finishPlan ? dateTimeStamp(waybill.finishPlan) : null }}
								span.icon.is-small(v-if='waybill.finishPlan && waybill.finishFact')
									i.far.fa-calendar-check(
										:class='waybill.finishPlan == waybill.finishFact ? "is-success" : "is-danger"')
							td.task {{ waybill.workText.length <= 40 ? waybill.workText : `${waybill.workText.slice(0, -(waybill.workText.length - 40))}...` }}
							td.driver {{ waybill.driver.name }}
							td.status(
								:class='waybill.status.class') 
								|{{ waybill.status.text }}
								router-link(
									v-if='waybill.status.num == 2'
									:to='`/waybills/report/${waybill.id}`')
									img.icon(
										src="@/assets/icons/waybill-report.svg")
								router-link(
									v-if='waybill.status.num == 0'
									:to='`/waybills/preview/${waybill.id}`')
									img.icon(
										src="@/assets/icons/close-waybill.svg")
			router-link.open(
				to="/waybills/open")
				b-button Открыть путевой лист

			b-pagination(
				:total='total'
				per-page='7'
				:simple='true'
				v-model='currentPage')

		.container(v-else)
			.content
				span.subtitle.has-text-warning Нет путевых листов за данный период
				router-link.open(
					to="/waybills/open")
					b-button Открыть путевой лист

</template>

<script>
import monthName from '@/month'
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
	name: 'Table',
	data() {
		return {
			currentPage: 1
		}
	},
	props: ['waybills', 'isLoading', 'total'],
	computed: {
		...mapGetters('waybills', {
			filterValues: 'getCarFilterValues',
			carFilter: 'getCarFilter'
		}),
		isEmpty() {
			return this.waybills == {} ? true : false
		}
	},
	methods: {
		...mapMutations('waybills', [
			'setCarFilter'
		]),
		...mapActions('waybills', [
			'waybillsSort'
		]),
		noWorkDistance(totalDistance, workDistance) {
			return (totalDistance - workDistance).toFixed(2)
		},
		goTo(id) {
			// this.$router.push({ path: `/waybills/${id}` })
			console.log(id)
		},
		dateTimeStamp(unix) {
			let date = new Date(unix),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]} ${hours}:${minutes}`
		}
	}
}

</script>
