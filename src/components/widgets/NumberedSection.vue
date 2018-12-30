<template lang="pug">

  .c-numbered-section(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
      br

    // Debug mode
    .my-design-mode(v-if="isDesignMode", @click.stop="selectThisElement2")
      .c-layout-mode-heading
        edit-bar-icons(:element="element")
        | numbered section
      br
      .label2(:data-number="sectionNo")
        .my-label {{label}}
      //.label(:style="myStyle", :class="myClass") {{label}}
      .my-indented
        content-children.my-content(:element="element", :context="context")

    // Editing
    .my-edit-mode(v-else-if="isEditMode", @click.stop="selectThisElement2")
      .label2(:data-number="sectionNo")
        .my-label {{label}}
      .my-indented
        content-children.my-content(:element="element", :context="context")


    // Live mode
    template(v-else)
      .label2(:data-number="sectionNo")
        .my-label {{label}}
      .my-indented
        content-children.my-content(:element="element", :context="context")
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
    },
    context: {
      type: Object,
      required: true
    },
  },
  mixins: [ ContentMixins, CutAndPasteMixins ],
  data: function () {
    return {
    }
  },
  computed: {

    sectionNo: {
      get () {
        let value = this.element['sectionNo']
        return value ? value : ''
      },
      // set (value) {
      //   this.$content.setProperty({ vm: this, element: this.element, name: 'label', value })
      // }
    },

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

  $design-frame-color: #7697c2;
  $design-text-color: white;
  $design-background-color: #e0ebfa;

  // .c-edit-mode-debug {
  //   border-left: dashed 2px $design-frame-color;
  //   border-bottom: dashed 2px $design-frame-color;
  //   border-right: dashed 2px $design-frame-color;
  //   margin: 1px;
  //
  //   .container {
  //     width: 90% !important;
  //   }
  // }

  .c-numbered-section {

    .label2 {
      margin-top: 1.5rem;
      font-weight: 600;
      color: #363636;
      display: block;
      font-size: 1.8rem;
      box-sizing: inherit;
      text-align: left;
      margin-bottom: 0.2rem;

      .my-label {
        display: inline-block;
        position: relative;
        top: 4px;
      }
    }
    .label2:before {
      position: relative;
      content: attr(data-number);
      display: inline-block;
      padding: 2px;
      background: #209cee;
      text-align: center;
      color: #fff;
      border-radius: 50%;
      font-size: 1rem;
      width: 25px;
      height: 25px;
      margin-right: 10px;
      // top: 5px;
      // margin-bottom: 10px;
      // margin-top: 50px;
    }

    .my-indented {
      margin-left: 35px;
    }

    /*
     *  Design mode
     */
    .my-design-mode {
      background-color: $design-background-color;
      border-left: dashed 2px $design-frame-color;
      border-bottom: dashed 2px $design-frame-color;
      border-right: dashed 2px $design-frame-color;
      padding-bottom: 4px;

      .c-layout-mode-heading {
        // This overrides the definition in content-editor.scss
        background-color: $design-frame-color;
        color: $design-text-color;
      }

      .label2 {
        margin-top: 0px;
      }
    }

    /*
     *  Edit mode
     */
    .my-edit-mode {
    }

    /*
     *  Live mode
     */
    .my-live-mode {
      .my-label {
      }
    }
  }
</style>
