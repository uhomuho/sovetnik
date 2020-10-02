import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import waybills from '@/store/waybillsModule'
import reports from '@/store/reportsModule'
import user from '@/store/userModule'

const Store = new Vuex.Store({})

Store.registerModule('waybills', waybills)
Store.registerModule('reports', reports)
Store.registerModule('user', user)

export default Store