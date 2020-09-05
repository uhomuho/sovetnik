import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import waybills from '@/store/waybillsModule'
import reports from '@/store/reportsModule'

const Store = new Vuex.Store({})

Store.registerModule('waybills', waybills)
Store.registerModule('reports', reports)

export default Store