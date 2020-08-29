import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import waybills from '@/store/waybillsModule'

const Store = new Vuex.Store({})

Store.registerModule('waybills', waybills)

export default Store