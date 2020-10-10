<template lang="pug">
div
	.container#preview(@click='close')
		.section
			.level
				.level-left
					.level-item
						h1
							|Предварительный
							br
							|просмотр
			hr
			.container#wb(v-if='waybill')
				.head
					p.title ПУТЕВОЙ ЛИСТ
					.num.flex-input
						p грузового автомобиля
						input()
						p.has-text-weight-bold №
						input(
							:value='waybill.id'
							@input='setId'
							)
					.date.flex-input
						input(
							type='number'
							:value='dayOf'
							@input='setDay'
							)
						.month
							p.is-lowercase(
								@click='toggleMonthSelector') 
								|{{ monthOf }}

							.month-selector.dropdown(
								:class='showMonthSelector ? "" : "is-hidden"')
								p(
									v-for='month in monthList'
									:key='month.num'
									:class='month.num == monthOfNum ? "selected" : ""'
									@click='setMonth(month.num)')
									|{{ month.name }}

						input(
							type='number'
							:value='yearOf'
							@input='setYear'
							)
						p года
				.organisation.flex-input
					p Организация
					p.info МБУ  Кировский ДЭУ г. Екатеринбург, ул. Вишневая, 69, тел. 374-45-99

				.tile.is-ancestor
					.tile.is-parent
						.tile.is-child
							.model.flex-input
								p Марка автомобиля
								p.info.is-capitalized {{ waybill.car.model }}
							.plate.flex-input
								p Государственный номерной знак
								.input-container
									input#car.is-lowercase(
										@input='getSerial'
										:disabled='waybill.car && waybill.car.registrationPlate ? true : false')
									.tag.is-lowercase(
										v-if='waybill.car && waybill.car.registrationPlate'
										@click='setRegistrationPlate({serial: null, registrationPlate: null}); setNull("#car")')
										|{{ waybill.car ? waybill.car.registrationPlate : "" }}
										img.delete( src="@/assets/icons/delete.svg" )

								.plates.dropdown(v-if='plates')
									p(
										v-for='plate in plates'
										@click='setCar(plate), plates = null'
										:class='waybill.car && plate.serial == waybill.car.serial ? "selected" : null') 
										|{{ plate.registrationPlate }}
							.driver.flex-input
								p Водитель
								.input-container
									input#driver(
										@input='getDriver'
										:disabled='waybill.driver && waybill.driver.name ? true : false'
									)
									.tag(	
										v-if='waybill.driver && waybill.driver.name'
										@click='setDriver(null), setNull("#driver")')
										|{{ waybill.driver ? waybill.driver.name : "" }}
										img.delete( src="@/assets/icons/delete.svg" )

								.drivers.dropdown(v-if='drivers')
									p(
										v-for='driver in drivers'
										@click='setDriver(driver), drivers = null'
										:class='waybill.driver && driver.id == waybill.driver.id ? "selected" : null')
										|{{ driver.name }}
							.ticket.flex-input
								p Удостоверение №
								p.info {{ waybill.serial }}
								p Класс
								p.info
							.license-card.flex-input
								p Лицензионная карточка
								p.info стандартная
							.register-num.flex-input
								p Регистрационный №
								p.info
								p Серия
								p.info
								p №
								p.info
							.trailer.flex-input
								p Прицеп 1
								p.info
								p Гос. номерной знак
								p.info
								p Гаражный номер
								p.info
							.trailer.flex-input
								p Прицеп 2
								p.info
								p Гос. номерной знак
								p.info
								p Гаражный номер
								p.info
							.faces.flex-input
								p Сопровождающие лица:

							.pre-table-title
								p.is-uppercase ЗАДАНИЕ ВОДИТЕЛЮ

							table.table.is-bordered.is-fullwidth
								tr
									td
										|в чье распоряжение
										br
										|(наименование и адрес заказчика)
									td
										p время, ч., мин.
										table
											tr
												td прибытия
												td убытия
									td
										p количество
										table
											tr
												td часов
												td ездок
								tr
									td
										input(
											:value='waybill.workText'
											@input='setTask'
											)
									td
									td
								tr
									td
									td
									td
							.check.flex-input
								p 
									|Водительское удостоверение проверил,
									br 
									|задание выдал, выдать горючего
								p.info
								p литров
							.dispetcher.flex-input
								p Диспетчер
								p.info
							.health.flex-input
								p 
									|Водитель по состоянию здоровья
									br
									|к управлению допущен
								p.info

						.tile.is-child
							.table-title
								p Работа водителя и автомобиля
							table.first.table.is-fullwidth.is-bordered
								tr
									td операция
									td
										p время по графику
										table
											tr
												td число
												td месяц
												td час
												td мин
									td 
										|нулевой
										br
										|пробег,
										br
										|км
									td
										|показание
										br
										|спидометра,
										br
										|км
									td
										|время фактическое
										br
										|число, месяц, ч., мин
								tr
									td 1
									td
										table
											tr
												td 2
												td 3
												td 4
												td 5
									td 6
									td 7
									td 8
								tr
									td выезд из гаража
									td
										table
											tr.time
												td {{ startDate }}
												td {{ startMonth }}
												td {{ startHours }}
												td {{ startMinutes }}
									td
									td 
										input(
											:value='waybill.mileageStart'
											)
									td
								tr
									td возвращение в гараж
									td
										table
											tr.time
												td {{ finishDate }}
												td {{ finishMonth }}
												td {{ finishHours }}
												td {{ finishMinutes }}
									td
									td
									td

							table.second.table.is-bordered.is-fullwidth
								tr
									td
										p.title Движение горючего
										table.table.is-fullwidth
											tr
												td.other
													p прочее
													table.table.is-fullwidth
														tr
															td марка
															td 
																|код
																br
																|марки
												td.given
													|выдано,
													br
													|л
												td.remain
													p остаток при
													table.table.is-fullwidth
														tr
															td
																|выезде,
																br
																|л
															td
																|возвращении,
																br
																|л
												td.passoff
													|сдано,
													br
													|л
												td.factor
													|коэффициент
													br
													|изменения
													br
													|нормы
									td
										p 
											|время работы,
											br
											|ч. мин.
										table.table.is-fullwidth
											tr
												td
													p
														|спецобору
														br
														|дования
												td 
													p двигателя
								tr
									td
										table.table.is-fullwidth.need-border
											tr
												td.other
													table.table.is-fullwidth
														tr
															td.has-text-weight-bold {{ waybill.car ? waybill.car.fuelType : "" }}
															td
												td.given
												td.remain
													table.table.is-fullwidth
														tr
															td 
																input(
																	:value='waybill.fuelStart'
																	@input='setFuelStart'
																	)
															td
												td.passoff
												td.factor
									td
										table.table.is-fullwidth.right-table
											tr
												td
												td
								tr
									td
										table.table.is-fullwidth
											tr
												td.other
													table.table.is-fullwidth
														tr
															td 
															td
												td.given
												td.remain
													table.table.is-fullwidth
														tr
															td
															td
												td.passoff
												td.factor
									td
										table.table.is-fullwidth.right-table
											tr
												td
												td
								tr
									td
										table.table.is-fullwidth
											tr
												td.other
													table.table.is-fullwidth
														tr
															td 
															td
												td.given
												td.remain
													table.table.is-fullwidth
														tr
															td
															td
												td.passoff
												td.factor
									td
										table.table.is-fullwidth.right-table
											tr
												td
												td
							.accept.flex-input
								p 
									|Автомобиль технически исправен.
									br
									|Выезд разрешен. Механик
								p.info

							.take-driver.flex-input
								p Автомобиль принял. Водитель
								p.info.is-capitalized {{ waybill.driver ? waybill.driver.name : "" }}

							.well.flex-input
								p При возвращении автомобиль 
								p.info
							
							.wb-footer.flex-input
								p Сдал водитель
								p.info.is-capitalized {{ waybill.driver ? waybill.driver.name : "" }}
								p Принял механик
								p.info

			.button.is-pulled-right(
				@click='open'
				v-if='!opened')
				|Создать
			.button.is-pulled-right(
				style="margin-right: 2rem"
				@click='print'
				v-if='opened')
				|Печать

