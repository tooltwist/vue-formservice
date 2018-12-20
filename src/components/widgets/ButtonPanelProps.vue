<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      | Button Panel
      | ({{currentEditPanel}}) {{element.children.length}} {{typeof(currentEditPanel)}}
      span.tt-property-header-extra {{header}}

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label attribute
          .c-property-value
            input.input(v-model="attribute")
        .tt-property
          .c-property-label Panels
          .c-property-value
            input.input(v-model="panels" placeholder="e.g. H=Hello|T=There|E=Everyone")

        template(v-if="element['currentEditPanel'] != undefined")
          | Selected Panel:
          .tt-property
            .c-property-label Value
            .c-property-value
              input.input(v-model="currentEditPanelValue")
          .tt-property
            .c-property-label Label
            .c-property-value
              input.input(v-model="currentEditPanelLabel")
          .tt-property
            .c-property-label
            .c-property-value
              //input.input(v-model="currentEditPanelLabel")
              button.button.is-small.is-outlined(:disabled="currentEditPanel < 1") &lt;
              | &nbsp;
              button.button.is-small.is-outlined(:disabled="currentEditPanel >= element.children.length - 1") &gt;
              | &nbsp;
              button.button.is-small.is-outlined.is-danger(:disabled="currentEditPanel < 0", @click.stop="deleteCurrentEditTab") delete
          //.tt-property
          //  .c-property-label Class
          //  .c-property-value
          //    input.input(v-model="clas")
          //.tt-property
          //  .c-property-label Style
          //  .c-property-value
          //    input.input(v-model="style")
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import ButtonPanelMixins from './ButtonPanelMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'button-panel-props',
  mixins: [ PropertyMixins, ButtonPanelMixins, FormserviceMixins ],
  computed: {

    header: function ( ) {
      let name = this.element['name']
      if (name) {
        return `  - ${name}`
      }
      return ''
    },

    // We cannot update the element directly - it is stored
    // in this.$store and must be updated with a 'commit'.
    // See https://vuex.vuejs.org/en/forms.html
    panels: {
      get () {
        let value = this.element['panels']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'panels', value })
      }
    },
    numPanels: {
      get () {
        let panels = this.element['panels']
        let arr = panels.split('|')
        return arr.length
      },
    },
    // propertiesTab: {
    //   get () {
    //     // let value = this.element['propertiesTab']
    //     let num = parseInt(this.element['propertiesTab'])
    //     return num
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'propertiesTab', value })
    //   }
    // },
    name: {
      get () {
        let value = this.element['name']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'name', value })
      }
    },
    attribute: {
      get () {
        let value = this.element['attribute']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'attribute', value })
      }
    },
    currentEditPanelLabel: {
      get () {
        let panels = this.zarps
        console.error(`000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`);
        console.error(`zarps=`, panels)
        if (this.currentEditPanel >= 0 && this.currentEditPanel < panels.length) {
          console.log(`zarp=`, panels[this.currentEditPanel])
          return panels[this.currentEditPanel].label
        }
        return ''
      },
      set (label) {
        let panels = this.zarps
        panels[this.currentEditPanel].label = label
        // console.error(`new panels is`, panels)
        this.zarps = panels
      }
    },
    currentEditPanelValue: {
      get () {
        let panels = this.zarps
        if (this.currentEditPanel >= 0 && this.currentEditPanel < panels.length) {
          return panels[this.currentEditPanel].value
        }
        return ''
      },
      set (value) {
        let panels = this.zarps
        panels[this.currentEditPanel].value = value
        this.zarps = panels
      }
    },

    clas: {
      get () {
        let value = this.element['class']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'class', value })
      }
    },
    style: {
      get () {
        let value = this.element['style']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
      }
    },
  },//- computed
  methods: {
    // setPanels: function (panels) {
    //   let def = ''
    //   let sep = ''
    //   panels.forEach(panel => {
    //     console.log(`+ `, panel);
    //     def += sep + this.sanitize(panel.value)
    //     if (panel.label && panel.label != panel.value) {
    //       def += '=' + this.sanitize(panel.label)
    //     }
    //     sep = '|'
    //   })
    //   // console.log(`NEW DEF IS ${def}.`);
    //   this.$content.setProperty({ vm: this, element: this.element, name: 'panels', value: def })
    // },

    // parseTabDefinition: function (definition) {
    //   // console.log(`parseTabDefinition(${definition})`)
    //   let i = definition.indexOf('=')
    //   if (i >= 0) {
    //     let value = definition.substring(0, i).trim()
    //     let label = definition.substring(i + 1).trim()
    //     // console.log(`- value=${value}, label=${label})`)
    //     return {value, label}
    //   } else {
    //     let value = definition.trim()
    //     let label = ''
    //     // console.log(`- value=${value}, label=${label})`)
    //     return {value, label}
    //   }
    // },

    // sanitize: function (str) {
    //   // Remove any '='
    //   for ( ; ; ) {
    //     let i = str.indexOf('=')
    //     if (i >= 0) {
    //       str = str.substring(0, i) + str.substring(i + 1)
    //     } else {
    //       break;
    //     }
    //   }
    //   // Remove any '|'
    //   for ( ; ; ) {
    //     let i = str.indexOf('|')
    //     if (i >= 0) {
    //       str = str.substring(0, i) + str.substring(i + 1)
    //     } else {
    //       break;
    //     }
    //   }
    //   return str
    // }
  }
}
</script>

<style lang="scss" scoped>
  .c-property-value {
    input.input {
      margin-top: 2px;
      font-size: 9px;
    }
  }
</style>
