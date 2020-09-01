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
		waybillsSort: null,
		dateFrom: dateFrom ? new Date(dateFrom) : null,
		dateTo: dateTo ? new Date(dateTo) : null,
		total: null,
		filterType: filterType ? filterType : "range",
		carFilter: null,
		carFilterValues: [],
		newWaybill: newWaybill ? JSON.parse(newWaybill) : null,
		newListDrivers: newListDrivers ? JSON.parse(newListDrivers) : null,
		newListCar: newListCar ? JSON.parse(newListCar) : null
	},
	getters: {
		getNewWaybill: state => state.newWaybill,
		getNewListDrivers: state => state.newListDrivers,
		getNewListCar: state => state.newListCar,
		waybills: state => state.waybills,
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
		dateFrom (state, payload) {
			state.dateFrom = payload
			localStorage.setItem('dateFrom', payload)
		},
		dateTo (state, payload) {
			state.dateTo = payload
			localStorage.setItem('dateTo', payload)
		},
		setFilterType (state, payload) {
			state.filterType = payload
			localStorage.setItem('filterType', payload)
		},
		setCarFilter: (state, payload) => state.carFilter = payload,
		setAllNewWaybillData (state, payload) {
			state.newWaybill = payload.waybill
			state.newListDrivers = payload.listDrivers
			state.newListCar = payload.listCar

			localStorage.setItem('newWaybill', JSON.stringify(state.newWaybill))
			localStorage.setItem('newListDrivers', JSON.stringify(state.newListDrivers))
			localStorage.setItem('newListCar', JSON.stringify(state.newListCar))
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
		async getWaybills ({ commit }) {
			await api.getWaybills()
				.then(res => {
					let waybills = res.data.listWaybill			
					for (var index in waybills) {
						if (waybills[index].car !== null) {
							let model = waybills[index].car.model
							let registrationPlate = waybills[index].car.registrationPlate
							if (model !== null) waybills[index].car.model = model.replace(registrationPlate, '').trim()

							for (var key in waybills[index]) {
								let field = waybills[index][key]
								if (typeof field == 'number') {
									if (!Number.isInteger(field)) {
										waybills[index][key] = waybills[index][key].toFixed(2).replace(".", ",")
									}
								}
							}
						}
					}
					waybills = waybills.filter(item => item.car !== null)
					commit('waybills', waybills)
					localStorage.setItem('waybills', JSON.stringify(waybills))
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
		waybillsSort ({ commit, state }) {
			let waybills 		= state.waybills,
					itemYear 		= (unix) => new Date(unix).getFullYear(),
					itemMonth 	= (unix) => monthName.num[new Date(unix).getMonth()],
					itemDay 		= (unix) => new Date(unix).getDate(),
					itemHours 	= (unix) => new Date(unix).getHours(),
					itemMinutes = (unix) => new Date(unix).getMinutes(),
					curYear 		= new Date().getFullYear(),
					curMonth 		= monthName.num[new Date().getMonth()],
					curDay 			= new Date().getDate()

			
			switch(state.filterType) {

				// Filter by year
				case "year":
					waybills = waybills.filter(item => {
						let itemYear = new Date(item.of).getFullYear()
						if (itemYear == curYear && item.of !== null) return item
					})
					break;

				// Filter by yestarday
				case "yest":
					waybills = waybills.filter(item => {
						let dateTo = new Date(`${curYear}-${curMonth}-${curDay-1} 19:00`),
								dateFrom = new Date(`${curYear}-${curMonth}-${curDay-1} 7:00`),
								itemDate = new Date(`${itemYear(item.of)}-${itemMonth(item.of)}-${itemDay(item.of)}`)

						if ((itemDate.getTime() == dateTo.getTime() || itemDate.getTime() < dateTo.getTime()) && (itemDate.getTime() == dateFrom.getTime() || itemDate.getTime() > dateFrom.getTime())) return item
					})
					break;

				// Filter by month
				case "month":
					waybills = waybills.filter(item => {
						let userDate = `${curYear}-${curMonth}`,
								itemDate = `${itemYear(item.of)}-${itemMonth(item.of)}`
						if (userDate == itemDate && item.of !== null) return item
					})
					break;

				// Filter by today
				case "today":
					waybills = waybills.filter(item => {
						let dateFrom 	= new Date(`${curYear}-${curMonth}-${curDay} 7:00`),
								dateTo 		= new Date(`${curYear}-${curMonth}-${curDay} 19:00`),
								itemDate = new Date(`${itemYear(item.of)}-${itemMonth(item.of)}-${itemDay(item.of)} ${itemHours(item.of)}:${itemMinutes(item.of)}`)
								
						if ((itemDate.getTime() == dateTo.getTime() || itemDate.getTime() < dateTo.getTime()) && (itemDate.getTime() == dateFrom.getTime() || itemDate.getTime() > dateFrom.getTime())) return item
					})
					break;

				// Filter by week
				case "week":
					waybills = waybills.filter(item => {
						let curWeekDay 	= new Date().getDay() - 1,
								weekStart 	= curDay - curWeekDay,
								weekEnd 		= weekStart + 6,
								dateFrom 		= new Date(`${curYear}-${curMonth}-${weekStart} 7:00`).getTime(),
								dateTo 			= new Date(`${curYear}-${curMonth}-${weekEnd} 19:00`).getTime()
						
						if ((item.of < dateTo || item.of > dateFrom) && item.of !== 0) return item
					})
					break;

				// Filter by range
				case "range":
					waybills = waybills.filter(item => {
						let itemDate = new Date(`${itemYear(item.of)}-${itemMonth(item.of)}-${itemDay(item.of)} ${itemHours(item.of)}:${itemMinutes(item.of)}`).getTime()
						
						if ((itemDate == state.dateTo.getTime() || itemDate < state.dateTo.getTime()) && (itemDate == state.dateFrom.getTime() || itemDate > state.dateFrom.getTime())) return item
					})
					break;
			}

			let pagesCount = Math.ceil(waybills.length/4),
					sortWaybills = {},
					carFilterValues = []

			for (var waybill of waybills) {
				
				if (waybill.status)
					switch(waybill.status) {
						case "OPEN":
							waybill.status = {}
							waybill.status.name 	= "OPEN"
							waybill.status.num  	= 0
							waybill.status.text 	= 'Открыт'
							waybill.status.class 	= 'opened'
							break;
						case "CHECK":
							waybill.status.name = "CHECK"
							waybill.status.num  = 1
							waybill.status.text 	= 'Проверка'
							waybill.status.class 	= 'check'
							break;
						case "CLOSE":
							waybill.status = {}
							waybill.status.name = "CLOSE"
							waybill.status.num  = 2
							waybill.status.text 	= 'Закрыт'
							waybill.status.class 	= 'closed'
							break;
					}
					waybill.startFact = new Date().getTime()
					waybill.startPlan = new Date().getTime()
					waybill.finishFact = new Date().getTime()
					waybill.finishPlan = new Date().getTime()

					waybill.workText = 'Уборка участка Кировский район улица Комсомольская 89, пятый двор'
				carFilterValues.push(waybill.car.model)
			}
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