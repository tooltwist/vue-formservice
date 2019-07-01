<template lang="pug">

  .c-form-label(:class="editModeClass")
    span(v-if="extraDebug")
      | &lt;form-label&gt;
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
      .my-prefix-and-label.highlight-when-selected(v-if="indent > 0", :style="myStyle", :class="myClass", @click.stop="selectThisElement")
        span.my-prefix(v-html="prefix", :style="{ width: `${indent}px` }")
        span.my-label-with-prefix(v-html="label", :style="{ left: `${indent}px` }")
      span.my-label-without-prefix.highlight-when-selected(v-else, :style="myStyle", :class="myClass", v-html="label", @click.stop="selectThisElement")
      //span.my-label(:style="myStyle", :class="myClass", v-html="label", @click.stop="selectThisElement")

    // Live mode
    template(v-else)
      .my-prefix-and-label(v-if="indent > 0", :style="myStyle", :class="myClass")
        span.my-prefix(v-html="prefix", :style="{ width: `${indent}px` }")
        span.my-label-with-prefix(v-html="label", :style="{ left: `${indent}px` }")
      .my-label-without-prefix(v-else, :style="myStyle", :class="myClass", v-html="label")
</template>

<script>
import ContentMixins from '@tooltwist/vue-contentservice/src/mixins/ContentMixins'
import CutAndPasteMixins from '@tooltwist/vue-contentservice/src/mixins/CutAndPasteMixins'
import FormserviceMixins from '../../mixins/FormserviceMixins'

export default {
  name: 'form-label',
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

    label: {
      get () {
        let value = this.element['label']
        // return value ? value : ''
        const defaultTabStop = 4
        return value ? convertLabel(value, defaultTabStop) : ''
      }
    },
    indent: function () {
      let value = this.element['indent']
      let indent = 0
      if (value) {
        indent = parseInt(value)
        if (isNaN(indent)) {
          indent = 0
        }
      }
      return indent
    },
    prefix: function () {
      let value = this.element['prefix']
      if (value && value.startsWith('^P159~')) {
        return '&bull;'
      }
      return value
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

function convertLabel(v, tabStop) {
  // console.log(`convertLabel(${v}, ${tabStop})`);

  // // See if we are using tabs
  // if (v.startsWith('^T8~')) {
  //   tabStop = 8
  //   v = v.substring(4)
  // } else if (v.startsWith('^T6~')) {
  //   tabStop = 6
  //   v = v.substring(4)
  // } else if (v.startsWith('^T4~')) {
  //   tabStop = 4
  //   v = v.substring(4)
  // }
  //
  // if (
  //   v.startsWith('^H4~')
  //   || v.startsWith('^H6~')
  //   || v.startsWith('^H8~')
  //   // v.startsWith('^H4~')
  // ) {
  //   // Not sure what to do with this
  //   v = v.substring(4)
  // }
  //
  // if (v.startsWith('^P159~')) {
  //   // Not sure what to do with this
  //   v = v.substring(6)
  // }

  // Convert the label
  // ^B...^b   (bold)
  // ^I...^i   (italics)
  // ^U...^u   (underline)
  // ^I   (tab)
  let label = ''
  let pos = 0
  while (v) {

    if (v.startsWith('^B')) {
      // Find end of bold section
      let end = v.indexOf('^b')
      if (end >= 0) {
        let boldStuff = v.substring(2, end)
        v = v.substring(end + 2)
        label += `<b>${convertLabel(boldStuff, tabStop)}</b>`
        pos += boldStuff.length
      } else {
        // No end, ignore this bold
        v = v.substring(2)
      }
    }
    else if (v.startsWith('^I')) {
      // Find end of italic section
      let end = v.indexOf('^i')
      if (end >= 0) {
        let italicStuff = v.substring(2, end)
        v = v.substring(end + 2)
        label += `<i>${convertLabel(italicStuff, tabStop)}</i>`
        pos += italicStuff.length
      } else {
        // No end, ignore this italics
        v = v.substring(2)
      }
    }
    else if (v.startsWith('^U')) {
      // Find end of underlined section
      let end = v.indexOf('^u')
      if (end >= 0) {
        let underlineStuff = v.substring(2, end)
        v = v.substring(end + 2)
        label += `<u>${convertLabel(underlineStuff, tabStop)}</u>`
        pos += underlineStuff.length
      } else {
        // No end, ignore this italics
        v = v.substring(2)
      }
    }
    else if (v.startsWith('^t')) {

      // Tab (must have at least one space)
      v = v.substring(2)
      label += '&nbsp;'
      pos++
      while ((pos++ % tabStop) != 0) {
        label += '&nbsp;'
      }
    }
    else if (v.startsWith(' ')) {
      if (label.endsWith(' ')) {
        // Because multiple spaces get treated as one space
        label += '&nbsp;'
      } else {
        label += ' '
      }
      v = v.substring(1)
      pos++
    }
    else {
      label += v.substring(0, 1)
      v = v.substring(1)
      pos++
    }
  }
  return label
}


// Find the first matching pattern.
// Returns { pos, pattern }
// Returns { pos:-1, pattern:null } if none found
function findFirstString(string, patterns /*[String]*/) {
  // console.error(`findFirstString(${string})`, patterns);
  let bestPos = -1
  patterns.forEach((pattern) => {
    let pos = string.indexOf(pattern)
    if (pos >= 0 && (bestPos < 0 || pos < bestPos)) {
      // console.error(`- have natch ${pattern}`)
      bestPos = pos
    }
  })
  return bestPos
}
</script>


<style lang="scss" scoped>
  @import '../../assets/css/content-variables.scss';
</style>
