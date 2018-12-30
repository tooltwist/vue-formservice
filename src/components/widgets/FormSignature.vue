<template lang="pug">

  .c-form-signature(:class="editModeClass")

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
      //  | &lt;form-input&gt;
      //  br

      // Design mode
      div(v-if="isDesignMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :style="inputStyle", :class="inputClass", :placeholder="placeholder")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :style="inputStyle", :class="inputClass", :placeholder="placeholder")

      // Live mode
      template(v-else)
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(:style="inputStyle", :class="inputClass", :placeholder="placeholder", v-model="actualData")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'form-signature',
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
        obj['form-input-default'] = true
      }
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`element=`, this.element);
        console.log(`obj=`, obj)
      }
      return obj
    },

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

    // inputStyle: function (field) {
    //   console.log(`inputStyle()`, field);
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
        // console.error(`FormSignature.attribute.get(): this.context=`, this.context);

        let attribute = this.element['attribute'] ? this.element['attribute'] : this.element['field']
        return attribute
      }
    },

    label: {
      get () {
        let label = this.element['label'] ? this.element['label'] : ''
        return label
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
          let str = (this.attribute) ? `[${this.attribute}]` : '?'
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
     *  Actual data edited by this input field
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
          console.log(`Warning: Signature is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      set (value) {
        if (this.isLive) {
          let recordPath = this.context.formservice.dataPath
          console.error(`WARP FormSignature.actualData.set: recordPath=${recordPath}`);
          let attribute = this.element['attribute']

          if (attribute) {
            console.log(`FormSignature: datavalue.set(${attribute}, ${value}`);
            this.$formservice.setValue(recordPath, attribute, value, String)
            // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
          }
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

  $frame-color: goldenrod;
  $text-color: #700;


  .c-form-signature {

    // Used if not in a valid form
    .sanity-error {
      color: red;
      font-family: courier;
      font-size: 11px;
    }

    // Design mode
    &.c-edit-mode-debug {
      // border-top: dashed 2px $frame-color;
      // border-left: dashed 2px $frame-color;
      // border-bottom: dashed 2px $frame-color;
      // border-right: dashed 2px $frame-color;

      // border-top: solid 1px yellow;
      // border-left: solid 1px yellow;
      // background-color: goldenrod;
      // border-bottom: solid 1px brown;
      // border-right: solid 1px brown;
      border-top: solid 1px #ccc;
      border-left: solid 2px #ccc;
      background-color: $frame-color;
      border-bottom: solid 1px #999;
      border-right: solid 1px #999;
      padding-left: 2px;
      padding-right: 2px;
      margin: 1px;

      .container {
        width: 90% !important;
      }

      input.form-input-default {
        border-color: $border-color-default;
        background-color: $bg-default;
        //background-color: red;
        font-family: Arial;
        font-weight: bold;
        font-size: 9px;
      }
      input.form-input-borderless {
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
      input.form-input-default {
        border-color: $border-color-default;
        background-color: $bg-default;
        font-family: Arial;
        font-weight: bold;
        font-size: 9px;
      }
      input.form-input-borderless {
        //border-color: $border-color-borderless;
        border: dashed 1px $border-color-borderless;
        box-shadow: none;
        background-color: $bg-borderless;
        font-size: 9px;
      }
    }

    // Live modes
    &.c-edit-mode-view {
      input.my-live-mode.form-input-default {
        border-color: $border-color-default;

        font-family: Arial;
        font-weight: bold;
        font-size: 11px;
        color: blue;
        background-color: #ffffff;
      }
      input.my-live-mode.form-input-borderless {
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
