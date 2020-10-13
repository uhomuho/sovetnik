import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import CryptoJS from 'crypto-js' 
import store from '../store'
import api from '@/api/apiActions'
import { SnackbarProgrammatic as Snackbar } from 'buefy'

// Components
// -> Login/Register
import Login from '@/views/Login'
import Register from '@/views/Register'

// -> Waybills
import Waybills from '@/views/Waybills'
import WaybillsList from '@/views/WaybillsList'
import WaybillsListByCar from '@/views/WaybillsListByCar'
import Open from '@/views/Open'
import Close from '@/views/Close'
import Preview from '@/views/Preview'

// -> Reports 
import Reports from '@/views/Reports'
import WaybillsReports from '@/views/WaybillsReports'
import WaybillReport from '@/views/WaybillReport'
import Autograph from '@/views/Autograph'


const decode = (data) => {
	let returnData = CryptoJS.AES.decrypt(data, 'kFLeCZ19095')
	returnData = returnData.toString(CryptoJS.enc.Utf8)
	return JSON.parse(returnData)
}

const havePermissions = (permission, user) => {
	if (user && user.can[permission]) {
		return true
	} else {
		return false
	}
}

const isAuthentificated = (user) => {
	if (!user || user == null || user == 'null') {
		api.logout()
		return false
	} else {
		return true
	}
}

// Router
export default new Router({
	base: process.env.BASE_URL,
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Login',
			component: Login,
			hidden: true,
			beforeEnter: (to, from, next) => {
				let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
				
				
				if (to.name == 'Login' && isAuthentificated(user)) {
					next({ name: 'OpenWaybill' })
					Snackbar.open({
						message: 'Вы уже авторизованы',
						actionText: null
					})
				} else {
					next()
				}
			}
		},
		{
			path: '/login',
			redirect: '/'
		},
		{
			path: '/register',
			name: 'Register',
			component: Register,
			hidden: true,
			beforeEnter: (to, from, next) => {
				let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
				
				if (to.name == 'Register' && isAuthentificated(user)) {
					next({ name: 'OpenWaybill' })
					Snackbar.open({
						message: 'Вы уже авторизованы',
						actionText: null
					})
				} else {
					next()
				}
			}
		},
		{
			path: '/waybills',
			name: 'Waybills',
			component: Waybills,
			hidden: false,
			props: true,
			children: [
				{
					path: '',
					name: 'WaybillsList',
					menuName: 'Путевые листы',
					menuIcon: 'waybills',
					permission: 'watchWaybillsList',
					component: WaybillsList,
					hidden: false,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'WaybillsList' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'WaybillsList' && !havePermissions('watchWaybillsList', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
				},
				{
					path: 'cars',
					name: 'WaybillsListBycars',
					menuName: 'Путевые листы по авто.',
					menuIcon: 'waybills',
					permission: 'watchWaybillsList',
					component: WaybillsListByCar,
					hidden: false,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'WaybillsList' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'WaybillsList' && !havePermissions('watchWaybillsList', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
				},
				{
					path: 'open',
					name: 'OpenWaybill',
					menuName: 'Открыть путевой лист',
					menuIcon: 'addWaybill',
					permission: 'openWaybill',
					component: Open,
					hidden: false,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'OpenWaybill' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'OpenWaybill' && !havePermissions('openWaybill', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
				},
				{
					path: 'close',
					name: 'CloseWaybillWithoutId',
					menuName: 'Закрыть путевой лист',
					menuIcon: 'closeWaybill',
					permission: 'closeWaybill',
					component: Close,
					hidden: false,
					props: true,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						

						if (to.name == 'CloseWaybillWithoutId' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'CloseWaybillWithoutId' && !havePermissions('closeWaybill', user) ) {
							next({ name: 'OpenWaybill' })
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
					children: [
						{
							path: ':num',
							component: Close,
							hidden: true,
							name: 'CloseWaybill',
							beforeEnter: (to, from, next) => {
								let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
								

								if (to.name == 'CloseWaybill' && !isAuthentificated(user)) {
									next({ name: "Login"})
									Snackbar.open({
										message: 'Сначала войдите или зарегистрируйтесь',
										actionText: null
									})
								} else if (to.name == 'CloseWaybill' && !havePermissions('closeWaybill', user) ) {
									next({ name: "Login"})
									Snackbar.open({
										message: 'Недостаточно прав доступа',
										actionText: null
									})
								} else {
									next()
								}
							},
						}
					]
				},
				{
					path: 'preview',
					name: 'PreviewWaybill',
					component: Preview,
					hidden: true,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'PreviewWaybill' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'PreviewWaybill' && !havePermissions('openWaybill', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
				}
			]
		},
		{
			path: '/reports',
			name: 'Reports',
			menuName: 'Отчеты',
			component: Reports,
			hidden: false,
			children: [
				{
					path: 'waybills',
					name: 'WaybillsReport',
					menuName: 'По путевым листам',
					menuIcon: 'report_menu-item',
					permission: 'reportWaybill',
					component: WaybillsReports,
					hidden: false,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'WaybillsReport' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'WaybillsReport' && !havePermissions('reportWaybill', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
				},
				{
					path: 'waybill',
					name: 'WaybillReport',
					component: WaybillReport,
					hidden: true,
					props: true,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'WaybillReport' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'WaybillReport' && !havePermissions('reportWaybill', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
					children: [
						{
							path: ':id',
							component: WaybillReport,
							hidden: true,
							name: 'WaybillReportByID',
							beforeEnter: (to, from, next) => {
								let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
								
								if (to.name == 'WaybillReportByID' && !isAuthentificated(user)) {
									next({ name: 'Login' })
									Snackbar.open({
										message: 'Сначала войдите или зарегистрируйтесь',
										actionText: null
									})
								} else if (to.name == 'WaybillReportByID' && !havePermissions('reportWaybill', user) ) {
									next({ name: "Login"})
									Snackbar.open({
										message: 'Недостаточно прав доступа',
										actionText: null
									})
								} else {
									next()
								}
							},
						}
					]
				},
				{
					path: 'autograph',
					name: 'Autopraph',
					menuName: 'По автографу',
					menuIcon: 'report_menu-item',
					permission: 'reportAutograph',
					component: Autograph,
					hidden: false,
					beforeEnter: (to, from, next) => {
						let user = localStorage.user && localStorage.user !== 'null' ? decode(localStorage.user) : store.state.user.user && store.state.user.user !== 'null' ? store.state.user.user : null
						
						if (to.name == 'Autopraph' && !isAuthentificated(user)) {
							next({ name: 'Login' })
							Snackbar.open({
								message: 'Сначала войдите или зарегистрируйтесь',
								actionText: null
							})
						} else if (to.name == 'Autopraph' && !havePermissions('reportAutograph', user) ) {
							next({ name: "Login"})
							Snackbar.open({
								message: 'Недостаточно прав доступа',
								actionText: null
							})
						} else {
							next()
						}
					},
				}
			]
		},
		{
			path: '*',
			redirect: '/waybills/open',
			hidden: true
		},
	]
})