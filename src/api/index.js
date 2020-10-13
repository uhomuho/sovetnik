import axios from 'axios'
import { ToastProgrammatic as Toast, SnackbarProgrammatic as Snackbar } from 'buefy'
import router from '../router'
import store from '../store'
import api from '@/api/apiActions'

axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

export default () => {
	const url = 'http://tomcat.utyf.ru/',
				dev = process.env.NODE_ENV == 'development' ? true : false,
				axiosInstance = axios.create({
					baseURL: `${dev ? 'https://uhomuhoproxy.herokuapp.com/'+url+'api/' : '/api/'}`
				}),
				isHandlerEnabled = (config = {}) => !config.handlerEnabled,
				errorHandler = error => {
					if (isHandlerEnabled(error.config)) {
						if (error.response.status !== 403 && error.response.status !== 401) {
							Toast.open({
								message: `${error.response.statusText}, with status ${error.response.status}`,
								type: 'is-danger',
								position: 'is-top-right',
								queue: false
							})
						} else {
							store.state.user.user = null
							localStorage.user = null
							api.logout()
							Snackbar.open({
								message: 'Сессия истекла!',
								position: 'is-top-right',
								actionText: null,
								duration: 2300
							})
							router.push('/login')
						}
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