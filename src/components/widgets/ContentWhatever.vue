<template lang="pug">

  .c-content-whatever(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;content-whatever&gt;
      br

    // Debug mode
    div(v-if="isPageMode('debug')", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | whatever
      .whatever-box
        | {{myProperty}}

    // Editing
    div(v-else-if="isPageMode('edit')", @click.stop="selectThisElement")
      .whatever-box
        | {{myProperty}}

    // layout
    div(v-else-if="isPageMode('layout')", @click.stop="selectThisElement")
      .whatever-box
        | {{myProperty}}

    // Live mode
    template(v-else)
      .whatever-box
        | {{myProperty}}
</template>

<script>
import ContentMixins from '../../mixins/ContentMixins'
import CutAndPasteMixins from '../../mixins/CutAndPasteMixins'

export default {
  name: 'content-whatever',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  mixins: [ ContentMixins, CutAndPasteMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    myProperty: {
      get () {
        let value = this.element['myProperty']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'myProperty', value })
      }
    }

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: lightblue;
  $text-color: darkblue;

  .c-layout-mode-heading {
    // This overrides the definition in content-editor.scss
    background-color: $frame-color;
    color: $text-color;
  }

  .whatever-box {
    width: 300px;
    padding: 15px;
    border: solid 1px #ccc;
    text-align: center;
    margin: 0 auto;
  }
</style>
