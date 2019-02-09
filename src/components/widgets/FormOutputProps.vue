<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      property-bar-icons(v-if="isExpandedElement", :element="element")
      | Output

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Attribute
          .c-property-value
            input.input(v-model="attribute")
        .tt-property
          .c-property-label Class
          .c-property-value
            input.input(v-model="clas")
        .tt-property
          .c-property-label Style
          .c-property-value
            input.input(v-model="style")

        fixed-position-properties(:element="element")
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import FixedPositionProperties from './FixedPositionProperties'

export default {
  name: 'form-output-props',
  components: {
    FixedPositionProperties
  },
  mixins: [ PropertyMixins ],
  computed: {

    // We cannot update the element directly - it is stored
    // in this.$store and must be updated with a 'commit'.
    // See https://vuex.vuejs.org/en/forms.html
    attribute: {
      get () {
        let value = this.element['attribute'] ? this.element['attribute'] : this.element['field']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'attribute', value })
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
    x: {
      get () {
        let value = this.element['x']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'x', value })
      }
    },
    y: {
      get () {
        let value = this.element['y']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'y', value })
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
