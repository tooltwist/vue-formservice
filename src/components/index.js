
// External libraries
import Vuex from 'vuex'

// Our main class
import Formservice from '../lib/Formservice.js'

// Our store
import FormserviceStore from '../store/FormserviceStore.js'


import PropertyBarIcons from './PropertyBarIcons'
import StandardStyleProperties from './StandardStyleProperties'
import FormserviceSanityError from './FormserviceSanityError'

// ADL components
import AdlAddress from './widgets/AdlAddress.vue'
import AdlAddressProps from './widgets/AdlAddressProps.vue'
import AdlInspectAreas from './widgets/AdlInspectAreas.vue'
import AdlInspectAreasProps from './widgets/AdlInspectAreasProps.vue'

// Our components
import FormElementPosition from './widgets/FormElementPosition.vue'
import FormElementPositionProps from './widgets/FormElementPositionProps.vue'
import ContentFormservice from './widgets/ContentFormservice.vue'
import ContentFormserviceProps from './widgets/ContentFormserviceProps.vue'
import FormLabel from './widgets/FormLabel.vue'
import FormLabelProps from './widgets/FormLabelProps.vue'
import FormInput from './widgets/FormInput.vue'
import FormInputProps from './widgets/FormInputProps.vue'
import FormOutput from './widgets/FormOutput.vue'
import FormOutputProps from './widgets/FormOutputProps.vue'
import FormCheckbox from './widgets/FormCheckbox.vue'
import FormCheckboxProps from './widgets/FormCheckboxProps.vue'
import FormSubmit from './widgets/FormSubmit.vue'
import FormSubmitProps from './widgets/FormSubmitProps.vue'
import FormGrid from './widgets/FormGrid.vue'
import FormGridProps from './widgets/FormGridProps.vue'
import ButtonPanel from './widgets/ButtonPanel.vue'
import ButtonPanelProps from './widgets/ButtonPanelProps.vue'
import NumberedSection from './widgets/NumberedSection.vue'
import NumberedSectionProps from './widgets/NumberedSectionProps.vue'
import ResponsiveForm from './widgets/ResponsiveForm.vue'
import ResponsiveFormProps from './widgets/ResponsiveFormProps.vue'
import ExampleWidget from './widgets/ExampleWidget.vue'
import ExampleWidgetProps from './widgets/ExampleWidgetProps.vue'
import PanelWithoutProperties from './widgets/PanelWithoutProperties.vue'
import PanelWithoutPropertiesProps from './widgets/PanelWithoutPropertiesProps.vue'

