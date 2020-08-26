import Vue from 'vue'
import Vuex from 'vuex'

// import { ToastProgrammatic as Toast } from 'buefy'

import api from '@/api/apiActions'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		waybills: null,
		paginationData: null
	},
	getters: {
		waybills: state => state.waybills,
		paginationData: state => state.paginationData
	},
	mutations: {
		waybills(state, payload) {
			state.waybills = payload
		},
		paginationData(state, payload) {
			state.paginationData = payload
		}
	},
	actions: {
		async getWaybills ({ commit }, range) {
			await api.getWaybills(range)
				.then(res => {
					let waybills = res.data.data
					for (var index in waybills) {
						for (var key in waybills[index]) {
							if (key !== 'carSerial' && key !== 'model' && waybills[index][key] !== null) {
								waybills[index][key] = waybills[index][key].toFixed(2) 
							}
						}
					}
					let pagesCount = Math.ceil(waybills.length/4),
							waybillsSort = {}
					
					let paginationData = {
						pages: pagesCount,
						total: waybills.length
					}
					commit('paginationData', paginationData)
					for (var i = 0; i < pagesCount-1; i++) {
						let waybillsCount = (i + 1) * 4,
								y	= 4 * i
								
						waybillsSort[i] = []
						for (y; y < waybillsCount; y++) {
							waybillsSort[i].push(waybills[y])
						}
					}

					if (res.data.data.length == 0) {
						// Toast.open({
						// 	message: 'Ничего не найдено!',
						// 	type: 'is-warning',
						// 	position: 'is-bottom-right',
						// 	queue: false
						// })
						waybillsSort = {
							false: true
						}
						commit('waybills', waybillsSort)
					} else {
						commit('waybills', waybillsSort)
					}
				})
		}
	}
})