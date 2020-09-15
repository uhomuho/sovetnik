import api from '@/api'
import config from '../../public/config.json'

export default {
	getWaybills(params) {
		let perPage = config.waybillsPerPage
		return api().get(`waybill.json?from=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00${params.from.timezone}&to=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00${params.to.timezone}&size=${perPage}&page=${params.page ? params.page - 1 : 0}`)
	},
	getNewWaybill() {
		return api().get('waybill/open.json')
	},
	getDrivers(keyword) {
		return api().get(`drivers.json?keyword=${keyword}`)
	},
	getPlates(keyword) {
		return api().get(`car.json?keyword=${keyword}`)
	},
	getLastWb(params) {
		return api().get(`waybill/last.json?serial=${params.serial}&status=CLOSE`)
	},
	createWaybill(params) {
		return api().post('waybill/openJson', params)
	},
	closeWaybill(params) {
		return api().post('waybill/close', params)
	},
	getCloseWaybill(id) {
		return api().get(`waybill/close.json?id=${id}`)
	},
	getAutographReport(params) {
		return api().get(`report/track.json?start=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00%2B03:00&end=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00%2B03:00`)
	},
	getWaybillReport(params) {
		return api().get(`report/waybill.json?id=${params}`)
	}
}