import FormDate from './widgets/FormDate.vue'
import FormDateProps from './widgets/FormDateProps.vue'
import FormDropdown from './widgets/FormDropdown.vue'
import FormDropdownProps from './widgets/FormDropdownProps.vue'
import FormPDF from './widgets/FormPDF.vue'
import FormPDFProps from './widgets/FormPDFProps.vue'
import FormSignature from './widgets/FormSignature.vue'
import FormSignatureProps from './widgets/FormSignatureProps.vue'
import FormTextarea from './widgets/FormTextarea.vue'
import FormTextareaProps from './widgets/FormTextareaProps.vue'
import FormTime from './widgets/FormTime.vue'
import FormTimeProps from './widgets/FormTimeProps.vue'



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
    label: 'Fixed form',
    category: '',
    iconClass: 'c-toolbox-icon-fixed-form',
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
    category: '',
    iconClass: 'c-toolbox-icon-label',
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
    category: '',
    iconClass: 'c-toolbox-icon-input',
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
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'formoutput',
    label: 'PDF Field',
    category: 'Application',
    iconClass: 'c-toolbox-icon-pdf-output',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'content-form-output',
    component: FormOutput,
    propertyComponent: FormOutputProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'formoutput',
        label: 'output',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'formcheckbox',
    label: 'Checkbox',
    category: '',
    iconClass: 'c-toolbox-icon-checkbox',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'content-form-checkbox',
    component: FormCheckbox,
    propertyComponent: FormCheckboxProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'formcheckbox',
        label: 'checkbox',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'formsubmit',
    label: 'Submit',
    category: 'Application',
    iconClass: 'c-toolbox-icon-submit',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'content-form-submit',
    component: FormSubmit,
    propertyComponent: FormSubmitProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'formsubmit',
        label: 'submit',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'adlAddress',
    label: 'Address',
    category: 'Application',
    iconClass: 'c-toolbox-icon-address',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'adl-address',
    component: AdlAddress,
    propertyComponent: AdlAddressProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'adlAddress',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'adlInspectAreas',
    label: 'Areas',
    category: 'Application',
    iconClass: 'c-toolbox-icon-areas',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'adl-inspect-areas',
    component: AdlInspectAreas,
    propertyComponent: AdlInspectAreasProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'adlInspectAreas',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'formgrid',
    label: 'Grid',
    category: '',
    iconClass: 'c-toolbox-icon-grid',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-grid',
    component: FormGrid,
    propertyComponent: FormGridProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'formgrid',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'buttonPanel',
    label: 'Button Panel',
    category: '',
    iconClass: 'c-toolbox-icon-button-panel',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'button-panel',
    component: ButtonPanel,
    propertyComponent: ButtonPanelProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'buttonPanel',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'numberedSection',
    label: 'Number section',
    category: 'Application',
    iconClass: 'c-toolbox-icon-numbered-section',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'numbered-section',
    component: NumberedSection,
    propertyComponent: NumberedSectionProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'numberedSection',
        sectionNo: 99,
        label: 'label',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'responsiveForm',
    label: 'Responsive Form',
    category: '',
    iconClass: 'c-toolbox-icon-responsive-form',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'responsive-form',
    component: ResponsiveForm,
    propertyComponent: ResponsiveFormProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'responsiveForm',
        children: [ ]
      }
    }
  })

  if (options.examples) {
    $content.registerWidget(Vue, {
      name: 'exampleWidget',
      label: 'Example Widget',
      category: 'Tutorial',
      iconClass: 'fa fa-vimeo',
      iconClass5: 'fab fa-vimeo',
      dragtype: 'component',

      // Register native Vue templates
      componentName: 'example-widget',
      component: ExampleWidget,
      propertyComponent: ExampleWidgetProps,

      // Identical structure to a CUT or COPY from edit mode.
      data: {
        type: "contentservice.io",
        version: "1.0",
        source: "toolbox",
        layout: {
          type: 'exampleWidget',
          text: 'This is a splendid example widget',
          label: 'This is a label',
          placeholder: 'This is an input field',
          'class': 'has-text-info has-text-left',
          style: 'font-style: italic;',
          children: [ ]
        }
      }
    })
  }

  $content.registerWidget(Vue, {
    name: 'date',
    label: 'Date',
    // category: 'ADL Data Entry',
    iconClass: 'c-toolbox-icon-date',
    // iconClass5: 'fab fa-vimeo',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-date',
    component: FormDate,
    propertyComponent: FormDateProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'date',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'dropdown',
    label: 'Dropdown',
    // category: 'ADL Data Entry',
    iconClass: 'c-toolbox-icon-dropdown',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-dropdown',
    component: FormDropdown,
    propertyComponent: FormDropdownProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'dropdown',
        values: ''
        // children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'pdf',
    label: 'Display PDF',
    category: 'Application',
    iconClass: 'c-toolbox-icon-display-pdf',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-pdf',
    component: FormPDF,
    propertyComponent: FormPDFProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'pdf',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'signature',
    label: 'Signature',
    category: 'Application',
    iconClass: 'c-toolbox-icon-signature',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-signature',
    component: FormSignature,
    propertyComponent: FormSignatureProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'signature',
        children: [ ]
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'textarea',
    label: 'Text area',
    category: '',
    iconClass: 'c-toolbox-icon-textarea',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-textarea',
    component: FormTextarea,
    propertyComponent: FormTextareaProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'textarea',
        attribute: ''
      }
    }
  })

  $content.registerWidget(Vue, {
    name: 'time',
    label: 'Time',
    category: '',
    iconClass: 'c-toolbox-icon-time',
    // iconClass5: 'fab fa-vimeo',
    dragtype: 'component',

    // Register native Vue templates
    componentName: 'form-time',
    component: FormTime,
    propertyComponent: FormTimeProps,

    // Identical structure to a CUT or COPY from edit mode.
    data: {
      type: "contentservice.io",
      version: "1.0",
      source: "toolbox",
      layout: {
        type: 'time',
        attribute: ''
      }
    }
  })




  $content.registerLayoutType(Vue, 'panelWithoutProperties', 'panel-without-properties', PanelWithoutProperties, PanelWithoutPropertiesProps)

  //ZZZZ Move this component to vue-contentservice
  Vue.component('property-bar-icons', PropertyBarIcons)
  Vue.component('standard-style-properties', StandardStyleProperties)
  Vue.component('formservice-sanity-error', FormserviceSanityError)


  // Initialise the store
  Vue.use(Vuex)
  let store = new Vuex.Store(FormserviceStore);
  _formservice.store = store

  return _formservice
} //- install()

const FormserviceLib = {
  install: install
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
