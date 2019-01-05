time<template lang="pug">

  .c-form-time(:class="cClass", :style="cStyle")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="mSelectMe")
      | Please place this field inside a form.
      br
      | (missing this.context.formservice)
    template(v-else)

      // No Errors

      // Design mode
      div(v-if="isDesignMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, placeholder="HH:MM")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, placeholder="HH:MM")

      // Live mode
      template(v-else)
        b-field.has-text-left(:label="label")
          //b-datepicker(icon-pack="fa", icon="fa-calendar", v-model="actualData")
          b-timepicker(icon="calendar-today", v-model="actualData", :readonly="false")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
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
    }
  }
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';

  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;


  .c-form-time {

    // Used if not in a valid form
    .sanity-error {
      color: red;
      font-family: courier;
      font-size: 11px;
    }

    input {
      max-width: 120px;
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
      margin: 1px;

      // .container {
      //   width: 90% !important;
      // }

      input {
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
        input {
          border: dashed 1px $border-color-borderless;
          box-shadow: none;
          font-weight: normal;
        }
      }


      // input.form-input-default {
      //   border-color: $border-color-default;
      //   background-color: $bg-default;
      //   //background-color: red;
      //   font-family: Arial;
      //   font-weight: bold;
      //   font-size: 9px;
      // }
      // input.form-input-borderless {
      //   border-color: $border-color-borderless;
      //   zborder: none;
      //   box-shadow: none;
      //   zbackground-color: $bg-borderless;
      //   font-size: 9px;
      // }
    }

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      input {
        border-color: $border-color-default;
        font-family: $c-input-default-font-family;
        font-weight: $c-input-default-font-weight;
        font-size: $c-input-default-font-size;
        color: $c-input-default-color;
        background-color: $c-input-default-background-color;
      }
      &.form-input-borderless {
        input {
          border: dashed 1px $border-color-borderless;
          box-shadow: none;
          font-weight: normal;
        }
      }
    }

    // Live mode
    &.c-edit-mode-view {
      input {
        border-color: $border-color-default;
        font-family: $c-input-default-font-family;
        font-weight: $c-input-default-font-weight;
        font-size: $c-input-default-font-size;
        color: $c-input-default-color;
        background-color: $c-input-default-background-color;
      }
      &.form-input-borderless {
        input {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
</style>
