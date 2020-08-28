<template lang="pug">

  .c-form-textarea(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="selectThisElement")
      | FormTextarea: missing this.context.formservice
      br
      | Please place this field inside a form.
    template(v-else)

      // Design mode
      //div(v-if="isDesignMode", @click.stop="selectThisElement")
      //  .field-body.has-text-left
      //    .field
      //      label.label(v-show="label") {{label}}
      //      .control
      //        textarea.textarea(readonly, :style="inputStyle", :class="inputClass", :placeholder="cPlaceholder")

      // Editing
      div(v-if="isEditMode || isDesignMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              textarea.textarea.highlight-when-selected(readonly, :style="inputStyle", :class="inputClass", :placeholder="cPlaceholder", v-model="actualData", :tabindex="tabIndex")

      // Live mode
      template(v-else)
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control.has-icons-right(:class="tooltipClass", :data-tooltip="errorMessage")
              textarea.textarea(:style="inputStyle", :class="inputClass", :placeholder="cPlaceholder", v-model="actualData", :tabindex="tabIndex", :readonly="readonly")
              .icon.is-small.is-right(v-if="errorMessage")
                i.my-error-icon.c-input-error-icon
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

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

      // See if this is readonly (i.e. in a pdf)
      if (this.readonly) {
        obj['c-readonly'] = true
      }

      // Check the warning level
      if (this.errorLevel) {
        obj[`error-level-${this.errorLevel}`] = true
      }

      return obj
    },

    inputStyle: function ( ) {
      let style = this.readonly ? '' : this.element['style'] + ';'
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

    readonly: function () {
      let value = this.element['readonly']
      if (typeof(value) === 'boolean') {
        return value
      }
      if (typeof(value) === 'string') {
        let uc = value.toUpperCase()
        return (rc === 'TRUE')
      }
      return false
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

        // This reference forces 'actualData' to be
        // re-computed if this.sequence is incremented.
        let sequence = this.sequence

        if (attribute) {
          let path = `${recordPath}.${attribute}`
          let defaultValue = '' //ZZZ This could come from a schema
          let {data, error} = this.$formservice.find({
            vm: this,
            path,
            debug: false});

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
            let path = `${recordPath}.${attribute}`
            // apply sentence casing here to save the formatted value instead of the default value
            value =  this.enableSentenceCase ? this.formatSentenceCase(value) : value;

            // Save the value
            this.$formservice.save({ vm: this, path, updatePath: true, value, debug: false })
            this.$content.refresh({})
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
    enableSentenceCase: {
      get() { 
        let enableSentenceCase = this.element['enableSentenceCase']
        return enableSentenceCase ? enableSentenceCase: false
      }
    },
  },
  methods: {
    formatSentenceCase(data) {
      let returnString = [];
      // splitting the value string for multiple line sentence casing
      data.split('\n').forEach(line => {
        //find white space occurences
        let validatedLine = line.search(/\S|$/);
        if(validatedLine > 0){
          return returnString.push(line.substring(0,validatedLine) + line.charAt(validatedLine).toUpperCase() + line.substring(validatedLine+1).toLowerCase())
        }
        //format first character of the line
        return returnString.push( line.charAt(0).toUpperCase() + line.substring(1).toLowerCase());
      });
      return returnString.join('\n');
    }
  },
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';
  @import '~bulma-tooltip';

</style>
