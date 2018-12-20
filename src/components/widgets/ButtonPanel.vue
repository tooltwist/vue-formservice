//
//  Row of buttons to select between values, with optional
//  panels displayed depending upon which option is selected.

<template lang="pug">

  .c-content-formlabel(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    .my-design-mode(v-if="isDesignMode", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | button panel
      .field.has-addons
        .control(v-for="(panel, index) in zarps")
          .button(:class="editmode_labelClass(index)", @click="currentEditPanel = index")
            | {{panel.label}}
        .control
          .button(@click.stop="addTab")
            //.icon.is-small
            //  i.fas.fa-align-left
            | +
      panel-without-properties(v-if="editMode_childForCurrentTab != null", :element="editMode_childForCurrentTab", :context="context")

    // Editing
    .my-edit-mode(v-else-if="isEditMode", @click.stop="selectThisElement")
      .field.has-addons
        .control(v-for="(panel, index) in zarps")
          .button(:class="editmode_labelClass(index)", @click="currentEditPanel = index")
            | {{panel.label}}
        .control
          .button(@click.stop="addTab")
            //.icon.is-small
            //  i.fas.fa-align-left
            | +
      panel-without-properties(v-if="editMode_childForCurrentTab != null", :element="editMode_childForCurrentTab", :context="context")

    // Live mode
    template(v-else)
      .field.has-addons
        .control(v-for="(panel, index) in zarps")
          .button(:class="livemode_labelClass(panel.value)", @click.stop="actualData = panel.value")
            //.icon.is-small
            //  i.fas.fa-align-left
            | {{panel.label}}
      panel-without-properties(v-if="liveMode_indexOfCurrentTab >= 0", :element="liveMode_childForCurrentTab", :context="context")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'
import ButtonPanelMixins from './ButtonPanelMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-label',
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
  mixins: [ ContentMixins, CutAndPasteMixins, ButtonPanelMixins, FormserviceMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    panels: {
      get () {
        let value = this.element['panels']
        //value = 'A| Bee | Ceee'
        // console.log(`Getting labels ${value}`);
        if (!value) {
          return [ ]
        }
        let arr = [ ]
        value.split('|').forEach(l => {
          // console.log(` - ${l}`);
          let i = l.indexOf('=')
          if (i >= 0) {
            l = l.substring(i + 1)
          }
          l = l.trim()
          arr.push(l ? l : '?')
        })
        return arr
      }
    },

    // childForCurrentEditTab: function () {
    //   console.log(`childForCurrentEditTab()`);
    //   // let currentTabIndex = 0
    //   let currentTabIndex = parseInt(this.element['currentEditPanel'])
    //   if (currentTabIndex >= 0 && currentTabIndex < this.element.children.length) {
    //     console.log(`- have child ${currentTabIndex}`);
    //     return this.element.children[currentTabIndex]
    //   }
    //   return null
    // },

    liveMode_indexOfCurrentTab: function () {
      // Get the panels
      let panels = this.zarps
      let defaultValue = (panels.length > 0) ? panels[0].value : ''

      // Get the attribute value
      let attribute = this.element['attribute']
      if (attribute) {
        let path = this.mAbsolutePath(attribute)
        let { error, data } = this.$formservice.findOrCreate({ vm: this, path, updatePath: true, value: defaultValue, debug: false })
        if (data && !error) {

          // Find the panel with this value
          for (var index = 0; index < panels.length; index++) {
            let panel = panels[index]
            if (panel.value === data) {
              return index
            }
          }
        }
      }
      return -1
    },//- liveMode_indexOfCurrentTab

    liveMode_childForCurrentTab: function () {
      // console.log(`liveMode_childForCurrentTab()`);
      let tabIndex = this.liveMode_indexOfCurrentTab
      if (tabIndex >= 0 && tabIndex < this.element.children.length) {
        // console.log(`- have child ${tabIndex}`);
        return this.element.children[tabIndex]
      }
      return null
    },

    editMode_childForCurrentTab: function () {
      // console.log(`editMode_childForCurrentTab()`);
      let currentEditPanel = this.element['currentEditPanel']
      if (currentEditPanel >= 0 && currentEditPanel < this.element.children.length) {
        // console.log(`- have child ${currentEditPanel}`);
        return this.element.children[currentEditPanel]
      }
      return null
    },
  },

  methods: {
    labelForPanel(index) {
      let panels = this.zarps
      if (index < panels.length) {
        return panels[index].label
      }
      return 'label'
    },

    editmode_labelClass: function (index) {
      let currentEditPanel = this.currentEditPanel
      if (currentEditPanel === index) {
        return { 'is-primary' : true }
      }
      return { }
    },

    livemode_labelClass: function (valueForPanel) {
      let attribute = this.element['attribute']
      if (attribute) {
        let path = this.mAbsolutePath(attribute)
        let { error, data } = this.$formservice.find({ vm: this, path, debug: false })
        if (data === valueForPanel) {
          return { 'is-primary' : true }
        }
      }
      return { }
    },

    labelStyle: function (field) {
      console.log(`labelStyle()`, field);
      return {
        // 'background-color': 'red',
        // color: 'white',
        left: `${field.x}px`,
        top: `${field.y}px`,
      }
    },

    addTab: function ( ) {
      // console.log(`addTab()`);
      // console.log(`${this.element.children.length} children`)
      let insertContent = {
        type: "contentservice.io",
        version: "1.0",
        source: "toolbox",
        layout: {
          type: 'panelWithoutProperties',
          children: [ ]
        }
      }
      this.$content.insertLayout({ vm: this, parent: this.element, position: -1, layout: insertContent })
    }
  }//- methods
}
</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: lightblue;
  $text-color: darkblue;

  .c-content-formlabel {

    .c-layout-mode-heading {
      // This overrides the definition in content-editor.scss
      background-color: $frame-color;
      color: $text-color;
    }

    .c-edit-mode-debug {
      border-left: dashed 2px $frame-color;
      border-bottom: dashed 2px $frame-color;
      border-right: dashed 2px $frame-color;
      margin: 1px;

      .container {
        width: 90% !important;
      }
    }

    //.c-label {
    //  position: absolute;
    //  //background-color: pink;
    //}

    // .form-label-default {
    //   //color: #000000;
    //   color: #333;
    //   font-family: Arial;
    //   font-weight: normal;
    //   font-size: 9px;
    // }
    //
    // .form-label-bold-default {
    //   //color: #000000;
    //   color: #333;
    //   font-family: Arial;
    //   font-weight: bold;
    //   font-size: 9px;
    // }

  //form-checkbox-bold-default

    .my-edit-mode {
      .my-label {
      }
    }

    .my-design-mode {
      .my-label {
      }
    }

    .my-live-mode {
      .my-label {
      }
    }
  }

  // // Transitions for properties editing.
  // .c-button-panel-transition-enter-active {
  //   // Slow arrival
  //   transition: opacity .7s;
  // }
  // .c-button-panel-transition-leave-active {
  //   // Fast exit
  //   transition: opacity 0s;
  // }
  // .c-button-panel-transition-enter, .c-button-panel-transition-leave-to /* .property-list-transition-leave-active below version 2.1.8 */ {
  //   opacity: 0;
  // }
</style>
