import monthName from '@/month'
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

function setLocalDataNull(data) {
	localStorage.setItem(data, null)
}
setLocalDataNull('dateFrom')
setLocalDataNull('dateTo')
setLocalDataNull('filterType')
// setLocalDataNull('newWaybill')
setLocalDataNull('newListDrivers')
setLocalDataNull('newListCar')
setLocalDataNull('waybills')

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
		filterType: filterType && filterType !== 'null' ? filterType : "range",
		closeWaybill: null,
		newWaybill: newWaybill ? JSON.parse(newWaybill) : null,
		newListDrivers: newListDrivers ? JSON.parse(newListDrivers) : null,
		newListCar: newListCar ? JSON.parse(newListCar) : null,
		loading: false,
		status: ["CLOSE"],
		carsFilter: null,
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
		getCarsFilter: state => state.carsFilter,
	},
	mutations: {
		waybills: (state, payload) => state.waybills = payload,
		waybillsSort: (state, payload) => state.waybillsSort = payload,
		setCloseWaybill: (state, payload) => state.closeWaybill = payload,
		dateFrom (state, payload) {
			state.dateFrom = new Date(payload)
			localStorage.setItem('dateFrom', payload)
		},
		dateTo (state, payload) {
			state.dateTo = new Date(payload)
			localStorage.setItem('dateTo', payload)
		},
		setFilterType (state, payload) {
			state.filterType = payload
			localStorage.setItem('filterType', payload)
		},
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
		setNewWbId (state, payload) {
			state.newWaybill.id = payload.target.value
			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
		},
		setNewWbRegistrationPlate (state, payload) {
			state.newWaybill.car.registrationPlate = payload.target.value
		},
		setNewWbDateOf (state, payload) {
			state.newWaybill.of = payload
			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
		},
		setNewWbCar (state, payload) {
			state.newWaybill.car = payload
			state.newWaybill.serial = payload.serial
			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
		},
		setNewWbDriverName (state, payload) {
			state.newWaybill.driver.name = payload
		},
		setNewWbDriver (state, payload) {
			state.newWaybill.driver = payload
			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
		},
		setNewWbTask (state, payload) {
			state.newWaybill.workText = payload.target.value
			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
		},
		setNewWbFuelStart (state, payload) {
			state.newWaybill.fuelStart = payload.target.value
			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
		},
		setListDrivers(state, payload) {
			state.newListDrivers = payload
			localStorage.setItem('newListDrivers', JSON.stringify(state.newListDrivers))
		},
		setListCars(state, payload) {
			state.newListCar = payload
			localStorage.setItem('newListCar', JSON.stringify(state.newListCar))
		},
		setCarsFilter: (state, payload) => state.carsFilter = payload,
	},
	actions: {
		async getWaybills ({ commit, state }, filter) {
			state.loading = true
			let curYear 		= new Date().getFullYear(),
					curMonth 		= monthName.num[new Date().getMonth()],
					curDay 			= new Date().getDate(),
					timezone 		= `${new Date().getTimezoneOffset()/60}`,
					page 				= filter && filter.page ? filter.page : null,
					params,
					curWeekDay,
					weekStart,
					weekEnd

			if ( `${timezone}`.includes('-') ) {
				timezone = `${timezone}`.replace('-', '')
				timezone = `%2B0${timezone}:00`
			} else {
				timezone = `%2D0${timezone}:00`
			}

			if (filter && filter.byMonth) {
				params = {
					from: {
						year: filter.from.getFullYear(),
						month: monthName.num[filter.from.getMonth()],
						day: '01',
						timezone: timezone
					},
					to: {
						year: filter.from.getFullYear(),
						month: monthName.num[filter.from.getMonth()],
						day: new Date(filter.from.getFullYear(), monthName.num[filter.from.getMonth()],0).getDate(),
						timezone: timezone
					},
					page: page
				}
			} else {
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
			}
			params.status = filter && filter.status ? filter.status.join(',') : null
			params.serial = filter && filter.serial ? filter.serial : null
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
						r.data.of = new Date().getTime()
					commit('setAllNewWaybillData', { waybill: r.data })
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
				.then(r => {
					let waybill = r.data
					if (r.data == "") {
						Snackbar.open({
							message: "Путевой лист не найден!"
						})
						commit('setCloseWaybill', null)
					} else if (waybill.status == "NEW") {
						Snackbar.open({
							message: "Путевой лист ещё не открыт"
						})
						commit('setCloseWaybill', null)
					} else if (waybill.status !== "CLOSE" && waybill.status !== "CHECK") {
						commit('setCloseWaybill', waybill)
					} else {
						Snackbar.open({
							message: 'Путевой лист уже закрыт или находится на проверке'
						})
					}
				})
				.catch((err) => {
					console.log(err)
				})
		},
		async apiCarsFilter({ commit }) {
			api.getCarsFilter()
				.then(r => {
					let groups = r.data
					for (let group in groups) {
						for (let plate in groups[group]) {
							let registrationPlate = groups[group][plate].registrationPlate
							groups[group][plate].registrationPlate = registrationPlate.toLowerCase()
						}
					}
					commit('setCarsFilter', groups)
				})
				.catch(err => {
					console.error(err)
				})
		},
		async apiLastOpenWb({ commit }, serial) {
			api.getLastOpenWb(serial)
				.then(r => {
					if (r.data.waybill !== null) {
						commit('setCloseWaybill', r.data)
						return
					}
					Snackbar.open({
						message: 'Такого путевого листа нет!'
					})
					return
				})
				.catch(err => console.error(err))
		},
		setDates ({ commit }) {
			let date = new Date()

			let from = new Date(date.setMonth(date.getMonth() - 3))
			from = from.setHours(7, 0, 0)
			commit('dateFrom', from)
			let to = new Date(date.setMonth(date.getMonth() + 4))
			to = to.setHours(19, 0, 0)
			commit('dateTo', to)
		}
	}
}