<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      property-bar-icons(v-if="isExpandedElement", :element="element")
      | Submit button

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Label
          .c-property-value
            input.input(v-model="label")
        // URL is a temporary Hack
        .tt-property
          .c-property-label URL
          .c-property-value
            input.input(v-model="url")
        .tt-property
          .c-property-label Style
          .c-property-value
            input.input(v-model="style")
        .tt-property
          .c-property-label Class
          .c-property-value
            input.input(v-model="clas")
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'form-submit-props',
  mixins: [ PropertyMixins, CutAndPasteMixins ],
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
    url: {
      get () {
        let value = this.element['url']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'url', value })
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
    clas: {
      get () {
        let value = this.element['class']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'class', value })
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

  .my-button {
    margin-top: 2px;
    position: absolute;
    right: 3px;
    cursor: pointer;
    font-size: 10px;
  }

  .my-restore {
    display: block;
    min-height: 15px;
    //height:
    font-size: 10px;
  }
</style>
