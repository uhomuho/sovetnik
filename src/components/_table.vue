<template lang="pug">
	.wrapper#reports_table
		.container(v-if='waybills[0]')
			.table-container
				table.table.is-fullwidth(v-if='')
					thead
						tr
							th.id №
							th.car Машина
							th.start 
								|Выезд,
								br
								span одометр
							th.finish
								|Возвращение,
								br
								span одометр
							th.task Задание
							th.driver Водитель
							th.status Статус

					tbody(v-for='waybill in waybills[currentPage - 1]')
						tr
							td.id {{ waybill.id }}
							td.car.is-paddingless
								table.table.is-fullwidth
									tr
										td {{ waybill.car.model }}
										td.is-lowercase {{ waybill.car.registrationPlate }}
							td.start 
								|{{ dateTimeStamp(waybill.start) }}
								br
								span {{ waybill.mileageStart }}
							td.finish
								|{{ waybill.finish ? dateTimeStamp(waybill.finish) : `&nbsp;` }}
								br
								span {{ waybill.mileageFinish }}
							td.task {{ waybill.workText }}
							td.driver {{ waybill.driver }}
							td.status
			router-link.open(
				to="/waybills/open")
				b-button Открыть путевой лист

			b-pagination(
				:total='total'
				per-page='4'
				:simple='true'
				v-model='currentPage')

		.container(v-else)
			.content
				span.subtitle.has-text-warning Нет путевых листов за данный период
				router-link.open(
					to="/waybills/open")
					b-button Открыть путевой лист

</template>

<script>
import monthName from '@/month'

export default {
	name: 'Table',
	data() {
		return {
			currentPage: 1
		}
	},
	props: ['waybills', 'isLoading', 'total'],
	computed: {
		isEmpty() {
			return this.waybills == {} ? true : false
		}
	},
	methods: {
		noWorkDistance(totalDistance, workDistance) {
			return (totalDistance - workDistance).toFixed(2)
		},
		dateTimeStamp(unix) {
			let date = new Date(unix),
					day = (`${date.getDate()}`.length == 1) ? (`0${date.getDate()}`) : date.getDate(),
					hours = (`${date.getHours()}`.length == 1) ? (`0${date.getHours()}`) : date.getHours()

			return `${day}/${monthName.num[date.getMonth()]} ${hours}:${date.getMinutes()}`
		}
	}
}

</script>
