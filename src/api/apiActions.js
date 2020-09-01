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
		return api().post('waybill/open', params)
	},
	closeWaybill(params) {
		return api().post('waybill/close', params)
	}
}