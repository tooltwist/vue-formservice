<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      | Address

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")
        .tt-property
          .c-property-label Record
          .c-property-value
            input.input(v-model="record")
        //.tt-property
        //  .c-property-label Label
        //  .c-property-value
        //    input.input(v-model="label")
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
import PropertyMixins from '@tooltwist/vue-contentservice/src/mixins/PropertyMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'Adl-address-props',
  mixins: [ PropertyMixins, EditMixins ],
  computed: {

    record: EditMixins.twoWayComputedProperty('record'),

    // We cannot update the element directly - it is stored
    // in this.$store and must be updated with a 'commit'.
    // See https://vuex.vuejs.org/en/forms.html
    // label: {
    //   get () {
    //     let value = this.element['label']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
    //   }
    // },
    // clas: {
    //   get () {
    //     let value = this.element['class']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'class', value })
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
