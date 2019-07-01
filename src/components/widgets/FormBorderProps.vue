<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      | Border
      span.tt-property-header-extra {{header}}

    transition(name="c-property-list-transition")
      div.c-element-properties(v-show="isExpandedElement")
        //.tt-property
        //  .c-property-label View
        //  .c-property-value
        //    input.input(v-model="view")
        //.tt-property
        //  .c-property-label Mode
        //  .c-property-value
        //    input.input(v-model="mode")
        //.tt-property
        //  .c-property-label Width
        //  .c-property-value
        //    input.input(v-model="width")
        //.tt-property
        //  .c-property-label Height
        //  .c-property-value
        //    input.input(v-model="height")
        .tt-property
          .c-property-label Style
          .c-property-value
            input.input(v-model="inputStyle")
        .tt-property
          .c-property-label Class
          .c-property-value
            input.input(v-model="inputClass")
        .tt-property
          .c-property-label Color
          .c-property-value
            input.input(v-model="color")
        .tt-property
          .c-property-label Right
          .c-property-value
            input.input(v-model="right")
        .tt-property
          .c-property-label Bottom
          .c-property-value
            input.input(v-model="bottom")

        fixed-position-properties(:element="element")
</template>

<script>
import PropertyMixins from '@tooltwist/vue-contentservice/src/mixins/PropertyMixins'
import FixedPositionProperties from './FixedPositionProperties'

export default {
  name: 'content-formservice-props',
  mixins: [ PropertyMixins ],
  components: {
    FixedPositionProperties
  },
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
    right: {
      get () {
        let value = this.element['right']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'right', value })
      }
    },
    bottom: {
      get () {
        let value = this.element['bottom']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'bottom', value })
      }
    },
    color: {
      get () {
        let value = this.element['color']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'color', value })
      }
    },
    // mode: {
    //   get () {
    //     let value = this.element['mode']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'mode', value })
    //   }
    // },
    // width: {
    //   get () {
    //     let value = this.element['width']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'width', value })
    //   }
    // },
    // height: {
    //   get () {
    //     let value = this.element['height']
    //     return value ? value : ''
    //   },
    //   set (value) {
    //     this.$content.setProperty({ vm: this, element: this.element, name: 'height', value })
    //   }
    // },
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
