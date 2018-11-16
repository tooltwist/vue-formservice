
// External libraries
import Vuex from 'vuex'

// Our main class
import Formservice from '../lib/Formservice.js'

// Our store
import FormserviceStore from '../store/FormserviceStore.js'

// Our components
import FormElementPosition from './widgets/FormElementPosition.vue'
import FormElementPositionProps from './widgets/FormElementPositionProps.vue'
import ContentFormservice from './widgets/ContentFormservice.vue'
import ContentFormserviceProps from './widgets/ContentFormserviceProps.vue'
import FormLabel from './widgets/FormLabel.vue'
import FormLabelProps from './widgets/FormLabelProps.vue'
import FormInput from './widgets/FormInput.vue'
import FormInputProps from './widgets/FormInputProps.vue'

let _formservice = null


function install (Vue, options) {
  console.log('Formservice.install()', options)
  if (_formservice) {
    console.error("Vue.use(Formservice) has already been called.")
    return
  }
  let tmpvue = new Vue()
  let $content = tmpvue.$content
  if ( !$content) {
    console.error("$content not defined. Please register ContentService before cslling Vue.use(Formservice).")
    return
  }

  // Create ourselves a Formservice Object
  _formservice = new Formservice(options)

  // Vue.mixin adds an additional 'beforeCreate' function to it's
  // list of functions to be called when new Vue is created. We'll
  // use it to look for new Vue({ Formservice }). If found, we'll
  // consider this to be the root. If it is not found, then we will
  // assume this is a child of the root, and create pointers back
  // to the root.
  //Vue.mixin({
  Vue.mixin({
    beforeCreate () {
      // console.log('vue-formservice: index.js - beforeCreate()')

      if (!this.$parent) {
      //if (isDef(this.$options.formservice)) {
        // console.error('Initializing ROOT *********')
        // This must be the root, since we found formservice in it's options.
        this._formserviceRoot = this
        this._formservice = _formservice
        // this._formservice.init(this)
        Vue.util.defineReactive(this, '_formservice', this.$formservice)
        // Vue.util.defineReactive(this, '_formservice', this._formservice.jwt)
        // Vue.util.defineReactive(this, '_formservice', this._formservice.fromCache)
      } else {
        //console.log('Initialise new child')
        this._formserviceRoot = this.$parent._formserviceRoot
      }
    },
    destroyed () {
      // registerInstance(this)
    }
  })

  // As described above, the Vue instances form a hierachy. The mixin
  // above ensures that each instance has an '_formserviceRoot' field
  // that points to the instance where 'formservice' was passed to new Vue({  }).
  // Note that it's _formserviceRoot might actually point to itself.
  Object.defineProperty(Vue.prototype, '$formservice', {
    get () { return this._formserviceRoot._formservice }
  })


  /*
   *  Register our widgets with Contentservice
   */

  // 'formservice' Widget
  $content.registerWidget(Vue, {
    name: 'formservice',
    label: 'Formservice',
    category: 'Forms',
    iconClass: 'fa fa-vimeo',
    iconClass5: 'fab fa-vimeo',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'content-formservice',
    component: ContentFormservice,
    propertyComponent: ContentFormserviceProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'formservice',
        children: []
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'formlabel',
    label: 'Label',
    category: 'Forms',
    iconClass: 'fa fa-vimeo',
    iconClass5: 'fab fa-vimeo',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'content-formlabel',
    component: FormLabel,
    propertyComponent: FormLabelProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'formlabel',
        label: 'label',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'forminput',
    label: 'Input',
    category: 'Forms',
    iconClass: 'fa fa-vimeo',
    iconClass5: 'fab fa-vimeo',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'content-form-input',
    component: FormInput,
    propertyComponent: FormInputProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'forminput',
        label: 'input',
        children: [ ]
      }
    }
  })

  // $content.registerLayoutType(Vue, 'element-position', 'element-position', FormElementPosition, FormElementPositionProps)


  // Initialise the store
  Vue.use(Vuex)
  let store = new Vuex.Store(FormserviceStore);
  _formservice.store = store

  return _formservice
} //- install()

const FormserviceLib = {
  install: install,
}

// Object.defineProperty(FormserviceLib, '_formservice', {
//   get: function() {
//       return _formservice
//   }
// });
//
// Object.defineProperty(FormserviceLib, 'storeDefinition', {
//   get: function() {
//     console.error('storeDefinition getter (in formservice)')
//     return FormserviceStore
//   }
// });
//
// Object.defineProperty(FormserviceLib, 'formserviceStoreDefinition', {
//   get: function() {
//     console.error('formserviceStoreDefinition getter')
//     return FormserviceStore
//   }
// });
//
// Object.defineProperty(FormserviceLib, 'store', {
//   get: function() {
//     if (_store) {
//       return _store
//     }
//
//     // Create a new store object
//     _Vue.use(Vuex)
//     _store = new Vuex.Store({
//       modules: {
//         formservice: FormserviceStore
//       }
//     });
//     return _store;
//   }
// });

export default FormserviceLib


// This is used when the npm package is included into an HTML page
if (typeof window !== "undefined" && window.Vue) {
  window.Formservice = FormserviceLib
}
