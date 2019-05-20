<template lang="pug">

  .c-content-formline(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-line&gt;
      br

    // Debug mode
    //.my-design-mode(v-if="isDesignMode && false", @click.stop="selectThisElement")
      //.c-layout-mode-heading
        edit-bar-icons(:element="element")
        | label
      .my-label(:style="myStyle", :class="myClass")
        span(v-html="label")

    // Editing
    template(v-if="isDesignMode || isEditMode")
      //span.my-label(:style="myStyle", :class="myClass", v-html="label", @click.stop="selectThisElement")
      .my-line(:style="myStyle", :class="myClass", @click.stop="selectThisElement")

    // Live mode
    template(v-else)
      .my-line(:style="myStyle", :class="myClass")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-line',
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
        obj['form-line-default'] = true
      }
      return obj
    },

    myStyle: function ( ) {
      let style = this.element['style'] + ';'
      // width
      try {
        let num = parseInt(this.element['width'])
        if (num < 1) {
          num = 1
        }
        style += `width:${num}px;`
      } catch (e) { }

      // height
      try {
        let num = parseInt(this.element['height'])
        if (num < 1) {
          num = 1
        }
        style += `height:${num}px;`
      } catch (e) { }
      console.log(`inputStyle=`, style)
      return style
    },

  }
}

</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  .c-content-formline {
    // $edit-frame-color: lightblue;
    // $text-color: darkblue;
    $linecolor: #333;

    // .c-layout-mode-heading {
    //   // This overrides the definition in content-editor.scss
    //   background-color: $edit-frame-color;
    //   color: $text-color;
    // }

    // .c-label {
    //   position: absolute;
    //   //background-color: pink;
    // }

    .form-line-default {
      background-color: $linecolor;
      border-top: solid 1px $linecolor;
      border-left: solid 1px $linecolor;
    }

    .my-line {
      min-width: 1px;
      min-height: 1px;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      .my-label {
        display: block;
        text-align: left;
        border: solid 1px red;
      }
    }

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      .my-label {
        display: block;
        text-align: left;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
      .my-label {
        display: block;
        text-align: left;
      }
    }
  }
</style>
