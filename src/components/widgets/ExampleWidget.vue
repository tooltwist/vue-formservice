<template lang="pug">

  .c-example-widget(:class="editModeClass")

    div(v-if="!formserviceSanityCheck")
      formservice-sanity-error(:element="element")

    // Design mode
    div(v-else-if="isDesignMode", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | example

      div(:style="inputStyle", :class="inputClass")
        | {{text}}
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :placeholder="element.placeholder")

    // Editing
    div(v-else-if="isEditMode", @click.stop="selectThisElement")
      | {{text}}
      .field-body.has-text-left
        .field
          label.label(v-show="label") {{label}}
          .control
            input.input(readonly, :style="inputStyle", :class="inputClass")

    // Live mode
    template(v-else)
      | {{text}}
      .field-body.has-text-left
        .field
          label.label(v-show="label") {{label}}
          .control
            input.input(:style="inputStyle", :class="inputClass", v-model="mAttributeValue")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'
import WidgetMixins from '../../mixins/WidgetMixins'

export default {
  // name: 'example-widget',
  props: {
    element: {
      type: Object,
      required: true
    },

    context: {
      type: Object,
      required: true
    }
  },
  mixins: [ ContentMixins, CutAndPasteMixins, WidgetMixins, FormserviceMixins ],
  data: function () {
    return {
    }
  },
  computed: {
    text: WidgetMixins.computedProperty('text'),
    label: WidgetMixins.computedProperty('label'),
    attribute: WidgetMixins.computedProperty('attribute'),
    placeholder: WidgetMixins.computedProperty('placeholder'),

  },
  methods: {

  },
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';

  $frame-color: #d0ffd0;
  $text-color: #700;

  .c-example-widget {
    &.c-edit-mode-debug {
      // border-left: dashed 2px $frame-color;
      // border-bottom: dashed 2px $frame-color;
      // border-right: dashed 2px $frame-color;
      border-top: solid 1px $f-widget-top-left-color;
      border-left: solid 1px $f-widget-top-left-color;
      background-color: $frame-color;
      border-bottom: solid 1px $f-widget-bottom-right-color;
      border-right: solid 1px $f-widget-bottom-right-color;
      margin: 1px;
      padding: 3px;

      .container {
        width: 90% !important;
      }
    }

    .c-layout-mode-heading {
      // This overrides the definition in content-editor.scss
      // border-left: solid 1px #ffc0c0;
      background-color: $frame-color;
      color: $text-color;
    }
  }

</style>
