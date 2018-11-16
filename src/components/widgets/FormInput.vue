<template lang="pug">

  .c-form-input(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-input&gt;
      br

    // Design mode
    .my-design-mode(v-if="isDesignMode", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | input
      input.input(readonly, :style="inputStyle", :class="inputClass", :placeholder="`${element.field} - ${placeholder}`")

    // Editing
    .my-edit-mode(v-else-if="isEditMode", @click.stop="selectThisElement")
      input.input(readonly, :style="inputStyle", :class="inputClass", :placeholder="`${element.field} - ${placeholder}`")

    // Live mode
    template(v-else)
      input.input.my-live-mode(:style="inputStyle", :class="inputClass", :placeholder="placeholder")
</template>

<script>
import ContentMixins from '../../mixins/ContentMixins'
import CutAndPasteMixins from '../../mixins/CutAndPasteMixins'

export default {
  name: 'content-formservice',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  mixins: [ ContentMixins, CutAndPasteMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    inputStyle: function ( ) {
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

    inputClass: function () {
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`inputClass()`, this.element);
      }

      var obj = { }
      let classesForElement = this.element['class']
      if (classesForElement) {
        console.log(`classesForElement=${classesForElement}`);
        classesForElement.split(' ').forEach(clas => {
          console.log(`-- ${clas}`);
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

    // inputStyle: function (field) {
    //   console.log(`inputStyle()`, field);
    //   // return { }
    //   return {
    //     //'background-color': 'red',
    //     //color: 'white',
    //     left: `${field.x}px`,
    //     top: `${field.y}px`,
    //   }
    // },

    fieldname: {
      get () {
        let value = this.element['fieldname']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'fieldname', value })
      }
    },

    placeholder: {
      get () {
        let value = this.element['placeholder']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'placeholder', value })
      }
    }
  },
  methods: {
    componentNameForElement (element) {
      let type = element.type
      let def = this.$content.getLayoutType(type)
      return def ? def.componentName : null
    },

    mouseDown: function (p1, p2, p3) {
      // let element = this.element
      console.log(`mouseDown(). p1=`, p1);
      console.log(`mouseDown(). p2=`, p2);
      console.log(`mouseDown(). p3=`, p3);
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

      if (data.type == 'element-position') {

        console.log(`Dropped element-position`)
        console.log(`data=`, data);
        // x: event.layerX,
        // y: event.layerY,
        console.log(`x=${event.layerX}, y=${event.layerY}`)

        this.$content.setPropertyInElement({ vm: this, element: data, name: 'x', value: event.layerX })
        this.$content.setPropertyInElement({ vm: this, element: data, name: 'y', value: event.layerY })

      } else if (data.dragtype == 'component') {

        // Get the element to be inserted, from the drop data.
        let wrapper = {
          type: 'contentservice.io',
          version: "1.0",
          layout: {
            type: 'element-position',
            x: event.layerX,
            y: event.layerY,
            layout: data.data.layout
          }
        }
        let position = this.element.children.length
        this.$content.insertLayout({ vm: this, parent: this.element, position, layout: wrapper })
        this.counter++ //ZZZZZ?
      } else {
        console.log(`Dropped non-component: '${data.dragtype}'`)
        return
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

  },
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


<style lang="scss">
  $bg-default: #ffffe0;
  $border-color-default: #ccc;

  $bg-borderless: #ffff00;
  $border-color-borderless: #ccc;

  .c-form-input {
    .my-design-mode {
      input.form-input-default {
        border-color: $border-color-default;
        zbackground-color: $bg-default;
        background-color: red;
        font-family: Arial;
        font-weight: bold;
        font-size: 9px;
      }
      input.form-input-borderless {
        border-color: $border-color-borderless;
        zborder: none;
        box-shadow: none;
        zbackground-color: $bg-borderless;
        font-size: 9px;
      }
    }

    .my-edit-mode {
      input.form-input-default {
        border-color: $border-color-default;
        background-color: $bg-default;
        font-family: Arial;
        font-weight: bold;
        font-size: 9px;
      }
      input.form-input-borderless {
        //border-color: $border-color-borderless;
        border: dashed 1px $border-color-borderless;
        box-shadow: none;
        background-color: $bg-borderless;
        font-size: 9px;
      }
    }

    // Live modes
    input.my-live-mode.form-input-default {
      border-color: $border-color-default;

      font-family: Arial;
      font-weight: bold;
      font-size: 11px;
      color: blue;
      background-color: #ffffff;
    }
    input.my-live-mode.form-input-borderless {
      border-color: #eee;
      //border: none;
      box-shadow: none;
      font-family: Arial;
      font-weight: bold;
      font-size: 11px;
      color: blue;
      background-color: #ffffff;
    }

  }
</style>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: pink;
  $text-color: #700;

  .c-edit-mode-debug {
    border-left: dashed 2px $frame-color;
    border-bottom: dashed 2px $frame-color;
    border-right: dashed 2px $frame-color;
    margin: 1px;

    .container {
      width: 90% !important;
    }
  }

  .c-layout-mode-heading {
    // This overrides the definition in content-editor.scss
    background-color: $frame-color;
    color: $text-color;
  }

  // .my-edit-mode {
  //   input {
  //     font-size: 10px;
  //   }
  // }
  //
  // .my-design-mode {
  //   input {
  //     font-size: 10px;
  //   }
  // }
  //
  // .my-live-mode {
  //   input {
  //     font-size: 10px;
  //   }
  // }

</style>
