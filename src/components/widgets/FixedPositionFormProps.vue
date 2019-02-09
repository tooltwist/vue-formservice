<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      | Fixed Position Form
      span.tt-property-header-extra {{header}}

    transition(name="c-property-list-transition")
      div.c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Name
          .c-property-value
            input.input(v-model="name")
        .tt-property
          .c-property-label Dataset
          .c-property-value
            input.input(v-model="dataset")
        .tt-property
          .c-property-label View
          .c-property-value
            input.input(v-model="view")
        .tt-property
          .c-property-label Mode
          .c-property-value
            input.input(v-model="mode")
        .tt-property
          .c-property-label Width
          .c-property-value
            input.input(v-model="width")
        .tt-property
          .c-property-label Height
          .c-property-value
            input.input(v-model="height")
        .tt-property
          .c-property-label Style
          .c-property-value
            input.input(v-model="style")
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'

export default {
  name: 'content-formservice-props',
  mixins: [ PropertyMixins ],
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
    name: {
      get () {
        let value = this.element['name']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'name', value })
      }
    },
    dataset: {
      get () {
        let value = this.element['dataset']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'dataset', value })
      }
    },
    view: {
      get () {
        let value = this.element['view']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'view', value })
      }
    },
    mode: {
      get () {
        let value = this.element['mode']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'mode', value })
      }
    },
    width: {
      get () {
        let value = this.element['width']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'width', value })
      }
    },
    height: {
      get () {
        let value = this.element['height']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'height', value })
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
  },
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
