
export default {
  computed: {

    parsedColumns: function () {
      let arr = [ ]
      let columns = this.element['columns']
      if (columns) {
        columns.split('|').forEach(def => {
          let column = this.parseColumnDefinition(def)
          arr.push(column)
        })
      }
      return arr
    },//- parsedColumns

    editColumnNo: {
      get () {
        let value = this.element['editColumnIndex']
        return value ? value : 0
      },
      set (index) {
        console.log(`editColumnNo.set(${index})`);
        this.$content.setProperty({ vm: this, element: this.element, name: 'editColumnIndex', value: index, save: false })
      }
    },

  },//- computed


  methods: {

    parseColumnDefinition: function (definition) {
      // console.log(`parseColumnDefinition(${definition})`)
      let arr = definition.split(',')
      let label = arr[0]
      let sequence = (arr.length >= 2) ? parseInt(arr[1]) : 0
      let enabled = (arr.length >= 3) ? (arr[2].startsWith('Y')) : true
      // console.log(`- label=${label}, sequence=${sequence}, enabled=${enabled}`)
      return { label, sequence, enabled }
    },//- parseColumnDefinition

    setLabel: function(index, label) {
      console.log(`setLabel(${index}, ${label})`);
      let columns = this.parsedColumns
      // console.log(`parsedColumns is`, columns);
      // console.log(`(${columns.length} columns)`);
      while (columns.length <= index) {
        // console.log(`Add a label to the end`);
        columns.push({
          label: 'label',
          sequence: columns.length,
          enabled: true
        })
      }

      // Set the label
      columns[index].label = label
      this.saveColumns(columns)
    },

    // Delete a column:
    // - Remove the label
    // - Remove the panel
    deleteColumn: function (index) {

      console.log(`deleteColumn(${index})`)

      // Delete the label
      let columns = this.parsedColumns
      if (index < columns.length) {
        columns.splice(index, 1)
        this.saveColumns(columns)
      }


      // Delete the content of the column
      console.log(`${this.element.children.length} children`)
      if (index < this.element.children.length) {
        let panelToDelete = this.element.children[index]
        console.log(`will delete panel`, panelToDelete);
        this.$content.deleteElement({ vm: this, element: panelToDelete })
      }
    },

    saveColumns: function (columns) {
      let def = ''
      let sep = ''
      columns.forEach(col => {
        console.log(`+ `, col);
        def += sep + this.sanitizeLabel(col.label)
        def += `,${col.sequence}`
        def += `,${col.enabled ? 'Y' : 'N'}`
        sep = '|'
      })
      console.log(`NEW DEF IS ${def}.`);
      this.$content.setProperty({ vm: this, element: this.element, name: 'columns', value: def })
    },//- saveColumns

    // Remove any pipes and commas from the label
    sanitizeLabel: function (str) {
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

    isEditColumn: function (index) {
      return (index === this.editColumnNo)
    }
  }//- methods

}
