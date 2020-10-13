import api from '@/api'

export default {
	download(id) {
		return api().get(`/waybill/print?id=${id}`)
	},
	login(params) {
		return api().post('/login', params)
	},
	logout() {
		return api().get('/logout')
	},
	getWaybills(params) {
		return api().get(`waybill
											?from=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00${params.from.timezone}
											&to=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00${params.to.timezone}
											&page=${params.page ? params.page - 1 : 0}
											${params.status ? '&status='+params.status : ''}${params.serial ? '&serial='+params.serial : ''}`)
	},
	getNewWaybill() {
		return api().get('waybill/open')
	},
	getDrivers(keyword) {
		return api().get(`drivers?keyword=${keyword}`)
	},
	getPlates(keyword) {
		return api().get(`car?keyword=${keyword}`)
	},
	getLastWb(params) {
		return api().get(`waybill/last?serial=${params.serial}&status=CLOSE`)
	},
	getLastOpenWb(keyword) {
		return api().get(`waybill/last?serial=${keyword}&status=OPEN`)
	},
	createWaybill(params) {
		return api().post('waybill/open', params)
	},
	closeWaybill(params) {
		return api().post(`waybill/close`, params)
	},
	getCloseWaybill(id) {
		return api().get(`waybill/close?id=${id}`)
	},
	getAutographReport(params) {
		return api().get(`report/track?start=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00${params.from.timezone}&end=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00${params.to.timezone}`)
	},
	getWaybillReport(params) {
		return api().get(`report/waybill?id=${params}`)
	},
	getCarsFilter() {
		return api().get('car-groups')
	}
}