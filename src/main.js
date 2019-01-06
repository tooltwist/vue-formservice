import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import ContentService from 'vue-contentservice';
import Formservice from './components/index.js';

import TestInLayout from './testapp/TestInLayout.vue'
import TestStandalone from './testapp/TestStandalone.vue'

import Practice1 from './testapp/Practice1.vue'
import Practice2 from './testapp/Practice2.vue'
import Practice3 from './testapp/Practice3.vue'
import Practice4 from './testapp/Practice4.vue'
import Practice5 from './testapp/Practice5.vue'


import ADLEntryNotice from './testapp/ADLEntryNotice.vue'

import AUQLDREPMT13_EntryNotice from './testapp/AUQLDREPMT13-EntryNotice.vue'
import AUQLDREPMT14_NoticeIntentionToSell from './testapp/AUQLDREPMT14-NoticeIntentionToSell.vue'
import AUQLDREPMT15_NoticeRemedyBreach from './testapp/AUQLDREPMT15-NoticeRemedyBreach.vue'
import AUQLDREPMT17_NoticeToLeave from './testapp/AUQLDREPMT17-NoticeToLeave.vue'
import AUQLDREPMT24_AbandonmentTerminationNotice from './testapp/AUQLDREPMT24-AbandonmentTerminationNotice.vue'
import AUQLDREPMT25_DisputeResolutionRequest from './testapp/AUQLDREPMT25-DisputeResolutionRequest.vue'
import AUQLDREPMT39_EntryNotice_RoomingAccommodation from './testapp/AUQLDREPMT39-EntryNotice-RoomingAccommodation.vue'
import AUQLDREPMT40_NoticeRemedyBreach_RoomingAccommodation from './testapp/AUQLDREPMT40-NoticeRemedyBreach-RoomingAccommodation.vue'
import AUQLDREPMT41_NoticeLeave_RoomingAccommodation from './testapp/AUQLDREPMT41-NoticeLeave-RoomingAccommodation.vue'
import AUQLDREPMT47_NoticeRentIncrease from './testapp/AUQLDREPMT47-NoticeRentIncrease.vue'

import InspectionReport from './testapp/InspectionReport.vue'


require('font-awesome/css/font-awesome.min.css')
require('bulma/css/bulma.min.css')
require('vue-contentservice/dist/vue-contentservice.css')
require('@/assets/css/content-editor.scss')
// require('vue-contentservice/dist/vue-contentservice.css')


import FroalaKey from './protected-config/froalaKey.js'
//console.error(`FroalaKey is ${FroalaKey}`)

Vue.config.productionTip = false

// Content Service
const options = {
  protocol: 'http',
  host: 'uat.crowdhound.io',
  port: 80,
  // host: 'localhost',
  // port: 7000,
  version: '2.0',
  apikey: 'API10O0X1NS8FWUTO3FXKN15ZOR09',
  froalaActivationKey: FroalaKey
}
Vue.use(ContentService, options);
Vue.use(Formservice, { })

// Install Buefy
Vue.use(Buefy)

// Now run the site
new Vue({
  render (h) {
    let currentRoute = window ? window.location.pathname : '/'
    console.log(`Route is ${currentRoute}.`)
    switch (currentRoute) {
      case '/in-layout': return h(TestInLayout)

      // case '/in-layout': return h(ADLEntryNotice)
      case '/practice1':
        console.log(`Goi9ng to practice screen`);
        return h(Practice1)
      case '/practice2': return h(Practice2)
      case '/practice3': return h(Practice3)
      case '/practice4': return h(Practice4)
      case '/practice5': return h(Practice5)
      case '/AUQLDREPMT13':
        console.log(`Go to 13`);
        return h(AUQLDREPMT13_EntryNotice)
      case '/AUQLDREPMT14': return h(AUQLDREPMT14_NoticeIntentionToSell)
      case '/AUQLDREPMT15': return h(AUQLDREPMT15_NoticeRemedyBreach)
      case '/AUQLDREPMT17': return h(AUQLDREPMT17_NoticeToLeave)
      case '/AUQLDREPMT24': return h(AUQLDREPMT24_AbandonmentTerminationNotice)
      case '/AUQLDREPMT25': return h(AUQLDREPMT25_DisputeResolutionRequest)
      case '/AUQLDREPMT39': return h(AUQLDREPMT39_EntryNotice_RoomingAccommodation)
      case '/AUQLDREPMT40': return h(AUQLDREPMT40_NoticeRemedyBreach_RoomingAccommodation)
      case '/AUQLDREPMT41': return h(AUQLDREPMT41_NoticeLeave_RoomingAccommodation)
      case '/AUQLDREPMT47': return h(AUQLDREPMT47_NoticeRentIncrease)

      case '/inspection': return h(InspectionReport)

      // default: return h(Practice1)
      default: return h(TestStandalone)
    }
  }
}).$mount('#app')
