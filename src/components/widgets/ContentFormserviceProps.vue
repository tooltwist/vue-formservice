<template lang="pug">
  div
    .tt-property-header Form
    .c-element-properties
      .tt-property
        .c-property-label Name
        .c-property-value
          input.input(v-model="name")
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
import PropertyMixins from '../../mixins/PropertyMixins'

export default {
  name: 'content-formservice-props',
  mixins: [ PropertyMixins ],
  computed: {

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
  .c-property-value {
    input.input {
      margin-top: 2px;
      font-size: 9px;
    }
  }
</style>
