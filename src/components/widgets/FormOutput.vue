<template lang="pug">

  .c-form-output(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice")
      | Please place this field inside a form.
      br
      | (missing this.context.formservice)
    template(v-else)

      // Normal operation below here
      //span(v-if="extraDebug")
      //  | &lt;form-output&gt;
      //  br

      // Design mode
      div(v-if="isDesignMode && false", @click.stop="selectThisElement")
        //.c-layout-mode-heading
        //  edit-bar-icons(:element="element")
        //  | output
        input.input(readonly, :style="outputStyle", :class="outputClass")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        input.input(readonly, :style="outputStyle", :class="outputClass")

      // Live mode
      template(v-else)
        //input.input.my-live-mode(:style="outputStyle", :class="outputClass", v-model="actualData")
        //input.input(:style="outputStyle", :class="outputClass", v-model="actualData")
        //| {{actualData}}
        .my-output {{actualData}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'content-forminput',
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
  mixins: [ ContentMixins, CutAndPasteMixins, FormserviceMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    sane_$content: function ( ) {
      if (this.$content) {
        return true
      }
      return false
    },

    sane_context_formservice: function ( ) {
      if (this.context && this.context.formservice) {
        return true
      }
      return false
    },

    outputClass: function () {
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
        obj['form-output-default'] = true
      }
      return obj
    },

    outputStyle: function ( ) {
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
      // console.log(`outputStyle=`, style)
      return style
    },

    attribute: {
      get () {

        //ZZZZZ
        // console.error(`FormInput.attribute.get(): this.context=`, this.context);

        let attribute = this.element['attribute'] ? this.element['attribute'] : this.element['field']
        return attribute
      }
    },

    /*
     *  Actual data displayed by this output field
     */
    actualData: {
      get () {
        let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        // {
        //   let {data, error} = this.$formservice.find({ vm: this, path: '!adlform.abandon', debug: false })
        //   console.error(`data=`, data);
        //   return 'qqq'
        // }

        if (attribute) {
          // console.error(`this.context.formservice=`, this.context.formservice)
          let path = `${recordPath}.${attribute}`
          // console.error(`path=${path}`);
          let defaultValue = '' //ZZZ This could come from a schema
          // let {data, error} = this.$formservice.findOrCreate({ vm: this, path, updatePath: true, value: '', debug: false })
          let {data, error} = this.$formservice.find({ vm: this, path, debug: false })

          let value = data
          // console.error(`${attribute}: value`, value);
          // console.log(`error`, error);


          if (error) {
            if (error !== 'NOTFOUND') {
              console.error(`FieldOutput: ${error}`);
            }
            return ''
          } else if (value) {
            // console.log(`value for field ${path} is ${value}`);
            return value
          } else {
            return ''
          }
        } else {
          console.log(`Warning: output is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      // set (value) {
      //   let recordPath = this.context.formservice.dataPath
      //   let attribute = this.element['attribute']
      //
      //   if (attribute) {
      //     console.log(`FormOutput: datavalue.set(${attribute}, ${value}`);
      //     this.$formservice.setValue(recordPath, attribute, value, String)
      //     // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
      //   }
      // }
    }
  }
}
</script>


<style lang="scss">
  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;

  $frame-color: pink;
  $text-color: #700;


  // .c-form-output {
  //
  //   // Design mode
  //   &.c-edit-mode-debug {
  //     border-top: solid 4px $frame-color;
  //     border-left: dashed 2px $frame-color;
  //     border-bottom: dashed 2px $frame-color;
  //     border-right: dashed 2px $frame-color;
  //     margin: 1px;
  //
  //     .container {
  //       width: 90% !important;
  //     }
  //
  //     input.form-output-default {
  //       border-color: $border-color-default;
  //       background-color: $bg-default;
  //       //background-color: red;
  //       font-family: Arial;
  //       font-weight: bold;
  //       font-size: 9px;
  //     }
  //     input.form-output-borderless {
  //       border-color: $border-color-borderless;
  //       zborder: none;
  //       box-shadow: none;
  //       zbackground-color: $bg-borderless;
  //       font-size: 9px;
  //     }
  //   }
  //
  //   // Edit mode
  //   &.c-edit-mode-edit {
  //   //.my-edit-mode {
  //     input.form-output-default {
  //       border-color: $border-color-default;
  //       background-color: $bg-default;
  //       font-family: Arial;
  //       font-weight: bold;
  //       font-size: 9px;
  //     }
  //     input.form-output-borderless {
  //       //border-color: $border-color-borderless;
  //       border: dashed 1px $border-color-borderless;
  //       box-shadow: none;
  //       background-color: $bg-borderless;
  //       font-size: 9px;
  //     }
  //   }
  //
  //   // Live modes
  //   &.c-edit-mode-view {
  //     input.my-live-mode.form-output-default {
  //       border-color: $border-color-default;
  //
  //       font-family: Arial;
  //       font-weight: bold;
  //       font-size: 11px;
  //       color: blue;
  //       background-color: #ffffff;
  //     }
  //     input.my-live-mode.form-output-borderless {
  //       border-color: #eee;
  //       //border: none;
  //       box-shadow: none;
  //       font-family: Arial;
  //       font-weight: bold;
  //       font-size: 11px;
  //       color: blue;
  //       background-color: #ffffff;
  //     }
  //   }
  // }
</style>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  .c-form-output {
    $frame-color: pink;
    $text-color: #700;

    .sanity-error {
      color: red;
      font-family: courier;
      font-size: 11px;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      // border-top: solid 4px $frame-color;
      // border-left: dashed 2px $frame-color;
      // border-bottom: dashed 2px $frame-color;
      // border-right: dashed 2px $frame-color;
      // margin: 1px;
      //
      // .container {
      //   width: 90% !important;
      // }
      border: solid 1px blue;
      input {
        background-color: $c-input-default-background-color;
      }
    }

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      input {
        background-color: $c-input-default-background-color;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      .my-output {
        position: relative;
        top: -2px;
        left: -0px;
        font-family: Courier;
        font-size: 14px;
      }
    }

  }
</style>