</template>

<script>
import { mapMutations, mapState } from 'vuex'
import monthName from '@/month'
import { SnackbarProgrammatic as Snackbar } from 'buefy'
import api from '@/api/apiActions'

export default {
	name: 'WaybillPreview',
	data() {
		return {
			plates: null,
			drivers: null,
			showMonthSelector: false,
			monthList: [
				{
					num: 1,
					name: 'Январь'
				},
				{
					num: 2,
					name: 'Февраль'
				},
				{
					num: 3,
					name: 'Март'
				},
				{
					num: 4,
					name: 'Апрель'
				},
				{
					num: 5,
					name: 'Май'
				},
				{
					num: 6,
					name: 'Июнь'
				},
				{
					num: 7,
					name: 'Июль'
				},
				{
					num: 8,
					name: 'Август'
				},
				{
					num: 9,
					name: 'Сентябрь'
				},
				{
					num: 10,
					name: 'Октябрь'
				},
				{
					num: 11,
					name: 'Ноябрь'
				},
				{
					num: 12,
					name: 'Декабрь'
				},
			],
			errors: {
				dateErr: true
			},
			opened: false
		}
	},
	computed: {
		...mapState('waybills', {
			waybill: state => state.newWaybill
		}),
		dayOf() {
			return new Date(this.waybill.of).getDate()
		},
		monthOf() {
			return monthName.string[new Date(this.waybill.of).getMonth()].toLowerCase()
		},
		monthOfNum() {
			return new Date(this.waybill.of).getMonth() + 1 
		},
		yearOf() {
			return new Date(this.waybill.of).getFullYear()
		},
		startDate() {
			return this.validateData(new Date(this.waybill.startPlan).getDate())
		},
		startMonth() {
			return this.validateData(monthName.num[new Date(this.waybill.startPlan).getMonth()])
		},
		startHours() {
			return this.validateData(new Date(this.waybill.startPlan).getHours())
		},
		startMinutes() {
			return this.validateData(new Date(this.waybill.startPlan).getMinutes())
		},
		finishDate() {
			return this.validateData(new Date(this.waybill.finishPlan).getDate())
		},
		finishMonth() {
			return this.validateData(monthName.num[new Date(this.waybill.finishPlan).getMonth()])
		},
		finishHours() {
			return this.validateData(new Date(this.waybill.finishPlan).getHours())
		},
		finishMinutes() {
			return this.validateData(new Date(this.waybill.finishPlan).getMinutes())
		}
	},
	methods: {
		...mapMutations('waybills', {
			setId: 'setNewWbId',
			setPlate: 'setNewWbRegistrationPlate',
			setOf: 'setNewWbDateOf',
			setCar: 'setNewWbCar',
			setDriverName: 'setNewWbDriverName',
			setDriver: 'setNewWbDriver',
			setTask: 'setNewWbTask',
			setFuelStart: 'setNewWbFuelStart'
		}),
		validateData(data) {
			return `${data}`.length == 1 ? `0${data}` : data
		},
		setRegistrationPlate(obj) {
			this.registrationPlate = obj.registrationPlate
			this.waybill.serial = obj.serial
			this.waybill.car = obj
		},
		setDay(e) {
			if(!(e.target.value > 31)) {
				this.setOf(new Date(`${this.yearOf}-${this.monthOfNum}-${e.target.value}`).getTime())
				this.errors.dateErr = false
			} else {
				Snackbar.open({
					type: 'is-error',
					message: 'Слишком большое число!',
					queue: false
				})
				this.errors.dateErr = true
			}
		},
		setMonth(num) {
			this.setOf(new Date(`${this.yearOf}-${num}-${this.dayOf}`).getTime())
			this.showMonthSelector = false
		},
		setYear(e) {
			if (!(e.target.value < 1970)) {
				this.setOf(new Date(`${e.target.value}-${this.monthOfNum}-${this.dayOf}`).getTime())
			}
		},
		toggleMonthSelector() {
			this.showMonthSelector = !this.showMonthSelector
		},
		getSerial(e) {
			let key = e.target.value
			if (key.length !== 0) {
				api.getPlates(key)
					.then(r => {
						if (r.data.length == 0) {
							this.plates = null
						} else {
							this.plates = r.data
						}
					})
			} else {
				this.plates = null
			}
		},
		getDriver(e) {
			let key = e.target.value
			if (key.length !== 0) {
				api.getDrivers(key)
					.then(r => {
						if (r.data.length == 0) {
							this.drivers = null
						} else {
							this.drivers = r.data
						}
					})
			}
		},
		open() {
			if (!this.opened) {
				this.waybill.mileageStart = `${this.waybill.mileageStart}`
				if (this.waybill.mileageStart.includes(',')) {
					this.waybill.mileageStart = parseInt(this.waybill.mileageStart.replace(",", "."))
				}
				this.waybill.fuelStart = `${this.waybill.fuelStart}`
				if (this.waybill.fuelStart.includes(',')) {
					this.waybill.fuelStart = parseInt(this.waybill.fuelStart.replace(",", "."))
				}
				api.createWaybill(this.waybill)
					.then(r => {
						if (r.data.message) {
							Snackbar.open({
								message: `${r.data.message} №${this.waybill.id}`,
								duration: 2000,
								position: 'is-top-right',
								actionText: null
							})
							localStorage.setItem('newWaybill', null)
							localStorage.lastWb = null
							this.opened = true
						} else if (r.data.error) {
							Snackbar.open({
								message: r.data.error,
								duration: 1500,
								position: 'is-top-right',
								actionText: null
							})
						}
					})
					.catch(err => {
						console.error(err)
					})
			} else {
				Snackbar.open({
					message: 'Путевой лист уже открыт!',
					duration: 1500,
					position: 'is-top-right',
					type: 'is-danger',
					actionText: null
				})
			}
		},
		setNull(id) {
			document.querySelector(id).value = ""
		},
		print() {
			api.download(this.waybill.id)
				.then(res => {
					let url = res.request.responseURL
					window.open(url, '_blank')
				})
				.catch(err => console.log(err))
		},
		mounted() {
			if (!this.waybill) {
				this.$router.push('/waybills/open')
			}
		},
		close(e) {
			if(!e.target.matches('.month-selector *, .month *')) {
				if (this.showMonthSelector) {
					this.showMonthSelector = false
				}
			}
			if(!e.target.matches('.month-selector *, .month *')) {
				if (this.showMonthSelector) {
					this.showMonthSelector = false
				}
			}
		}
	}
}
</script>

