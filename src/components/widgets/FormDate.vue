<template lang="pug">

  .c-form-date(:class="editModeClass")

    // Sanity checks
    .sanity-error(v-if="!sane_$content")
      | Contentservice has not been installed/initialized.
      br
      | (missing this.$content)
    .sanity-error(v-else-if="!sane_context_formservice", @click.stop="selectThisElement")
      | FormDate: missing this.context.formservice
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
              input.input(readonly, :style="inputStyle", :class="inputClass", placeholder="DD/MM/YYYY")

      // Editing
      div(v-else-if="isEditMode", @click.stop="selectThisElement")
        .field-body.has-text-left
          .field
            label.label(v-show="label") {{label}}
            .control
              input.input(readonly, :style="inputStyle", :class="inputClass", placeholder="DD/MM/YYYY")

      // Live mode - read only (e.g. PDF)
      template(v-else-if="readonly")
        .my-pdf {{actualData}}

      // Live mode - Normal date input
      template(v-else)
        .field-body.has-text-left
          .field
            // Here's the field and dropdown selector
            label.label(v-show="label") {{label}}
            //| {{mode}}
            //br

            .control.has-icons-right(:class="tooltipClass", :data-tooltip="errorMessage")
              .my-dropdown-caret-icon(@click="mode = (mode==='closed') ? 'selectDate' : 'closed'", :style="iconPositionStyle")
              input.input.tooltip(:style="inputStyle", :class="inputClass", :placeholder="placeholder", autocomplete="mAutocompleteDisabled", v-model="actualData", :tabindex="tabIndex", @blur="onblur", data-tooltip="Tooltip Text")
              //.icon.is-small.my-dropdown-icon(@click="mode = (mode==='closed') ? 'selectDate' : 'closed'")
                //a(:href="`#${elementId}`")
                .c-dropdown-caret-icon
            //.icon.is-small.is-right(v-if="errorMessage")
            //  br
            //  | YARP
            //  br
            //  i.my-error-icon.c-input-error-icon
            //  .sanity-error {{errorMessage}} {{errorLevel}} {{typeof(errorLevel)}}.
            div

            // invisible div used to close the form
            .my-fullpage(v-if="mode==='selectDate' || mode==='selectOffset'", @click="mode=previousMode")

            // Date Selector dropdown
            .my-date-dropdown(v-if="mode === 'selectDate'", v-bind:class="{ popupAbove: popupAbove, popupBelow: !popupAbove }")

              // options above date selector
              .my-selectDate-options(@click.prevent.stop="doNothing", v-if="showOffsetPane")
                .control
                  label.radio
                    input(type="radio", v-model="pickMode", value="absolute", @click.stop="doNothing()", name="na")
                    | &nbsp;&nbsp;Use Selected Date
                  br
                  label.radio
                    input(type="radio", v-model="pickMode", value="relative", @click.stop="doNothing()", name="nb")
                    | &nbsp;&nbsp;Calculate a New Date from selected date

              // Select the date
              .my-selectDate-pick
                date-pick(
                  v-model="actualData"
                  :hasInputElement="false"
                  :parseDate="parseDateForDatePick"
                  :formatDate="formatDateFromDatePick"
                  )

            // Relative date selection dropdown
            .my-date-dropdown(v-if="mode === 'selectOffset'", v-bind:class="{ popupAbove: popupAbove, popupBelow: !popupAbove }")

              .my-offset-options(@click.prevent.stop="doNothing")
                | Select the number of days to add to&nbsp;
                br
                b {{actualData}}
                | .
                hr

                div
                  .control
                    label.radio
                      input(type="radio", v-model="offsetDays", value="days", @click.stop="doNothing()", name="ne")
                      | &nbsp;&nbsp;Add&nbsp;&nbsp;
                      input.my-specific-days(type="number", v-model="specificDaysToAdd")
                      | &nbsp;days
                    br
                    label.radio
                      input(type="radio", v-model="offsetDays", value="7", @click.stop="doNothing()", name="ne")
                      | &nbsp;&nbsp;Add 7 days
                    br
                    label.radio
                      input(type="radio", v-model="offsetDays", value="14", @click.stop="doNothing()", name="nf")
                      | &nbsp;&nbsp;Add 14 days
                    br
                    label.radio
                      input(type="radio", v-model="offsetDays", value="30", @click.stop="doNothing()", name="nf")
                      | &nbsp;&nbsp;Add 30 days
                    br
                    label.radio
                      input(type="radio", v-model="offsetDays", value="month", @click.stop="doNothing()", name="nf")
                      | &nbsp;&nbsp;Add 1 Calendar Month
                    br
                    label.radio
                      input(type="radio", v-model="offsetDays", value="60", @click.stop="doNothing()", name="nf")
                      | &nbsp;&nbsp;Add 60 days
                    label.checkbox
                      input(type="checkbox", v-model="countDateAsFirstDay", @click.stop="doNothing()", name="nf")
                      | &nbsp;&nbsp;Count {{actualData}} as first day.

                hr
                .is-pulled-right
                  button.button.is-light.is-smallZ(@click="mode='selectDate'") Back
                  | &nbsp;&nbsp;
                  button.button.is-success.is-smallZ(@click="useCalculatedDate") Use {{calculatedOffsetDate}}
                .is-clearfix
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import EditMixins from '../../mixins/EditMixins'
import DatePick from 'vue-date-pick';
import moment from 'moment';
import 'vue-date-pick/dist/vueDatePick.css';

