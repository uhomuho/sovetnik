import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Components
import Login from '@/views/Login'
import Reports from '@/views/Reports'
import Report from '@/views/Report'
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
			image: 'svg',
			hidden: true,
			meta: {
				breadcrumbs: [
					{
						to: '/',
						text: 'Главная'
					}
				]
			},
			redirect: '/analitycs',
		},
		{
			path: '/analitycs',
			name: 'Отчёт по сменам',
			component: Reports,
			hidden: false,
			meta: {
				breadcrumbs: [
					{
						to: '/',
						text: 'Главная'
					},
					{
						to: '/analitycs',
						text: 'Аналитика'
					}
				]
			}
		},
		{
			path: '/reports/:id',
			name: 'Аналитика по смене',
			component: Report,
			hidden: true,
			props: true,
			meta: {
				breadcrumbs: [
					{
						to: '/',
						text: 'Главная'
					},
					{
						to: '/reports',
						text: 'Аналитика'
					},
					{
						to: '/reports/:id',
						text: 'Аналитика по смене'
					}
				]
			}
		},
		{
			path: '/waybills',
			name: 'Оператор',
			component: Waybills,
			hidden: true,
			meta: {
				breadcrumbs: [
					{
						to: '/',
						text: 'Главная'
					},
					{
						to: '/waybills',
						text: 'Оператор'
					}
				]
			}
		},
		{
			path: '/waybills/create',
			name: 'Открытие маршрутного листа',
			component: Create,
			hidden: true,
			meta: {
				breadcrumbs: [
					{
						to: '/',
						text: 'Главная'
					},
					{
						to: '/waybills',
						text: 'Оператор'
					},
					{
						to: '/waybills/create',
						text: 'Открытие маршрутного листа'
					}
				]
			}
		},
		{
			path: '/waybills/close/:id',
			name: 'Закрытие маршрутного листа',
			component: Close,
			hidden: true,
			props: true,
			meta: {
				breadcrumbs: [
					{
						to: '/',
						text: 'Главная'
					},
					{
						to: '/waybills',
						text: 'Оператор'
					},
					{
						to: '/waybills/close/:id',
						text: 'Закрытие маршрутного листа'
					}
				]
			}
		},
		{
			path: '*',
			redirect: '/analitycs',
			hidden: true
		},
	]
})