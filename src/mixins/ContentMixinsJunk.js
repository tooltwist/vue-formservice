import FileSaver from 'file-saver'

export default {
  computed: {

    extraDebug: function () {
      if (this.$content) {
        return this.$content.store.state.extraDebug
      }
      console.error('this.$content not defined');
      return true
    },

    isEditing: function () {
      switch (this.$content.store.state.mode) {
        case 'view':
        case 'live':
          return false
      }
      return true
    },

    pageEditMode: function () {
      if (this.$content && this.$content.store.state.mode) {
        return this.$content.store.state.mode
      }
      return 'view'
    },

    isEditMode: function () {
      if (this.$content) {
        return (this.$content.store.state.mode == 'edit')
      }
      return false
    },

    isDesignMode: function () {
      if (this.$content) {
        return (this.$content.store.state.mode == 'debug')
      }
      return false
    },

    isLive: function () {
      return !(this.isEditMode || this.isDesignMode)
    },

    debugClass () {
      return (this.pageEditMode === 'debug') ? 'tt-debug' : ''
    },

    showDropAreas () {
      //console.log(`++++ showDropAreas: `, this.pageEditMode)
      if (this.pageEditMode === 'layout' || this.pageEditMode === 'debug') {
        return true
      }
      if (this.pageEditMode === 'edit' && this.$content.store.state.dragging) {
        return true
      }
      return false
    }
  },

  methods: {

    // Compare the page mode to a comma separated list
    isPageMode (modes) {
      return modes.split(',').includes(this.pageEditMode)
    },

    selectThisElement () {
      console.log(`selectThisElement()`)
      if (this.pageEditMode != 'view') {
        let element = this.element
        this.$content.setPropertyElement({ element })
      }
    },

    copyStyle (from, to, name) {
      if (from[name]) {
        to[name] = from[name]
      }
    },

    safeJSON: function (element) {

      // Custom replacer function - gets around "TypeError: Converting circular structure to JSON"
      // Modified from http://www.johnantony.com/pretty-printing-javascript-objects-as-json/
      var replacer = function(key, value) {
        // ignore parent links (they are circular)
        if (key === '_parent') {
          return
        }
        return value
      }
      let json = JSON.stringify(element, replacer, 4);

      return json;
    },
  }
}
