import api from '@/api/apiActions'
import monthName from '@/month'
import config from '../../public/config.js'

function setLocalDataNull(data) {
	localStorage.setItem(data, null)
}
setLocalDataNull('dateFrom')
setLocalDataNull('dateTo')

let dateTo = localStorage.getItem('dateTo'),
		dateFrom = localStorage.getItem('dateFrom')

export default {
	namespaced: true,
	state: {
		autographReport: null,
		totalData: null,
		carsList: null,
		dateTo: dateTo ? dateTo : null,
		dateFrom: dateFrom ? dateFrom : null,
		waybillReport: null,
		filter: "range"
	},
	getters: {
		getWaybillReport: state => state.waybillReport,
		getAutographReport: state => state.autographReport,
		getTotalData: state => state.totalData,
		getFilteredWaybillsReports: state => state.filteredWaybillsReports,
		getCarsList: state => state.carsList
	},
	mutations: {
		setAutographReport(state, payload) {
			state.autographReport = payload
		},
		setTotalData(state, payload) {
			state.totalData = payload
		},
		setCarsList(state, payload) {
			state.carsList = payload
		},
		setDateTo(state, payload) {
			state.dateTo = payload.date.getTime()
		},
		setDateFrom(state, payload) {
			state.dateFrom = payload.date.getTime()
		},
		setWaybillReport(state, payload) {
			state.waybillReport = payload
		},
		setFilter(state, payload) {
			state.filter = payload
		},
	},
	actions: {
		apiAutographReport({ commit, state }) {
			let dateFrom 		= new Date(state.dateFrom),
					dateTo 			= new Date(state.dateTo),
					curYear 		= new Date().getFullYear(),
					curMonth 		= monthName.num[new Date().getMonth()],
					curDay 			= new Date().getDate(),
					timezone 		= config.global.timezone,
					params,
					curWeekDay,
					weekStart,
					weekEnd

			if ( `${timezone}`.includes('-') ) {
				timezone = `${timezone}`.replace('-', '%2D')
			} else {
				timezone = `${timezone}`.replace('+', '%2B')
			}

			switch(state.filter) {

				// Filter by year
				case "year":
					params = {
						from: {
							year: new Date().getFullYear(),
							month: '01',
							day: '01',
							timezone: timezone
						},
						to: {
							year: new Date().getFullYear(),
							month: '12',
							day: '31',
							timezone: timezone
						}
					}
					break;

				// Filter by yestarday
				case "yest":
					params = {
						from: {
							year: curYear,
							month: curMonth,
							day: curDay - 1,
							timezone: timezone
						},
						to: {
							year: curYear,
							month: curMonth,
							day: curDay - 1,
							timezone: timezone
						}
					}
					break;

				// Filter by month
				case "month":
					params = {
						from: {
							year: curYear,
							month: curMonth,
							day: '01',
							timezone: timezone
						},
						to: {
							year: curYear,
							month: curMonth,
							day: new Date(curYear, curMonth, 0).getDate(),
							timezone: timezone
						}
					}
					break;

				// Filter by today
				case "today":
					params = {
						from: {
							year: curYear,
							month: curMonth,
							day: curDay,
							timezone: timezone
						},
						to: {
							year: curYear,
							month: curMonth,
							day: curDay,
							timezone: timezone
						}
					}
					break;

				// Filter by week
				case "week":
					curWeekDay 	= new Date().getDay() - 1
					weekStart 	= curDay - curWeekDay
					weekEnd 		= weekStart + 6
					params = {
						from: {
							year: curYear,
							month: curMonth,
							day: weekStart,
							timezone: timezone
						},
						to: {
							year: curYear,
							month: curMonth,
							day: weekEnd,
							timezone: timezone
						}
					}
					break;

				// Filter by range
				case "range":
					params 			= {
						from: {
							year: dateFrom.getFullYear(),
							month: monthName.num[dateFrom.getMonth()],
							day: `${dateFrom.getDate()}`.length == 1 ? `0${dateFrom.getDate()}` : dateFrom.getDate(),
							timezone: timezone
						},
						to: {
							year: dateTo.getFullYear(),
							month: monthName.num[dateTo.getMonth()],
							day: `${dateTo.getDate()}`.length == 1 ? `0${dateTo.getDate()}` : dateTo.getDate(),
							timezone: timezone
						}
					}
					break;
			}
			api.getAutographReport(params)
				.then(r => {
					let report = r.data.data,
							total  = {
								motionFuelUp: 0,
								motionFuelDown: 0,
								firstFuel: 0,
								lastFuel: 0
							}
					
					for (var i = 0; i <= report.length - 1; i++) {
						report[i].idingDistance = report[i].totalDistance - report[i].workDistance
	
						total.motionFuelUp += report[i].motionFuelUp ? Number(report[i].motionFuelUp) : 0
						total.motionFuelDown += report[i].motionFuelDown ? Number(report[i].motionFuelDown) : 0
						total.firstFuel += report[i].firstFuel ? Number(report[i].firstFuel) : 0
						total.lastFuel += report[i].lastFuel ? Number(report[i].lastFuel) : 0
	
						for (var key in report[i]) {
							let field = report[i][key]
							if (typeof field == 'number') {
								if (!Number.isInteger(field)) {
									report[i][key] = report[i][key].toFixed(2).replace(".", ",")
								}
							}
						}
					}
					total.motionFuelUp = total.motionFuelUp.toFixed(2).replace(".", ",")
					total.motionFuelDown = total.motionFuelDown.toFixed(2).replace(".", ",")
					total.firstFuel = total.firstFuel.toFixed(2).replace(".", ",")
					total.lastFuel = total.lastFuel.toFixed(2).replace(".", ",")
	
					commit('setTotalData', total)
					commit('setAutographReport', report)
				})
				.catch(err => console.error(err))
		},
		apiWaybillReport({ commit }, params) {
			api.getWaybillReport(params)
				.then(r => {
					let x 					= 15,
							distance 		= 897/r.data.track.length,
							lineConfig 	= [],
							chart 			= r.data.track,
							max 				= 0,
							min 				= 0

					for(let key in chart) {
						if ((chart[key].firstFuel-chart[key].lastFuel) < 0 || chart[key].totalDistance == 0) {
							chart[key].fuelDown = 0
						} else {
							chart[key].fuelDown = new Number(((chart[key].firstFuel-chart[key].lastFuel)/(chart[key].totalDistance)).toFixed(2))
						}
					}
					
					min = chart[0].fuelDown
					for (let i = 0, len=chart.length; i < len; i++) {
						let v = chart[i].fuelDown
						max = (v > max) ? v : max
						min = (v < min) && v > 0 ? v : min
					}
					
					for(let key in chart) {
						chart[key].config = {
							id: key,
							x: x + 10,
							y: max !== 0 ? 400 -(chart[key].fuelDown * (400/((Math.ceil(max/10) * 10) + 5))) : 400 - chart[key].fuelDown,
							radius: 10
						}
						lineConfig.push(chart[key].config.x)
						lineConfig.push(chart[key].config.y)
						x += distance
					}

					chart.filter(item => {
						switch(item.fuelDown) {
							case max:
								item.maxFuelDown = true
								item.minFuelDown = false
								break
							case min:
								item.minFuelDown = true
								item.maxFuelDown = false
								break
							default:
								item.minFuelDown = false
								item.maxFuelDown = false
								break
						}
					})
					let steps = [],
							count = (Math.ceil(max/10) * 10) + 5
					for (let i = 0; i <= count; i+=5) {
						let step = {
							num: i,
							y: 400 - ((400/count) * i),
							height: 400/count
						}
						steps.push(step)
					}
					
					r.data.steps = steps
					r.data.track = chart
					r.data.lineConfig = {
						points: lineConfig,
						stroke: "#617E8C",
						strokeWidth: 5,
						lineCap: "round",
						lineJoin: "round"
					}

					let dots = []
					for (let item of chart) {
						if (!item.firstLocation.includes('°')) {
							dots.push(item.firstLocation)
						}
						if (!item.lastLocation.includes('°')) {
							dots.push(item.lastLocation)
						}
					}
					function onlyUnique(value, index, self) {
						return self.indexOf(value) === index;
					}
					
					// usage example:
					dots = dots.filter(onlyUnique)

					r.data.trackLocations = dots

					commit('setWaybillReport', r.data)
				})
				.catch(err => {
					console.error(err)
				})
		},
		setDates ({ commit }) {
			let date = new Date()
			
			let from = new Date(date.setMonth(date.getMonth() - 3))
			commit('setDateFrom', {date: from})
			let to = new Date(date.setMonth(date.getMonth() + 4))
			commit('setDateTo', {date: to})
		}
	}
}