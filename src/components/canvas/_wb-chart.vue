<template lang="pug">
	.container(v-if='chart' @mouseout='hideItem')
		v-stage( 
			:config={
				width: 976,
				height: 425
			})
			v-layer
				v-group(
					v-for='step in steps'
					:key='step.num')
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
							fontSize: 12,
							fill: "#617E8C"
						}`
					)
				v-group(
					v-if='chart'
					v-for='(item, key) in chart'
					:key='key'
					:config=`{
						height: 425,
						width: 907/chart.length
					}`)
					v-rect(
						:config=`configLine && configLine.id == item.id ? configLine : null`)
					v-rect(
						:config=`{
							width: 907/chart.length,
							height: 425,
							x: item.config.x - configItem.radius,
							y: 0
						}`)
				v-line(
					:config='line')
				v-circle(
					v-for='(item, key) in chart'
					:key='key'
					:config='configItem && configItem.id == item.config.id ? configItem : item.config')
				v-group(
					v-for='(item, key) in chart'
					:key='key')
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
							fontSize: 12,
							fontStyle: 700,
							fill: "#617E8C"
						})
				v-group(
					v-for='step in steps'
					:key='step.num')
						v-rect(
							v-for='(item, key) in chart'
							:key='key'
							:config=`{
								x: items[key].config.x - ((907/items.length)/2),
								y: step.y,
								height: 400/steps.length,
								width: 907/items.length
							}`
							@mousemove='showItem(key, step.y)')
</template>

<script>
export default {
	name: 'wbChart',
	data() {
		return {
			popup: null,
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
		showItem(key, y) {
			let itemConfig = this.chart[key].config
			this.popup = key

			this.configItem.id = itemConfig.id
			this.configItem.x = itemConfig.x
			this.configItem.y = itemConfig.y

			this.configBg.y = y
			this.configBg.height = 400/this.steps.length + 4

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

			this.bg = false
		},
	}
}
</script>