<template lang="pug">
  .c-property-element(:class="propertyClass")
    .tt-property-header(@click="setExpandedElement")
      property-bar-icons(v-if="isExpandedElement", :element="element")
      | Example Widget

    transition(name="c-property-list-transition")
      .c-element-properties(v-show="isExpandedElement")

        //
        //  Custom properties for this widget
        //

        // Text displayed on the widget
        .tt-property
          .c-property-label Text
          .c-property-value
            input.input(v-model="text")


        // The name of the data we edit in the field
        .tt-property
          .c-property-label Attribute
          .c-property-value
            input.input(v-model="attribute")

        // Label displayed above the field
        .tt-property
          .c-property-label Label
          .c-property-value
            input.input(v-model="label")

        // "Placeholder" message shown on input field when there is no input
        .tt-property
          .c-property-label Placeholder
          .c-property-value
            input.input(v-model="placeholder")

        //
        //  Standard fields for CSS class and style.
        //
        standard-style-properties(:element="element")
</template>

<script>
import PropertyMixins from 'vue-contentservice/src/mixins/PropertyMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  // name: 'content-formservice-props',
  mixins: [ PropertyMixins, CutAndPasteMixins, EditMixins ],
  props: {
    element: {
      type: Object,
      required: true
    },
  },
  computed: {
    attribute: EditMixins.twoWayComputedProperty('attribute'),
    text: EditMixins.twoWayComputedProperty('text'),
    label: EditMixins.twoWayComputedProperty('label'),
    placeholder: EditMixins.twoWayComputedProperty('placeholder'),
  }//- computed
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
