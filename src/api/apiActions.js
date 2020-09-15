import api from '@/api'
import config from '../../public/config.json'

export default {
	getWaybills(params) {
		let perPage = config["Количество путевых листов на странице"],
				method 	= config["Путевые листы за период"]
		return api().get(`${method}
											?from=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00${params.from.timezone}
											&to=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00${params.to.timezone}
											&size=${perPage}
											&page=${params.page ? params.page - 1 : 0}
											${params.status ? '&status='+params.status : ''}${params.serial ? '&serial='+params.serial : ''}`)
	},
	getNewWaybill() {
		let method = config["Получение путевого листа на открытие"]
		return api().get(method)
	},
	getDrivers(keyword) {
		let method = config["Поиск водителя"]
		return api().get(`${method}?keyword=${keyword}`)
	},
	getPlates(keyword) {
		let method = config["Поиск автомобиля"]
		return api().get(`${method}?keyword=${keyword}`)
	},
	getLastWb(params) {
		let method = config["Получение последнего путевого листа"]
		return api().get(`${method}?serial=${params.serial}&status=CLOSE`)
	},
	createWaybill(params) {
		let method = config["Открытие путевого листа"]
		return api().post(method, params)
	},
	closeWaybill(params) {
		let method = config["Закрытие путевого листа"]
		return api().post(method, params)
	},
	getCloseWaybill(id) {
		let method = config["Получение путевого листа на закрытие"]
		return api().get(`${method}?id=${id}`)
	},
	getAutographReport(params) {
		let method = config["Отчёт по автографу"]
		return api().get(`${method}?start=${params.from.year}-${params.from.month}-${params.from.day}T07%3A00%2B03:00&end=${params.to.year}-${params.to.month}-${params.to.day}T19%3A00%2B03:00`)
	},
	getWaybillReport(params) {
		let method = config["Отчёт по путевому листу"]
		return api().get(`${method}?id=${params}`)
	},
	getCarsFilter() {
		let method = config["Список автомобилей для фильтра путевых листов"]
		return api().get(method)
	}
}