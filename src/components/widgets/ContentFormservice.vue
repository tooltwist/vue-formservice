context<template lang="pug">

  .c-content-form(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;content-formservice&gt;
      br

    // Design mode
    div(v-if="isDesignMode", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | form {{name}}
        span(v-if="dataset ") &nbsp;&nbsp;{ dataset: {{dataset}} }

      drop.formservice-box.droparea.my-design-mode(:style="boxStyle", @drop="handleDrop(form, ...arguments)")
        div(v-if="element.children", v-for="(child, index) in element.children")
          drag.my-drag(:transfer-data="child", @dragstart="dragStart")
            .fixed-position(:class="positionClass(child)", :style="positionStyle(child)", @mousedown="mouseDown")
              component.my-component(v-if="componentNameForElement(child)", v-bind:is="componentNameForElement(child)", :element="child", :context="newContext")

    // Editing
    div(v-else-if="isEditMode", @click.stop="selectThisElement")
      drop.formservice-box.droparea.my-edit-mode(:style="boxStyle", @drop="handleDrop(form, ...arguments)")
        div(v-if="element.children", v-for="(child, index) in element.children")
          drag.my-drag(:transfer-data="child", @dragstart="dragStart")
            .fixed-position(:class="positionClass(child)", :style="positionStyle(child)", @mousedown="mouseDown")
              component.my-component(v-if="componentNameForElement(child)", v-bind:is="componentNameForElement(child)", :element="child", :context="newContext")

    // Live mode
    template(v-else)
      .formservice-box.my-live-mode(:style="boxStyle")
        template(v-if="element.children", v-for="(child, index) in element.children")
            .fixed-position(:class="positionClass(child)", :style="positionStyle(child)")
              component.my-component(v-if="componentNameForElement(child)", v-bind:is="componentNameForElement(child)", :element="child", :context="newContext")
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'content-formservice',
  props: {

    // This element describes the layouts
    // (not the record being edited)
    element: {
      type: Object,
      required: true
    },

    // The context provides a means for a container to pass information down to
    // the elements it's contains, to provide elements context within the
    // hierarchy of elements. Why?
    // During editing there can only be one currently-being-edited layout,
    // and the store provides context about the single element being editing.
    // During normal rendering there may be multiple layouts on a page, but
    // the store only saves a single state, so the store cannot be used.
    // In cases where a container and it's children need to know a bit about
    // each other, this context can contain that non-editing-related context.
    context: {
      type: Object,
      required: false
    }
  },
  mixins: [ ContentMixins, CutAndPasteMixins ],
  data: function () {
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
  },// - data

  computed: {

    //  Our form will need it's own context object cloned
    //  from the context we received, but with extra information.
    newContext: {
      get () {
        // console.error(`******* newContext(): old=`, this.context);

        if (this.context && this.context.formservice) {
          // console.log(`- need to clone existing context`)

          // This is a form inside a form
          // Dataset is inherited if not overridden
          let parentFormservice = this.context.formservice

          let newContext = this.cloneContextZZZ(this.context)
          let name = this.element['name'] ? this.element['name'] : ''
          let dataset = this.element['dataset']
          let dataPath
          if (dataset) {
            // Override the inherited dataPath - use our own dataset
            dataPath = '!' + dataset

          } else {

            // Use inherited dataPath
            dataPath = this.context.formservice.dataPath

          }
          newContext.formservice = {
            name,
            // dataset,
            dataPath,
            parentFormservice
          }
          return newContext
        } else {

          // Not a form inside a form
          // console.log(`- need an initial context`)

          // Create the context for the fields within this form.
          let newContext = { }
          let name = this.element['name']
          let dataset = this.element['dataset']
          let dataPath = (dataset) ? `!${dataset}` : '!mock'
          newContext.formservice = {
            name,
            // dataset,
            dataPath,
            parentFormservice: null
          }
          // console.log(`newContext(): new=`, newContext);
          return newContext
        }
      } // - newContext.get
    }, //- newContext

    name: {
      get () {
        let value = this.element['name']
        return value ? value : ''
      }
    },

    dataset: {
      get () {
        let value = this.element['dataset']
        return value ? value : ''
      }
    },

    boxStyle: function ( ) {
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
      // console.log(`boxStyle=`, style)
      return style
    },
  },//- computed

  methods: {

    cloneContextZZZ (context) {
      return { }
    },

    componentNameForElement (element) {
      let type = element.type
      let def = this.$content.getLayoutType(type)
      return def ? def.componentName : null
    },

    // labelClass: function (field) {
    //   // console.log(`labelClass()`, field);
    //
    //   if (field.classname) {
    //     return field.classname
    //   }
    //   return null
    // },
    //
    // labelStyle: function (field) {
    //   // console.log(`labelStyle()`, field);
    //   // return { }
    //   return {
    //     // 'background-color': 'red',
    //     // color: 'white',
    //     left: `${field.x}px`,
    //     top: `${field.y}px`,
    //   }
    // },

    // inputClass: function (field) {
    //   // console.log(`inputClass()`, field);
    //
    //   if (field.classname) {
    //     return field.classname
    //   }
    //   return null
    // },
    //
    // inputStyle: function (field) {
    //   // console.log(`inputStyle()`, field);
    //   // return { }
    //   return {
    //     //'background-color': 'red',
    //     //color: 'white',
    //     left: `${field.x}px`,
    //     top: `${field.y}px`,
    //   }
    // },

    // otherClass: function (field) {
    //   // console.log(`otherClass()`, field);
    //
    //   if (field.classname) {
    //     return field.classname
    //   }
    //   return null
    // },
    //
    // otherStyle: function (field) {
    //   // console.log(`otherStyle()`, field);
    //   // return { }
    //   return {
    //     'background-color': 'red',
    //     color: 'white',
    //     left: `${field.x}px`,
    //     top: `${field.y}px`,
    //   }
    // },

    positionClass: function (element) {
      // console.log(`positionClass()`, element);

      if (element.classname) {
        return element.classname
      }
      return null
    },

    positionStyle: function (element) {
      // console.log(`positionStyle()`, element);
      // return { }

      let x = element._fixed_x ? element._fixed_x : 10
      let y = element._fixed_y ? element._fixed_y : 10

      let style = {
        position: 'absolute',
        //'background-color': 'red',
        //color: 'white',
        left: `${x}px`,
        top: `${y}px`,
      }
      // console.log(`style=`, style)
      return style
    },

    mouseDown: function (p1, p2, p3) {
      // let element = this.element
      console.log(`mouseDown(). p1=`, p1);
      console.log(`mouseDown(). p2=`, p2);
      console.log(`mouseDown(). p3=`, p3);

      this.mouseDownX = event.offsetX
      this.mouseDownY = event.offsetY
      // this.mouseDownX = event.layerX
      // this.mouseDownY = event.layerY
    },

    dragStart: function (p1, p2, p3) {
      // let element = this.element
      console.log(`dragStart(). p1=`, p1);
      console.log(`dragStart(). p2=`, p2);
      console.log(`dragStart(). p3=`, p3);
    },

    // The drop event normally provides (data, event) but we've added (form, ...) in front.
    handleDrop (form, data, event) {
      console.log(`ContentFormservice.handleDrop(). form=`, form)
      console.log(`ContentFormservice.handleDrop(), data=`, data)
      console.log(`ContentFormservice.handleDrop(), event=`, event)

      // Work out the drop position
      let x = event.layerX - this.mouseDownX
      let y = event.layerY - this.mouseDownY
      console.log(`layer: x=${event.layerX}, y=${event.layerY}`)
      console.log(`mouseDown: x=${this.mouseDownX}, y=${this.mouseDownY}`)

      if (this.alignToGrid && this.gridSize > 1) {
        console.log('truncating position');
        x = Math.round(x / this.gridSize) * this.gridSize
        y = Math.round(y / this.gridSize) * this.gridSize
      }
      console.log(`new position: x=${x}, y=${y}`)


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

        this.$content.setProperty({ vm: this, element: null, name: '_fixed', value: true })
        this.$content.setProperty({ vm: this, element: null, name: '_fixed_x', value: x })
        this.$content.setProperty({ vm: this, element: null, name: '_fixed_y', value: y })

      } else {
        // console.log(`Dropped non-component: '${data.type}'`)
        console.log(`Dropped element (not from toolbox)`)
        console.log(`data=`, data);
        // x: event.layerX,
        // y: event.layerY,
        // this.$content.setPropertyInElement({ vm: this, element: data, name: 'x', value: x })
        // this.$content.setPropertyInElement({ vm: this, element: data, name: 'y', value: y })
        this.$content.setProperty({ vm: this, element: data, name: '_fixed', value: true })
        this.$content.setProperty({ vm: this, element: data, name: '_fixed_x', value: x })
        this.$content.setProperty({ vm: this, element: data, name: '_fixed_y', value: y })
        // return
      }



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

    deletePositionedField: function(element) {
      console.log(`deletePositionedField()`);
      this.$content.deleteElement({ vm: this, element: element })
    }

  },//- methods

  created: function () {

    // Sanity check
    if (!this.$content) {
      console.error(`ContentFromservice.created(): this.$content not defined: has ContentService been initialised?`);
      this.sane = false
      return
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  // $frame-color: lightblue;
  // $text-color: darkblue;

  $frame-color: lightgreen;
  $text-color: darkgreen;

  .c-content-form {
    // & > .c-edit-mode-debug {
    //   border-left: dashed 2px $frame-color;
    //   border-bottom: dashed 2px $frame-color;
    //   border-right: dashed 2px $frame-color;
    //   margin: 1px;
    //
    //   .container {
    //     width: 90% !important;
    //   }
    // }

    .c-layout-mode-heading {
      // This overrides the definition in content-editor.scss
      background-color: $frame-color;
      color: $text-color;
    }

    .formservice-box {
      position: relative;
      overflow-x: visible;
      overflow-y: visible;

      zborder: solid 1px #ccc;
      // text-align: center;
      margin: 0 auto;
      padding: 0px;

      width: 1500px;
      height: 1000px;
      zbackground-color: yellow;
    }

    .c-label {
      position: absolute;
      //background-color: pink;
    }

    .c-field {
      position: absolute;
      background-color: pink;

      input {
        font-size: 11px;
      }
    }

    .c-other {
      position: absolute;
      background-color: red;
      color: pink;
    }

    .happy {
      //font-size: 25px;
    }

    .my-drag {
      overflow-x: visible;
      overflow-y: visible;
      color: black;
    }

    .fixed-position {
      position: absolute;
      overflow-x: visible;
      overflow-y: visible;
      zwidth: 200px;
      zheight: 200px;
      zbackground-color: blue;
      zborder: solid 1px black;
      zcolor: black;
    }

    .my-edit-mode {
      //min-width: 400px;
      background-color: #f9f9f9;

      .my-component {
        //min-width: 300px;
      }
    }

    .my-design-mode {
      //min-width: 400px;

      .my-component {
        min-width: 120px;
        background-color: white;
      }
    }
  }
</style>
