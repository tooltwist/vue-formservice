<template lang="pug">

  // Mixin editModeClass() adds .c-edit-mode-view, .c-edit-mode-edit or .c-edit-mode-design
  .c-form-border(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;content-formservice&gt;
      br

    // Design mode
    div(v-if="isDesignMode", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | border

      .my-border(:style="boxStyle")

    // Editing
    div(v-else-if="isEditMode", @click.stop="selectThisElement")
      //div(style="background-color:red;width:100px;height:100px;")
      .my-border(:style="boxStyle")

    // Live mode
    template(v-else)
      //div(style="background-color:red;width:100px;height:100px;")
      .my-border(:style="boxStyle")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import EditMixins from '../../mixins/EditMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

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

  mixins: [ ContentMixins, CutAndPasteMixins, EditMixins, FormserviceMixins ],

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

    // absoluteDataPath: function ( ) {
    //   let dataset = this.element['dataset']
    //   return this.mAbsolutePath(dataset)
    // },

    // //  Our form will need it's own context object cloned
    // //  from the context we received, but with extra information.
    // newContext: {
    //   get () {
    //     // console.error(`******* newContext(): old=`, this.context);
    //
    //     if (this.context && this.context.formservice) {
    //       // This is a form inside a form
    //       // Dataset is inherited if not overridden
    //       let parentFormservice = this.context.formservice
    //
    //       let newContext = this.cloneContextZZZ(this.context)
    //       let name = this.element['name'] ? this.element['name'] : ''
    //       let dataset = this.element['dataset']
    //       let dataPath = this.context.formservice.dataPath
    //       if (dataset) {
    //         if (dataset.startsWith('!')) {
    //           // Override the inherited dataPath - use our own dataset
    //           dataPath = dataset.trim()
    //         } else {
    //           // Add to inherited dataPath
    //           dataPath = `${this.context.formservice.dataPath}.${dataset}`
    //         }
    //       }
    //       newContext.formservice = {
    //         name,
    //         dataPath,
    //         parentFormservice
    //       }
    //       return newContext
    //
    //     } else {
    //
    //       // Not a form inside a form
    //       // console.log(`- need an initial context`)
    //
    //       // Create the context for the fields within this form.
    //       let newContext = { }
    //       let name = this.element['name']
    //       let dataset = this.element['dataset']
    //       let dataPath = (dataset) ? dataset : '!mock'
    //       newContext.formservice = {
    //         name,
    //         // dataset,
    //         dataPath,
    //         parentFormservice: null
    //       }
    //       console.error(`newContext(): new=`, newContext);
    //       return newContext
    //     }
    //   } // - newContext.get
    // }, //- newContext

    name: {
      get () {
        let value = this.element['name']
        return value ? value : ''
      }
    },

    // dataset: {
    //   get () {
    //     let value = this.element['dataset']
    //     return value ? value : ''
    //   }
    // },

    borderStyle: function ( ) {
      console.log(`FormBorder.borderStyle()`, this.element);
      return ''
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

    borderClass: function () {
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

      // See if this is readonly (i.e. in a pdf)
      if (this.readonly) {
        obj['c-readonly'] = true
      }

      // Check the warning level
      if (this.errorLevel) {
        obj[`error-level-${this.errorLevel}`] = true
      }

      return obj
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
      // style += 'background: rgba(255,0,0,0.1);'
      console.log(`boxStyle=`, style)
      return style
    },

  },//- computed

  methods: {

    // cloneContextZZZ (context) {
    //   return { }
    // },

    // componentNameForElement (element) {
    //   let type = element.type
    //   let def = this.$content.getLayoutType(type)
    //   return def ? def.componentName : null
    // },

    // positionClass: function (element) {
    //   // console.log(`positionClass()`, element);
    //
    //   if (element.classname) {
    //     return element.classname
    //   }
    //   return null
    // },
    //
    // positionStyle: function (element) {
    //   // console.log(`positionStyle()`, element);
    //   // return { }
    //
    //   let x = element._fixed_x ? element._fixed_x : 0
    //   let y = element._fixed_y ? element._fixed_y : 0
    //
    //   let style = {
    //     position: 'absolute',
    //     //'background-color': 'red',
    //     //color: 'white',
    //     left: `${x}px`,
    //     top: `${y}px`,
    //   }
    //   // console.log(`style=`, style)
    //   return style
    // },

    // mouseDown: function (p1, p2, p3) {
    //   // let element = this.element
    //   console.log(`mouseDown(). p1=`, p1);
    //   console.log(`mouseDown(). p2=`, p2);
    //   console.log(`mouseDown(). p3=`, p3);
    //
    //   this.mouseDownX = event.offsetX
    //   this.mouseDownY = event.offsetY
    //   // this.mouseDownX = event.layerX
    //   // this.mouseDownY = event.layerY
    // },

    // dragStart: function (p1, p2, p3) {
    //   // let element = this.element
    //   console.log(`dragStart(). p1=`, p1);
    //   console.log(`dragStart(). p2=`, p2);
    //   console.log(`dragStart(). p3=`, p3);
    // },

    // // The drop event normally provides (data, event) but we've added (form, ...) in front.
    // handleDrop (form, data, event) {
    //   console.log(`FixedPositionForm.handleDrop(). form=`, form)
    //   console.log(`FixedPositionForm.handleDrop(), data=`, data)
    //   console.log(`FixedPositionForm.handleDrop(), event=`, event)
    //
    //   // Work out the drop position
    //   let x = event.layerX - this.mouseDownX
    //   let y = event.layerY - this.mouseDownY
    //   console.log(`layer: x=${event.layerX}, y=${event.layerY}`)
    //   console.log(`mouseDown: x=${this.mouseDownX}, y=${this.mouseDownY}`)
    //
    //   if (this.alignToGrid && this.gridSize > 1) {
    //     console.log('truncating position');
    //     x = Math.round(x / this.gridSize) * this.gridSize
    //     y = Math.round(y / this.gridSize) * this.gridSize
    //   }
    //   console.log(`new position: x=${x}, y=${y}`)
    //
    //
    //   if (data.dragtype == 'component') {
    //
    //     // Get the element to be inserted, from the drop data.
    //     // let wrapper = {
    //     //   type: 'contentservice.io',
    //     //   version: "1.0",
    //     //   layout: {
    //     //     type: 'element-position',
    //     //     _fixed_x: event.layerX,
    //     //     _fixed_y: event.layerY,
    //     //     children: [ ]
    //     //   }
    //     // }
    //     console.log(`rooss 1`, data);
    //     let newElement = data.data
    //     // wrapper.layout.children.push(newElement)
    //     let position = this.element.children.length
    //     // console.error(`new wrapper is`, wrapper);
    //     console.error(`newElement is`, newElement);
    //     console.log(`rooss 2`);
    //     let rv = this.$content.insertLayout({ vm: this, parent: this.element, position, layout: newElement })
    //     console.log(`rooss 3`);
    //     console.log(`return from insertLayout is ${rv}`);
    //     this.counter++ //ZZZZZ?
    //     console.log(`rooss 4`);
    //
    //     this.$content.setProperty({ vm: this, element: null, name: '_fixed', value: true })
    //     this.$content.setProperty({ vm: this, element: null, name: '_fixed_x', value: x })
    //     this.$content.setProperty({ vm: this, element: null, name: '_fixed_y', value: y })
    //
    //   } else {
    //     // console.log(`Dropped non-component: '${data.type}'`)
    //     console.log(`Dropped element (not from toolbox)`)
    //     console.log(`data=`, data);
    //     // x: event.layerX,
    //     // y: event.layerY,
    //     // this.$content.setPropertyInElement({ vm: this, element: data, name: 'x', value: x })
    //     // this.$content.setPropertyInElement({ vm: this, element: data, name: 'y', value: y })
    //     this.$content.setProperty({ vm: this, element: data, name: '_fixed', value: true })
    //     this.$content.setProperty({ vm: this, element: data, name: '_fixed_x', value: x })
    //     this.$content.setProperty({ vm: this, element: data, name: '_fixed_y', value: y })
    //     // return
    //   }
    //
    //
    //
    //   // // Get the element to be inserted, from the drop data.
    //   // let insertContent = data.data
    //
    //   // // Note that 'child' is the existing child, not the child being inserted.
    //   // if (child) {
    //   //   // Insert before the specified child.
    //   //   for (var i = 0; i < element.children.length; i++) {
    //   //     if (element.children[i] === child) {
    //   //       console.log(`Insert at position ${i}`)
    //   //       this.$content.insertLayout({ vm: this, parent: element, position: i, layout: insertContent })
    //   //       break
    //   //     }
    //   //   }
    //   // } else {
    //   //   // No child specified - add at the end
    //   //   this.$content.insertLayout({ vm: this, parent: element, position: -1, layout: insertContent })
    //   // }
    // },

    // deletePositionedField: function(element) {
    //   console.log(`deletePositionedField()`);
    //   this.$content.deleteElement({ vm: this, element: element })
    // }

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
</style>
