<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      property-bar-icons(v-if="isExpandedElement", :element="element")
      | Label

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Label
          .c-property-value
            input.input(v-model="label")
        .tt-property
          .c-property-label Class
          .c-property-value
            input.input(v-model="clas")
        .tt-property
          .c-property-label Style
          .c-property-value
            input.input(v-model="style")
        .tt-property
          .c-property-label Align
          .c-property-value
            .select
              select.is-small(v-model="textAlign")
                option(value="")
                option(value="left") left
                option(value="center") center
                option(value="right") right
                option(value="justify") justify

        fixed-position-properties(:element="element")
</template>

<script>
import PropertyMixins from '@tooltwist/vue-contentservice/src/mixins/PropertyMixins'
import FixedPositionProperties from './FixedPositionProperties'

export default {
  name: 'form-label-props',
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
    textAlign: {
      get () {
        let value = this.element['text-align']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'text-align', value })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
  .c-property-value {
    input.input {
      margin-top: 2px;
      font-size: 9px;
    }
    select {
      margin-top: 4px;
      padding-top: 0px;
      padding-bottom: 0px;
      font-size: 9px;
    }
  }
</style>
