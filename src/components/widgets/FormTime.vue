time<template lang="pug">

  .c-form-time(:class="cClass", :style="cStyle")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="mSelectMe")
      | FormTime: missing this.context.formservice
      br
      | Please place this field inside a form.
    template(v-else)

      // No Errors

      // Design mode
      div(v-if="isDesignMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :style="inputStyle", :class="inputClass", placeholder="HH:MM")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :style="inputStyle", :class="inputClass", placeholder="HH:MM")

      // Live mode
      template(v-else)
        b-field.has-text-left(:label="label")
          //b-datepicker(icon-pack="fa", icon="fa-calendar", v-model="actualData")
          b-timepicker(:style="inputStyle", :class="inputClass", icon="calendar-today", v-model="actualData", :readonly="false")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'form-time',
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
  mixins: [ ContentMixins, CutAndPasteMixins, EditMixins ],
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

    cAttribute: {
      get () {

        //ZZZZZ
        // console.error(`FormDate.attribute.get(): this.context=`, this.context);

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

    /*
     *  Actual data edited by this input field
     */
    actualData: {
      get () {
        let recordPath = this.context.formservice.dataPath
        let attribute = this.cAttribute

// console.log(`------`);
        // console.log(`actualData: ${recordPath}, ${attribute}.`);
        // return nullTime

        if (attribute) {
          // console.error(`@@@ GET START`)
          let path = `${recordPath}.${attribute}`
          let defaultValue = null
          // let {data, error} = this.$formservice.getData(path, defaultValue)
          let {data, error} = this.$formservice.findOrCreate({vm: this, path, updatePath: true, value: defaultValue, debug: false })
          // let {data, error} = this.$formservice.find({vm: this, path, debug: true })

          let value = data
          // console.log(`value`, value);
          // console.log(`error`, error);


          if (error) {
            // console.error(`FieldInput: ${error}`);
            // return ''
            // console.error(`@@@ GET END 1`)
            return null
          } else if (value) {
            // console.log(`value for field ${path} is ${value}`);
            // (date) => date.toLocaleDateString()
            // console.error(`@@@ GET END 2`, new Date(Date.parse(value)))
            return new Date(Date.parse(value))
            // return value
          } else {
            // return ''
            // console.error(`@@@ GET END 3`)
            return null
          }
        } else {
          console.log(`Warning: FormDate is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          // return ''
          // console.error(`@@@ GET END 4`)
          return null
        }
      },//- get
      set (newValue) {
        // console.log(`actualData.set(${newValue}), ${typeof(newValue)}`);
        if (this.isLive) {
          // console.error(`@@@ SET START`)
          let recordPath = this.context.formservice.dataPath
          // console.error(`WARP FormDate.actualData.set: recordPath=${recordPath}`);
          let attribute = this.cAttribute

          if (attribute) {
            let path = `${recordPath}.${attribute}`
            // console.log(`FormDate: actualData.set(${attribute}, ${newValue}`);

            // See if the value has changed
            let {data, error} = this.$formservice.find({vm: this, path, debug: false })
            let oldValue = data
            console.log(`Old time: ${oldValue}`, error)
            console.log(`New time: ${typeof(newValue)}, ${newValue instanceof Date}, ${newValue}`);

            if (newValue === null) {

              // Value is being set to null
              if (oldValue) {
                // Set to null
                console.error(`TIME BEING SET TO NULL`);
                newValue = ''
              } else {
                // Is already null
                console.error(`BOTH TIMES NULL - not changed`);
                return
              }
            } else {
              // Format new value to yyyy-mm-dd
              let hour = '' + (newValue.getHours() + 1)
              let minute = '' + newValue.getMinutes()
              if (hour.length < 2) hour = '0' + hour;
              if (minute.length < 2) minute = '0' + minute;
              newValue = `${hour}:${minute}`

              if (oldValue === newValue) {
                // Value has not been changed
                console.error(`VALUE NOT CHANGED`);
                return
              }
              console.error(`VALUE CHANGED TO ${newValue}`);
            }

            this.$formservice.save({vm: this, path, updatePath: true, value: newValue, debug: false })
          }
        }
      }
    },

    inputClass: function () {
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
  }
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';



</style>
