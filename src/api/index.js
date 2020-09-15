import axios from 'axios'
import config from '../../public/config.json'
import { ToastProgrammatic as Toast } from 'buefy'

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default () => {
	const url = config["Адрес сервера"],
				axiosInstance = axios.create({
					baseURL: `${config["Использование прокси"] ? 'https://uhomuhoproxy.herokuapp.com/' : ''}${url}`
				}),
				isHandlerEnabled = (config = {}) => !config.handlerEnabled,
				errorHandler = error => {
					if (isHandlerEnabled(error.config)) {
						Toast.open({
							message: 'Ошибка при получении данных!',
							type: 'is-danger',
							position: 'is-bottom-right',
							queue: false
						})
					}
					return Promise.reject(error)
				},
				successHandler = response => {
					return response
				}

	axiosInstance.interceptors.response.use(
		response => successHandler(response),
		error => errorHandler(error)
	)

	return axiosInstance
}