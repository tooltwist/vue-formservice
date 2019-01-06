<template lang="pug">

  .c-form-textarea(:class="editModeClass")

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

      // Design mode
      div(v-if="isDesignMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              textarea.textarea(readonly, :placeholder="cPlaceholder", :rows="rows")

      // Editing
      div(v-else-if="isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              textarea.textarea(readonly, :placeholder="cPlaceholder", :rows="rows")

      // Live mode
      template(v-else)
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              textarea.textarea(:placeholder="cPlaceholder", :rows="rows", v-model="actualData")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'form-textarea',
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

    // inputClass: function () {
    //   var obj = { }
    //   let classesForElement = this.element['class']
    //   if (classesForElement) {
    //     // console.log(`classesForElement=${classesForElement}`);
    //     classesForElement.split(' ').forEach(clas => {
    //       // console.log(`-- ${clas}`);
    //       let classname = clas.trim()
    //       if (classname) {
    //         obj[classname] = true
    //       }
    //     })
    //   } else {
    //     obj['form-input-default'] = true
    //   }
    //   return obj
    // },
    //
    // inputStyle: function ( ) {
    //   let style = this.element['style'] + ';'
    //   // width
    //   try {
    //     let num = parseInt(this.element['width'])
    //     if (num >= 20) {
    //       style += `width:${num}px;`
    //     }
    //   } catch (e) { }
    //
    //   // height
    //   try {
    //     let num = parseInt(this.element['height'])
    //     if (num >= 20) {
    //       style += `height:${num}px;`
    //     }
    //   } catch (e) { }
    //   // console.log(`inputStyle=`, style)
    //   return style
    // },

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
        // console.error(`FormTextarea.attribute.get(): this.context=`, this.context);

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

    rows: function ( ) {
      return 15
    },

    cPlaceholder: {
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
            str += `\n${placeholder}`
          }
          return str
        }
        return placeholder
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'placeholder', value })
      // }
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
          console.log(`Warning: TextArea is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      set (value) {
        if (this.isLive) {
          let recordPath = this.context.formservice.dataPath
          console.error(`WARP FormTextarea.actualData.set: recordPath=${recordPath}`);
          let attribute = this.element['attribute']

          if (attribute) {
            console.log(`FormTextarea: datavalue.set(${attribute}, ${value}`);
            this.$formservice.setValue(recordPath, attribute, value, String)
            // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
          }
        }
      }
    },//- actualData


    cClass: function () {
      // Get the class for design/edit/live mode
      let cls = this.editModeClass + ' '

      // Add classes defined by the user
      let classesForElement = this.element['class']
      if (classesForElement) {
        cls +=  classesForElement
      } else {
        cls += ' form-input-default'
      }
      return cls
    },

    cStyle: function ( ) {
      let style = this.element['style'] + ';'
      return style ? `${style};` : ``
    },

  }
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';

  $border-color-default: #ccc;
  $border-color-borderless: #ccc;

  .c-form-textarea {

    // Used if not in a valid form
    .sanity-error {
      color: red;
      font-family: courier;
      font-size: 11px;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      border-top: $c-input-layout-border-color-1;
      border-left: $c-input-layout-border-color-1;
      background-color: $c-input-layout-frame-color;
      border-bottom: $c-input-layout-border-color-2;
      border-right: $c-input-layout-border-color-2;

      padding-left: 2px;
      padding-right: 2px;
      //margin: 1px;

      // .container {
      //   width: 90% !important;
      // }

      label {
        min-height: 50px;
      }
      textarea {
        border: solid 1px $c-input-layout-border-color-1;
        font-family: $c-input-default-font-family;
        font-weight: normal;
        font-size: $c-input-layout-font-size;
        padding-top: 0px;
        padding-bottom: 0px;
        color: $c-input-default-color;
        background-color: $c-input-default-background-color;
        margin-bottom: 4px;
      }
      &.form-input-borderless {
        textarea {
          border: dashed 1px $border-color-borderless;
          box-shadow: none;
          font-weight: normal;
          background-color: none;
        }
      }
    }//- design mode

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      textarea {
        border-color: $border-color-default;
        font-family: $c-input-default-font-family;
        //font-weight: $c-input-default-font-weight;
        font-weight: normal;
        font-size: $c-input-default-font-size;
        color: $c-input-default-color;
        background-color: $c-input-default-background-color;
      }
      &.form-input-borderless {
        textarea {
          border: dashed 1px $border-color-borderless;
          box-shadow: none;
        }
        // //border-color: $border-color-borderless;
        // border: dashed 1px $border-color-borderless;
        // box-shadow: none;
        // font-weight: normal;
        // background-color: none;
      }

    // //.my-edit-mode {
    //   input.form-input-default {
    //     border-color: $border-color-default;
    //     background-color: $bg-default;
    //     font-family: Arial;
    //     font-weight: bold;
    //     font-size: 9px;
    //   }
    //   input.form-input-borderless {
    //     //border-color: $border-color-borderless;
    //     border: dashed 1px $border-color-borderless;
    //     box-shadow: none;
    //     background-color: $bg-borderless;
    //     font-size: 9px;
    //   }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      margin-top: 2px;
      margin-bottom: 8px;
      label {
        margin-bottom: 1px;
      }
      textarea {
        border-color: $border-color-default;
        font-family: $c-input-default-font-family;
        font-weight: $c-input-default-font-weight;
        font-size: $c-input-default-font-size;
        color: $c-input-default-color;
        background-color: $c-input-default-background-color;
      }
      // textarea.my-live-mode.form-input-default {
      //   border-color: $border-color-default;
      //
      //   font-family: Arial;
      //   font-weight: bold;
      //   font-size: 11px;
      //   color: blue;
      //   background-color: #ffffff;
      // }
      &.form-input-borderless {
        textarea {
          border: none;
          box-shadow: none;
        }
        // border-color: #eee;
        // //border: none;
        // box-shadow: none;
        // font-family: Arial;
        // font-weight: bold;
        // font-size: 11px;
        // color: blue;
        // background-color: #ffffff;
      }
    }
  }
</style>
