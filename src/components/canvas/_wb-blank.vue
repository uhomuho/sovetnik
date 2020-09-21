<template lang="pug">
.container
	v-stage( :config='stageConfig' )
		v-layer
			//- Container
			v-rect( :config='containerConfig' )

			//- Title
			v-text( :config={
				x: 101,
				y: 17,
				text: "ПУТЕВОЙ ЛИСТ",
				fontFamily: "Montserrat",
				fontSize: 6.50877,
				fontStyle: 700,
				fill: "#253238"
			} )
			v-text( :config={
				x: 101,
				y: 28.8,
				text: "грузового автомобиля",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 165.97,
				y: 32.54,
				width: 77.64,
				height: 0.464912,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 248.73,
				y: 27.89,
				text: "№",
				fontFamily: "Montserrat",
				fontSize: 5.57895,
				fontStyle: 700,
				fill: "#253238"
			} )
			v-rect(
				:config={
					x: 257.1,
					y: 26,
					width: 77.18,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='id')
			v-rect( 
				:config={
					x: 257.1,
					y: 26,
					width: 77.18,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			v-rect(
				:config={
					x: 126.47,
					y: 36,
					width: 25.11,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateOf')
			v-rect(
				:config={
					x: 126.47,
					y: 36,
					width: 25.11,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			v-rect(
				:config={
					x: 156.21,
					y: 36,
					width: 64.16,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateOf')
			v-rect(
				:config={
					x: 156.21,
					y: 36,
					width: 64.16,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-else)

			v-rect(
				:config={
					x: 224.55,
					y: 36,
					width: 19.06,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateOf')
			v-rect(
				:config={
					x: 224.55,
					y: 36,
					width: 19.06,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-else)
			v-text( :config={
				x: 245.47,
				y: 39.05,
				text: "года",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )


			//- Организация
			v-text( :config={
				x: 13.95,
				y: 53,
				text: "Организация",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 41.84,
				y: 55.79,
				width: 359.38,
				height: 0.464912,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 45.1,
				y: 50.68,
				text: "МБУ  Кировский ДЭУ г.Екатеринбург, ул.Вишневая, 69, тел. 374-45-99",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238"
			} )

			//- Марка авто
			v-text( :config={
				x: 13.95,
				y: 80.89,
				text: "Марка автомобиля",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 55.32,
				y: 84.15,
				width: 118.09,
				height: 0.464912,
				fill: "#B0BFC6"
			} )
			//- v-text( :config={
			//- 	x: 58.11,
			//- 	y: 79.04,
			//- 	text: "Камаз",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238"
			//- } )
			v-rect(
				:config={
					x: 55.11,
					y: 76.7,
					width: 117.09,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='model')
			v-rect(
				:config={
					x: 55.11,
					y: 76.7,
					width: 117.09,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			//- Гос номер
			v-text( :config={
				x: 13.95,
				y: 90.19,
				text: "Государственный номерной знак",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 83.68,
				y: 93.45,
				width: 89.73,
				height: 0.464912,
				fill: "#B0BFC6"
			} )
			v-rect(
				:config={
					x: 83.68,
					y: 86.01,
					width: 88.8,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='registrationPlate')
			v-rect(
				:config={
					x: 83.68,
					y: 86.01,
					width: 88.8,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			//- Водитель
			v-text( :config={
				x: 13.95,
				y: 100.49,
				text: "Водитель",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 37.19,
				y: 103.28,
				width: 136.22,
				height: 0.464912,
				fill: "#B0BFC6"
			} )
			v-rect(
				:config={
					x: 38.12,
					y: 95.38,
					width: 134.36,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='driver')
			v-rect( 
				:config={
					x: 38.12,
					y: 95.38,
					width: 134.36,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			//- Удостоверение
			v-text( :config={
				x: 13.95,
				y: 108.79,
				text: "Удостоверение №",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 55.32,
				y: 111.58,
				width: 91.12,
				height: 0.464912,
				fill: "#B0BFC6"
			} )
			//- v-text( :config={
			//- 	x: 57.18,
			//- 	y: 106.46,
			//- 	text: "597099",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238"
			//- } )
			v-rect(
				:config={
					x: 55.18,
					y: 104.41,
					width: 90.12,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='serial')
			v-rect(
				:config={
					x: 55.18,
					y: 104.41,
					width: 90.12,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			v-text( :config={
				x: 150.17,
				y: 108.79,
				text: "Класс",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 169.23,
				y: 111.58,
				width: 42.31,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			//- Лицензионная карточка
			v-text( :config={
				x: 13.95,
				y: 118.09,
				text: "Лицензионная карточка",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 65.09,
				y: 120.88,
				width: 146.45,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			//- Регистрационный номер
			v-text( :config={
				x: 13.95,
				y: 127.39,
				text: "Регистрационный №",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 58.58,
				y: 130.18,
				width: 39.52,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			v-text( :config={
				x: 101.35,
				y: 127.39,
				text: "Серия",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 115.3,
				y: 130.18,
				width: 29.75,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			v-text( :config={
				x: 148.77,
				y: 127.39,
				text: "№",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 156.21,
				y: 130.18,
				width: 55.32,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			//- Прицеп 1
			v-text( :config={
				x: 13.95,
				y: 136.68,
				text: "Прицеп 1",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 33.47,
				y: 139.47,
				width: 29.75,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			v-text( :config={
				x: 65.55,
				y: 136.68,
				text: "Гос. номерной знак",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 105.54,
				y: 139.47,
				width: 29.75,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			v-text( :config={
				x: 139.01,
				y: 136.68,
				text: "Гаражный номер",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 176.67,
				y: 139.47,
				width: 34.87,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			//- Прицеп 2
			v-text( :config={
				x: 13.95,
				y: 145.98,
				text: "Прицеп 2",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 33.47,
				y: 148.77,
				width: 29.75,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			v-text( :config={
				x: 65.55,
				y: 145.98,
				text: "Гос. номерной знак",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 105.54,
				y: 148.77,
				width: 29.75,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			v-text( :config={
				x: 139.01,
				y: 145.98,
				text: "Гаражный номер",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 176.67,
				y: 148.77,
				width: 34.87,
				height: 0.464912,
				fill: "#B0BFC6"
			} )

			//- Сопровождающие лица
			v-text( :config={
				x: 13.95,
				y: 155.28,
				text: "Сопровождающие лица:",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )

			//- ЗАДАНИЕ ВОДИТЕЛЮ
			v-text( :config={
				x: 85.08,
				y: 164.58,
				text: "ЗАДАНИЕ ВОДИТЕЛЮ",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			//- Табличка
			v-rect( :config={
				x: 13.95,
				y: 172.48,
				width: 197.59,
				height: 39.51,
				stroke: "#B0BFC6",
				strokeWidth: .5
			} )
			v-text( :config={
				x: 47.89,
				y: 176.67,
				text: "в чье распоряжение\n(наименование и адрес заказчика)",
				align: "center",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-text( :config={
				x: 150.63,
				y: 174.81,
				text: "время, ч., мин.",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-text( :config={
				x: 187.5,
				y: 174.81,
				text: "количество",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-text( :config={
				x: 147,
				y: 183.64,
				text: "прибытия",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-text( :config={
				x: 168,
				y: 183.64,
				text: "убытия",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-text( :config={
				x: 185.5,
				y: 183.64,
				text: "часов",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-text( :config={
				x: 199.4,
				y: 183.64,
				text: "ездок",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
			} )
			v-rect( :config={
				x: 13.95,
				y: 190.15,
				width: 197.59,
				height: 11.62,
				stroke: "#B0BFC6",
				strokeWidth: .5
			} )
			v-rect( :config={
				x: 144.59,
				y: 172.5,
				width: 39.05,
				height: 39.51,
				stroke: "#B0BFC6",
				strokeWidth: .5
			} )
			v-rect( :config={
				x: 145.05,
				y: 181.32,
				width: 66.48,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 165.97,
				y: 181.5,
				height: 30.5,
				width: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 197.59,
				y: 181.5,
				height: 30.5,
				width: .5,
				fill: "#B0BFC6"
			} )
			v-rect(
				:config={
					x: 16.74,
					y: 192.47,
					width: 126.46,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='task')
			v-rect(
				:config={
					x: 16.74,
					y: 192.47,
					width: 126.46,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			//- Водит. удост. проверил
			v-text( :config={
				x: 13.95,
				y: 219.44,
				text: "Водительское удостоверение проверил,\nзадание выдал, выдать горючего",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 94.84,
				y: 227.81,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 143.19,
				y: 224.55,
				text: "литров",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )

			//- Диспетчер
			v-text( :config={
				x: 13.95,
				y: 234.32,
				text: "Диспетчер",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 39.05,
				y: 237.57,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 51.14,
				y: 233.85,
				text: "Ильина Н.В.",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 700,
				fill: "#253238"
			} )

			//- Водитель допущен
			v-text( :config={
				x: 13.95,
				y: 242.68,
				text: "Водитель по состоянию здоровья\nк управлению допущен",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 84.15,
				y: 251.05,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 88.33,
				y: 246.4,
				text: "Мещерякова Е.С.",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 700,
				fill: "#253238"
			} )

			//- Табличка 2
			v-rect( :config={
				x: 223.16,
				y: 65.09,
				width: 242.68,
				height: 55.79,
				stroke: "#B0BFC6",
				strokeWidth: .2
			} )
			//- Title
			v-text( :config={
				x: 310.61,
				y: 68.41,
				text: "Работа водителя и автомобиля",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			//- tr/td
			v-rect( :config={
				x: 223.16,
				y: 74.39,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 278.95,
				y: 74.39,
				width: .5,
				height: 46.03,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 297.08,
				y: 83.68,
				width: .5,
				height: 36.73,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 316.14,
				y: 83.68,
				width: .5,
				height: 36.73,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 334.27,
				y: 83.68,
				width: .5,
				height: 36.73,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 353.33,
				y: 74.39,
				width: .5,
				height: 46.03,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 380.76,
				y: 74.39,
				width: .5,
				height: 46.03,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 418.42,
				y: 74.39,
				width: .5,
				height: 46.03,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 279.41,
				y: 83.68,
				width: 73.92,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 92.98,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 102.28,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 111.58,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			//- Text
			v-text( :config={
				x: 239.04,
				y: 82.36,
				text: "операция",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 298.94,
				y: 76.71,
				text: "время по графику",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 282.67,
				y: 87.01,
				text: "число",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 301.26,
				y: 87.01,
				text: "месяц",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 322.18,
				y: 87.01,
				text: "час",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 339.85,
				y: 87.01,
				text: "мин",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 358,
				y: 78.32,
				text: "нулевой\nпробег,\nкм",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 387.27,
				y: 78.12,
				text: "показание\nспидометра,\nкм",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 423.07,
				y: 78.12,
				text: "время фактическое\nчисло, месяц, ч., мин",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 247.33,
				y: 96.31,
				text: "1",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 287.32,
				y: 96.31,
				text: "2",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 306.38,
				y: 96.31,
				text: "3",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 324.04,
				y: 96.31,
				text: "4",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 343.11,
				y: 96.31,
				text: "5",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 364.96,
				y: 96.31,
				text: "6",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 398.43,
				y: 96.31,
				text: "7",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 441.67,
				y: 96.31,
				text: "8",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 226.02,
				y: 105.54,
				text: "выезд из гаража",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 226.02,
				y: 114.97,
				text: "возвращение в гараж",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			//- v-text( 
			//- 	:config={
			//- 		x: 285.46,
			//- 		y: 105,
			//- 		text: "24",
			//- 		fontFamily: "Montserrat",
			//- 		fontSize: 4.64912,
			//- 		fontStyle: 700,
			//- 		fill: "#253238",
			//- 		align: "center"
			//- 	} 
			//- 	v-if='dateStart')
			v-rect(
				:config={
					x: 280.46,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateStart')
			v-rect(
				:config={
					x: 280.46,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-text( :config={
			//- 	x: 304.05,
			//- 	y: 105,
			//- 	text: "06",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 299,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateStart')
			v-rect(
				:config={
					x: 299,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-text( :config={
			//- 	x: 322.65,
			//- 	y: 105,
			//- 	text: "19",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 317.5,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateStart')
			v-rect(
				:config={
					x: 317.5,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-text( :config={
			//- 	x: 340.78,
			//- 	y: 105,
			//- 	text: "00",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 336,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateStart')
			v-rect(
				:config={
					x: 336,
					y: 103.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- 
			//- v-text( :config={
			//- 	x: 285.46,
			//- 	y: 113.51,
			//- 	text: "25",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 280.46,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateFinish')
			v-rect(
				:config={
					x: 280.46,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-text( :config={
			//- 	x: 304.05,
			//- 	y: 113.51,
			//- 	text: "06",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 299,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateFinish')
			v-rect(
				:config={
					x: 299,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-text( :config={
			//- 	x: 322.65,
			//- 	y: 113.51,
			//- 	text: "07",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 317.5,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateFinish')
			v-rect(
				:config={
					x: 317.5,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-text( :config={
			//- 	x: 340.78,
			//- 	y: 113.51,
			//- 	text: "00",
			//- 	fontFamily: "Montserrat",
			//- 	fontSize: 4.64912,
			//- 	fontStyle: 700,
			//- 	fill: "#253238",
			//- 	align: "center"
			//- } )
			v-rect(
				:config={
					x: 336,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='dateFinish')
			v-rect(
				:config={
					x: 336,
					y: 112.5,
					width: 15.5,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			v-rect(
				:config={
					x: 384.02,
					y: 103.35,
					width: 31.15,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='mileageLast')
			v-rect(
				:config={
					x: 384.02,
					y: 103.35,
					width: 31.15,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)
			//- v-rect( :config={
			//- 	x: 421.68,
			//- 	y: 103.35,
			//- 	width: 41.38,
			//- 	height: 7.44,
			//- 	fill: `${dateStart ? "#7FCCC6" : "#F09A9B"}`
			//- } )
			//- v-rect( :config={
			//- 	x: 384.02,
			//- 	y: 112.64,
			//- 	width: 31.15,
			//- 	height: 7.44,
			//- 	fill: "#F09A9B"
			//- } )
			//- v-rect( :config={
			//- 	x: 421.68,
			//- 	y: 112.64,
			//- 	width: 41.38,
			//- 	height: 7.44,
			//- 	fill: "#F09A9B"
			//- } )

			//- Табличка 3
			v-rect( :config={
				x: 223.16,
				y: 130.18,
				width: 242.68,
				height: 55.79,
				stroke: "#B0BFC6",
				strokeWidth: .2
			} )
			//- Title
			v-text( :config={
				x: 323.75,
				y: 132.96,
				text: "Движение горючего",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			//- tr/td
			v-rect( :config={
				x: 223.16,
				y: 139.47,
				width: 194.8,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 241.75,
				y: 148.77,
				width: .5,
				height: 37.19,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 260.35,
				y: 139.47,
				width: .5,
				height: 46.49,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 283.6,
				y: 139.47,
				width: .5,
				height: 46.49,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 315.68,
				y: 148.77,
				width: .5,
				height: 37.19,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 348.68,
				y: 139.47,
				width: .5,
				height: 46.49,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 367.28,
				y: 139.47,
				width: .5,
				height: 46.49,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 417.96,
				y: 130.18,
				width: .5,
				height: 55.79,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 441.67,
				y: 148.77,
				width: .5,
				height: 37.19,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 148.77,
				width: 37.19,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 283.6,
				y: 148.77,
				width: 65.09,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 417.96,
				y: 148.77,
				width: 47.89,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 158.07,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 167.37,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-rect( :config={
				x: 223.16,
				y: 176.67,
				width: 242.68,
				height: .5,
				fill: "#B0BFC6"
			} )
			//- Text
			v-text( :config={
				x: 228.67,
				y: 161.39,
				text: "Д/т",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 234.32,
				y: 142.8,
				text: "прочее",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 226.41,
				y: 151.7,
				text: "марка",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 245.4,
				y: 149.7,
				text: "код\nмарки",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 263.14,
				y: 149.7,
				text: "выдано,\nл",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 305.45,
				y: 142.8,
				text: "остаток при",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 290.57,
				y: 149.7,
				text: "выезде,\nл",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 318,
				y: 149.7,
				text: "возвращении,\nл",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 352.4,
				y: 149.7,
				text: "сдано,\nл",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 379.3,
				y: 143.73,
				text: "коэффициент\nизменения\nнормы",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 429.58,
				y: 135.75,
				text: "время работы,\nч. мин.",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 419.35,
				y: 150.24,
				text: "спецобору\nдования",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			v-text( :config={
				x: 443.99,
				y: 151.1,
				text: "двигателя",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238",
				align: "center"
			} )
			//- v-rect( :config={
			//- 	x: 263.14,
			//- 	y: 159.34,
			//- 	width: 17.2,
			//- 	height: 7.44,
			//- 	fill: "#F09A9B"
			//- } )
			v-rect(
				:config={
					x: 291.04,
					y: 159.34,
					width: 17.2,
					height: 7.44,
					fill: "#7FCCC6"
				}
				v-if='fuelLast')
			v-rect(
				:config={
					x: 291.04,
					y: 159.34,
					width: 17.2,
					height: 7.44,
					fill: "#F09A9B"
				}
				v-else)

			//- Тех исправен
			v-text( :config={
				x: 228.27,
				y: 196.19,
				text: "Автомобиль технически исправен.\nВыезд разрешен. Механик",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 302.19,
				y: 204.56,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 304.05,
				y: 198.98,
				text: "Беляев",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238"
			} )

			//- Выдал
			v-text( :config={
				x: 228.27,
				y: 215.25,
				text: "Автомобиль принял. Водитель",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 302.66,
				y: 218.97,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 304.05,
				y: 213.39,
				text: "Садыков А.Р.",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238"
			} )

			//- При возврате
			v-text( :config={
				x: 228.27,
				y: 229.2,
				text: "При возвращении автомобиль ",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-text( :config={
				x: 302.19,
				y: 228.27,
				text: "исправен",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238",
				textDecoration: "underline"
			} )
			v-text( :config={
				x: 302.19,
				y: 233.85,
				text: "неисправен",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )

			//- Сдал водитель
			v-text( :config={
				x: 228.27,
				y: 247.8,
				text: "Сдал водитель",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 260.82,
				y: 251.52,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 261.28,
				y: 245.94,
				text: "Садыков А.Р.",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238"
			} )

			//- Принял механик
			v-text( :config={
				x: 330.09,
				y: 247.8,
				text: "Принял механик",
				fontFamily: "Montserrat",
				fontSize: 3.7193,
				fontStyle: 400,
				fill: "#253238"
			} )
			v-rect( :config={
				x: 367.28,
				y: 251.52,
				width: 46.03,
				height: .5,
				fill: "#B0BFC6"
			} )
			v-text( :config={
				x: 367.75,
				y: 245.94,
				text: "Беляев",
				fontFamily: "Montserrat",
				fontSize: 4.64912,
				fontStyle: 700,
				fill: "#253238"
			} )
</template>

<script>
export default {
	name: 'WbBlank',
	data() {
		return {
			stageConfig: {
				width: 472,
				height: 260,
			},
			containerConfig: {
				x: 0,
				y: 0,
				width: 472,
				height: 260,
				stroke: "#B0BFC6",
				strokeWidth: 1
			}
		}
	},
	props: ['id', 'dateOf', 'dateStart', 'dateFinish', 'registrationPlate', 'serial', 'model', 'driver', 'task', 'mileageLast', 'fuelLast'],
	beforeMount() {
	}
}
</script>