<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      property-bar-icons(v-if="isExpandedElement", :element="element")
      | Input

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Attribute
          .c-property-value
            input.input(v-model="attribute")
        .tt-property
          .c-property-label Label
          .c-property-value
            input.input(v-model="label")
        .tt-property
          .c-property-label Placeholder
          .c-property-value
            input.input(v-model="placeholder")
        .tt-property
          .c-property-label Class
          .c-property-value
            input.input(v-model="clas")
        .tt-property
          .c-property-label Style
          .c-property-value
            input.input(v-model="style")
        .tt-property
          .c-property-label Hooks
          .c-property-value
            input.input(v-model="hooks")

        fixed-position-properties(:element="element")

        .tt-property
          .c-property-label tabIndex
          .c-property-value
            input.input(v-model="tabIndex")
</template>

<script>
import PropertyMixins from '@tooltwist/vue-contentservice/src/mixins/PropertyMixins'
import FixedPositionProperties from './FixedPositionProperties'

export default {
  name: 'form-input-props',
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
    label: {
      get () {
        let value = this.element['label']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
      }
    },
    placeholder: {
      get () {
        let value = this.element['placeholder']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'placeholder', value })
      }
    },
    tabIndex: {
      get () {
        let value = this.element['tabIndex']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'tabIndex', value })
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
    hooks: {
      get () {
        let value = this.element['hooks']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'hooks', value })
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
