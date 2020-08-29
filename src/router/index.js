import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Components
import Login from '@/views/Login'
import Reports from '@/views/Reports'
import Waybill from '@/views/Waybill'
import Waybills from '@/views/Waybills'
import Create from '@/views/Create'
import Close from '@/views/Close'

// Router
export default new Router({
	base: process.env.BASE_URL,
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'Главная',
			component: Login,
			// image: 'svg',
			hidden: true,
			meta: {
				
			},
			redirect: '/waybills',
		},
		{
			path: '/waybills',
			name: 'Waybills',
			menuName: 'Путевые листы',
			component: Waybills,
			hidden: false,
			meta: {
				
			}
		},
		{
			path: '/waybills/open',
			name: 'OpenWaybill',
			menuName: 'Открыть путевой лист',
			component: Create,
			hidden: false,
			meta: {
			
			}
		},
		{
			path: '/waybills/close',
			name: 'CloseWaybill',
			menuName: 'Закрыть путевой лист',
			component: Close,
			hidden: false,
			props: true,
			children: [
				{
					path: ':id',
					name: 'CloseWaybillById',
					menuName: 'Закрыть путевой лист',
					component: Close,
					hidden: true,
					props: true
				}
			]
		},
		{
			path: '/waybills/:id',
			name: 'Аналитика по смене',
			component: Waybill,
			hidden: true,
			props: true,
			meta: {
				
			}
		},
		{
			path: '/analitycs',
			name: 'Отчёт по сменам',
			component: Reports,
			hidden: true,
			meta: {
				
			}
		},
		{
			path: '*',
			redirect: '/waybills',
			hidden: true
		},
	]
})