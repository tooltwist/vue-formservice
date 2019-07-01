<template lang="pug">

  .c-form-checkbox(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="selectThisElement")
      | FormCheckbox: Missing this.context.formservice
      br
      | Please place this component within a form.
    template(v-else)
      //| YEP: {{$formservice.store.state.refreshCounter}}
      //br

      // Normal operation below here
      span(v-if="extraDebug")
        | &lt;form-checkbox&gt;
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
          .my-box(@click.stop="clickOnCheckbox")
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

          // console.log(`checked.get(), ${data}, ${error}, ${typeof(data)}`);


          if (error) {
            console.error(`FormCheckbox: ${error}`);
            return false
          } else if (value) {
            console.log(`YY value for field ${path} is ${value} (${typeof(value)})`);
            if (typeof(value) === 'boolean') {
              console.log(`is a boolean`);
              return value
            }
            if (typeof(value) === 'string') {
              value = value.toUpperCase()
              if (value.startsWith('T') || value.startsWith('Y')) {
                return true
              }
            }
            if (typeof(value) === 'number') {
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
    },
  },
  methods: {

    clickOnCheckbox: function () {
      let recordPath = this.context.formservice.dataPath
      let attribute = this.element['attribute']

      if (attribute) {
        let currentValue = this.checked
        let value = true
        if (currentValue) {
          value = false
        }
        this.$formservice.setValue(recordPath, attribute, value, Boolean)
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

<style lang="scss" scoped>
</style>
