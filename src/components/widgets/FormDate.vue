<template lang="pug">

  .c-form-date(:class="cClass", :style="cStyle")

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
              input.input(readonly, placeholder="YYYY/MM/DD")

      // Editing
      div(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, placeholder="YYYY/MM/DD")

      // Live mode
      template(v-else)
        .has-text-left
          .part1
            b-field(:label="label")
              b-datepicker(icon-pack="fa", icon="fa-calendar", v-model="actualData", :min-date="minDate", :date-formatter="dateFormatter", :date-parser="dateParser", :readonly="false")
          .part2
            | &nbsp; {{weekday}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import EditMixins from '../../mixins/EditMixins'

export default {
  name: 'form-date',
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

    weekday: function ( ) {
      let date = this.actualData
      console.error(`weekday(): ${date}`);
      if (date === null) {
        return ''
      }
      if (date.getTime() === 0) {
        return ''
      }
      let day = date.getDay()
      console.error(`day is ${day}`);
      // let locale =
      // return date.toLocaleDateString(locale, { weekday: 'long' });
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[day]
    },

    minDate: function ( ) {
      let now = new Date()
      let pastDays = 10;
      let min = now.getTime() - (1000 * 60 * 60 * 24 * pastDays)
      return new Date(min)
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
        // return new Date()

        if (attribute) {
          // console.error(`@@@ GET START`)
          let path = `${recordPath}.${attribute}`
          let defaultValue = ''
          // let {data, error} = this.$formservice.getData(path, defaultValue)
          let {data, error} = this.$formservice.findOrCreate({vm: this, path, updatePath: true, value: defaultValue, debug: false })
          // let {data, error} = this.$formservice.find({vm: this, path, debug: true })

          let value = data
          console.error(`value`, value);
          console.error(`error`, error);


          if (error) {
            // console.error(`FieldInput: ${error}`);
            // return ''
            // console.error(`@@@ GET END 1`)
            return null
          } else if (value) {

            // See if the date has been set yet
            // if (value === null || value.getTime() === 0) {
            //   return null
            // }
            console.error(`value is ${typeof(value)}, ${value instanceof Date}, ${value}`);



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
        // console.log(`actualData.set(${value}), ${typeof(value)}`);
        if (this.isLive) {
          // console.error(`@@@ SET START`)
          let recordPath = this.context.formservice.dataPath
          // console.error(`WARP FormDate.actualData.set: recordPath=${recordPath}`);
          let attribute = this.cAttribute

          if (attribute) {
            let path = `${recordPath}.${attribute}`
            // console.log(`FormDate: actualData.set(${attribute}, ${value}`);

            // See if the value has changed
            let {data, error} = this.$formservice.find({vm: this, path, debug: false })
            let oldValue = data

            console.log(`Old value: ${oldValue}`, error)
            console.log(`New value: ${newValue}`)

            if (newValue === null) {

              // Value is being set to null
              if (oldValue) {
                // Set to null
                console.error(`BEING SET TO NULL`);
                newValue = ''
              } else {
                // Is already null
                console.error(`BOTH NULL - not changed`);
                return
              }
            } else {

              // Format new value to yyyy-mm-dd
              let month = '' + (newValue.getMonth() + 1)
              let day = '' + newValue.getDate()
              let year = newValue.getFullYear()
              if (month.length < 2) month = '0' + month;
              if (day.length < 2) day = '0' + day;
              newValue = [year, month, day].join('-');

              if (oldValue === newValue) {
                // Value has not been changed
                console.error(`VALUE NOT CHANGED`);
                return
              }
              console.error(`VALUE CHANGED TO ${newValue}`);
            }

            // Save the new value
            this.$formservice.save({vm: this, path, updatePath: true, value: newValue, debug: false })
            // console.error(`@@@ SET END`)
          }
        }
      }
    }
  },//- computed

  methods: {
    dateFormatter: function (date) {
      console.error(`dateFormatter(${date})`);
      if (date == null) {
        console.error(`NULL DATE (null)`);
        return ''
      }
      return date.toLocaleDateString()
    },
    dateParser: function (date) {
      return new Date(Date.parse(date))
    },
  },//- methods
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';

  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;


  .c-form-date {

    // Used if not in a valid form
    .sanity-error {
      color: red;
      font-family: courier;
      font-size: 11px;
    }

    input {
      max-width: 140px;
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
      .part1 {
        display: inline-block;
      }
      .part2 {
        display: inline-block;
        position: relative;
        top: 6px;
        font-size: 0.8rem;
      }
      input {
        display: inline-block;
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
