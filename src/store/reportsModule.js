// import api from '@/api/apiActions'

const randomDate = (start, end) => {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).getTime();
}

let dateTo = localStorage.getItem('dateTo'),
		dateFrom = localStorage.getItem('dateFrom')

export default {
	namespaced: true,
	state: {
		waybillsReports: null,
		filteredWaybillsReports: null,
		carsList: null,
		dateTo: dateTo ? dateTo : null,
		dateFrom: dateFrom ? dateFrom : null
	},
	getters: {
		getWaybillsReports: state => state.waybillsReports,
		getFilteredWaybillsReports: state => state.filteredWaybillsReports,
		getCarsList: state => state.carsList
	},
	mutations: {
		setWaybillsReports(state, payload) {
			state.waybillsReports = payload
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
		filterByStatus({ commit, state }, filter) {
			let waybills = state.waybillsReports

			if (filter.status !== "ALL") waybills = waybills.filter(waybill => waybill.status.name == filter.status)

			commit('setFilteredWaybillsReports', waybills)
		},
		filterByCar({ commit, state }, filter) {
			let waybills = state.waybillsReports
			
			if (filter.car !== "ALL") waybills = waybills.filter( waybill => waybill.car.name == filter.car )

			commit('setFilteredWaybillsReports', waybills)
		}
	}
}