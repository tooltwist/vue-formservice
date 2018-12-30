<template lang="pug">

  .c-form-submit(:class="editModeClass")
    // Design mode
    div(v-if="isDesignMode", @click.stop="selectThisElement")
      //.c-layout-mode-heading
      //  edit-bar-icons(:element="element")
      //  | submit
      button.button(readonly, :style="inputStyle", :class="inputClass")
        | {{label}}

    // Editing
    div(v-else-if="isEditMode", @click.stop="selectThisElement")
      button.button(readonly, :style="inputStyle", :class="inputClass")
        | {{label}}

    // Live mode
    template(v-else)
      button.button.my-live-mode.is-pulled-right.is-info(:style="inputStyle", :class="inputClass", @click.stop.prevent="onClick")
        | {{label}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'content-formsubmit',
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
  mixins: [ ContentMixins, CutAndPasteMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    inputStyle: function ( ) {
      let style = this.element['style'] + ';'
      // width
      try {
        let num = parseInt(this.element['width'])
        if (num >= 20) {
          style += `width:${num}px;`
        }
      } catch (e) { }

      // height
      try {
        let num = parseInt(this.element['height'])
        if (num >= 20) {
          style += `height:${num}px;`
        }
      } catch (e) { }
      // console.log(`inputStyle=`, style)
      return style
    },

    inputClass: function () {
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`inputClass()`, this.element);
      }

      var obj = { }
      let classesForElement = this.element['class']
      if (classesForElement) {
        // console.log(`classesForElement=${classesForElement}`);
        classesForElement.split(' ').forEach(clas => {
          // console.log(`-- ${clas}`);
          let classname = clas.trim()
          if (classname) {
            obj[classname] = true
          }
        })
      } else {
        obj['form-input-default'] = true
      }
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`element=`, this.element);
        console.log(`obj=`, obj)
      }
      return obj
    },

    label: {
      get () {
        return this.element['label'] ? this.element['label'] : 'Submit'
      }
    },
  },
  methods: {
    onClick: function ( ) {
      console.log(`onClick (context, dataset=${this.context.formservice.dataset})`, this.context)

      let url = this.element['url']
      this.$formservice.saveDataset({ path: this.context.formservice.dataPath, url })
      //ZZZZ This should be a promise
      //.then(...)
      //.error(...)
      return false
    }

  },
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';

  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;
  //
  // .c-form-submit {
  //   .my-design-mode {
  //     input.form-input-default {
  //       border-color: $border-color-default;
  //       zbackground-color: $bg-default;
  //       background-color: red;
  //       font-family: Arial;
  //       font-weight: bold;
  //       font-size: 9px;
  //     }
  //     input.form-input-borderless {
  //       border-color: $border-color-borderless;
  //       zborder: none;
  //       box-shadow: none;
  //       zbackground-color: $bg-borderless;
  //       font-size: 9px;
  //     }
  //   }
  //
  //   .my-edit-mode {
  //     input.form-input-default {
  //       border-color: $border-color-default;
  //       background-color: $bg-default;
  //       font-family: Arial;
  //       font-weight: bold;
  //       font-size: 9px;
  //     }
  //     input.form-input-borderless {
  //       //border-color: $border-color-borderless;
  //       border: dashed 1px $border-color-borderless;
  //       box-shadow: none;
  //       background-color: $bg-borderless;
  //       font-size: 9px;
  //     }
  //   }
  //
  //   // Live modes
  //   input.my-live-mode.form-input-default {
  //     border-color: $border-color-default;
  //
  //     font-family: Arial;
  //     font-weight: bold;
  //     font-size: 11px;
  //     color: blue;
  //     background-color: #ffffff;
  //   }
  //   input.my-live-mode.form-input-borderless {
  //     border-color: #eee;
  //     //border: none;
  //     box-shadow: none;
  //     font-family: Arial;
  //     font-weight: bold;
  //     font-size: 11px;
  //     color: blue;
  //     background-color: #ffffff;
  //   }
  //
  // }
</style>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';

  $frame-color: pink;
  $text-color: #700;

  .c-form-submit {
    &.c-edit-mode-debug {
      border-top: $c-input-layout-border-color-1;
      border-left: $c-input-layout-border-color-1;
      background-color: $c-input-layout-frame-color;
      border-bottom: $c-input-layout-border-color-2;
      border-right: $c-input-layout-border-color-2;

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
