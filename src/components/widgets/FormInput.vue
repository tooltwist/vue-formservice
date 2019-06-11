<template lang="pug">

  .c-form-input(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="selectThisElement")
      | FormInput: missing this.context.formservice
      br
      | Please place this field inside a form.
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
            .control.has-icons-right(:class="tooltipClass", :data-tooltip="errorMessage")
              input.input.tooltip(:style="inputStyle", :class="inputClass", :placeholder="placeholder", autocomplete="mAutocompleteDisabled", v-model="actualData", :tabindex="tabIndex", @blur="onblur", data-tooltip="Tooltip Text")
              .icon.is-small.is-right(v-if="errorMessage")
                i.my-error-icon.c-input-error-icon
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
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
      errorLevel: null,
      errorMessage: '',
      sequence: 0, // Increment this to force display of a new value.
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

      // Add .c-is-empty class if the field has no content
      let value = this.actualData
      if (!value) {
        obj['c-is-empty'] = true
      }

      // Check the warning level
      if (this.errorLevel) {
        obj[`error-level-${this.errorLevel}`] = true
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
        // console.error(`FormInput.attribute.get(): this.context=`, this.context);

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

    tabIndex: {
      get () {
        let value = this.element['tabIndex'] ? this.element['tabIndex'] : ''
        let index = parseInt(value)
        if (index === NaN) {
          return null
        }
	if (index <= 0) {
          index = 1
        }
        return index
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
    },

    /*
     *  Actual data edited by this input field
     */
    actualData: {
      get () {
        let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        // This reference forces 'actualData' to be
        // re-computed if this.sequence is incremented.
        let sequence = this.sequence

        if (attribute) {
          let path = `${recordPath}.${attribute}`
          let defaultValue = ''
          let {data, error} = this.$formservice.find({
            vm: this,
            path,
            debug: false});

          let value = data
          // console.log(`path`, path);
          // console.log(`value`, value);
          // console.log(`error`, error);
          if (error) {
            console.error(`FormInput: ${error}`);
            return ''
          } else if (value) {
            //console.log(`value for field ${path} is ${value}`);
            return value
          } else {
            return ''
          }
        } else {
          console.log(`Warning: FormInput is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      set (value) {
        if (this.isLive) {
          let recordPath = this.context.formservice.dataPath
          // console.error(`WARP1 FormInput.actualData.set: recordPath=${recordPath}`);
          let attribute = this.element['attribute']

          if (attribute) {
            let path = `${recordPath}.${attribute}`

            // Run any 'onchange' hooks.
            let hooks = this.element['hooks']
            if (hooks) {
              let hookContext = {
                vm: this,
                recordPath,
                attribute,
                path,
              }
              let { errorLevel, errorMessage, newValue } = this.$formservice.runHooks('change', hooks, value, hookContext)

              // See if we got a changed value or error
              console.log(`A. errorLevel=${errorLevel}, newValue=${newValue}, errorMessage=${errorMessage}`);
              if (newValue !== null) {
                console.log(`A. setting new value to ${newValue}`);
                value = newValue
                this.sequence++ // Force redisplay of the field
              }
              if (errorLevel !== null) {
                this.errorLevel = errorLevel
              }
              if (errorMessage !== null) {
                this.errorMessage = errorMessage
              }
            }

            // Save the value
            this.$formservice.save({ vm: this, path, updatePath: true, value, debug: false })
            return true
          }
        }
      }
    },//- actualData

    tooltipClass: function () {
      if (this.errorLevel) {
        // console.log(`tooltipClass: ${this.errorLevel}`);
        return 'tooltip'
      }
    },
  }, //- computed

  methods: {
    onblur: function () {
      // console.log('onblur')
      if (this.isLive) {
        let recordPath = this.context.formservice.dataPath
        // console.error(`WARP1 FormInput.actualData.set: recordPath=${recordPath}`);
        let attribute = this.element['attribute']

        if (attribute) {
          // Get the current value
          let path = `${recordPath}.${attribute}`
          let defaultValue = ''
          let {data, error} = this.$formservice.findOrCreate({
              vm: this,
              path,
              updatePath: true,
              value: defaultValue,
              debug: false});
          let value = data

          // Run the 'onblur' hooks
          let hooks = this.element['hooks']
          if (hooks) {
            console.log(`hooks=${hooks}`)
            let hookContext = {
              vm: this,
              recordPath,
              attribute,
              path,
            }
            let { errorLevel, errorMessage, newValue } = this.$formservice.runHooks('blur', hooks, value, hookContext)

            // If the value has been chanfged by the hooks, update it now.
            // console.log(`A2. errorLevel=${errorLevel}, newValue=${newValue}, errorMessage=${errorMessage}`);
            if (newValue !== null) {
              // console.log(`A2. setting new value to ${newValue}`);
              this.sequence++ // Force redisplay of the field
              this.$formservice.save({ vm: this, path, updatePath: true, value:newValue, debug:false })
            }
            if (errorLevel !== null) {
              this.errorLevel = errorLevel
            }
            if (errorMessage !== null) {
              this.errorMessage = errorMessage
            }
          }
        }
      }
    },//- onblur
  },//- methods

//   mounted: function () {
//     // Don't allow a string to start with 'hello'
//     this.$formservice.registerHook('notFriendly', function(value, parameters, context) {
//       if (value.toLowerCase().startsWith('hello')) {
//         return { errorLevel: context.ERROR, errorMessage: 'This message is too friendly.' }
//       }
//       return { }
//     })
//
//     // Increment a number less than 100
//     this.$formservice.registerHook('#mytest', function(value, parameters, context) {
//       let num = parseInt(value)
//       if (isNaN(num)) {
//         return { errorLevel: context.WARNING, errorMessage: 'Must be a number' }
//       }
//       if (num >= 100) {
//         return { errorLevel: context.ERROR, errorMessage: 'Number is too big!' }
//       }
//       let newValue = num + 1
//       return { newValue }
//     })
//   },//- mounted

}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';
  @import '~bulma-tooltip';

//  $border-color-default: #ccc;
//  $border-color-borderless: #ccc;
//  $c-input-warning-color: #ffeac6;
//  $c-input-error-color: #ffdedd;
//
//  .c-form-input {
//
//    // Used if not in a valid form
//    .sanity-error {
//      color: red;
//      font-family: courier;
//      font-size: 11px;
//    }
//
//    /*
//     *  Design mode
//     */
//    &.c-edit-mode-debug {
//      border-top: $c-input-layout-border-color-1;
//      border-left: $c-input-layout-border-color-1;
//      background-color: $c-input-layout-frame-color;
//      border-bottom: $c-input-layout-border-color-2;
//      border-right: $c-input-layout-border-color-2;
//
//      padding-left: 2px;
//      padding-right: 2px;
//      margin: 1px;
//
//      // .container {
//      //   width: 90% !important;
//      // }
//
//      input {
//        border: solid 1px $c-input-layout-border-color-1;
//        font-family: $c-input-default-font-family;
//        font-weight: normal;
//        font-size: $c-input-layout-font-size;
//        padding-top: 0px;
//        padding-bottom: 0px;
//        color: $c-input-default-color;
//        background-color: $c-input-default-background-color;
//        margin-bottom: 4px;
//      }
//      &.form-input-borderless {
//        input {
//          border: dashed 1px $border-color-borderless;
//          box-shadow: none;
//          font-weight: normal;
//          background-color: none;
//        }
//      }
//    }
//
//    /*
//     *  Edit mode
//     */
//    &.c-edit-mode-edit {
//    //.my-edit-mode {
//      input {
//        border-color: $border-color-default;
//        font-family: $c-input-default-font-family;
//        font-weight: $c-input-default-font-weight;
//        font-size: $c-input-default-font-size;
//        color: $c-input-default-color;
//        background-color: $c-input-default-background-color;
//      }
//      &.form-input-borderless {
//        input {
//          border: dashed 1px $border-color-borderless;
//          box-shadow: none;
//        }
//      }
//    }
//
//    /*
//     *  Live mode
//     */
//    &.c-edit-mode-view {
//      margin-top: 0px;
//      margin-bottom: 10px;
//      label {
//        margin-bottom: 1px;
//      }
//      input {
//        border: none;
//        box-shadow: none;
//        font-family: $c-input-default-font-family;
//        font-weight: $c-input-default-font-weight;
//        font-size: $c-input-default-font-size;
//        color: $c-input-default-color;
//        background-color: $c-input-default-background-color;
//        &.c-is-empty {
//          background-color:$c-input-empty-background-color;
//        }
//        &.error-level-warning {
//          background-color: $c-input-warning-color;
//          border: solid 2px orange;
//        }
//        &.error-level-error {
//          background-color: $c-input-error-color;
//          border: solid 2px red;
//        }
//      }
//      &.form-input-borderless {
//        input {
//          border: none;
//          box-shadow: none;
//          background-color: white;
//        }
//      }
//      .my-error-icon {
//        width: 30px;
//        height: 30px;
//        margin-top: 2px;
//        margin-right: 5px;
//      }
//
//    }//- live mode
//  }
</style>
