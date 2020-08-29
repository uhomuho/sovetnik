import api from '@/api'

export default {
	getWaybills() {
		return api().get(`waybill.json`)
	},
	getNewWaybill() {
		return api().get('waybill/open.json')
	}
}