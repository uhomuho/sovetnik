<template lang="pug">
	.container(v-if='chart' @mouseout='hideItem')
		v-stage( 
			:config={
				width: 976,
				height: 425
			})
			v-layer
				v-group(
					v-for='step in steps')
					v-rect(	
						:config=`{
							x: 0,
							y: step.y,
							height: 1,
							width: 907,
							fill: "#EEEEEE"
						}`)
					v-rect(
						:config=`configBg.y ? configBg : null`)
					v-text(
						:config=`{
							x: 5,
							y: step.y - 14,
							text: step.num,
							fontFamily: "Montserrat",
							fontSize: 12,
							fill: "#617E8C"
						}`
					)
				v-group(
					v-if='chart'
					v-for='(item, key) in chart'
					:config=`{
						height: 425,
						width: 907/chart.length
					}`)
					v-rect(
						:config=`configLine && configLine.id == item.id ? configLine : null`)
				v-line(
					:config='line')
				v-group
					v-rect(
						:config='configPopUp.show ? configPopUp : null')
					v-text(
						:config='configPopUpTitle.show ? configPopUpTitle : null')

					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + 16,
							y: configPopUp.y + 110,
							text: "Расход:",
							fontFamily: "Montserrat",
							fill: "#617E8C",
							fontSize: 10
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + configPopUp.width - 100,
							y: configPopUp.y + 99,
							text: configPopUp.fuelDown,
							fontFamily: "Montserrat",
							textAlign: "right",
							fill: "#617E8C",
							fontSize: 24,
							width: 70,
							align: "right"
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + configPopUp.width - 25,
							y: configPopUp.y + 110,
							text: "л/м",
							fontFamily: "Montserrat",
							textAlign: "right",
							fill: "#617E8C",
							fontSize: 10
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + 16,
							y: configPopUp.y + 135,
							text: "Пробег:",
							fontFamily: "Montserrat",
							fill: "#617E8C",
							fontSize: 10
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + configPopUp.width - 100,
							y: configPopUp.y + 125,
							text: configPopUp.totalDistance,
							fontFamily: "Montserrat",
							textAlign: "right",
							fill: "#617E8C",
							fontSize: 24,
							width: 70,
							align: "right"
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + configPopUp.width - 22,
							y: configPopUp.y + 135,
							text: "км",
							fontFamily: "Montserrat",
							textAlign: "right",
							fill: "#617E8C",
							fontSize: 10
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + 16,
							y: configPopUp.y + 160,
							text: "Длительность:",
							fontFamily: "Montserrat",
							fill: "#617E8C",
							fontSize: 10
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + configPopUp.width - 60,
							y: configPopUp.y + 149,
							text: configPopUp.totalTime,
							fontFamily: "Montserrat",
							textAlign: "right",
							fill: "#617E8C",
							fontSize: 24
						}`)
					v-text(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x + configPopUp.width - 28,
							y: configPopUp.y + 160,
							text: "мин",
							fontFamily: "Montserrat",
							textAlign: "right",
							fill: "#617E8C",
							fontSize: 10
						}`)

					v-rect(
						v-if='configPopUp.show'
						:config=`{
							x: configPopUp.x,
							y: configPopUp.y + 90,
							height: 1,
							width: configPopUp.width,
							stroke: "#C4C4C4",
							strokeWidth: 1,
							dash: [4, 4]
						}`)
				v-circle(
					v-for='(item, key) in chart'
					:config='configItem && configItem.id == item.config.id ? configItem : item.config')
				v-group(v-for='(item, key) in chart')
					v-text(
						v-if='item.maxFuelDown'
						:config=`{
							x: item.config.x + 12,
							y: item.config.y - 24,
							text: item.fuelDown,
							fontFamily: "Montserrat",
							fontSize: 24,
							fill: "#F09A9B"
						}`)
					v-text(
						v-if='item.minFuelDown'
						:config=`{
							x: item.config.x + 12,
							y: item.config.y,
							text: item.fuelDown,
							fontFamily: "Montserrat",
							fontSize: 24,
							fill: "#7FCCC6"
						}`)
					v-circle(
						v-if='item.maxFuelDown'
						:config=`{
							x: item.config.x,
							y: item.config.y,
							radius: ((907/items.length)/2),
							fill: "#F09A9B"
						}`)
					v-circle(
						v-if='item.minFuelDown && chart'
						:config=`{
							x: item.config.x,
							y: item.config.y,
							radius: ((907/items.length)/2),
							fill: "#7FCCC6"
						}`)
				v-group
					v-text(
						:config={
							x: 25,
							y: 8,
							text: "Расход топлива\nпо участкам, л/м",
							fontFamily: "Montserrat",
							fontSize: 12,
							fontStyle: 700,
							fill: "#617E8C"
						})
				v-group(
					v-for='step in steps')
						v-rect(
							v-for='(item, key) in chart'
							:config=`{
								x: item.config.x - ((907/items.length)/2),
								y: step.y,
								height: 400/steps.length,
								width: 907/items.length
							}`
							@mousemove='showItem(key, step.y, item)')
