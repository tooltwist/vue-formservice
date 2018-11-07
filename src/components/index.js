
// External libraries
import Vuex from 'vuex'

// Our main class
import Whatever from '../lib/Whatever.js'

// Our store
import WhateverStore from '../store/WhateverStore.js'

// Our components
import ContentWhatever from './widgets/ContentWhatever.vue'
import ContentWhateverProps from './widgets/ContentWhateverProps.vue'

let _whatever = null


function install (Vue, options) {
  console.log('Whatever.install()', options)
  if (_whatever) {
    console.error("Vue.use(Whatever) has already been called.")
    return
  }
  let tmpvue = new Vue()
  let $content = tmpvue.$content
  if ( !$content) {
    console.error("$content not defined. Please register ContentService before cslling Vue.use(Whatever).")
    return
  }

  // Create ourselves a Whatever Object
  _whatever = new Whatever(options)

  // Vue.mixin adds an additional 'beforeCreate' function to it's
  // list of functions to be called when new Vue is created. We'll
  // use it to look for new Vue({ Whatever }). If found, we'll
  // consider this to be the root. If it is not found, then we will
  // assume this is a child of the root, and create pointers back
  // to the root.
  //Vue.mixin({
  Vue.mixin({
    beforeCreate () {
      // console.log('vue-whatever: index.js - beforeCreate()')

      if (!this.$parent) {
      //if (isDef(this.$options.whatever)) {
        // console.error('Initializing ROOT *********')
        // This must be the root, since we found whatever in it's options.
        this._whateverRoot = this
        this._whatever = _whatever
        // this._whatever.init(this)
        Vue.util.defineReactive(this, '_whatever', this.$whatever)
        // Vue.util.defineReactive(this, '_whatever', this._whatever.jwt)
        // Vue.util.defineReactive(this, '_whatever', this._whatever.fromCache)
      } else {
        //console.log('Initialise new child')
        this._whateverRoot = this.$parent._whateverRoot
      }
    },
    destroyed () {
      // registerInstance(this)
    }
  })

  // As described above, the Vue instances form a hierachy. The mixin
  // above ensures that each instance has an '_whateverRoot' field
  // that points to the instance where 'whatever' was passed to new Vue({  }).
  // Note that it's _whateverRoot might actually point to itself.
  Object.defineProperty(Vue.prototype, '$whatever', {
    get () { return this._whateverRoot._whatever }
  })


  /*
   *  Register our widgets with Contentservice
   */

   // 'whatever' Widget
   $content.registerWidget(Vue, {
     name: 'whatever',
     label: 'Whatever',
     category: '',
     iconClass: 'fa fa-vimeo',
     iconClass5: 'fab fa-vimeo',
     dragtype: 'component',

     // Register native Vue templates
     componentName: 'content-whatever',
     component: ContentWhatever,
     propertyComponent: ContentWhateverProps,

     // Identical structure to a CUT or COPY from edit mode.
     data: {
       type: "contentservice.io",
       version: "1.0",
       source: "toolbox",
       layout: {
         type: 'whatever',
       }
     }
   })

  // Initialise the store
  Vue.use(Vuex)
  let store = new Vuex.Store(WhateverStore);
  _whatever.store = store

  return _whatever
} //- install()

const WhateverLib = {
  install: install,
}

// Object.defineProperty(WhateverLib, '_whatever', {
//   get: function() {
//       return _whatever
//   }
// });
//
// Object.defineProperty(WhateverLib, 'storeDefinition', {
//   get: function() {
//     console.error('storeDefinition getter (in whatever)')
//     return WhateverStore
//   }
// });
//
// Object.defineProperty(WhateverLib, 'whateverStoreDefinition', {
//   get: function() {
//     console.error('whateverStoreDefinition getter')
//     return WhateverStore
//   }
// });
//
// Object.defineProperty(WhateverLib, 'store', {
//   get: function() {
//     if (_store) {
//       return _store
//     }
//
//     // Create a new store object
//     _Vue.use(Vuex)
//     _store = new Vuex.Store({
//       modules: {
//         whatever: WhateverStore
//       }
//     });
//     return _store;
//   }
// });

export default WhateverLib


// This is used when the npm package is included into an HTML page
if (typeof window !== "undefined" && window.Vue) {
  window.Whatever = WhateverLib
}
