<template lang="pug">

  .c-content-formlabel(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    .my-design-mode(v-if="isDesignMode && false", @click.stop="selectThisElement2")
      //.c-layout-mode-heading
        edit-bar-icons(:element="element")
        | label
      .label(:style="myStyle", :class="myClass") {{label}}

    // Editing
    .my-edit-mode(v-else-if="isDesignMode || isEditMode", @click.stop="selectThisElement2")
      .label(:style="myStyle", :class="myClass") {{label}}

    // Live mode
    template(v-else)
      .my-live-mode.label(:style="myStyle", :class="myClass") {{label}}
</template>

<script>
import ContentMixins from 'vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from 'vue-contentservice/src/mixins/CutAndPasteMixins'

export default {
  name: 'form-label',
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

    label: {
      get () {
        let value = this.element['label']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
      // }
    },

    style: {
      get () {
        let value = this.element['style']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'style', value })
      // }
    },

    myClass: function () {
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
        obj['form-label-default'] = true
      }
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`element=`, this.element);
        console.log(`obj=`, obj)
      }
      return obj
    },

    myStyle: function ( ) {
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

  },
  methods: {
    selectThisElement2: function () {
      console.log(`selectThisElement2() IN LABEL`, this.element)
      return this.selectThisElement()
    },

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
    }

  }
}
</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  $frame-color: lightblue;
  $text-color: darkblue;

  // .c-edit-mode-debug {
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


  .c-label {
    position: absolute;
    //background-color: pink;
  }

  .form-label-default {
    //color: #000000;
    color: #333;
    font-family: Arial;
    font-weight: normal;
    font-size: 9px;
  }

  .form-label-bold-default {
    //color: #000000;
    color: #333;
    font-family: Arial;
    font-weight: bold;
    font-size: 9px;
  }

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

</style>