</template>

<script>
export default {
	name: 'wbChart',
	data() {
		return {
			configItem: {
				show: true,
				id: null,
				x: null,
				y: null,
				radius: ((907/this.items.length)/2),
				fill: "#F8981D"
			},
			configLine: {
				id: null,
				x: null,
				y: 1,
				width: 0,
				height: 425,
				fill: "rgba(238, 238, 238, 0.3)",
				opacity: 0.1
			},
			configBg: {
				x: 0,
				y: null,
				height: null,
				width: 907,
				fill: "rgba(238, 238, 238, 0.3)",
				opacity: 0.1
			},
			configPopUp: {
				show: false,
				x: null,
				y: null,
				height: null,
				width: null,
				fill: "#FFFFFF",
				shadowBlur: 10,
				shadowOffset: { x: 0, y: 3 },
				shadowColor: "rgba(176, 191, 198, 0.5)",
				shadowOpacity: 0.5,
				stroke: "#C4C4C4",
				strokeWidth: 1,
				dash: [4, 4]
			},
			configPopUpTitle: {
				show: false,
				x: null,
				y: null,
				text: null,
				fontFamily: "Montserrat",
				lineHeight: 1,
				fontSize: 14,
				wrap: "char",
				fill: "#617E8C"
			}
		}
	},
	computed: {
		chart() {
			return this.items
		}
	},
	props: ['items', 'line', 'steps'],
	methods: {
		showItem(key, y, item) {
			let itemConfig = this.chart[key].config
			this.popup = key

			this.configItem.id = itemConfig.id
			this.configItem.x = itemConfig.x
			this.configItem.y = itemConfig.y

			this.configBg.y = y
			this.configBg.height = 400/this.steps.length + 4

			this.configPopUp.show = true
			this.configPopUp.fuelDown = item.fuelDown
			this.configPopUp.totalDistance = item.totalDistance.toFixed(2)
			this.configPopUp.totalTime = this.$moment.utc(this.$moment(new Date(item.firstDT),"DD/MM/YYYY HH:mm:ss").diff(this.$moment(new Date(item.lastDT),"DD/MM/YYYY HH:mm:ss"))).format("mm")
			this.configPopUp.width = 180
			this.configPopUp.height = 200
			if (item.config.x < 449) {
				this.configPopUp.x = item.config.x
			} else {
				this.configPopUp.x = item.config.x - this.configPopUp.width
			}
			if (item.config.y < 150) {
				this.configPopUp.y = item.config.y
			} else {
				this.configPopUp.y = item.config.y - this.configPopUp.height
			}

			this.configPopUpTitle.show = true
			this.configPopUpTitle.width = this.configPopUp.width - 32
			this.configPopUpTitle.x = this.configPopUp.x + 16
			this.configPopUpTitle.y = this.configPopUp.y + 16
			this.configPopUpTitle.text = `${item.firstLocation}\n\n${item.lastLocation}`

			this.configLine.x = itemConfig.x - this.configItem.radius
			if (this.configLine.width == 0) {
				this.configLine.width = 907/this.items.length
			}
		},
		showBg(num) {
			this.bgNum = num
		},
		hideItem() {
			this.configItem.id = null
			this.configItem.x = null
			this.configItem.y = null

			this.configLine.x = null
			if (this.configLine.width !== 0) {
				this.configLine.width = 0
			}

			this.configBg.y = null
			this.configBg.height = null

			this.configPopUp.show = null
			this.configPopUp.fuelDown = null
			this.configPopUp.totalDistance = null
			this.configPopUp.totalTime = null
			this.configPopUp.width = null
			this.configPopUp.height = null
			this.configPopUp.x = null
			this.configPopUp.y = null

			this.configPopUpTitle.show = null
			this.configPopUpTitle.width = null
			this.configPopUpTitle.x = null
			this.configPopUpTitle.y = null
			this.configPopUpTitle.text = null
		},
	}
}
</script>