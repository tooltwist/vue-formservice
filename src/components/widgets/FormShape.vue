<template lang="pug">

  .c-content-formshape(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-shape&gt;
      br

    // Debug mode
    //.my-design-mode(v-if="isDesignMode && false", @click.stop="selectThisElement")
      //.c-layout-mode-heading
        edit-bar-icons(:element="element")
        | shape
      .my-shape(:style="myStyle", :class="myClass")
        span(v-html="label")

    // Editing
    template(v-if="isDesignMode || isEditMode")
      span.my-shape(:style="myStyle", :class="myClass", @click.stop="selectThisElement")

    // Live mode
    template(v-else)
      .my-shape(:style="myStyle", :class="myClass")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-shape',
  props: {
    element: {
      type: Object,
      required: true
    }
  },
  mixins: [ ContentMixins, CutAndPasteMixins, FormserviceMixins ],
  data: function () {
    return {
    }
  },
  computed: {

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
        obj['form-shape-default'] = true
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

      // Perhaps set alignment
      let talign = this.element['text-align']
      if (talign) {
        switch (talign.trim()) {
          case 'left':
          case 'center':
          case 'right':
          case 'justify':
            style += `text-align: ${talign};`
        }
      }
      // console.log(`inputStyle=`, style)
      return style
    },

  },
}
</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  .c-content-formshape {
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


    .c-shape {
      position: absolute;
      //background-color: pink;
    }

    .form-shape-default {
      //color: #000000;
      color: #333;
      font-family: Arial;
      font-weight: normal;
      font-size: 12px;
      line-height: 110%;
    }

    .form-shape-bold-default {
      //color: #000000;
      color: #333;
      font-family: Arial;
      font-weight: bold;
      font-size: 12px;
      line-height: 110%;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      .my-shape {
        display: block;
        padding-top: 1px;
        padding-left: 2px;
        padding-right: 2px;
        text-align: left;
        border: solid 1px red;
        word-wrap: break-word;
      }
    }

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      .my-shape {
        display: block;
        padding-top: 1px;
        padding-left: 2px;
        padding-right: 2px;
        text-align: left;
        word-wrap: break-word;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      .my-shape {
        display: block;
        padding-top: 1px;
        padding-left: 2px;
        padding-right: 2px;
        text-align: left;
        word-wrap: break-word;
      }
    }
  }
</style>
