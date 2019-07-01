<template lang="pug">

  .c-form-dropdown(:class="cClass", :style="cStyle")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="selectThisElement")
      | FormDropdown: missing this.context.formservice
      br
      | Please place this component inside a form.
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
              input.input(readonly, :style="mInputStyle", :class="mInputClass", :placeholder="placeholder")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :style="mInputStyle", :class="mInputClass", :placeholder="placeholder")

      // Live mode
      template(v-else)
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              // input.input(:style="mInputStyle", :class="mInputClass", :placeholder="placeholder", v-model="actualData")
              .select.has-text-left
                select(v-model="actualData")
                  option(v-for="record in cOptions", :value="record.value") {{record.description}}
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import WidgetMixins from '../../mixins/WidgetMixins'

export default {
  name: 'form-dropdown',
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

    attribute: {
      get () {

        //ZZZZZ
        // console.error(`FormDropdown.attribute.get(): this.context=`, this.context);

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
          console.log(`Warning: FormDropdown is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      set (value) {
        if (this.isLive) {
          let recordPath = this.context.formservice.dataPath
          console.error(`WARP FormDropdown.actualData.set: recordPath=${recordPath}`);
          let attribute = this.element['attribute']

          if (attribute) {
            console.log(`FormDropdown: datavalue.set(${attribute}, ${value}`);
            this.$formservice.setValue(recordPath, attribute, value, String)
            // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
          }
        }
      }
    },//- actualData

    cOptions: function ( ) {

      let attribute = this.element['attribute']
      let dataset = this.element.dataset
      // console.log(`dataset is ${dataset}`, this);
      if (dataset) {
        let { data, error } = this.$formservice.find({vm: this, path: dataset})
        // console.error(`${dataset}=`, data)
        // console.error(`error=`, error)
        if (error) {
          console.error(`Dropdown for '${attribute}' (dataset=${dataset}): `, error)
          return [ ]
        }
        return data
      }
      console.error(`Property 'dataset' not set for Dropdown '${attribute}'`);
      return [ ]
    },//- options

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

  },//- computed

}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';


</style>
