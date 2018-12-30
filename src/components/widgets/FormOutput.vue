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
      div(v-if="isDesignMode", @click.stop="selectThisElement")
        //.c-layout-mode-heading
        //  edit-bar-icons(:element="element")
        //  | output
        input.input(readonly, :style="outputStype", :class="inputClass", :placeholder="placeholder", v-model="actualData")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        input.input(readonly, :style="outputStype", :class="inputClass", :placeholder="placeholder")

      // Live mode
      template(v-else)
        input.input.my-live-mode(:style="outputStype", :class="inputClass", :placeholder="placeholder", v-model="actualData")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

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
  mixins: [ ContentMixins, CutAndPasteMixins ],
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
        obj['form-output-default'] = true
      }
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`element=`, this.element);
        console.log(`obj=`, obj)
      }
      return obj
    },

    outputStype: function ( ) {
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
      // console.log(`outputStype=`, style)
      return style
    },

    // outputStype: function (field) {
    //   console.log(`outputStype()`, field);
    //   // return { }
    //   return {
    //     //'background-color': 'red',
    //     //color: 'white',
    //     left: `${field.x}px`,
    //     top: `${field.y}px`,
    //   }
    // },

    attribute: {
      get () {

        //ZZZZZ
        // console.error(`FormInput.attribute.get(): this.context=`, this.context);

        let attribute = this.element['attribute'] ? this.element['attribute'] : this.element['field']
        return attribute
      }
    },

    placeholder: {
      get () {
        // Temporary - display a symbol if data is not found
        let placeholder = this.element['placeholder']
        if (!placeholder) {
          placeholder = ''
        }

        // Display a nice message in design mode
        if (this.isDesignMode || this.isEditMode) {
          let str = (this.attribute) ? this.attribute : '?'
          if (placeholder) {
            str += ` - ${placeholder}`
          }
          return str
        }
        return placeholder
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'placeholder', value })
      }
    },

    /*
     *  Actual data edited by this output field
     */
    actualData: {
      get () {
        let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        if (attribute) {
          let path = `${recordPath}.${attribute}`
          let defaultValue = '' //ZZZ This could come from a schema
          let {data, error} = this.$formservice.getData(path, defaultValue)

          let value = data
          // console.log(`value`, value);
          // console.log(`error`, error);


          if (error) {
            console.error(`FieldInput: ${error}`);
            return ''
          } else if (value) {
            console.log(`value for field ${path} is ${value}`);
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
      set (value) {
        let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        if (attribute) {
          console.log(`FormOutput: datavalue.set(${attribute}, ${value}`);
          this.$formservice.setValue(recordPath, attribute, value, String)
          // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
        }
      }
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


  .c-form-output {

    // Design mode
    &.c-edit-mode-debug {
      border-top: solid 4px $frame-color;
      border-left: dashed 2px $frame-color;
      border-bottom: dashed 2px $frame-color;
      border-right: dashed 2px $frame-color;
      margin: 1px;

      .container {
        width: 90% !important;
      }

      input.form-output-default {
        border-color: $border-color-default;
        background-color: $bg-default;
        //background-color: red;
        font-family: Arial;
        font-weight: bold;
        font-size: 9px;
      }
      input.form-output-borderless {
        border-color: $border-color-borderless;
        zborder: none;
        box-shadow: none;
        zbackground-color: $bg-borderless;
        font-size: 9px;
      }
    }

    // Edit mode
    &.c-edit-mode-edit {
    //.my-edit-mode {
      input.form-output-default {
        border-color: $border-color-default;
        background-color: $bg-default;
        font-family: Arial;
        font-weight: bold;
        font-size: 9px;
      }
      input.form-output-borderless {
        //border-color: $border-color-borderless;
        border: dashed 1px $border-color-borderless;
        box-shadow: none;
        background-color: $bg-borderless;
        font-size: 9px;
      }
    }

    // Live modes
    &.c-edit-mode-view {
      input.my-live-mode.form-output-default {
        border-color: $border-color-default;

        font-family: Arial;
        font-weight: bold;
        font-size: 11px;
        color: blue;
        background-color: #ffffff;
      }
      input.my-live-mode.form-output-borderless {
        border-color: #eee;
        //border: none;
        box-shadow: none;
        font-family: Arial;
        font-weight: bold;
        font-size: 11px;
        color: blue;
        background-color: #ffffff;
      }
    }
  }
</style>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: pink;
  $text-color: #700;

  .c-form-output {
    &.c-edit-mode-debug {
      border-top: solid 4px $frame-color;
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
      //background-color: $frame-color;
      //color: $text-color;
    }

    // .my-edit-mode {
    //   input {
    //     font-size: 10px;
    //   }
    // }
    //
    // .my-design-mode {
    //   input {
    //     font-size: 10px;
    //   }
    // }
    //
    // .my-live-mode {
    //   input {
    //     font-size: 10px;
    //   }
    // }
    .sanity-error {
      color: red;
      font-family: courier;
      font-size: 11px;
    }
  }
</style>
