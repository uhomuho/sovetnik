<template lang="pug">
	div#main
		.container#report
			.section
				.level
					.level-left
						.level-item
							h1
								|Отчет по
								br
								|путевому листу
				
					.level-right
						.level-item
							.level
								.level-left
									.level-item
										|№
										form(@submit.prevent='getWaybill(wbId).then(() => hint = false)')
											b-tooltip(
												:active='hint'
												label="Нажмите Enter"
												position="is-bottom"
												type="is-white"
												size="is-small"
												multilined
												always)
											input(
												v-model="wbId"
												placeholder="ID"
												type="number"
												@input='showHint')
								.level-right
									.level-item
										|от
										span {{ dateStringOf ? dateStringOf : "XX.XX.XXXX" }}
				hr

				.wrapper(v-if='waybill')
					.item
						p Гос. номер:
						input.input( 
							type="text"
							v-model='waybill.car.registrationPlate')
						.search.is-hidden

					.item
						p Водитель: {{ waybill.driver.name }}

				hr(v-if='waybill')

				//- img( 
				//- 	:src='`${mode == "development" ? "/" : $userConfig.publicPath}img/canvas.png`'
				//- 	v-if='waybill')
				Chart(
					v-if='waybillReport'
					:items='chartData',
					:line='waybillReport.lineConfig'
					:steps='waybillReport.steps')
				.tile.is-ancestor(v-if='waybill')
					.tile.is-parent.is-paddingless
						.tile.is-child
							p.title Сравнение данных
							table.table.is-fullwidth
								thead
									tr
										th &nbsp;
										th АВТОГРАФ
										th Путевой лист
								tbody
									tr
										td.name Расход топлива
										td {{ totalTrackFuel }}
										td {{ totalWaybillFuel }}
									tr
										td.name Пробег
										td {{ waybill.trackMileage.toFixed(2) }}
										td {{ waybill.mileageTotal }}
									tr
										td.name Время
										td {{ trackTimeDiff }}
										td {{ waybillTimeDiff }}
						.tile.is-child
							p.title Сравнение адресов
							.tile
								.tile.is-parent
									.tile.is-child
										p.title АВТОГРАФ
										.with-border
											p Восточная,&nbsp; 
											p Бажова,&nbsp;
											p Шарташская,&nbsp;
											p Луначарского,&nbsp;
											p М-Сибиряка,&nbsp;
											p Толмачева,&nbsp;
											p Горького,&nbsp;
											p Первомайская,&nbsp;
											p К-Либкнехта,&nbsp;
											p Дублер Сиб.Тракта,&nbsp;
											p Тургенева,&nbsp;
											p Ленина,&nbsp;
											p Площаль УПИ,&nbsp;
											p Серова&nbsp;
									.tile.is-child
										p.title Путевой лист
										.with-border
											p Восточная,&nbsp;
											p Бажова,&nbsp;
											p Шарташская,&nbsp;
											p Луначарского,&nbsp;
											p М-Сибиряка,&nbsp;
											p Толмачева,&nbsp;
											p Горького,&nbsp;
											p Первомайская,&nbsp;
											p К-Либкнехта,&nbsp;
											p Дублер Сиб.Тракта,&nbsp;
											p Тургенева,&nbsp;
											p Ленина,&nbsp;
											p Площаль УПИ,&nbsp;
											p Блюхера&nbsp;

							

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import monthName from '@/month'
import Chart from '@/components/canvas/_wb-chart'

export default {
	name: 'Report',
	data() {
		return {
			wbId: this.id ? this.id : null,
			registrationPlate: this.waybill ? this.waybill.car.registrationPlate : null,
			hint: false,
			mode: process.env.NODE_ENV
		}
	},
	components: {
		Chart
	},
	props: {
		id: {
			default: null
		}
	},
	computed: {
		...mapGetters('reports', {
			waybillReport: 'getWaybillReport'
		}),
		waybill() {
			return this.waybillReport ? this.waybillReport.waybill : null
		},
		chartData() {
			return this.waybillReport ? this.waybillReport.track : null
		},
		dateStringOf() {
			if (this.waybill) {
				let date = new Date(this.waybill.of),
						day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate()
				return `${day}.${monthName.num[date.getMonth()]}.${date.getFullYear()}`
			} else {
				return null
			}
		},
		totalWaybillFuel() {
			return parseInt(this.waybill.fuelStart) + parseInt(this.waybill.fuelVolume) - parseInt(this.waybill.fuelFinish)
		},
		totalTrackFuel() {
			return (parseInt(this.waybill.trackFuelDown) - parseInt(this.waybill.trackFuelUp)) < 0 ? 0 : parseInt(this.waybill.trackFuelDown) - parseInt(this.waybill.trackFuelUp)
		},
		waybillTimeDiff() {
			return this.$moment.utc(this.$moment(new Date(this.waybill.startPlan),"DD/MM/YYYY HH:mm:ss").diff(this.$moment(new Date(this.waybill.finishPlan),"DD/MM/YYYY HH:mm:ss"))).format("HH:mm")
		},
		trackTimeDiff() {
			return this.$moment.utc(this.$moment(new Date(this.waybill.startFact),"DD/MM/YYYY HH:mm:ss").diff(this.$moment(new Date(this.waybill.finishFact),"DD/MM/YYYY HH:mm:ss"))).format("HH:mm")
		}
	},
	methods: {
		...mapActions('reports', {
			getWaybill: 'apiWaybillReport'
		}),
		showHint() {
			this.hint = false
			setTimeout(() => {
				this.hint = true
			}, 5000)
		}
	},
	mounted() {
		if (this.id) {
			this.getWaybill(this.id)
		}
	}
}

</script>