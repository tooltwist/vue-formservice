<template lang="pug">

  .c-form-option(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="selectThisElement")
      | FormOption: Missing this.context.formservice
      br
      | Please place this component within a form.
    template(v-else)
      //| YEP: {{$formservice.store.state.refreshCounter}}
      //br

      // Normal operation below here
      span(v-if="extraDebug")
        | &lt;form-option&gt;
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
        .my-option(:style="mInputStyle", :class="mInputClass", @click.stop="selectThisElement")
          .my-box
          .my-label(v-if="label")
            | {{label}}

      // Live mode
      template(v-else)
        .my-option
          .my-box(@click.stop="clickOnOption")
            .my-selected(v-if="checked")
              | X
          .my-label(v-if="label")
            | {{label}}
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import WidgetMixins from '../../mixins/WidgetMixins'

export default {
  name: 'content-form-option',
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
        obj['form-option-default'] = true
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
        let valueWhenSelected = this.element['value']

        console.log(`option.get(), ${recordPath}, ${attribute}, ${valueWhenSelected}`);

        if (attribute && valueWhenSelected) {
          let path = `${recordPath}.${attribute}`
          let defaultValue = ''
          let {data, error} = this.$formservice.getData(path, defaultValue)
          console.log(`option.get(), ${data}, ${valueWhenSelected}`);
          if (data == valueWhenSelected) {
            return true
          }
          return false
        } else {
          console.log(`Warning: option is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return false
        }
      },
      // set (value) {
      //   console.error(`CHECKBOX SET TO ${value} (${typeof(value)})`);
      //   let recordPath = this.context.formservice.dataPath
      //   let attribute = this.element['attribute']
      //
      //   if (attribute) {
      //     console.log(`datavalue.set(${attribute}, ${value}`);
      //     console.log(`type is ${typeof(value)}`);
      //     this.$formservice.setValue(recordPath, attribute, value, Boolean)
      //     // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
      //   }
      // }
    },
  },
  methods: {

    // checkboxStatus () {
    //   let recordPath = this.context.formservice.dataPath
    //   let attribute = this.element['attribute']
    //
    //   if (attribute) {
    //     let path = `${recordPath}.${attribute}`
    //     let defaultValue = '' //ZZZ This could come from a schema
    //     let {data, error} = this.$formservice.getData(path, defaultValue)
    //
    //     let value = data
    //     console.log(`value`, value);
    //     console.log(`error`, error);
    //
    //
    //     if (error) {
    //       console.error(`FormCheckbox: ${error}`);
    //       return false
    //     } else if (value) {
    //       console.log(`ZZ value for field ${path} is ${value}`);
    //       return value
    //     } else {
    //       return ''
    //     }
    //   } else {
    //     console.log(`Warning: checkbox is missing 'attribute' property`, this.element);
    //     //ZZZZZ Do something about this...
    //     return false
    //   }
    // },

    clickOnOption: function () {
      let recordPath = this.context.formservice.dataPath
      let attribute = this.element['attribute']
      let value = this.element['value']

      if (attribute && value) {
        this.$formservice.setValue(recordPath, attribute, value, String)
        this.$content.refresh({ })
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

  .c-form-option {
    text-align: left;

    input.form-option-default {
      font-size: 9px;
      background-color: pink;
    }
    label.form-option-default {
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

  .my-option {
    display: inline-block;
    position: relative;

    .my-box {
      display: inline-block;
      //position: relative;
      width: 16px;
      height: 16px;
      border: solid 1px #333;
      padding: 0px;

      .my-selected {
        position: absolute;
        top: -2px;
        left: 4px;
        font-family: Courier;
        font-size: 15px;
        font-color: black;
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
