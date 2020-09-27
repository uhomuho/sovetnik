import api from '@/api'
// import config from '../../public/config.json'
import config from '../../public/config.js'

export default {
	login(params) {
		console.log(params)
		return api().post('/login', params)
	},
	getWaybills(params) {
		let method 	= config.waybill
		return api().get(`${method}
											?from=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00${params.from.timezone}
											&to=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00${params.to.timezone}
											&page=${params.page ? params.page - 1 : 0}
											${params.status ? '&status='+params.status : ''}${params.serial ? '&serial='+params.serial : ''}`)
	},
	getNewWaybill() {
		let method = config.getWaybillOpen
		return api().get(method)
	},
	getDrivers(keyword) {
		let method = config.drivers
		return api().get(`${method}?keyword=${keyword}`)
	},
	getPlates(keyword) {
		let method = config.car
		return api().get(`${method}?keyword=${keyword}`)
	},
	getLastWb(params) {
		let method = config.waybillLast
		return api().get(`${method}?serial=${params.serial}&status=CLOSE`)
	},
	getLastOpenWb(keyword) {
		let method = config.waybillLast
		return api().get(`${method}?serial=${keyword}&status=OPEN`)
	},
	createWaybill(params) {
		let method = config.setWaybillOpen
		return api().post(method, params)
	},
	closeWaybill(params) {
		let method = config.setWaybillClose
		return api().post(`${method}`, params)
	},
	getCloseWaybill(id) {
		let method = config.getWaybillClose
		return api().get(`${method}?id=${id}`)
	},
	getAutographReport(params) {
		let method = config.reportTrack
		return api().get(`${method}?start=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00${params.from.timezone}&end=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00${params.to.timezone}`)
	},
	getWaybillReport(params) {
		let method = config.reportWaybill
		return api().get(`${method}?id=${params}`)
	},
	getCarsFilter() {
		let method = config.carGroups
		return api().get(method)
	}
}