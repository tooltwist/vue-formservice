<template lang="pug">

  .c-form-checkbox(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Missing this.$content
    .sanity-error(v-else-if="!sane_context_formservice")
      | Missing this.context.formservice
    template(v-else)
      //| YEP: {{$formservice.store.state.refreshCounter}}
      //br

      // Normal operation below here
      span(v-if="extraDebug")
        | &lt;form-input&gt;
        br

      // Design mode
      //.my-design-mode(v-if="isDesignMode && false", @click.stop="selectThisElement")
      //  //input(readonly, type="checkbox", :id="`c-formservice-checkbox-${element.id}`", v-model="checked", :style="mInputStyle", :class="mInputClass")
      //  //label(:for="`c-formservice-checkbox-${element.id}`", :style="mInputStyle", :class="mInputClass") &nbsp;{{ label }}
      //  label.checkbox(disabled, :style="mInputStyle", :class="mInputClass")
      //    input(disabled type="checkbox", :style="mInputStyle", :class="mInputClass")
      //    | &nbsp; {{ label }}

      // Editing
      .my-edit-mode(v-if="isDesignMode || isEditMode")
        //- .my-box(:style="mInputStyle", :class="mInputClass", @click.stop="selectThisElement")
        //-   label.checkbox(disabled)
        //-     input(type="checkbox", :style="mInputStyle", :class="mInputClass", @click.stop="selectThisElement")
        //-     | &nbsp; {{ label }}
        .my-checkbox(:style="mInputStyle", :class="mInputClass", @click.stop="selectThisElement")
          .my-box
          .my-label(v-if="label")
            | {{label}}

      // Live mode
      template(v-else)
        .my-checkbox
          .my-box
            .my-selected(v-if="checked")
              | X
          .my-label(v-if="label")
            | {{label}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import WidgetMixins from '../../mixins/WidgetMixins'

export default {
  name: 'content-form-checkbox',
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
  mixins: [ ContentMixins, CutAndPasteMixins, WidgetMixins ],
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
      var obj = { }
      let classesForElement = this.element['class']
      if (classesForElement) {
        console.log(`classesForElement=${classesForElement}`);
        classesForElement.split(' ').forEach(clas => {
          console.log(`-- ${clas}`);
          let classname = clas.trim()
          if (classname) {
            obj[classname] = true
          }
        })
      } else {
        obj['form-checkbox-default'] = true
      }
      return obj
    },

    attribute: {
      get () {
        let attribute = this.element['attribute'] ? this.element['attribute'] : this.element['field']
        return attribute
      }
    },

    label: {
      get () {
        // Temporary - display a symbol if data is not found
        let label = this.element['label']
        // if (!label) {
          // Display a nice message in design mode
          // if (this.isDesignMode || this.isEditMode) {
          //   return '-- no label --'
          // }
          // return ''
        // }
        return label
      },
    },

    /*
     *  Actual data edited by this input field
     */
    checked: {
      get () {
        // console.error(`CHECKBOX getting value`);
        let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        if (attribute) {
          let path = `${recordPath}.${attribute}`
          let defaultValue = false //ZZZ This could come from a schema
          let {data, error} = this.$formservice.getData(path, defaultValue)

          let value = data
          // console.log(`value`, value);
          // console.log(`type=`, typeof(value));
          // console.log(`error`, error);


          if (error) {
            console.error(`FormCheckbox: ${error}`);
            return false
          } else if (value) {
            console.log(`YY value for field ${path} is ${value} (${typeof(value)})`);
            if (typeof(value) === 'Boolean') {
              console.log(`is a boolean`);
              return value
            }
            if (typeof(value) === 'String') {
              value = value.toUpperCase()
              if (value.startsWith('T') || value.startsWith('Y')) {
                return true
              }
            }
            if (typeof(value) === 'Number') {
              return (value > 0)
            }
            // Unknown type
            return false
          } else {
            return false
          }
        } else {
          console.log(`Warning: checkbox is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return false
        }
      },
      set (value) {
        console.error(`CHECKBOX SET TO ${value} (${typeof(value)})`);
        let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        if (attribute) {
          console.log(`datavalue.set(${attribute}, ${value}`);
          console.log(`type is ${typeof(value)}`);
          this.$formservice.setValue(recordPath, attribute, value, Boolean)
          // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
        }
      }
    },
  },
  methods: {

    checkboxStatus () {
      let recordPath = this.context.formservice.dataPath
      let attribute = this.element['attribute']

      if (attribute) {
        let path = `${recordPath}.${attribute}`
        let defaultValue = '' //ZZZ This could come from a schema
        let {data, error} = this.$formservice.getData(path, defaultValue)

        let value = data
        console.log(`value`, value);
        console.log(`error`, error);


        if (error) {
          console.error(`FormCheckbox: ${error}`);
          return false
        } else if (value) {
          console.log(`ZZ value for field ${path} is ${value}`);
          return value
        } else {
          return ''
        }
      } else {
        console.log(`Warning: checkbox is missing 'attribute' property`, this.element);
        //ZZZZZ Do something about this...
        return false
      }
    },
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

<style lang="scss">
  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;

  .c-form-checkbox {
    input.form-checkbox-default {
      font-size: 9px;
      background-color: pink;
    }
    label.form-checkbox-default {
      background-color: none;
      font-family: Arial;
      font-weight: bold;
      font-size: 10px;
    }
  }
</style>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: pink;
  $text-color: #700;


  .c-layout-mode-heading {
    // This overrides the definition in content-editor.scss
    background-color: $frame-color;
    color: $text-color;
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

  .my-checkbox {
    display: inline-block;

    .my-box {
      display: inline-block;
      //postition: relative;
      width: 16px;
      height: 16px;
      border: solid 1px #333;
      padding: 0px;

      .my-selected {
        position: absolute;
        top: -2px;
        left: 4px;
        font-family: Courier;
        font-size: 14px;
      }
    }
    .my-label {
      display: inline-block;
      position: absolute;
      top: 2px;
      left: 22px;
      text-align: left;
      color: #333;
      font-family: Arial;
      font-weight: normal;
      font-size: 12px;
      line-height: 130%;
      white-space: nowrap;
    }
  }


</style>
