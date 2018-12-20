import FileSaver from 'file-saver'

export default {
  computed: {

  },

  methods: {
    mSelectMe: function () {
      console.log(`mSelectMe()`)
      if (this.pageEditMode != 'view') {
        let element = this.element
        this.$content.setPropertyElement({ element })
      }
    },

  },//- methods

  // We cannot update the element's property directly, as it is in the
  // Vuex store this.$content.store. We must use a mutation. This function
  // returns a definition for a Vue computed value for the property.
  // See https://vuex.vuejs.org/guide/forms.html#two-way-computed-property
  twoWayComputedProperty: function (propertyName, defaultValue) {
    // console.log(`twoWayComputedProperty(${propertyName})`);
    return {
      get () {
        if (this.element.hasOwnProperty(propertyName)) {
          return this.element[propertyName]
        }
        if (typeof(defaultValue) !== 'undefined') {
          return defaultValue
        }
        return undefined
      },
      set (value) {
        console.log(`set(${propertyName}, ${value})`);
        this.$content.setProperty({ vm: this, element: this.element, name: propertyName, value })
      }
    }
  }//- twoWayComputedProperty

}
