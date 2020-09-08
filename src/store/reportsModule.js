import api from '@/api/apiActions'
import monthName from '@/month'

const randomDate = (start, end) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
}

let dateTo = localStorage.getItem('dateTo'),
		dateFrom = localStorage.getItem('dateFrom')

export default {
	namespaced: true,
	state: {
		waybillsReports: null,
		autographReport: null,
		totalData: null,
		filteredWaybillsReports: null,
		carsList: null,
		dateTo: dateTo ? dateTo : new Date(2020, 8, 20),
		dateFrom: dateFrom ? dateFrom : new Date()
	},
	getters: {
		getWaybillsReports: state => state.waybillsReports,
		getAutographReport: state => state.autographReport,
		getTotalData: state => state.totalData,
		getFilteredWaybillsReports: state => state.filteredWaybillsReports,
		getCarsList: state => state.carsList
	},
	mutations: {
		setWaybillsReports(state, payload) {
			state.waybillsReports = payload
		},
		setAutographReport(state, payload) {
			state.autographReport = payload
		},
		setTotalData(state, payload) {
			state.totalData = payload
		},
		setFilteredWaybillsReports(state, payload) {
			state.filteredWaybillsReports = payload
		},
		setCarsList(state, payload) {
			state.carsList = payload
		},
		setDateTo(state, payload) {
			state.dateTo = payload.date.getTime()
			
		},
		setDateFrom(state, payload) {
			state.dateFrom = payload.date.getTime()
		}
	},
	actions: {
		apiWaybillsReport({ commit }) {
			const count = 30

			let reports = [],
					statusNum

			for (var i = 1; i <= count; i++) {
				let report = {
					id: null,
					car: {
						name: null,
						registrationPlate: 'у 797 но 96'
					},
					of: randomDate(new Date(2020, 0, 1), new Date()),
					fuelWaybill: '1 233,28',
					fuelAutograph: '1 233,28',
					mileageWaybill: '1 233,28',
					mileageAutograph: '1 233,28',
					status: {}
				}

				report.id = i
				
				statusNum = Math.floor(Math.random() * 3)
				switch(statusNum) {
					case 1:
						report.status.name 	= "OPEN"
						report.status.class = "opened"
						report.status.text 	= "Открыт"
						report.car.name = "Машина 1"
						break
					case 2:
						report.status.name 	= "CHECK"
						report.status.class = "check"
						report.status.text 	= "Проверка"
						report.car.name = "Машина 2"
						break
					case 3:
						report.status.name 	= "CLOSE"
						report.status.class	= "closed"
						report.status.text 	= "Закрыт"
						report.car.name = "Машина 1"
						break
					default:
						report.status.name 	= "CLOSE"
						report.status.class	= "closed"
						report.status.text 	= "Закрыт"
						report.car.name = "Машина 3"
						break
						
				}
				reports.push(report)
			}

			let cars = []
			for (i = 0; i <= reports.length - 1; i++) {
				cars.push(reports[i].car.name)
			}
			cars = [...new Set(cars)]

			commit('setCarsList', cars)
			commit('setWaybillsReports', reports)
		},
		apiAutographReport({ commit, state }) {
			let dateFrom 	= new Date(state.dateFrom),
					dateTo 		= new Date(state.dateTo),
					params 		= {
				from: {
					year: dateFrom.getFullYear(),
					month: monthName.num[dateFrom.getMonth()],
					day: dateFrom.getDate()
				},
				to: {
					year: dateTo.getFullYear(),
					month: monthName.num[dateTo.getMonth()],
					day: dateTo.getDate()
				}
			}
			api.getAutographReport(params)
				.then(r => {
					let report = r.data.data,
							total  = {
								motionFuelUp: 0,
								motionFuelDown: 0,
								tankFuelUp: 0,
								tankFuelDown: 0
							}
					
					for (var i = 0; i <= report.length - 1; i++) {
						console.log(report[i])
						report[i].idingDistance = report[i].totalDistance - report[i].workDistance

						total.motionFuelUp += report[i].motionFuelUp ? Number(report[i].motionFuelUp) : 0
						total.motionFuelDown += report[i].motionFuelDown ? Number(report[i].motionFuelDown) : 0
						total.tankFuelUp += report[i].tankFuelUp ? Number(report[i].tankFuelUp) : 0
						total.tankFuelDown += report[i].tankFuelDown ? Number(report[i].tankFuelDown) : 0

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
					total.tankFuelUp = total.tankFuelUp.toFixed(2).replace(".", ",")
					total.tankFuelDown = total.tankFuelDown.toFixed(2).replace(".", ",")

					commit('setTotalData', total)
					commit('setAutographReport', report)
				})
				.catch(err => console.error(err))
		},
		filterReports({ commit, state }, filter) {
			let waybills = state.waybillsReports,
					data = {},
					filteredData = []

			for (let status of filter.status) {
				if (status !== "") {
					data = waybills.filter(waybill => waybill.status.name == status)
					for(let waybill of data) {
						filteredData.push(waybill)
					}
				}
			}

			if (filter.car !== "ALL") filteredData = filteredData.filter( waybill => waybill.car.name == filter.car )

			filteredData.sort((a, b) => {
				return a.id - b.id
			})

			commit('setFilteredWaybillsReports', filteredData)
		},
		filterByCar({ commit, state }, filter) {
			let waybills = state.waybillsReports

			
			if (filter.car !== "ALL") waybills = waybills.filter( waybill => waybill.car.name == filter.car )

			commit('setFilteredWaybillsReports', waybills)
		}
	}
}