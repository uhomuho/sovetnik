module.exports = {
	// Адрес сервера 
	backendUrl: "http://tomcat.utyf.ru/",

	// Относительный путь до директории сайта
	publicPath: "/",

	/*---------------------------------------------------------*/
	/* Пути для бэкенда */
	// Путевые листы за период 
	waybill: "waybill",

	// Получение путевого листа на открытие 
	getWaybillOpen: "waybill/open",

	// Открытие путевого листа 
	setWaybillOpen: "waybill/open",

	// Поиск водителя
	drivers: "drivers",

	// Поиск автомобиля 
	car: "car",

	// Получение последнего путевого листа
	waybillLast: "waybill/last",

	// Получение путевого листа на закрытие 
	getWaybillClose: "waybill/close",

	// Закрытие путевого листа 
	setWaybillClose: "waybill/close",

	// Отчёт по автографу 
	reportTrack: "report/track",

	// Отчёт по путевому листу 
	reportWaybill: "report/waybill",

	// Список автомобилей для фильтра путевых листов 
	carGroups: "car-groups",

	/*---------------------------------------------------------*/
	/* Глобальные переменные */
	global: {
		// Часовой пояс
		timezone: "+05:00" // Формат: +00:00
	}
}