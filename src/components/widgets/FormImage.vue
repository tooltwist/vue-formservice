<template lang="pug">

  .c-content-formimage(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-image&gt;
      br

    // Debug and Editing mode
    template(v-if="isDesignMode || isEditMode")
      img.my-image(:src="url", :style="myStyle", :class="myClass", @click.stop="selectThisElement")

    // Live mode
    template(v-else)
      img.my-image(:src="url", :style="myStyle", :class="myClass",  onerror="this.style.display='none'")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-image',
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

    url: {
      get () {
        let value = this.element['url']
        return value ? value : ''
      },
    },

    myClass: function () {
      if (this.element.placeholder && this.element.placeholder.startsWith('tEntryTime')) {
        console.log(`inputClass()`, this.element);
      }

      var obj = { }
      let classesForElement = this.element['class']
      if (classesForElement) {
        classesForElement.split(' ').forEach(clas => {
          let classname = clas.trim()
          if (classname) {
            obj[classname] = true
          }
        })
      } else {
        obj['form-image-default'] = true
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
      return style
    },

  }
}

</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';

  .c-content-formimage {
    $edit-bg-color: lightblue;

    .my-image {
      min-width: 50px;
      min-height: 30px;
    }

    /*
     *  Design mode
     */
    &.c-edit-mode-debug {
      .my-image {
        display: block;
        text-align: left;
        background-color: $edit-bg-color;
        border: solid 1px $edit-bg-color;
      }
    }

    /*
     *  Edit mode
     */
    &.c-edit-mode-edit {
      .my-image {
        display: block;
        text-align: left;
        background-color: $edit-bg-color;
        // border: solid 1px $edit-bg-color;
      }
    }

    /*
     *  Live mode
     */
    &.c-edit-mode-view {
    }
  }
</style>
