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
											input.id(
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
						.plate(
							:class='plates ? "is-active" : null')
							input.input(
								type="text"
								@input='filterPlates'
								v-model='waybill.car.registrationPlate')
							img.icon( src="@/assets/icons/angle-4.svg" )
						.plates.dropdown( v-if='plates' )
							p( 
								v-for='plate in plates'
								@click='getWb(plate.serial)')
								|{{ plate.registrationPlate }}

					.item
						p Водитель: {{ waybill.driver.name }}

				hr(v-if='waybill')
				Chart(
					v-if='waybillReport'
					:items='chartData',
					:line='waybillReport.lineConfig'
					:steps='waybillReport.steps')
				.tile.is-ancestor(v-if='waybill')
					.tile.is-parent.is-paddingless
						.tile.is-child.is-6
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
										td {{ waybill.trackFuelDown.toFixed(2) }}
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
							.content(v-if='!trackLocations || trackLocations.length == 0 || !wbLocations || wbLocations.length == 0')
								p.is-size-4.has-text-warning
									|Нет данных по адресам
							.tile
								.tile.is-parent
									.tile.is-child(v-if='trackLocations && trackLocations.length !== 0')
										p.title АВТОГРАФ
										.with-border
											p(
												v-if='trackLocations'
												v-for='location in trackLocations')
												|{{ location }},&nbsp;
									.tile.is-child(v-if='wbLocations && wbLocations !== 0')
										p.title Путевой лист
										.with-border

							

</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import monthName from '@/month'
import Chart from '@/components/canvas/_wb-chart'
import api from '@/api/apiActions'
import { SnackbarProgrammatic } from 'buefy'

export default {
	name: 'Report',
	data() {
		return {
			wbId: this.id ? this.id : null,
			registrationPlate: this.waybill ? this.waybill.car.registrationPlate : null,
			hint: false,
			mode: process.env.NODE_ENV,
			plates: null
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
	watch: {
		waybillReport() {
			this.wbId = this.waybill.id
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
		trackLocations() {
			return this.waybillReport ? this.waybillReport.trackLocations : null
		},
		wbLocations() {
			return this.waybillReport && this.waybillReport.wbLocations ? this.waybillReport.wbLocations : null
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
		...mapMutations('reports', {
			setWaybill: 'setWaybillReport'
		}),
		getWb(serial) {
			api.getLastWb({serial: serial})
				.then(r => {
					if (r.data) {
						this.getWaybill(r.data.id)
						this.plates = null
					} else {
						SnackbarProgrammatic.open({
							message: 'По данному регистрационному номеру нет закрытых путевых листов',
							position: 'is-top-right',
							duration: 2000,
							actionText: null		
						})
					}
				})
		},
		showHint() {
			this.hint = false
			setTimeout(() => {
				this.hint = true
			}, 5000)
		},
		async filterPlates(e) {
			await api.getPlates(e.target.value)
				.then(r => this.plates = r.data)
		}
	},
	mounted() {
		if (this.id) {
			this.getWaybill(this.id)
		}
	}
}

</script>