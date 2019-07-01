<template lang="pug">

  .c-form-shape(:class="editModeClass")
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
</style>
