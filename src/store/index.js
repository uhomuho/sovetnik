import Vue from 'vue'
import Vuex from 'vuex'

// import { ToastProgrammatic as Toast } from 'buefy'

import monthName from '@/month'
import api from '@/api/apiActions'

Vue.use(Vuex)

let dateFrom 		= localStorage.getItem('dateFrom'),
		dateTo			= localStorage.getItem('dateTo')

export default new Vuex.Store({
	state: {
		waybills: null,
		waybillsSort: null,
		dateFrom: dateFrom ? new Date(dateFrom) : null,
		dateTo: dateTo ? new Date(dateTo) : null,
		total: null,
		filterType: "range"
	},
	getters: {
		waybills: state => state.waybills,
		waybillsSortData: state => state.waybillsSort,
		getPagesCount: state => state.pagesCount,
		total: state => state.total,
		getFilterType: state => state.filterType
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
		}
	},
	actions: {
		async getWaybills ({ commit }) {
			await api.getWaybills()
				.then(res => {
					let waybills = res.data.listWaybill
					
					for (var index in waybills) {
						let model = waybills[index].car.model
						let registrationPlate = waybills[index].car.registrationPlate
						if (model !== null) waybills[index].car.model = model.replace(registrationPlate, '').trim()

						// console.log(registrationPlate)
						// let string = ''
						// for (var letter in registrationPlate) {
						// 	if (letter == 0 || letter == 4) {
						// 		string += registrationPlate[letter]+' '
						// 	} else {
						// 		string += registrationPlate[letter]
						// 	}
						// }
						// console.log(string)

						for (var key in waybills[index]) {
							let field = waybills[index][key]
							if (typeof field == 'number') {
								if (!Number.isInteger(field)) waybills[index][key] = waybills[index][key].toFixed(2)
							}
						}
					}
					commit('waybills', waybills)
				})
		},
		waybillsSort ({ commit, state }) {
			let waybills 	= state.waybills,
					// curDate 	= (string) => new Date(string),
					itemYear 	= (unix) => new Date(unix).getFullYear(),
					itemMonth = (unix) => monthName.num[new Date(unix).getMonth()],
					itemDay 	= (unix) => new Date(unix).getDate(),
					curYear 	= new Date().getFullYear(),
					curMonth 	= monthName.num[new Date().getMonth()],
					curDay 		= new Date().getDate()

			
			switch(state.filterType) {

				// Filter by year
				case "year":
					waybills = waybills.filter(item => {
						let itemYear = new Date(item.start).getFullYear()
						if (itemYear == curYear && item.start !== null) return item
					})
					break;

				// Filter by yestarday
				case "yest":
					waybills = waybills.filter(item => {
						let userDate = `${curYear}-${curMonth}-${curDay-1}`,
								itemDate = `${itemYear(item.start)}-${itemMonth(item.start)}-${itemDay(item.start)}`
						if (userDate == itemDate && item.start !== null) return item
					})
					break;

				// Filter by month
				case "month":
					waybills = waybills.filter(item => {
						let userDate = `${curYear}-${curMonth}`,
								itemDate = `${itemYear(item.start)}-${itemYear(item.start)}`
						if (userDate == itemDate && item.start !== null) return item
					})
					break;

				// Filter by today
				case "today":
					waybills = waybills.filter(item => {
						let userDate = `${curYear}-${curMonth}-${curDay}`,
								itemDate = `${itemYear(item.start)}-${itemMonth(item.start)}-${itemDay(item.start)}`
						if (userDate == itemDate && item.start !== null) return item
					})
					break;

				// Filter by week
				case "week":
					waybills = waybills.filter(item => {
						let curWeekDay 	= new Date().getDay() - 1,
								weekStart 	= curDay - curWeekDay,
								weekEnd 		= weekStart + 6,
								dateFrom 		= new Date(`${curYear}-${curMonth}-${weekStart}`),
								dateTo 			= new Date(`${curYear}-${curMonth}-${weekEnd}`)
						
						
						if (item.start < dateTo && item.start > dateFrom && item.start !== 0) return item
					})
					break;

				// Filter by range
				case "range":
					waybills = waybills.filter(item => item.start < state.dateTo)
					waybills = waybills.filter(item => item.start > state.dateFrom)
					break;
			}

			let pagesCount = Math.ceil(waybills.length/4),
					sortWaybills = {}

			for (var i = 0; i < pagesCount; i++) {
				let waybillsCount = (i + 1) * 4,
						y	= 4 * i
						
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
})