<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      | Grid
      //| {{element.children.length}}
      span.tt-property-header-extra {{header}}

    transition(name="c-property-list-transition")
      div.c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Record
          .c-property-value
            input.input(v-model="record" placeholder="Show list of this record")
        .tt-property
          .c-property-label Add button
          .c-property-value
            input.input(v-model="addButtonLabel" placeholder="Label to show on button")
        //.tt-property
        //  .c-property-label Columns
        //  .c-property-value
        //    input.input(v-model="columns" placeholder="e.g. Hello|There|Everyone")

        template(v-if="element['editColumnIndex'] != undefined")
          | Selected Column:
          .tt-property
            .c-property-label Label
            .c-property-value
              input.input(v-model="labelYY")

          .tt-property
            .c-property-label
            .c-property-value
              br
              button.button.is-small.is-danger.is-outlined(@click.stop="deleteColumnButton") delete column and content
              br
              br
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import FormGridMixins from './FormGridMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'form-grid-props',
  mixins: [ PropertyMixins, FormGridMixins ],
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
    columns: {
      get () {
        let value = this.element['columns']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'columns', value })
      }
    },
    numColumns: {
      get () {
        let columns = this.element['columns']
        return columns.split('|').length
      },
    },


    record: EditMixins.twoWayComputedProperty('record'),
    addButtonLabel: EditMixins.twoWayComputedProperty('addButtonLabel'),

    // Column-specific values
    // width: {
    //   get () {
    //     let value = this.element['width']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'width', value })
    //   }
    // },
    // style: {
    //   get () {
    //     let value = this.element['style']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
    //   }
    // },
    // class: {
    //   get () {
    //     let value = this.element['style']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
    //   }
    // },

    labelYY: {
      get () {
        // console.log(`FormGridProds.labelYY.get()`);
        let columns = this.parsedColumns // mixin
        let index = this.element['editColumnIndex']
        if (index < columns.length) {
          return columns[index].label
        }
        return 'label'
      },
      set (label) {
        // let columns = this.parsedColumns // mixin
        let index = this.element['editColumnIndex']
        this.setLabel(index, label)
        return ''
      }
    },

  },//- computed

  methods: {
    deleteColumnButton: function ( ) {
      let index = this.element['editColumnIndex']
      this.deleteColumn(index)
    }

    // parseColumnDefinition: function (definition) {
    //   // console.log(`parseColumnDefinition(${definition})`)
    //   let i = definition.indexOf('=')
    //   if (i >= 0) {
    //     let label = definition.substring(0, i).trim()
    //     let sequence = parseInt(definition.substring(i + 1).trim())
    //     console.log(`- value=${value}, label=${label})`)
    //     return {label, sequence}
    //   } else {
    //     let label = definition.trim()
    //     console.log(`- value=${value}, label=${label})`)
    //     return { label, sequence: 0 }
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
  // .tt-property-header-extra {
  //   // color: #999 ;
  //   font-weight: 200;
  //   font-size: 10px;
  // }

  .c-property-value {
    input.input {
      margin-top: 2px;
      font-size: 9px;
    }
  }
</style>
