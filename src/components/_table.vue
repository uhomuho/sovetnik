<template lang="pug">
	.wrapper#waybills_table
		.container(v-if='waybills.listWaybill.length !== 0')
			.table-container
				table.table.is-fullwidth
					thead
						tr
							th.id №
							th.car 
								b-dropdown( aria-role="list" )
									.wrapper(slot="trigger")
										span Машина
										//- img.icon( src="@/assets/icons/angle.svg" )
									//- b-dropdown-item(
									//- 	aria-role="lsititem"
									//- 	:class='carFilter == null ? "active" : null' 
									//- 	@click='setCarFilter(null), getWaybills()')
									//- 		span Все
									b-dropdown-item(
										aria-role="listitem"
										v-for='value in filterValues'
										:key='value'
										:class='carFilter == value ? "active" : null'
										@click='setCarFilter(value), getWaybills()')
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
						v-for='waybill in waybills.listWaybill')
						tr(@click='waybill.status.name == "CLOSE" ? goto(`/reports/waybill/${waybill.id}`) : waybill.status.name == "OPEN" ? goto(`/waybills/close/${waybill.id}`) : null')
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
									v-if='waybill.status.name == "CLOSE"'
									:to='`/reports/waybill/${waybill.id}`')
									img.icon(
										src="@/assets/icons/waybill-report.svg")
								router-link(
									v-if='waybill.status.name == "OPEN"'
									:to='`/waybills/close/${waybill.id}`')
									img.icon(
										src="@/assets/icons/close-waybill.svg")
			b-loading(
				v-model='loading')
			router-link.open(
				to="/waybills/open")
				b-button Открыть путевой лист

			nav.pagination(
				role="navigation"
				aria-label="pagination")
				p {{ waybillsOnPage }}/{{ waybills.count }}
				.button.prev( 
					@click='prevPage'
					:class='prevDisabled ? null : "active"'
					role="button"
					:disabled="prevDisabled" )
				.button.next( 
					@click='nextPage'
					:class='nextDisabled ? null : "active"'
					role="button"
					:disabled="nextDisabled" )

		.container(v-else)
			.content
				span.subtitle.has-text-warning Нет путевых листов за данный период
				router-link.open(
					to="/waybills/open")
					b-button Открыть путевой лист

</template>

<script>
import monthName from '@/month'
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import config from '../../public/config.json'

export default {
	name: 'Table',
	data() {
		return {
			currentPage: 1
		}
	},
	props: ['waybills', 'isLoading', 'total'],
	computed: {
		...mapState('waybills', {
			loading: state => state.loading
		}),
		...mapGetters('waybills', {
			filterValues: 'getCarFilterValues',
			carFilter: 'getCarFilter'
		}),
		isEmpty() {
			return this.waybills == {} ? true : false
		},
		waybillsOnPage() {
			return (this.currentPage * config.waybillsPerPage) > this.waybills.size ? this.waybills.count : (this.currentPage * config.waybillsPerPage)
		},
		compPrev() {
			return true
		},
		prevDisabled() {
			return this.currentPage == 1 ? true : false
		},
		nextDisabled() {
			return (this.currentPage * config.waybillsPerPage) < this.waybills.count ? false : true
		}
	},
	methods: {
		...mapMutations('waybills', [
			'setCarFilter'
		]),
		...mapActions('waybills', [
			'getWaybills'
		]),
		noWorkDistance(totalDistance, workDistance) {
			return (totalDistance - workDistance).toFixed(2)
		},
		dateTimeStamp(unix) {
			let date = new Date(unix),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours(),
					minutes = (`${date.getMinutes()}`.length == 1) ? (`0${date.getMinutes()}`) : date.getMinutes()

			return `${day}/${monthName.num[date.getMonth()]} ${hours}:${minutes}`
		},
		goto(path) {
			return this.$router.push(path)
		},
		nextPage() {
			if (!this.nextDisabled) {
				this.currentPage += 1
				this.getWaybills(this.currentPage)
			}
		},
		prevPage() {
			if (!this.prevDisabled) {
				this.currentPage -= 1
				this.getWaybills(this.currentPage)
			}
		}
	}
}

</script>
