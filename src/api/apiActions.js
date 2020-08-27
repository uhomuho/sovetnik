import api from '@/api'

export default {
	getWaybills() {
		return api().get(`waybill.json`)
	}
}