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
        .tt-property
          .c-property-label Color
          .c-property-value
            input.input(v-model="lineColor")
        .tt-property
          .c-property-label Width
          .c-property-value
            input.input(v-model="lineWidth")
        .tt-property
          .c-property-label Type
          .c-property-value
          .select
            select.is-small(v-model="lineType")
              option(value="solid") Solid
              option(value="dotted") Dotted
              option(value="dashed") Dashed

        fixed-position-properties(:element="element", :min-width="0", :min-height="0")

        .tt-property
          .c-property-label-and-value
            | Metadata
            br
            | {{metadata}}
</template>

<script>
import PropertyMixins from '@tooltwist/vue-contentservice/src/mixins/PropertyMixins'
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
    lineColor: {
      get () {
        let value = this.element['lineColor']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'lineColor', value })
      }
    },
    lineWidth: {
      get () {
        let value = this.element['lineWidth']
        console.log(`Get lineWidth - ${value}, ${typeof(value)}`);
        return value ? value : ''
      },
      set (value) {
console.log(`Setting lineWidth - ${value}, ${typeof(value)}`);
        this.$content.setProperty({ vm: this, element: this.element, name: 'lineWidth', value })
      }
    },
    lineType: {
      get () {
        let value = this.element['lineType']
        switch (value) {
          case 'dotted':
          case 'dashed':
            return value
          default:
            return 'solid'
        }
      },
      set (value) {
        if (value!=='dotted' && value!=='dashed') {
          value = 'solid'
        }
        this.$content.setProperty({ vm: this, element: this.element, name: 'lineType', value })
      }
    },
    metadata: function () {
      let value = this.element['metadata']
      return value
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
