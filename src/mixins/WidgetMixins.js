import FileSaver from 'file-saver'

export default {
  computed: {

    editModeClass: function () {
      if (this.$content && this.$content.store.state.mode) {

        // Add a class for the current editing mode
        let mode = this.$content.store.state.mode
        let cls = `c-edit-mode-${mode}`

        // Add property-editing-related classes, for the currently selected
        // element, and the element expanded in the properties editor.
        if (this.element) {
          if (this.element === this.$content.store.getters.propertyElement) {
            // console.log(`HEY THATS ME!!! ${this.element.id} (${this.element.type})`)
            cls += ` c-selected`
          }
          if (this.element === this.$content.store.state.expandedElement) {
            cls += ` c-expanded`
          }
        }

        // console.log(`  class: ${cls}`)
        return cls
      }
      return 'c-edit-mode-view'
    },

    mInputStyle: function ( ) {
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

    mInputClass: function () {
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
      return obj
    },

  },

  computedProperty: function (propertyName) {
    console.log(`computedProperty(${propertyName})`);
    return {
      get () {
        let value = this.element[propertyName]
        return value ? value : ''
      }
    }
  }
}
