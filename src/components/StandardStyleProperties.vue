<template lang="pug">
  .c-property-element
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
  name: 'content-formservice-props',
  mixins: [ PropertyMixins, CutAndPasteMixins ],
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  computed: {

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

  // .my-button {
  //   margin-top: 2px;
  //   position: absolute;
  //   right: 3px;
  //   cursor: pointer;
  //   font-size: 10px;
  // }
  //
  // .my-restore {
  //   display: block;
  //   min-height: 15px;
  //   //height:
  //   font-size: 10px;
  // }
</style>
