import monthName from '@/month'
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

let dateFrom 				= localStorage.getItem('dateFrom'),
		dateTo					= localStorage.getItem('dateTo'),
		filterType  		= localStorage.getItem('filterType'),
		newWaybill  		= localStorage.getItem('newWaybill'),
		newListDrivers 	= localStorage.getItem('newListDrivers'),
		newListCar 			= localStorage.getItem('newListCar'),
		waybills 				= localStorage.getItem('waybills')

export default {
	namespaced: true,
	state: {
		waybills: waybills ? JSON.parse(waybills) : null,
		waybill: null,
		waybillsSort: null,
		dateFrom: dateFrom ? new Date(dateFrom) : null,
		dateTo: dateTo ? new Date(dateTo) : null,
		total: null,
		filterType: filterType ? filterType : "range",
		carFilter: null,
		closeWaybill: null,
		carFilterValues: [],
		newWaybill: newWaybill ? JSON.parse(newWaybill) : null,
		newListDrivers: newListDrivers ? JSON.parse(newListDrivers) : null,
		newListCar: newListCar ? JSON.parse(newListCar) : null,
		loading: false
	},
	getters: {
		getNewWaybill: state => state.newWaybill,
		getNewListDrivers: state => state.newListDrivers,
		getNewListCar: state => state.newListCar,
		waybills: state => state.waybills,
		getCloseWaybill: state => state.closeWaybill,
		waybillsSortData: state => state.waybillsSort,
		getPagesCount: state => state.pagesCount,
		total: state => state.total,
		getFilterType: state => state.filterType,
		getCarFilter: state => state.carFilter,
		getCarFilterValues: state => state.carFilterValues
	},
	mutations: {
		waybills: (state, payload) => state.waybills = payload,
		waybillsSort: (state, payload) => state.waybillsSort = payload,
		setCloseWaybill: (state, payload) => state.closeWaybill = payload,
		dateFrom (state, payload) {
			state.dateFrom = payload.date
			localStorage.setItem('dateFrom', payload.date)
		},
		dateTo (state, payload) {
			state.dateTo = payload.date
			localStorage.setItem('dateTo', payload.date)
		},
		setFilterType (state, payload) {
			state.filterType = payload
			localStorage.setItem('filterType', payload)
		},
		setCarFilter: (state, payload) => state.carFilter = payload,
		setAllNewWaybillData (state, payload) {
			if (payload.waybill) {
				state.newWaybill = payload.waybill
				localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
			}

			if (payload.newListDrivers) {
				state.newListDrivers = payload.listDrivers
				localStorage.setItem('newListDrivers', JSON.stringify(state.newListDrivers))
			}

			if (payload.newListCar) {
				state.newListCar = payload.listCar
				localStorage.setItem('newListCar', JSON.stringify(state.newListCar))
			}
		},
		setListDrivers(state, payload) {
			state.newListDrivers = payload
			localStorage.setItem('newListDrivers', JSON.stringify(state.newListDrivers))
		},
		setListCars(state, payload) {
			state.newListCar = payload
			localStorage.setItem('newListCar', JSON.stringify(state.newListCar))
		}
	},
	actions: {
		async getWaybills ({ commit, state }, page) {
			state.loading = true
			let curYear 		= new Date().getFullYear(),
					curMonth 		= monthName.num[new Date().getMonth()],
					curDay 			= new Date().getDate(),
					timezone 		= new Date().getTimezoneOffset()/60,
					params,
					curWeekDay,
					weekStart,
					weekEnd

			if ( `${timezone}`.includes('-') ) {
				timezone = `${timezone}`.replace('-', '%2B0') + ':00'
			} else {
				timezone = `%2D0${timezone}:00`
			}

			switch(state.filterType) {

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
						},
						page: page
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
						},
						page: page
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
						},
						page: page
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
						},
						page: page
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
						},
						page: page
					}
					break;

				// Filter by range
				case "range":
					params 			= {
						from: {
							year: state.dateFrom.getFullYear(),
							month: monthName.num[state.dateFrom.getMonth()],
							day: `${state.dateFrom.getDate()}`.length == 1 ? `0${state.dateFrom.getDate()}` : state.dateFrom.getDate(),
							timezone: timezone
						},
						to: {
							year: state.dateTo.getFullYear(),
							month: monthName.num[state.dateTo.getMonth()],
							day: `${state.dateTo.getDate()}`.length == 1 ? `0${state.dateTo.getDate()}` : state.dateTo.getDate(),
							timezone: timezone
						},
						page: page
					}
					break;
			}
			await api.getWaybills(params)
				.then(res => {
					state.loading = false
					let waybills = res.data
					for (var index in waybills.listWaybill) {
						if (waybills.listWaybill[index].car !== null) {
							let model = waybills.listWaybill[index].car.model
							let registrationPlate = waybills.listWaybill[index].car.registrationPlate
							if (model !== null) waybills.listWaybill[index].car.model = model.replace(registrationPlate, '').trim()

							for (var key in waybills.listWaybill[index]) {
								let field = waybills.listWaybill[index][key]
								if (typeof field == 'number') {
									if (!Number.isInteger(field)) {
										waybills.listWaybill[index][key] = waybills.listWaybill[index][key].toFixed(2).replace(".", ",")
									}
								}
							}
						}
						switch(waybills.listWaybill[index].status) {
							case "OPEN":
								waybills.listWaybill[index].status = {}
								waybills.listWaybill[index].status.name 	= "OPEN"
								waybills.listWaybill[index].status.text 	= 'Открыт'
								waybills.listWaybill[index].status.class 	= 'opened'
								break
							case "CHECK":
								waybills.listWaybill[index].status = {}
								waybills.listWaybill[index].status.name = "CHECK"
								waybills.listWaybill[index].status.text 	= 'Проверка'
								waybills.listWaybill[index].status.class 	= 'check'
								break
							case "CLOSE":
								waybills.listWaybill[index].status = {}
								waybills.listWaybill[index].status.name = "CLOSE"
								waybills.listWaybill[index].status.text 	= 'Закрыт'
								waybills.listWaybill[index].status.class 	= 'closed'
								break
							case "ERROR":
								waybills.listWaybill[index].status = {}
								waybills.listWaybill[index].status.name = "CHECK"
								waybills.listWaybill[index].status.text 	= 'Проверка'
								waybills.listWaybill[index].status.class 	= 'check'
								break
						}
						waybills.size = waybills.listWaybill.length
					}
					commit('waybills', waybills)
					localStorage.setItem('waybills', JSON.stringify(waybills))
				})
				.catch(err => {
					console.log(err)
					state.loading = false
				})
		},
		async getNewWaybillData ({ commit }) {
			await api.getNewWaybill()
				.then(r => {
					commit('setAllNewWaybillData', r.data)
				})
				.catch(err => {
					console.error(err)
					Snackbar.open({
						message: 'Неизвестная ошибка, повторите позже!',
						type: 'is-danger',
						queue: false
					})
				})
		},
		async apiCloseWaybill({ commit }, id) {
			await api.getCloseWaybill(id)
				.then(r => commit('setCloseWaybill', r.data))
				.catch(err => {
					console.error(err)
					commit('setCloseWaybill', null)
				})
		},
		waybillsSort ({ commit, state }) {
			let waybills 		= state.waybills.listWaybill
					// itemYear 		= (unix) => new Date(unix).getFullYear(),
					// itemMonth 	= (unix) => monthName.num[new Date(unix).getMonth()],
					// itemDay 		= (unix) => new Date(unix).getDate(),
					// itemHours 	= (unix) => new Date(unix).getHours(),
					// itemMinutes = (unix) => new Date(unix).getMinutes(),


			let pagesCount = Math.ceil(waybills.length/4),
					sortWaybills = {},
					carFilterValues = []

			carFilterValues = carFilterValues.filter((v, i, a) => a.indexOf(v) === i)
			state.carFilterValues = carFilterValues

			if (state.carFilter !== null) waybills = waybills.filter(item => item.car.model == state.carFilter)

			for (var i = 0; i < pagesCount; i++) {
				let waybillsCount = (i + 1) * 8,
						y	= 8 * i
						
				sortWaybills[i] = []
				for (y; y < waybillsCount; y++) {
					if (waybills[y]) sortWaybills[i].push(waybills[y])
				}
			}

			let total = 0

			for (var page in sortWaybills) {
				total += sortWaybills[page].length
			}
			
			state.total = total
			commit('waybillsSort', sortWaybills)
		},
		setDates ({ commit, state }) {
			let date = new Date()

			if (state.dateFrom == null) {
				let from = new Date(date.setMonth(date.getMonth() - 3))
				commit('dateFrom', from)
			}

			if (state.dateTo == null) {
				let to = new Date(date.setMonth(date.getMonth() + 1))
				commit('dateTo', to)
			}
		}
	}
}