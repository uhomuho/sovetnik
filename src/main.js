// Style
import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'

// Core
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.use(Buefy, {
	defaultSnackbarDuration: 2000,
	defaultSnackbarPosition: 'is-top-right'
})

// Router && Store
import router from './router'
import store from './store'

// Main Component
import App from './App.vue'

// Common libs
import VueKonva from 'vue-konva'
Vue.use(VueKonva)
import Moment from 'moment'
Vue.prototype.$moment = Moment

Vue.config.productionTip = false

new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app')
