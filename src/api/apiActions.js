import api from '@/api'

export default {
	getWaybills() {
		return api().get(`waybill.json`)
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
	getAutographReport(params) {
		return api().get(`report/track.json?start=${params.from.year}-${params.from.month}-${params.from.day}T07:00&end=${params.to.year}-${params.to.month}-${params.to.day}T19:00`)
	},
	getWaybillReport(params) {
		return api().get(`report/waybill.json?id=${params}`)
	}
}