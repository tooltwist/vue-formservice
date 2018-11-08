<template lang="pug">

  .c-content-formservice(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;content-formservice&gt;
      br

    // Debug mode
    div(v-if="isPageMode('debug')", @click.stop="selectThisElement")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | formservice
      //| DROPPABLE B {{counter}}, {{element.children}}
      br
      div(v-if="element.children", v-for="(child, index) in element.children")
        | {{index}}: {{child}}, {{child.type}}
        div(v-if="child.type=='element-position'")
          | IS POSITION
        button.button(@click="deletePositionedField(child)") Delete
        br
      drop.formservice-box.droparea(@drop="handleDrop(form, ...arguments)")
        div(v-if="element.children", v-for="(child, index) in element.children")
          drag(:transfer-data="child", @dragstart="dragStart")
            div.yarr(:class="positionClass(child)", :style="positionStyle(child)")
              | YAHOO

        div(v-for="field in fields")
          drag(:transfer-data="field")
            .c-label(v-if="field.type=='label'", :class="labelClass(field)", :style="labelStyle(field)")
              | {{field.value}}
            .c-field(v-else-if="field.type=='field'", :class="inputClass(field)", :style="inputStyle(field)")
              input.input(:value="field.value", :placeholder="field.property", :readonly="true")
              //| {{field.value}}
            .c-other(v-else :class="otherClass(field)", :style="otherStyle(field)")
              | {{field.type}}={{field.value}}
      br

    // Editing
    div(v-else-if="isPageMode('edit')", @click.stop="selectThisElement")
      .formservice-box
        div(v-for="field in fields")
          .c-label(v-if="field.type=='label'", :class="labelClass(field)", :style="labelStyle(field)")
            | {{field.value}}
          .c-field(v-else-if="field.type=='field'", :class="inputClass(field)", :style="inputStyle(field)")
            input.input(:value="field.value", :placeholder="field.property")
            //| {{field.value}}
          .c-other(v-else :class="otherClass(field)", :style="otherStyle(field)")
            | {{field.type}}={{field.value}}

    // layout
    div(v-else-if="isPageMode('layout')", @click.stop="selectThisElement")
      | DROPPABLE X
      br
      drop.formservice-box(@drop="handleDrop(form, ...arguments)")
        div(v-for="field in fields")
          .c-label(v-if="field.type=='label'", :class="labelClass(field)", :style="labelStyle(field)")
            | {{field.value}}
          .c-field(v-else-if="field.type=='field'", :class="inputClass(field)", :style="inputStyle(field)")
            input.input(:value="field.value", :placeholder="field.property")
            //| {{field.value}}
          .c-other(v-else :class="otherClass(field)", :style="otherStyle(field)")
            | {{field.type}}={{field.value}}

    // Live mode
    template(v-else)
      .formservice-box
        div(v-for="field in fields")
          .c-label(v-if="field.type=='label'", :class="labelClass(field)", :style="labelStyle(field)")
            | {{field.value}}
          .c-field(v-else-if="field.type=='field'", :class="inputClass(field)", :style="inputStyle(field)")
            input.input(:value="field.value", :placeholder="field.property")
            //| {{field.value}}
          .c-other(v-else :class="otherClass(field)", :style="otherStyle(field)")
            | {{field.type}}={{field.value}}
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
      counter: 1,
      form: {

      },
      size: {
        width: null,
        height: 500,
        style: 'chicken-style'
      },
      fields: [
        {
          type: 'label',
          x: 50,
          y: 50,
          value: 'First name',
          classname: 'happy'
        },
        {
          type: 'field',
          x: 160,
          y: 50,
          value: 'Wallace',
          classname: 'happy',
          property: 'firstname'
        },
        {
          type: 'label',
          x: 50,
          y: 80,
          value: 'Last name'
        },
        {
          type: 'field',
          x: 160,
          y: 80,
          value: 'Grommet',
          property: 'lastname'
        },
      ]
    }
  },
  computed: {

    myProperty: {
      get () {
        let value = this.element['myProperty']
        return value ? value : ''
      },
      set (value) {
        this.$content.setProperty({ vm: this, element: this.element, name: 'myProperty', value })
      }
    }

  },
  methods: {

    labelClass: function (field) {
      console.log(`fieldClass()`, field);

      if (field.classname) {
        return field.classname
      }
      return null
    },

    labelStyle: function (field) {
      console.log(`fieldStyle()`, field);
      // return { }
      return {
        // 'background-color': 'red',
        // color: 'white',
        left: `${field.x}px`,
        top: `${field.y}px`,
      }
    },

    inputClass: function (field) {
      console.log(`inputClass()`, field);

      if (field.classname) {
        return field.classname
      }
      return null
    },

    inputStyle: function (field) {
      console.log(`inputStyle()`, field);
      // return { }
      return {
        'background-color': 'red',
        color: 'white',
        left: `${field.x}px`,
        top: `${field.y}px`,
      }
    },

    otherClass: function (field) {
      console.log(`otherClass()`, field);

      if (field.classname) {
        return field.classname
      }
      return null
    },

    otherStyle: function (field) {
      console.log(`otherStyle()`, field);
      // return { }
      return {
        'background-color': 'red',
        color: 'white',
        left: `${field.x}px`,
        top: `${field.y}px`,
      }
    },

    positionClass: function (element) {
      console.log(`positionClass()`, element);

      if (element.classname) {
        return element.classname
      }
      return null
    },

    positionStyle: function (element) {
      console.log(`positionStyle()`, element);
      // return { }
      let style = {
        position: 'absolute',
        'background-color': 'red',
        color: 'white',
        left: `${element.x}px`,
        top: `${element.y}px`,
      }
      console.log(`style=`, style)
      return style
    },

    dragStart: function (element) {
      // let element = this.element
      console.log(`dragStart()`);
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

<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: lightblue;
  $text-color: darkblue;

  .c-layout-mode-heading {
    // This overrides the definition in content-editor.scss
    background-color: $frame-color;
    color: $text-color;
  }

  .formservice-box {
    position: relative;
    width: 300px;
    border: solid 1px #ccc;
    // text-align: center;
    margin: 0 auto;
    padding: 0px;

    width: 400px;
    height: 400px;
    background-color: yellow;
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
    color: white;
  }

  .happy {
    //font-size: 25px;
  }

  .yarr {
    width: 50px;
    height: 50px;
    background-color: blue;
    border: solid 1px black;
  }
</style>
