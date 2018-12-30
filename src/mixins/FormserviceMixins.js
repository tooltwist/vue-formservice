import FileSaver from 'file-saver'

export default {
  computed: {

    /*
     *  Check the widget is placed within a form and
     *  Contentservice has been installed and initialised.
     */
    formserviceSanityCheck: function ( ) {
      return (this.sane_$content && this.sane_context_formservice)
    },

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

    // Return the correct value for the autocomplete attribute
    // for the current browser.
    // See https://stackoverflow.com/questions/50405068/disable-autocomplete-in-chrome-66
    mAutocompleteDisabled: {
      get ( ) {
        console.error(`mAutocompleteDisabled()`);
        return 'disabled'
        let isChrome = false
        if (navigator) {
          console.error(`NAVIGAOTR IS`, navigator);
          isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        }
  else {
    console.error(`No Navigator`) }
    console.error(`IS CHROME =${isChrome}`)
        return isChrome ? 'disabled' :  'off'
      }
    },

    /*
     *  Actual data edited by this input field
     */
    mAttributeValue: {

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
          console.log(`Warning: input is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      set (value) {
        if (this.isLive) {
          let recordPath = this.context.formservice.dataPath
          let attribute = this.element['attribute']

          if (attribute) {
            // console.log(`FormInput: datavalue.set(${attribute}, ${value}`);
            this.$formservice.setValue(recordPath, attribute, value, String)
            // this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
          }
        } else {
          console.error(`Trying to set attribute value in non-live mode.`);
        }
      }
    },//- mAttributeValue

  },//- computed

  methods: {

    mAbsolutePath: function (relativePath) {
      // console.log(`   ** mAbsolutePath(${relativePath})`);
      if (!this.context || !this.context.formservice) {
        // console.log(`   ** no context`);
        return relativePath
      }
      let currentDataPath = this.context.formservice.dataPath
      // console.log(`   ** currentDataPath=${currentDataPath}`);

      if (!relativePath) {
        // console.log(`   ** no relative path, use currentDataPath`);
        return currentDataPath
      }
      if (relativePath.startsWith('!')) {
        // console.log(`   ** relativePath is absolute`);
        return relativePath
      }

      while (relativePath.startsWith('.')) {
        relativePath = relativePath.substring(1).trim()
      }
      let absolutePath = `${currentDataPath}.${relativePath}`
      // console.log(`   ** absolutePath=${absolutePath}`);
      return absolutePath
    },
  },//- methods


  twoWayComputedData: function (absoluteOrRelativePath) {

    return {
      get () {
        // console.log(`get(${absoluteOrRelativePath})`);
        let path = this.mAbsolutePath(absoluteOrRelativePath)
        let {error, data} = this.$formservice.find({
          vm: this,
          // operation: 'find',
          path: path,
          // updatePath: false,
          // value: [ ],
          debug: false
        })

        if (error) {
          console.error(`Error: ${error}`);
          return null
        }
        console.log(`  data is`, data);
        return data
      },
      set (value) {
        // console.log(`set(${absoluteOrRelativePath}, ${value})`);
        let path = this.mAbsolutePath(absoluteOrRelativePath)
        let {error, data} = this.$formservice.save({
          vm: this,
          // operation: 'save',
          path: path,
          updatePath: true,
          value: value,
          debug: false
        })
        if (error) {
          console.error(`Error: ${error}`);
          return null
        }
      }
    }
  }//- twoWayComputedData
}
