export default {
  computed: {

    parsedPanels: function () {
      let arr = [ ]
      let panels = this.element['panels']
      if (panels) {
        panels.split('|').forEach(def => {
          let panel = this.parsePanelDefinition(def)
          arr.push(panel)
        })
      }
      return arr
    },//- parsedPanels

    liveMode_currentPanel: function () {
      return -1
    },

    currentEditPanel: {
      get () {
        let value = this.element['currentEditPanel']
        return value ? value : 0
      },
      set (index) {
        console.log(`currentEditPanel.set(${index})`);
        this.$content.setProperty({ vm: this, element: this.element, name: 'currentEditPanel', value: index, save: false })
      }
    },

    // Return a list of { label, value, child }
    zarps: {
      get () {
        let arr = [ ]

        // Convert the labels first
        let value = this.element['panels']
        //value = 'A| Bee | Ceee'
        // console.log(`Getting labels ${value}`);
        if (!value) {
          return [ ]
        }
        value.split('|').forEach(tab => {
          // Split into value=label
          // console.log(` - ${l}`);
          let i = tab.indexOf(',')
          if (i >= 0) {
            let value = tab.substring(0, i)
            let label = tab.substring(i + 1)
            arr.push({ value, label, child: null })
          } else {
            // Should not happen
            arr.push({ value: tab, label: tab, child: null })
          }
        })

        // Now patch in children
        if (this.element.children) {
          this.element.children.forEach((child, index) => {
            if (index >= arr.length) {
              arr.push({ value: '', label: 'LABEL', child})
            } else {
              arr[index].child = child
            }
          })
        }

        // If we are editing, set the current tab
        if (this.isDesignMode || this.isEditMode) {
          let currentEditPanel = this.element['currentEditPanel']
          if (typeof(currentEditPanel) === 'number' && currentEditPanel >= 0 && currentEditPanel < arr.length) {
            console.log(`current edit tab is is ${currentEditPanel}`);
            arr[currentEditPanel].currentEditPanel = true
          }
        }
        return arr
      },//- get()

      // Panels = [ { value, label, child }, ...]
      set(panels) {
        let def = ''
        let sep = ''
        panels.forEach(panel => {
          console.log(`+ `, panel);
          def += sep + this.sanitize(panel.value)
          if (panel.label && panel.label != panel.value) {
            def += ',' + this.sanitize(panel.label)
          }
          sep = '|'
        })
        // console.log(`NEW DEF IS ${def}.`);
        this.$content.setProperty({ vm: this, element: this.element, name: 'panels', value: def })
      }
    },//- zarps

    /*
     *  Actual data edited by this input field
     */
    actualData: {
      get () {
        console.error(`actualData.get()`);
        // let recordPath = this.context.formservice.dataPath
        let attribute = this.element['attribute']

        if (attribute) {
          // let path = `${recordPath}.${attribute}`
          let path = this.mAbsolutePath(attribute)
          console.log(`attribute=${attribute}`)
          console.log(`path=${path}`)

          let { error, data } = this.$formservice.find({ vm: this, path, updatePath: true, value: '', debug: true })
          console.log(`error->`, error)
          console.log(`data->`, data)

          if (error) {
            console.error(`FieldInput: ${error}`);
            return ''
          } else if (data) {
            console.log(`value for field ${path} is ${data}`);
            return data
          } else {
            return ''
          }
        } else {
          console.log(`Warning: ButtonPanel is missing 'attribute' property`, this.element);
          //ZZZZZ Do something about this...
          return ''
        }
      },
      set (value) {
        // console.error(`actualData.set(${value})`);
        if (this.isLive) {
          let attribute = this.element['attribute']
          if (attribute) {
            // console.log(`ButtonPanel: datavalue.set(${attribute}, ${value}`);
            let path = this.mAbsolutePath(attribute)
            this.$formservice.save({vm: this, path, updatePath:true, value, debug:true})
          }
        }
      }
    },//- actualData

  },//- computed


  methods: {

    parsePanelDefinition : function(definition) {
      let arr = definition.split(',')
      let value = arr[0]
      let label = (arr.length >= 2) ? arr[1] : ''
      return { label, value}
    },

    setLabel: function(index, label) {
      console.log(`setLabel(${index}, ${label})`);
      let panels = this.parsedPanels
      // console.log(`parsedPanels is`, panels);
      // console.log(`(${columns.length} columns)`);
      while (panels.length <= index) {
        // console.log(`Add a label to the end`);
        panels.push({
          label: `${panels.length + 1}`,
          value: ''
        })
      }

      // Set the label
      panels[index].label = label
      this.savePanels(panels)
    },

    // Delete a panel:
    // - Remove the label
    // - Remove the child
    deleteCurrentEditTab: function () {
      console.log(`deleteCurrentEditTab()`)

      let currentEditPanel = this.element['currentEditPanel']
      let panels = this.zarps
      console.log(`currentEditPanel=${currentEditPanel}`);

      if (currentEditPanel >= 0 && currentEditPanel < panels.length) {
        console.log(`YEP, DELETE IT`);

        // Delete the label
        panels.splice(currentEditPanel, 1)
        this.savePanels(panels)

        // Delete the content of the panel
        console.log(`${this.element.children.length} children`)
        if (currentEditPanel < this.element.children.length) {
          let panelToDelete = this.element.children[currentEditPanel]
          console.log(`will delete panel`, panelToDelete);
          this.$content.deleteElement({ vm: this, element: panelToDelete })
        }
      }
    },

    savePanels: function (panels) {
      let def = ''
      let sep = ''
      panels.forEach(panel => {
        console.log(`+ `, panel);
        def += sep + this.sanitize(panel.label)
        def += `,${this.sanitize(panel.value)}`
        sep = '|'
      })
      console.log(`NEW DEF IS ${def}.`);
      this.$content.setProperty({ vm: this, element: this.element, name: 'panels', value: def })
    },//- saveColumns

    // Remove any pipes and commas from the label
    sanitize: function (str) {
      // Remove any '='
      for ( ; ; ) {
        let i = str.indexOf(',')
        if (i >= 0) {
          str = str.substring(0, i) + str.substring(i + 1)
        } else {
          break;
        }
      }
      // Remove any '|'
      for ( ; ; ) {
        let i = str.indexOf('|')
        if (i >= 0) {
          str = str.substring(0, i) + str.substring(i + 1)
        } else {
          break;
        }
      }
      return str
    },

    isEditPanel: function (index) {
      return (index === this.currentEditPanel)
    },

  }//- methods

}