<style lang="sass" scoped>

#preview.container
	.section
		padding: 
			right: 6rem
			left: 6rem

#wb
	padding: 2.5rem 2rem
	margin: 0 -3rem
	border: 1px solid #B0BFC6 
	*
		position: relative
		z-index: 1
	p
		font-size: .5rem
		color: $graphite6
		&.info
			font-size: .625rem 
			font-weight: bold
			text-transform: lowercase
			text-align: left
			margin-left: .2rem
			padding-left: .4rem
			border-bottom: 1px solid $graphite2
			display: block
		&.title
			font-size: .875rem
			margin-bottom: 0
		&.has-text-weight-bold
			font-size: .75rem
	input
		font-weight: bold
		border: none
		border-bottom: 1px solid $graphite2
		box-shadow: none
		&:-internal-autofill-selected
			background-color: transparent!important
		&:focus
			outline: none
		// &:
		// 	color: $graphite6!important
		// 	background-color: #fff	
	.flex-input
		display: flex
		justify-content: flex-start
		align-items: flex-end
		input
			padding-left: .4rem
			color: $blue4
	.dropdown
		border: 1px dashed $graphite1
		padding: .3rem 1rem .8rem
		background-color: #fff
		width: fit-content
		max-height: 15rem
		display: flex
		flex-direction: column
		align-items: flex-start
		justify-content: flex-start
		margin: 0 auto
		position: absolute
		top: 100%
		left: 0
		right: 0
		z-index: 99
		overflow: scroll
		-ms-overflow-style: none
		scrollbar-width: none
		
		&::-webkit-scrollbar
			display: none
		p
			cursor: pointer
		p.selected
			font-weight: bold
			color: #fff
			background-color: $graphite4
			border-radius: 4px
	.head
		padding-left: 13.625rem
		z-index: 9
		.num
			input
				text-align: center
				color: $blue4
				width: 10.5rem
				margin: 0 .7rem 0 1.25rem
		.date
			margin-top: .25rem
			margin-bottom: 1.25rem
			.month
				position: relative
				&>p
					font-size: .75rem
					font-weight: bold
					text-align: center
					color: $blue4
					width: 8.6rem
					margin-right: 1rem
					border-bottom: 1px solid $graphite2
					cursor: pointer
				.month-selector
					p
						font-size: .8rem
						display: block
						padding: .15rem .3rem
						cursor: pointer
			input
				text-align: center
				color: $blue4
				margin-right: .5rem
				-moz-appearance:textfield
				&::-webkit-outer-spin-button,
				&::-webkit-inner-spin-button
					-webkit-appearance: none

				&:first-of-type
					width: 3.375rem
					margin-left: 3rem
					margin-right: 1rem
				&:last-of-type
					width: 3.5rem
	.organisation
		margin-bottom: 1.25rem
		p.info
			text-transform: unset
			width: 45rem
	.tile.is-child
		display: flex
		flex-direction: column
		align-items: flex-start
		justify-content: flex-end
		&:first-of-type
			width: 45%
			padding-right: .8rem
			.flex-input
				p:first-of-type
					margin-right: .5rem
				&+.flex-input
					margin-top: .4rem
			.model
				p.info
					width: 15.875rem
			.plate
				position: relative
				z-index: 99
				input
					width: 12.3rem
				.tag
					font-size: .625rem
					font-weight: bold
					display: flex
					align-items: center
					justify-content: flex-start
					position: absolute
					bottom: .3rem
					left: .2rem
					cursor: pointer
					&:hover
						.delete
							display: block
					.delete
						display: none
						min-width: 15px
						min-height: 15px
						max-width: 15px
						max-height: 15px
						margin-left: .3rem
						background: transparent
				.plates
					p
						padding: .15rem .2rem
			.driver
				z-index: 98
				input
					width: 18.6rem
				.tag
					font-size: .625rem
					font-weight: bold
					display: flex
					align-items: center
					justify-content: flex-start
					position: absolute
					bottom: .3rem
					left: .2rem
					cursor: pointer
					&:hover
						.delete
							display: block
					.delete
						display: none
						min-width: 15px
						min-height: 15px
						max-width: 15px
						max-height: 15px
						margin-left: .3rem
						background: transparent
				.drivers
					p
						padding: .15rem .2rem
			.ticket
				p
					&:nth-of-type(2)
						width: 8rem
						margin-right: 1rem
					&:last-of-type
						width: 5.4rem
			.license-card
				p.info
					width: 14.4875rem
			.register-num
				p
					&:nth-of-type(2)
						width: 3.3125rem
						margin-right: .5rem
					&:nth-of-type(4)
						width: 4rem
						margin-right: .5rem
					&:last-of-type
						width: 4.4rem
			.trailer
				p
					&:nth-of-type(2)
						width: 2.5rem
						margin-right: .5rem
					&:nth-of-type(4)
						width: 2.5rem
						margin-right: .5rem
					&:last-of-type
						width: 2.35rem
			.pre-table-title
				text-align: center
				width: 100%
				margin-top: .8125rem
				margin-bottom: .625rem
			
			.table
				margin-bottom: 1rem
				input
					border: none
					color: $blue4
					font-size: .5rem
					font-weight: bold
					width: 90%
				td, p
					font-size: .5rem
					text-align: center
					vertical-align: middle
				tr
					td
						&:first-of-type
							width: 66%
						&:nth-of-type(2)
							width: 20%
						&:last-of-type
							width: 14%
				&>tr
					&>td
						&:nth-of-type(2),
						&:last-of-type
							padding: 0
							p
								margin: .3rem 0
						table
							tr
								td
									border-bottom: none
									&:first-of-type
										border-left: none
									&:last-of-type
										border-right: none
					&:not(:first-of-type)
						td
							padding: .5rem 0
			
			.check
				.info
					width: 6.2rem
					margin-right: .5rem
			.dispetcher
				.info
					width: 6.2rem
			.health
				.info
					width: 6.2rem

		&:last-of-type
			min-width: 58%
			.table-title
				letter-spacing: .25rem
				font-size: .5rem
				text-align: center
				width: 100%
				padding: .33rem
				border: 1px solid $graphite1
				border-bottom: none
			.table.first
				margin-bottom: 1.25rem
				*
					font-size: .5rem
					line-height: .625rem
				&>tr
					&>td
						text-align: center
						vertical-align: middle
						padding-top: .3rem
						padding-bottom: .3rem 
						height: 100%
						input
							color: $blue4
							border-bottom: unset
						&:first-of-type
							width: 23%
						&:nth-of-type(2)
							width: 30.6%
							padding: 0
							vertical-align: bottom
							p
								padding-bottom: .6rem
							table
								width: 100%
								td
									width: 25%
									padding: .3rem 0
									border-bottom: none
									vertical-align: middle
									&:first-of-type
										border-left: none
									&:last-of-type
										border-right: none
						&:nth-of-type(3)
							width: 11.3%
						&:nth-of-type(4)
							width: 15.5%
						&:last-of-type
							width: 19.3%
					&:last-of-type,
					&:nth-of-type(3)
						td
							&:first-of-type
								text-align: left
					&:last-of-type,
					&:nth-of-type(3),
					&:nth-of-type(2)
						&>td
							&:nth-of-type(2)
								table
									height: 100%
									width: 100%
									tr.time
										td
											font-weight: bold
									td
										width: 25%
										border-top: none
										border-bottom: 0
										text-align: center
			
			.table.second
				.need-border
					border-top: 1px solid #dbdbdb
				input
					border-bottom: 0
					width: 80%
					color: $blue4
				.title
					font-weight: normal
					letter-spacing: .25rem
					text-align: center
					padding: .45rem 0
				td
					vertical-align: middle
					*
						font-size: .5rem
						line-height: 100%
						text-align: center
						vertical-align: middle
				&>tr
					&>td
						padding: 0
						vertical-align: bottom
						&>p
							padding-bottom: .7rem
						&:first-of-type
							width: 80%
						&:last-of-type
							width: 20%
						&>table
							&>tr
								&>td
									padding: 0
									border-bottom: none
									&:first-of-type
										border-left: none
									&:last-of-type
										border-right: none
									p
										padding: .3rem 0
									table
										height: 100%
										tr
											td
												border-bottom: none
												&:first-of-type
													border-left: none
												&:last-of-type
													border-right: none
					&:last-of-type,
					&:nth-of-type(3),
					&:nth-of-type(2)
						
						
						&>td
							&>table
								height: 100%
								&>tr
									&>td
										border-top: none
										table
											td
												border-top: none
					.other
						min-width: 20%
						width: 20%
						td
							width: 50%
							padding-right: 0
							padding-left: 0
					.given
						min-width: 12%
						width: 12%
					.remain
						min-width: 33.5%
						width: 33.5%
						td
							min-width: 50%
							width: 50%
							padding-left: 0
							padding-right: 0 
					.passoff
						min-width: 9.5%
						width: 9.5%
					.factor
						min-width: 25%
						width: 25%
					.right-table
						td
							width: 51%
			.flex-input
				&+.flex-input
					margin-top: 1rem
				.info
					width: 6.1875rem
				&.wb-footer
					p:nth-of-type(3)
						margin-left: 3.125rem
.button
	margin-top: 2rem
	margin-bottom: 2rem
hr
	height: 1px
	background: $graphite6
</style>