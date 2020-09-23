module.exports = {
	// Адрес сервера 
	backendUrl: "http://tomcat.utyf.ru/",

	// Относительный путь до директории сайта
	publicPath: "/advisor/client/",

	/*---------------------------------------------------------*/
	/* Пути для бэкенда */
	// Путевые листы за период 
	waybill: "waybill.json",

	// Получение путевого листа на открытие 
	getWaybillOpen: "waybill/open.json",

	// Открытие путевого листа 
	setWaybillOpen: "waybill/openJson",

	// Поиск водителя
	drivers: "drivers.json",

	// Поиск автомобиля 
	car: "car.json",

	// Получение последнего путевого листа
	waybillLast: "waybill/last.json",

	// Получение путевого листа на закрытие 
	getWaybillClose: "waybill/close.json",

	// Закрытие путевого листа 
	setWaybillClose: "waybill/close",

	// Отчёт по автографу 
	reportTrack: "report/track.json",

	// Отчёт по путевому листу 
	reportWaybill: "report/waybill.json",

	// Список автомобилей для фильтра путевых листов 
	carGroups: "car-groups.json",

	/*---------------------------------------------------------*/
	/* Глобальные переменные */
	global: {
		// Часовой пояс
		timezone: "+05:00" // Формат: +00:00
	}
}