import Vue from 'vue'

import ContentService from 'vue-contentservice';
import Whatever from './components/index.js';

import TestInLayout from './testapp/TestInLayout.vue'
import TestStandalone from './testapp/TestStandalone.vue'

require('font-awesome/css/font-awesome.min.css')
require('bulma/css/bulma.min.css')
require('vue-contentservice/dist/vue-contentservice.css')


import FroalaKey from './protected-config/froalaKey.js'
//console.error(`FroalaKey is ${FroalaKey}`)

Vue.config.productionTip = false

// Content Service
const options = {
  protocol: 'http',
  host: 'uat.crowdhound.io',
  port: 80,
  version: '2.0',
  apikey: 'API10O0X1NS8FWUTO3FXKN15ZOR09',
  froalaActivationKey: FroalaKey
}
Vue.use(ContentService, options);
Vue.use(Whatever, { })


// Now run the site
new Vue({
  render (h) {
    let currentRoute = window ? window.location.pathname : '/'
    console.log(`Route is ${currentRoute}.`)
    switch (currentRoute) {
      case '/in-layout': return h(TestInLayout)
      default: return h(TestStandalone)
    }
  }
}).$mount('#app')