let elementIdCount = 100
const ERROR = 20

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
  components: { DatePick },
  mixins: [ ContentMixins, CutAndPasteMixins, EditMixins ],
  data: function () {
    return {
      errorMessage: '',
      errorLevel: 0,
      mode: 'closed', // closed, selectDate or selectOffset
      workingCopy: null, // edit this, save when correct
      elementId: `date-dropdown-${elementIdCount++}`,
      needRelativeDate: 'absolute',
      pickMode: 'absolute',
      offsetDays: 'days',
      specificDaysToAdd: 0,
      countDateAsFirstDay: false,
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

    // where to go after setting date
    previousMode: function () {
      if (this.mode === 'selectOffset') {
        return 'selectDate'
      }
      return 'closed'
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

    iconPositionStyle: function ( ) {
      let style = ''
      try {
        let width = parseInt(this.element['width'])
        if (width >= 20) {
          return `left: ${width - 20 - 3}px;`
        }
      } catch (e) { }
      return 'left: 120px;'
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
    //
    // minDate: function ( ) {
    //   let now = new Date()
    //   let pastDays = 10;
    //   let min = now.getTime() - (1000 * 60 * 60 * 24 * pastDays)
    //   return new Date(min)
    // },

    calculatedOffsetDate: function ( ) {
      console.log(`calculatedOffsetDate. actualData=${this.actualData}`);
      let offsetDate = moment(this.actualData, "DD/MM/YYYY")
      console.log(`offsetDate is `, offsetDate);
      // offsetDays: 0,
      // specificDaysToAdd: 7,
      // countDateAsFirstDay: false,
      // let newDate = this.actualData
      switch (this.offsetDays) {
        case 'days':
          let num = parseInt(this.specificDaysToAdd)
          if (isNaN(num)) {
            return '?'
          }
          offsetDate = offsetDate.add(num, 'days')
          break;
        case '7':
          offsetDate = offsetDate.add(7, 'days')
          break;
        case '14':
          offsetDate = offsetDate.add(14, 'days')
          break;
        case '30':
          offsetDate = offsetDate.add(30, 'days')
          break;
        case 'month':
          offsetDate = offsetDate.add(1, 'month')
          break;
        case '60':
          offsetDate = offsetDate.add(60, 'days')
          break;
        default:
          return '?'
      }

      if (this.countDateAsFirstDay) {
        offsetDate = offsetDate.add(-1, 'days')
      }

      return offsetDate.format('DD / MM / YYYY')
    },

    showOffsetPane: {
      get () {
        let value = this.element['showOffsetPane']
        return value
      }
    },

    popupAbove: {
      get () {
        let value = this.element['popupAbove']
        console.log(`popupAbove.get() -> ${value}`);
        return value ? true : false
      }
    },

    actualData: {
      get () {
        console.log(`%%% actualData.get()`);
        if (this.workingCopy !== null) {
          console.log(`%%% have workingCopy: ${this.workingCopy}`);
          return this.workingCopy
        }
        console.log(`%%% DO NOT have workingCopy`);

        // Don't have the working copy - get the actual value.
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
          console.log(`%%% value`, value);
          // console.log(`error`, error);
          if (error) {
            console.error(`FormDate: ${error}`);
            this.workingCopy = null
            return ''
          } else if (value) {
            console.log(`%%% value for field ${path} is ${value}`);
            this.workingCopy = value
            return value
            // return new Date(Date.parse(value))
            // return value
          } else {
            // return ''
            // console.error(`@@@ GET END 3`)
            this.workingCopy = null
            return ''
          }
        } else {
          console.log(`Warning: FormDate is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          this.workingCopy = null
          // return ''
          // console.error(`@@@ GET END 4`)
          return null
        }
      },//- get
      set (value) {
        console.log(`!!! actualData.set(${value}), ${typeof(value)}`);
        // Close the dropdown, if it is open
        // if (location) {
        //   console.log(`!!! current href=${location.href}`);
        //   location.href = this.tagAfterDateSelect
        // }
        if (this.mode==='selectDate' && this.pickMode==='relative') {
          this.mode = 'selectOffset'
        } else {
          this.mode = 'closed'
        }

        if (this.isLive) {

          this.workingCopy = value

          // Break it down into parts.
          value = value.replace(/-/g, '/')
          value = value.replace(/\./g, '/')
          var parts = value.split("/");
          console.log(`!!! parts=`, parts);
          if (parts.length != 3) {
            this.errorMessage = 'Invalid date'
            this.errorLevel = ERROR
            return
          }
          this.errorMessage = null
          let day = parseInt(parts[2], 10)
          let mth = parseInt(parts[1], 10)
          let year = parseInt(parts[0], 10)
          if (isNaN(day) || isNaN(mth) || isNaN(year)) {
            this.errorMessage = 'Invalid date'
            this.errorLevel = ERROR
            return
          }

          if (day > 1900 && year < 1900) {
            console.log(`!!! swap day/year`);
            let tmp = year
            year = day
            day = tmp
          }
          if (mth > 12 && day <= 12) {
            console.log(`!!! swap day/mth`);
            let tmp = day
            day = mth
            mth = tmp
          }
          console.log(`!!! ${day}, ${mth}, ${year}`);

          if (day < 1 || day > 31 || mth < 1 || mth > 12 || year < 1900) {
            this.errorMessage = 'Invalid date'
            this.errorLevel = ERROR
            return
          }

          // Convert to a date, to check validity
          var dt = new Date(year, mth - 1, day)
          console.log(`+++ -> ${dt}`);

          // Check it is valid
          if (dt instanceof Date && !isNaN(dt)) {
            // Is good
          } else {
            console.log(`!!! not saving date yet`);
            this.errorMessage = 'Invalid date'
            this.errorLevel = ERROR
            return
          }

          if (day < 10) {
            day = '0' + day;
          }
          if (mth < 10) {
            mth = '0' + mth;
          }
          value = day + ' / ' + mth + ' / ' + year;
          console.log(`!!! Value is now ${value}`);

          console.log(`!!! SAVING WORKING COPY`);

          let recordPath = this.context.formservice.dataPath
          console.error(`!!! WARP1 FormDate.actualData.set: recordPath=${recordPath}`);
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
              if (typeof(errorLevel) !== 'undefined') {
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

    tooltipClass: function () {
      if (this.errorLevel) {
        // console.log(`tooltipClass: ${this.errorLevel}`);
        return 'tooltip'
      }
    },
  },//- computed

  methods: {
    parseDateForDatePick: function (str) {
      console.log(`+++ parseDateForDatePick(${str})`);
      str = str.replace(/-/g, '/')
      str = str.replace(/\./g, '/')
      var parts = str.split("/");
      console.log(`parts=`, parts);
      let day = parseInt(parts[2], 10)
      let mth = parseInt(parts[1], 10)
      let year = parseInt(parts[0], 10)

      if (day > 1900) {
        console.log(`+++ swap year/day`);
        let tmp = year
        year = day
        day = tmp
      }
      console.log(`+++ ${day}, ${mth}, ${year}`);

      var dt = new Date(year, mth - 1, day)
      console.log(`+++ -> ${dt}`);

      // Check it is valid
      if (dt instanceof Date && !isNaN(dt)) {
        return dt
      }
      return null
      // return new Date(Date.parse(str))
    },

    formatDateFromDatePick: function (date) {
      console.log(`>>> formatDateFromDatePick(${date}) - ${typeof(date)}`);
      var dd = date.getDate();
      var mm = date.getMonth() + 1; //January is 0!

      var yyyy = date.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      var newDate = dd + ' / ' + mm + ' / ' + yyyy;
      console.log(`>>> newdate is ${newDate}`);
      return newDate
    },

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

          // If the working copy is valid, set it from the saved, formatted version
          if (!this.errorMessage) {
            this.workingCopy = value
          }

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

    useCalculatedDate () {

      // This will also close the dropdown
      this.actualData = this.calculatedOffsetDate
    },

    doNothing: function () {
      console.log(`doNothing()`);
      // Does nothing, but prevents clicks from being ignored.
    }
  },//- methods
}

function isSpace(c) {
  return (c == ' ')
}

function isNumber(c) {
  return ('0123456789'.indexOf(c) >= 0)
}
</script>


<style lang="scss">
  @import '../../assets/css/content-variables.scss';
  @import '~bulma-tooltip';

</style>
