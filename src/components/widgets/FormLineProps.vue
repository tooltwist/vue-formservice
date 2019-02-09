<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      property-bar-icons(v-if="isExpandedElement", :element="element")
      | Line

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
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
  name: 'form-line-props',
  components: {
    FixedPositionProperties
  },
  mixins: [ PropertyMixins ],
  computed: {

    // We cannot update the element directly - it is stored
    // in this.$store and must be updated with a 'commit'.
    // See https://vuex.vuejs.org/en/forms.html
    label: {
      get () {
        let value = this.element['label']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
      }
    },
    vertical: {
      get () {
        let value = this.element['vertical']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'vertical', value })
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
