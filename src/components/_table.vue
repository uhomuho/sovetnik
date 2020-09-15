<template lang="pug">
	.wrapper#waybills_table(@click='close')
		.container
			.table-container
				table.table.is-fullwidth
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
															@mouseover='setCar(key)')
															|{{ key }}
												.tile.is-child.is-8
													.title Гос. номер
													.columns.is-flex.is-multiline
														.column.is-4(
																v-if='choosenCar'
																v-for='car in carFilter[choosenCar]')
															.column-container.num(
																@click='setSerial(car.serial)')
																|{{car.registrationPlate}}

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
							th.status 
								.dropdown(
									@click='toggleDropdown'
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

					tbody(
						v-if='waybills.listWaybill.length !== 0'
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
			.container(v-if='waybills.listWaybill.length == 0')
				.content
					span.subtitle.has-text-warning Нет путевых листов по заданным параметрам
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

</template>

<script>
import monthName from '@/month'
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import config from '../../public/config.json'

export default {
	name: 'Table',
	data() {
		return {
			currentPage: 1,
			filter: {
				status: [],
				serial: null
			},
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
					name: "CHECK,ERROR",
					text: "Проверка",
					id: 	"check"
				}
			],
			openedDropdown: false,
			openedCarDropdown: false,
			choosenCar: null
		}
	},
	props: ['waybills', 'isLoading', 'total'],
	computed: {
		...mapState('waybills', {
			loading: state => state.loading
		}),
		...mapGetters('waybills', {
			carFilter: 'getCarsFilter'
		}),
		isEmpty() {
			return this.waybills == {} ? true : false
		},
		waybillsOnPage() {
			return (this.currentPage * config["Количество путевых листов на странице"]) > this.waybills.size ? this.waybills.count : (this.currentPage * config["Количество путевых листов на странице"])
		},
		compPrev() {
			return true
		},
		prevDisabled() {
			return this.currentPage == 1 ? true : false
		},
		nextDisabled() {
			return (this.currentPage * config["Количество путевых листов на странице"]) < this.waybills.count ? false : true
		}
	},
	methods: {
		...mapMutations('waybills', [
			'setCarFilter'
		]),
		...mapActions('waybills', [
			'getWaybills',
			'apiCarsFilter'
		]),
		setCar(name) {
			this.choosenCar = name
		},
		toggleDropdown(e) {
			if (!e.target.matches('.menu *')) {
				this.openedDropdown = !this.openedDropdown
			}
		},
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
		},
		nextPage() {
			if (!this.nextDisabled) {
				this.currentPage += 1
				this.getWaybills({page: this.currentPage})
			}
		},
		prevPage() {
			if (!this.prevDisabled) {
				this.currentPage -= 1
				this.getWaybills({page: this.currentPage})
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
		}
	},
	beforeMount() {
		this.apiCarsFilter()
	}
}

</script>
