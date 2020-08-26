// Style
import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'

// Core
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.use(Buefy)

// Router && Store
import router from './router'
import store from './store'

// Main Component
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
	router,
	store,
  render: h => h(App),
}).$mount('#app')
