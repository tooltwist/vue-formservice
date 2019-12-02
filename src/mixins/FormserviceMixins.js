import FileSaver from 'file-saver'

export default {
  data () {
    return {
      counter: 1,

      // Position of the mouse, within the object being dragged
      mouseDownX: 0,
      mouseDownY: 0,

      // Align to a grid
      alignToGrid: true,
      gridSize: 25,

      form: {

      },
      size: {
        width: null,
        height: 500,
        style: 'chicken-style'
      }
    }
  },
  computed: {
    boxStyle: function ( ) {
      let style = this.element['style'] + ';' + this.boxSize
      return style
    },//- boxStyle

    boxSize: function ( ) {
      let style = ''
      let sizeUnit = 'px'
      // width
      try {
        let num = parseInt(this.element['width'])
        if (num >= 20 && sizeUnit === 'px') {
          style += `width:${num}${sizeUnit};`
        }
      } catch (e) { }
      
      // height
      try {
        let num = parseInt(this.element['height'])
        if (num >= 20 && sizeUnit === 'px') {
          style += `height:${num}${sizeUnit};`
        }
      } catch (e) { }
      //console.log(`boxStyle=`, style)
      return style
    },//- boxStyle

    boxClass: function () {
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
      }
      return obj
    },

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

    componentNameForElement (element) {
      let type = element.type
      let def = this.$content.getLayoutType(type)
      return def ? def.componentName : null
    },

    containerClass: function (element) {
      if (element.containerClass) {
        return element.containerClass
      }
      return ''
    },

    elementClass: function (element) {
      // console.log(`positionClass()`, element);
      let _class = [this.positionClass(element)]
      
      if (element.class) {
        _class.push(element.class)
      }
      
      return _class.join(' ')
    },

    elementStyle: function (element) {
      let style = this.positionStyle(element)
      var elementStyle = element.style
      if (elementStyle) {
        elementStyle.split(';').forEach(_s => {
          var keyValue = _s.split(':')
          if (keyValue.length === 2) {
            style[keyValue[0].trim()] = keyValue[1].trim()
          }
        })
      }
      return style
    },
    
    positionClass: function (element) {
      // console.log(`positionClass()`, element);

      if (element.classname) {
        return element.classname
      }
      return ''
    },

    positionStyle: function (element, additionalStyles) {
      // console.log(`positionStyle()`, element);
      // return { }

      let x = element._fixed_x ? element._fixed_x : 0
      let y = element._fixed_y ? element._fixed_y : 0

      // x = element.style.left + x
      // y = element.style.top + y

      let style = {
        position: 'absolute',
        //'background-color': 'red',
        //color: 'white',
        left: `${x}px`,
        top: `${y}px`,
      }
      // console.log(`style=`, style)

      if (additionalStyles) {
        _addStyles = additionalStyles.split(';').forEach(style => {
          var key = style.split(':')[0].trim()
          var value = style.split(':')[1].trim()
          style[key] = value
        })
      }

      return style
    },

    mouseDown: function (p1, p2, p3) {
      // let element = this.element
      event.stopImmediatePropagation()
      console.log(`mouseDown(). p1=`, p1);
      console.log(`mouseDown(). p2=`, p2);
      console.log(`mouseDown(). p3=`, p3);

      // this.mouseDownX = event.layerX
      // this.mouseDownY = event.layerY
    },
    
    dragStart: function (p1, p2, p3) {
      // let element = this.element
      event.stopImmediatePropagation()
      console.log(`dragStart(). p1=`, p1);
      console.log(`dragStart(). p2=`, p2);
      console.log(`dragStart(). p3=`, p3);
      this.mouseDownX = event.clientX
      this.mouseDownY = event.clientY
    },

    // The drop event normally provides (data, event) but we've added (form, ...) in front.
    handleDrop (form, data, event) {
      event.stopImmediatePropagation()
      console.log(`FixedPositionForm.handleDrop(). form=`, form)
      console.log(`FixedPositionForm.handleDrop(), data=`, data)
      console.log(`FixedPositionForm.handleDrop(), el=`, this.$el)
      console.log(`FixedPositionForm.handleDrop(), event=`, event)
      var _fixed_x = data._fixed_x ? data._fixed_x : 0
      var _fixed_y = data._fixed_y ? data._fixed_y : 0

      // Work out the drop position
      let x = parseInt(_fixed_x) + (event.clientX - this.mouseDownX)
      let y = parseInt(_fixed_y) + (event.clientY - this.mouseDownY)
      console.log(`layer: x=${event.layerX}, y=${event.layerY}`)
      console.log(`mouseDown: x=${this.mouseDownX}, y=${this.mouseDownY}`)

      if (this.alignToGrid && this.gridSize > 1) {
        console.log('truncating position');
        x = Math.round(x / this.gridSize) * this.gridSize
        y = Math.round(y / this.gridSize) * this.gridSize
      }
      console.log(`new position: x=${x}, y=${y}`)

      var element = null

      if (data.dragtype == 'component') {

        // Get the element to be inserted, from the drop data.
        // let wrapper = {
        //   type: 'contentservice.io',
        //   version: "1.0",
        //   layout: {
        //     type: 'element-position',
        //     _fixed_x: event.layerX,
        //     _fixed_y: event.layerY,
        //     children: [ ]
        //   }
        // }

        // Get the layerX and layerY for components dragged from the contentservice
        x = event.layerX
        y = event.layerY
        
        console.log(`rooss 1`, data);
        let newElement = data.data
        // wrapper.layout.children.push(newElement)
        let position = this.element.children.length
        // console.error(`new wrapper is`, wrapper);
        console.error(`newElement is`, newElement);
        console.log(`rooss 2`);
        let rv = this.$content.insertLayout({ vm: this, parent: this.element, position, layout: newElement })
        console.log(`rooss 3`);
        console.log(`return from insertLayout is ${rv}`);
        this.counter++ //ZZZZZ?
        console.log(`rooss 4`);
        
      } else {
        // console.log(`Dropped non-component: '${data.type}'`)
        console.log(`Dropped element (not from toolbox)`)
        console.log(`data=`, data);
        // x: event.layerX,
        // y: event.layerY,
        // this.$content.setPropertyInElement({ vm: this, element: data, name: 'x', value: x })
        // this.$content.setPropertyInElement({ vm: this, element: data, name: 'y', value: y })
        // return
        element = data
      }

      this.$content.setProperty({ vm: this, element: element, name: '_fixed', value: true })
      this.$content.setProperty({ vm: this, element: element, name: '_fixed_x', value: x })
      this.$content.setProperty({ vm: this, element: element, name: '_fixed_y', value: y })
      this.$content.setProperty({ vm: this, element: element, name: 'parentIndex', value: data.parentIndex })

      console.log(element, data.parentIndex)



      // // Get the element to be inserted, from the drop data.
      // let insertContent = data.data

      // // Note that 'child' is the existing child, not the child being inserted.
      // if (child) {
      //   // Insert before the specified child.
      //   for (var i = 0; i < element.children.length; i++) {
      //     if (element.children[i] === child) {
      //       console.log(`Insert at position ${i}`)
      //       this.$content.insertLayout({ vm: this, parent: element, position: i, layout: insertContent })
      //       break
      //     }
      //   }
      // } else {
      //   // No child specified - add at the end
      //   this.$content.insertLayout({ vm: this, parent: element, position: -1, layout: insertContent })
      // }
    },

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
