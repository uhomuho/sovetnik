import api from '@/api'

export default {
	getWaybills(params) {
		return api().get(`report/track.json?start=${params.from}&end=${params.to}`)
	}
}