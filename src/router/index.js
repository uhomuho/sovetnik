import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Components
// -> Login/Register
import Login from '@/views/Login'
import Register from '@/views/Register'

// -> Waybills
import Waybills from '@/views/Waybills'
import WaybillsList from '@/views/WaybillsList'
import Open from '@/views/Open'
import Close from '@/views/Close'
import Preview from '@/views/Preview'

// -> Reports 
import Reports from '@/views/Reports'
import WaybillsReports from '@/views/WaybillsReports'
import WaybillReport from '@/views/WaybillReport'
import Autograph from '@/views/Autograph'

// import store from '@/store'
// console.log(store.state.waybills.newWaybill)

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
			redirect: '/waybills/open'
		},
		{
			path: '/login',
			redirect: '/'
		},
		{
			path: '/register',
			name: 'Register',
			component: Register,
			hidden: true
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
					component: WaybillsList,
					hidden: false
				},
				{
					path: 'open',
					name: 'OpenWaybill',
					menuName: 'Открыть путевой лист',
					menuIcon: 'addWaybill',
					component: Open,
					hidden: false
				},
				{
					path: 'close',
					name: 'CloseWaybillWithoutId',
					menuName: 'Закрыть путевой лист',
					menuIcon: 'closeWaybill',
					component: Close,
					hidden: false,
					props: true,
					children: [
						{
							path: ':num',
							component: Close,
							hidden: true,
							name: 'CloseWaybill',
						}
					]
				},
				{
					path: 'preview',
					name: 'PreviewWaybill',
					component: Preview,
					hidden: true
				}
			]
		},
		{
			path: '/reports',
			name: 'Reports',
			menuName: 'Отчеты',
			component: Reports,
			hidden: false,
			redirect: '/waybills/open',
			children: [
				{
					path: 'waybills',
					name: 'WaybillsReport',
					menuName: 'По путевым листам',
					menuIcon: 'report_menu-item',
					component: WaybillsReports,
					hidden: false
				},
				{
					path: 'waybill',
					name: 'WaybillReport',
					component: WaybillReport,
					hidden: true,
					props: true,
					children: [
						{
							path: ':id',
							component: WaybillReport,
							hidden: true
						}
					]
				},
				{
					path: 'autograph',
					name: 'Autopraph',
					menuName: 'По автографу',
					menuIcon: 'report_menu-item',
					component: Autograph,
					hidden: false
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