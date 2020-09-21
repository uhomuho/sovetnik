import axios from 'axios'
import config from '../../public/config.js'
import { ToastProgrammatic as Toast } from 'buefy'

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default () => {
	const url = config.backendUrl,
				dev = process.env.NODE_ENV == 'development' ? true : false,
				axiosInstance = axios.create({
					baseURL: `${dev ? 'https://uhomuhoproxy.herokuapp.com/'+url : '/'}`
				}),
				isHandlerEnabled = (config = {}) => !config.handlerEnabled,
				errorHandler = error => {
					if (isHandlerEnabled(error.config) && dev) {
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