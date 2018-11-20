<template lang="pug">

  .c-content-formlabel(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    .my-design-mode(v-if="isDesignMode", @click.stop="selectThisElement2")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | label
      .label(:style="style") {{label}}

    // Editing
    .my-edit-mode(v-else-if="isEditMode", @click.stop="selectThisElement2")
      .label(:style="style") {{label}}

    // Live mode
    template(v-else)
      .my-live-mode.label(:style="style") {{label}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'form-label',
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

    label: {
      get () {
        let value = this.element['label']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
      // }
    },

    style: {
      get () {
        let value = this.element['style']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
      // }
    }

  },
  methods: {
    selectThisElement2: function () {
      console.log(`selectThisElement2() IN LABEL`, this.element)
      return this.selectThisElement()
    },

    labelClass: function (field) {
      console.log(`fieldClass()`, field);

      if (field.classname) {
        return field.classname
      }
      return null
    },

    labelStyle: function (field) {
      console.log(`fieldStyle()`, field);
      // return { }
      return {
        // 'background-color': 'red',
        // color: 'white',
        left: `${field.x}px`,
        top: `${field.y}px`,
      }
    }

  },
  created: function () {

    // Sanity check
    if (!this.$content) {
      console.error(`ContentFromservice.created(): this.$content not defined: has ContentService been initialised?`);
      this.sane = false
      return
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: lightblue;
  $text-color: darkblue;

  .c-edit-mode-debug {
    border-left: dashed 2px $frame-color;
    border-bottom: dashed 2px $frame-color;
    border-right: dashed 2px $frame-color;
    margin: 1px;

    .container {
      width: 90% !important;
    }
  }

  .c-layout-mode-heading {
    // This overrides the definition in content-editor.scss
    background-color: $frame-color;
    color: $text-color;
  }

  .formservice-box {
    position: relative;
    overflow-x: visible;
    overflow-y: visible;

    border: solid 1px #ccc;
    // text-align: center;
    margin: 0 auto;
    padding: 0px;

    width: 400px;
    height: 400px;
    zbackground-color: yellow;
  }

  .c-label {
    position: absolute;
    //background-color: pink;
  }

  .c-field {
    position: absolute;
    background-color: pink;

    input {
      font-size: 11px;
    }
  }

  .c-other {
    position: absolute;
    background-color: red;
    color: pink;
  }

  .happy {
    //font-size: 25px;
  }

  .my-drag {
    overflow-x: visible;
    overflow-y: visible;
    color: black;
  }

  .fixed-position {
    position: absolute;
    overflow-x: visible;
    overflow-y: visible;
    zwidth: 200px;
    zheight: 200px;
    background-color: blue;
    zborder: solid 1px black;
    color: black;
  }

  .my-edit-mode {
    .my-label {
    }
  }

  .my-design-mode {
    .my-label {
    }
  }

  .my-live-mode {
    .my-label {
    }
  }

</style>
