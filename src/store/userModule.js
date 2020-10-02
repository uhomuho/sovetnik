
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

export default {
	namespaced: true,
	store: {
		user: null
	},
	getters: {
		getUser: state => state.user
	},
	mutations: {
		setUser: ( state, payload ) => {state.user = payload; console.log(state.user)}
	},
	actions: {
		login: ({ commit }, data) => {
			api.login(data)
				.then(r => {
					let data = r.data
					if ( data.status ) {
						localStorage.user = JSON.stringify(data)
						commit('setUser', data)
					} else {
						if ( !data.status && data.error === "Bad Credentials" ) {
							return Snackbar.open({
								message: 'Логин или пароль введён неверно!',
								type: 'is-warning'
							})
						} else {
							return Snackbar.open({
								message: 'Неизвестная ошибка!',
								type: 'is-danger'
							})
						}
					}
				})
		},
		isLocalUser: ({ commit, state }) => {
			if ((localStorage.user && localStorage.user !== 'null') && (!state.user || (state.user == 'null' || state.user == null))) {
				commit('setUser', JSON.parse(localStorage.user))
			}
		}
	}
}